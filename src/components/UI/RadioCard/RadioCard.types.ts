export interface RadioCardItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: React.ReactNode;
  value: string;
  error?: string;
}

export interface RadioCardGroupProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
}

