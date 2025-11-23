export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  error?: string;
  className?: string;
}

