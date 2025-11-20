import { forwardRef } from 'react';
import { InputProps } from './Input.types';
import styles from './Input.module.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className,
  ...props
}, ref) => {
  const inputClasses = [
    styles.input,
    error && styles['input--error'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <input ref={ref} className={inputClasses} {...props} />
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

