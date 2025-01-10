import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, Trash2 } from "lucide-react"

// Define types here instead of importing from react-easy-crop/types
interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  currentAvatar?: string;
}

export function AvatarUploadModal({
  isOpen,
  onClose,
  onUpload,
  onDelete,
  currentAvatar
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { toast } = useToast();

  // Set initial preview when modal opens
  React.useEffect(() => {
    if (isOpen && currentAvatar && currentAvatar !== "/placeholder-chef.jpg") {
      setPreviewUrl(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    handleFileSelect(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedFile = async () => {
    if (!selectedFile || !croppedAreaPixels) return null;
  
    const canvas = document.createElement('canvas');
    const image = await createImage(previewUrl!);
  
    // Set maximum dimensions for the cropped image
    const maxWidth = 800;
    const maxHeight = 800;
  
    // Calculate scaled dimensions while maintaining aspect ratio
    let width = croppedAreaPixels.width;
    let height = croppedAreaPixels.height;
    
    if (width > maxWidth) {
      height = (maxWidth * height) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (maxHeight * width) / height;
      height = maxHeight;
    }
  
    // Set canvas dimensions to our scaled size
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) return null;
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    // Apply some smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      width,
      height
    );
  
    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], selectedFile.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(file);
        },
        'image/jpeg',
        0.8  // Compression quality (0.8 = 80% quality)
      );
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

    const handleUpload = async () => {
        if (!selectedFile) return;
      
        try {
          setIsUploading(true);
          const croppedFile = await createCroppedFile();
          if (!croppedFile) return;
      
          // Check if the final file size is within limits (e.g., 5MB)
          if (croppedFile.size > 5 * 1024 * 1024) {
            toast({
              title: "Error",
              description: "Processed image is too large. Please try a smaller image or lower zoom level.",
              variant: "destructive",
            });
            return;
          }
      
          await onUpload(croppedFile);
          handleClose();
          toast({
            title: "Success",
            description: "Profile picture updated successfully",
          });
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to upload profile picture",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
    };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      await onDelete();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(currentAvatar && currentAvatar !== "/placeholder-chef.jpg" ? currentAvatar : null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload profile picture</DialogTitle>
          <DialogDescription>
            Choose an image to upload as your profile picture
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative w-full" style={{ height: '250px' }}>
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                  cropSize={{ width: 200, height: 200 }}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                      position: 'relative'
                    }
                  }}
                />
              </div>
            ) : (
              <div 
                {...getRootProps()} 
                className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input {...getInputProps()} />
                <div className="text-center p-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    {isDragActive ? "Drop the image here" : "Drag & drop an image here, or click to select"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <label htmlFor="zoom" className="block text-sm font-medium text-gray-700">
                Zoom
              </label>
              <input
                id="zoom"
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            {currentAvatar && currentAvatar !== "/placeholder-chef.jpg" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isUploading}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {previewUrl && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload new
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  {isUploading ? "Uploading..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}