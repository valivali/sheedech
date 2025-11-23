export interface CheckboxItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: React.ReactNode;
  error?: string;
}

export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
}

export interface ControlledCheckboxGroupProps {
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
}
