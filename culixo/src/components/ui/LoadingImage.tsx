// src/components/ui/LoadingImage.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LoadingImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  theme?: string;
}

export const LoadingImage = ({ 
  src, 
  alt, 
  className, 
  aspectRatio = "square",
  theme
}: LoadingImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[4/3]"
  };

  return (
    <div className={cn(
      "relative overflow-hidden",
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 animate-pulse",
          theme === 'dark' ? 'bg-zinc-800/50' : 'bg-zinc-100'
        )} />
      )}

      {/* Error state */}
      {error && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'
        )}>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          )}>
            Failed to load image
          </p>
        </div>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "object-cover transition-all duration-300",
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
        }}
      />
    </div>
  );
};