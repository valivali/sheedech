import { LoadingProps } from './Loading.types';
import styles from './Loading.module.scss';

export const Loading = ({ 
  variant = 'dots', 
  size = 'md', 
  className,
  text 
}: LoadingProps) => {
  const sizeClass = `loading--${size}`;
  const variantClass = `loading--${variant}`;
  const classes = [styles.loading, styles[sizeClass], styles[variantClass], className].filter(Boolean).join(' ');

  if (variant === 'dots') {
    return (
      <div className={classes}>
        <div className={styles.dotsContainer}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        {text && <span className={styles.loadingText}>{text}</span>}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={classes}>
        <div className={styles.spinner} />
        {text && <span className={styles.loadingText}>{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={classes}>
        <div className={styles.pulseContainer}>
          <div className={styles.pulseRing} />
          <div className={styles.pulseCore} />
        </div>
        {text && <span className={styles.loadingText}>{text}</span>}
      </div>
    );
  }

  return null;
};

