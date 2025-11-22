export interface FireworksProps extends Omit<React.ComponentProps<'div'>, 'color'> {
  canvasProps?: React.ComponentProps<'canvas'>;
  population?: number;
  color?: string | string[];
  fireworkSpeed?: { min: number; max: number } | number;
  fireworkSize?: { min: number; max: number } | number;
  particleSpeed?: { min: number; max: number } | number;
  particleSize?: { min: number; max: number } | number;
}
