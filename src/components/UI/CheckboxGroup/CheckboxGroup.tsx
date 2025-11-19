import { CheckboxGroupProps, CheckboxItemProps } from './CheckboxGroup.types';
import styles from './CheckboxGroup.module.scss';

export const CheckboxItem = ({
  children,
  error,
  className,
  ...props
}: CheckboxItemProps) => {
  const classes = [styles.checkboxItem, className].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <input type="checkbox" className={styles.checkbox} {...props} />
      <span className={styles.checkboxMark}></span>
      <span className={styles.checkboxLabel}>{children}</span>
      {error && <span className={styles.checkboxError}>{error}</span>}
    </label>
  );
};

export const CheckboxGroup = ({
  children,
  label,
  error,
  className
}: CheckboxGroupProps) => {
  const classes = [styles.checkboxGroup, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && <div className={styles.checkboxGroupLabel}>{label}</div>}
      <div className={styles.checkboxGroupItems}>
        {children}
      </div>
      {error && <span className={styles.checkboxGroupError}>{error}</span>}
    </div>
  );
};
