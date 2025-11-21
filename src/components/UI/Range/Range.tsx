import { useState, useEffect } from 'react';
import { RangeProps } from './Range.types';
import styles from './Range.module.scss';

export const Range = ({
  label,
  value,
  onChange,
  min = 0,
  max = 12,
  customCheckboxLabel = 'More than 12',
  customInputPlaceholder = 'Enter number',
  error,
  className,
}: RangeProps) => {
  const [isCustom, setIsCustom] = useState(value > max);
  const [customValue, setCustomValue] = useState(value > max ? value.toString() : '');
  const [rangeValue, setRangeValue] = useState(value <= max ? value : max);

  useEffect(() => {
    if (value > max) {
      setIsCustom(true);
      setCustomValue(value.toString());
      setRangeValue(max);
    } else {
      setIsCustom(false);
      setRangeValue(value);
      setCustomValue('');
    }
  }, [value, max]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setRangeValue(newValue);
    if (!isCustom) {
      onChange(newValue);
    }
  };

  const handleCustomCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCustom(checked);
    
    if (checked) {
      const customNum = customValue ? parseInt(customValue, 10) : max + 1;
      if (!isNaN(customNum) && customNum > max) {
        onChange(customNum);
      } else {
        setCustomValue((max + 1).toString());
        onChange(max + 1);
      }
    } else {
      onChange(rangeValue);
      setCustomValue('');
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);
    
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue > max) {
      onChange(numValue);
    }
  };

  const classes = [styles.range, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && <label className={styles.rangeLabel}>{label}</label>}
      
      <div className={styles.rangeControl}>
        <input
          type="range"
          min={min}
          max={max}
          value={rangeValue}
          onChange={handleRangeChange}
          disabled={isCustom}
          className={styles.rangeInput}
        />
        <div className={styles.rangeValue}>
          {isCustom ? `${customValue || max}+` : rangeValue}
        </div>
      </div>

      <div className={styles.customSection}>
        <label className={styles.customCheckbox}>
          <input
            type="checkbox"
            checked={isCustom}
            onChange={handleCustomCheckboxChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxLabel}>{customCheckboxLabel}</span>
        </label>

        {isCustom && (
          <input
            type="number"
            value={customValue}
            onChange={handleCustomInputChange}
            placeholder={customInputPlaceholder}
            min={max + 1}
            max={50}
            className={styles.customInput}
          />
        )}
      </div>

      {error && <span className={styles.rangeError}>{error}</span>}
    </div>
  );
};

