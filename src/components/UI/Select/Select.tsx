"use client";

import { useState, useRef, useEffect } from 'react';
import { match } from 'ts-pattern';
import { SelectProps } from './Select.types';
import styles from './Select.module.scss';

export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  className,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.value.includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.label === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setHighlightedIndex(-1);
        if (searchable) {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchable]);

  useEffect(() => {
    if (isFocused && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused, searchable]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    match(event.key)
      .with('Escape', () => {
        setIsOpen(false);
        setHighlightedIndex(-1);
        if (searchable) {
          setIsFocused(false);
          setSearchTerm('');
        }
      })
      .with('Enter', () => {
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].label);
        }
      })
      .with('ArrowDown', () => {
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      })
      .with('ArrowUp', () => {
        event.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
      })
      .otherwise(() => {});
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    if (searchable) {
      setIsFocused(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHighlightedIndex(-1);
    if (!isOpen && searchable) {
      setSearchTerm('');
    }
  };

  const handleInputFocus = () => {
    if (searchable) {
      setIsFocused(true);
      setIsOpen(true);
      // Keep the current search term when focusing
    }
  };

  const handleInputBlur = () => {
    // Don't blur immediately, let the click outside handler handle it
    setTimeout(() => {
      if (searchable && !isOpen) {
        setIsFocused(false);
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  return (
    <div
      ref={selectRef}
      className={`${styles.select} ${className || ''}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <div
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerOpen : ''}`}
        onClick={handleToggle}
      >
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            value={isFocused ? searchTerm : (selectedOption?.label || '')}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            className={styles.selectInput}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={selectedOption ? styles.selectValue : styles.selectPlaceholder}>
            {selectedOption?.label || placeholder}
          </span>
        )}
        <div className={`${styles.selectArrow} ${isOpen ? styles.selectArrowOpen : ''}`}>
          ▼
        </div>
      </div>

      {isOpen && (
        <div className={styles.selectDropdown}>
          {filteredOptions.length === 0 ? (
            <div className={styles.selectNoOptions}>No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`${styles.selectOption} ${
                  index === highlightedIndex ? styles.selectOptionHighlighted : ''
                } ${option.value === value ? styles.selectOptionSelected : ''}`}
                onClick={() => handleSelect(option.label)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
