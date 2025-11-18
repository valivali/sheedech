import { InputProps } from './Input.types';
import styles from './Input.module.scss';

export const Input = ({ 
  label, 
  error, 
  helperText, 
  className,
  ...props 
}: InputProps) => {
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
      <input className={inputClasses} {...props} />
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

