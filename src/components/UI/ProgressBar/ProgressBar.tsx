import { ProgressBarProps } from './ProgressBar.types';
import styles from './ProgressBar.module.scss';

export const ProgressBar = ({ fulfilled }: ProgressBarProps) => {
  const percentage = Math.min(Math.max(fulfilled * 100, 0), 100);

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
