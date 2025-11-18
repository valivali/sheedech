import { ChipProps } from './Chip.types';
import styles from './Chip.module.scss';

export const Chip = ({ label, onRemove, className }: ChipProps) => {
  return (
    <div className={`${styles.chip} ${className || ''}`}>
      <span className={styles.chipLabel}>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.chipRemove}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </div>
  );
};
