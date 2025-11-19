import { RadioGroupProps, RadioItemProps } from './RadioGroup.types';
import styles from './RadioGroup.module.scss';

export const RadioItem = ({
  children,
  error,
  className,
  ...props
}: RadioItemProps) => {
  const classes = [styles.radioItem, className].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <input type="radio" className={styles.radio} {...props} />
      <span className={styles.radioMark}></span>
      <span className={styles.radioLabel}>{children}</span>
      {error && <span className={styles.radioError}>{error}</span>}
    </label>
  );
};

export const RadioGroup = ({
  children,
  label,
  error,
  className
}: RadioGroupProps) => {
  const classes = [styles.radioGroup, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && <div className={styles.radioGroupLabel}>{label}</div>}
      <div className={styles.radioGroupItems}>
        {children}
      </div>
      {error && <span className={styles.radioGroupError}>{error}</span>}
    </div>
  );
};
