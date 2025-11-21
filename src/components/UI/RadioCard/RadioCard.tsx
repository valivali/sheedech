import { RadioCardGroupProps, RadioCardItemProps } from './RadioCard.types';
import styles from './RadioCard.module.scss';

export const RadioCardItem = ({
  children,
  error,
  className,
  ...props
}: RadioCardItemProps) => {
  const classes = [styles.radioCardItem, className].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <input type="radio" className={styles.radioInput} {...props} />
      <span className={styles.radioContent}>{children}</span>
      {error && <span className={styles.radioError}>{error}</span>}
    </label>
  );
};

export const RadioCardGroup = ({
  children,
  label,
  error,
  className,
  labelClassName
}: RadioCardGroupProps) => {
  const classes = [styles.radioCardGroup, className].filter(Boolean).join(' ');
  const labelClasses = [styles.radioCardGroupLabel, labelClassName].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && <div className={labelClasses}>{label}</div>}
      <div className={styles.radioCardGroupItems}>
        {children}
      </div>
      {error && <span className={styles.radioCardGroupError}>{error}</span>}
    </div>
  );
};

