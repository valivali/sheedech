import { ButtonProps } from './Button.types';
import styles from './Button.module.scss';

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className,
  isLoading = false,
  disabled,
  ...props 
}: ButtonProps) => {
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const classes = [styles.button, styles[variantClass], styles[sizeClass], className].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

