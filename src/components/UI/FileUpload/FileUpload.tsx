import { useState, useRef } from 'react';
import { FileUploadProps } from './FileUpload.types';
import styles from './FileUpload.module.scss';

export const FileUpload = ({
  label,
  accept = 'image/*',
  multiple = false,
  maxFiles = 2,
  onChange,
  error,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const limitedFiles = multiple ? fileArray.slice(0, maxFiles) : [fileArray[0]];
    
    setFiles(limitedFiles);
    onChange?.(limitedFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const classes = [styles.fileUpload, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && <label className={styles.fileUploadLabel}>{label}</label>}
      
      <div
        className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''} ${files.length > 0 ? styles.uploadAreaHasFiles : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className={styles.fileInput}
        />
        
        <div className={styles.uploadContent}>
          <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className={styles.uploadText}>
            <span className={styles.uploadTextBold}>Click to upload</span> or drag and drop
          </p>
          <p className={styles.uploadHint}>
            {multiple ? `Upload up to ${maxFiles} images` : 'Upload 1 image'} (Mock - not yet implemented)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className={styles.fileUploadError}>{error}</span>}
    </div>
  );
};

