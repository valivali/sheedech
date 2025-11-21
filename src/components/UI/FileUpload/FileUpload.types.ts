export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  error?: string;
  className?: string;
}

