import { forwardRef } from 'react';
import { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.scss';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className,
  ...props
}, ref) => {
  const textareaClasses = [
    styles.textarea,
    error && styles['textarea--error'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <textarea ref={ref} className={textareaClasses} {...props} />
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
