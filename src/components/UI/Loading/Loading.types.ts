export type LoadingVariant = 'dots' | 'spinner' | 'pulse';
export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  className?: string;
  text?: string;
}

