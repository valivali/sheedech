export interface CheckboxItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: React.ReactNode;
  error?: string;
}

export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}
