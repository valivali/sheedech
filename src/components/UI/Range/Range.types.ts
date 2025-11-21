export interface RangeProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  customCheckboxLabel?: string;
  customInputPlaceholder?: string;
  error?: string;
  className?: string;
}

