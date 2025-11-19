export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: React.ReactNode;
  error?: string;
}

export interface RadioGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}
