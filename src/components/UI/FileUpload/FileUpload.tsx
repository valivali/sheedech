import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { FileUploadProps } from './FileUpload.types';
import styles from './FileUpload.module.scss';

interface ImageState {
  id: string;
  originalFile: File | null;
  imageSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: { x: number; y: number; width: number; height: number } | null;
  preview: string | null;
  uploadedUrl: string | null;
  uploading: boolean;
  error: string | null;
}

export const FileUpload = ({
  label,
  accept = 'image/*',
  multiple = false,
  maxFiles = 2,
  value = [],
  onChange,
  error,
  className,
}: FileUploadProps) => {
  const [images, setImages] = useState<ImageState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUploadedUrlsRef = useRef<string[]>([]);
  const onChangeRef = useRef(onChange);
  const initializedRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!initializedRef.current && value && value.length > 0) {
      const valueUrls = value.filter(Boolean);
      const existingImages: ImageState[] = valueUrls.map((url, index) => ({
        id: `existing-${index}-${url}`,
        originalFile: null,
        imageSrc: url,
        crop: { x: 0, y: 0 },
        zoom: 1,
        croppedAreaPixels: null,
        preview: null,
        uploadedUrl: url,
        uploading: false,
        error: null,
      }));
      setImages(existingImages);
      prevUploadedUrlsRef.current = valueUrls;
      initializedRef.current = true;
    }
  }, [value]);

  const uploadedUrls = useMemo(() => {
    return images.filter(img => img.uploadedUrl).map(img => img.uploadedUrl!);
  }, [images]);

  useEffect(() => {
    const currentUrls = uploadedUrls;
    const prevUrls = prevUploadedUrlsRef.current;
    
    if (JSON.stringify(currentUrls) !== JSON.stringify(prevUrls)) {
      prevUploadedUrlsRef.current = currentUrls;
      onChangeRef.current?.(currentUrls);
    }
  }, [uploadedUrls]);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const remainingSlots = maxFiles - images.filter(img => img.uploadedUrl).length;
    const filesToAdd = multiple ? fileArray.slice(0, remainingSlots) : [fileArray[0]];

    const newImages: ImageState[] = filesToAdd.map((file, index) => {
      const id = `${Date.now()}-${index}`;

      if (file.size > 5_000_000) {
        return {
          id,
          originalFile: file,
          imageSrc: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
          croppedAreaPixels: null,
          preview: null,
          uploadedUrl: null,
          uploading: false,
          error: 'File size exceeds 5MB limit',
        };
      }

      return {
        id,
        originalFile: file,
        imageSrc: '',
        crop: { x: 0, y: 0 },
        zoom: 1,
        croppedAreaPixels: null,
        preview: null,
        uploadedUrl: null,
        uploading: false,
        error: null,
      };
    });

    // Add images to state first
    setImages(prev => {
      const updatedImages = [...prev, ...newImages];

      // Set up file readers asynchronously
      newImages.forEach((image, index) => {
        if (image.error || !image.originalFile) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImages(prevImages =>
            prevImages.map(img =>
              img.id === image.id
                ? { ...img, imageSrc: reader.result as string }
                : img
            )
          );
        });
        reader.readAsDataURL(image.originalFile);
      });

      return updatedImages;
    });

    // Set current editing index for the first valid image
    if (newImages.length > 0 && !newImages[0].error) {
      setCurrentEditingIndex(images.length);
    }
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
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (currentEditingIndex === index) {
      setCurrentEditingIndex(null);
    } else if (currentEditingIndex !== null && currentEditingIndex > index) {
      setCurrentEditingIndex(currentEditingIndex - 1);
    }
  };

  const onCropComplete = useCallback((index: number) => 
    (_: unknown, croppedPixels: { x: number; y: number; width: number; height: number }) => {
      setImages(prev => 
        prev.map((img, i) => 
          i === index ? { ...img, croppedAreaPixels: croppedPixels } : img
        )
      );
    }, []
  );

  const handleCrop = async (index: number) => {
    const image = images[index];
    if (!image.imageSrc || !image.croppedAreaPixels) return;

    const blob = await getCroppedImg(image.imageSrc, image.croppedAreaPixels);
    const croppedUrl = URL.createObjectURL(blob);

    setImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, preview: croppedUrl, imageSrc: croppedUrl } : img
      )
    );

    setCurrentEditingIndex(null);
  };

  const handleUpload = async (index: number) => {
    const image = images[index];
    if (!image.imageSrc) return;

    setImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, uploading: true, error: null } : img
      )
    );

    try {
      const res = await fetch(image.imageSrc);
      const blob = await res.blob();
      const fileName = image.originalFile?.name || 'image.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setImages(prev => {
        const updated = prev.map((img, i) => 
          i === index ? { ...img, uploadedUrl: data.url, uploading: false } : img
        );
        
        return updated;
      });
    } catch (err) {
      setImages(prev => 
        prev.map((img, i) => 
          i === index 
            ? { ...img, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' }
            : img
        )
      );
    }
  };

  const handleEditCrop = (index: number) => {
    setCurrentEditingIndex(index);
  };

  const classes = [styles.fileUpload, className].filter(Boolean).join(' ');
  const uploadedCount = images.filter(img => img.uploadedUrl).length;
  const canAddMore = uploadedCount < maxFiles;

  return (
    <div className={classes}>
      {label && <label className={styles.fileUploadLabel}>{label}</label>}
      
      {canAddMore && (
        <div
          className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''} ${images.length > 0 ? styles.uploadAreaHasFiles : ''}`}
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
              {multiple ? `Upload up to ${maxFiles} images (${uploadedCount}/${maxFiles} uploaded)` : 'Upload 1 image'} • Max 5MB
            </p>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className={styles.imageList}>
          {images.map((image, index) => (
            <div key={image.id} className={styles.imageItem}>
              {currentEditingIndex === index && image.imageSrc && !image.preview ? (
                <div className={styles.cropperContainer}>
                  <div className={styles.cropperWrapper}>
                    <Cropper
                      image={image.imageSrc}
                      crop={image.crop}
                      zoom={image.zoom}
                      aspect={4 / 3}
                      onCropChange={(crop) => {
                        setImages(prev => 
                          prev.map((img, i) => 
                            i === index ? { ...img, crop } : img
                          )
                        );
                      }}
                      onZoomChange={(zoom) => {
                        setImages(prev => 
                          prev.map((img, i) => 
                            i === index ? { ...img, zoom } : img
                          )
                        );
                      }}
                      onCropComplete={onCropComplete(index)}
                    />
                  </div>
                  <div className={styles.cropperControls}>
                    <label className={styles.zoomLabel}>
                      Zoom:
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={image.zoom}
                        onChange={(e) => {
                          setImages(prev => 
                            prev.map((img, i) => 
                              i === index ? { ...img, zoom: parseFloat(e.target.value) } : img
                            )
                          );
                        }}
                        className={styles.zoomSlider}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCrop(index)}
                      className={styles.confirmCropButton}
                    >
                      Confirm Crop
                    </button>
                  </div>
                </div>
              ) : image.preview || image.uploadedUrl ? (
                <div className={styles.previewContainer}>
                  <img 
                    src={image.preview || image.uploadedUrl!} 
                    alt="preview" 
                    className={styles.previewImage}
                  />
                  <div className={styles.previewActions}>
                    {!image.uploadedUrl && (
                      <button
                        type="button"
                        disabled={image.uploading}
                        onClick={() => handleUpload(index)}
                        className={styles.uploadButton}
                      >
                        {image.uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    )}
                    {image.uploadedUrl && !image.uploading && (
                      <button
                        type="button"
                        onClick={() => handleEditCrop(index)}
                        className={styles.editButton}
                      >
                        Edit Crop
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                  {image.uploadedUrl && (
                    <div className={styles.uploadedBadge}>✓ Uploaded</div>
                  )}
                </div>
              ) : image.error ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorText}>{image.error}</p>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={styles.loadingContainer}>
                  <p>Loading image...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <span className={styles.fileUploadError}>{error}</span>}
    </div>
  );
};

