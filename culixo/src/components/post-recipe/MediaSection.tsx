//src/components/post-recipe/MediaSection
'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import type { StepComponentProps} from '@/types/post-recipe/recipe';
import { draftApi } from '@/lib/api/draft';

type ValidationErrors = {
  mainImage?: string;
  additionalImages?: string;
};

interface MediaUploadZoneProps {
  onDrop: (files: FileList) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  onDrop,
  accept = 'image/*',
  multiple = false,
  loading = false,
  children,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const { files } = e.dataTransfer;
      if (files?.length) {
        await onDrop(files);
      }
    },
    [onDrop]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await onDrop(e.target.files);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? 'border-primary bg-primary/5'
          : loading
          ? 'border-muted cursor-not-allowed'
          : 'border-muted hover:border-primary/50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={loading}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      {children}
    </div>
  );
};

const MediaSection: React.FC<StepComponentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isFirst,
  draftId
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

const handleMainImageUpload = async (files: FileList) => {
  try {
    setIsLoading(true);
    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    // Remove draftId check and pass it as optional parameter
    const imageUrl = await draftApi.uploadMainImage(file, draftId); 
    
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        mainImage: imageUrl
      }
    }));
    
    setErrors(prev => ({ ...prev, mainImage: undefined }));
  } catch (error) {
    setErrors(prev => ({
      ...prev,
      mainImage: error instanceof Error ? error.message : 'Failed to upload image'
    }));
  } finally {
    setIsLoading(false);
  }
};

const handleAdditionalImagesUpload = async (files: FileList) => {
  try {
    setIsLoading(true);
    
    const filesToUpload = Array.from(files).slice(0, 5);
    
    // Validate files
    filesToUpload.forEach(file => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload only image files');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Each image should be less than 5MB');
      }
    });

    // Remove draftId check and pass it as optional parameter
    const imageUrls = await draftApi.uploadAdditionalImages(filesToUpload, draftId);
    
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        additionalImages: [
          ...(prev.media.additionalImages || []),
          ...imageUrls
        ].slice(0, 5)
      }
    }));
    
    setErrors(prev => ({ ...prev, additionalImages: undefined }));
  } catch (error) {
    setErrors(prev => ({
      ...prev,
      additionalImages: error instanceof Error ? error.message : 'Failed to upload images'
    }));
  } finally {
    setIsLoading(false);
  }
};

  const removeMainImage = () => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        mainImage: null
      }
    }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        additionalImages: prev.media.additionalImages?.filter((_, i) => i !== index)
      }
    }));
  };

  const validateAndContinue = () => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.media.mainImage) {
      newErrors.mainImage = 'Main recipe image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Main Recipe Image */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Main Recipe Image</Label>
          <span className="text-sm text-muted-foreground">Required</span>
        </div>

        {formData.media.mainImage ? (
          <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
            <Image
              src={formData.media.mainImage}
              alt="Main recipe"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={removeMainImage}
              className="absolute top-4 right-4 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <MediaUploadZone onDrop={handleMainImageUpload} loading={isLoading}>
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {isLoading
                    ? "Uploading..."
                    : "Drop your main recipe image here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files (max 5MB)
                </p>
              </div>
            </div>
          </MediaUploadZone>
        )}

        {errors.mainImage && (
          <Alert variant="destructive">
            <AlertDescription>{errors.mainImage}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Additional Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Additional Images (Optional)
          </Label>
          <span className="text-sm text-muted-foreground">
            {formData.media.additionalImages?.length || 0} of 5 images
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.media.additionalImages?.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
            >
              <Image
                src={image}
                alt={`Recipe ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeAdditionalImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {(!formData.media.additionalImages ||
            formData.media.additionalImages.length < 5) && (
            <MediaUploadZone
              onDrop={handleAdditionalImagesUpload}
              multiple
              loading={isLoading}
            >
              <div className="flex flex-col items-center justify-center aspect-square p-4">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {isLoading
                    ? "Uploading..."
                    : `Add ${
                        formData.media.additionalImages?.length === 4
                          ? "one more image"
                          : "more images"
                      }`}
                </p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  {formData.media.additionalImages?.length === 4
                    ? "Last spot available"
                    : `${
                        5 - (formData.media.additionalImages?.length || 0)
                      } spots remaining`}
                </p>
              </div>
            </MediaUploadZone>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={isFirst || isLoading}
          className="min-w-[120px]"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={validateAndContinue}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Uploading..." : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default MediaSection;