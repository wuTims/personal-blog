import { useState, useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'
import { useStoryboardImages } from './StoryboardImageContext'

interface StoryboardImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Cache-aware image component for storyboards.
 * Uses decoding="sync" to leverage pre-decoded cache from the provider.
 * Falls back to skeleton if not yet cached, with smooth fade-in.
 */
export function StoryboardImage({ src, alt, className, style }: StoryboardImageProps) {
  const { getCachedImage } = useStoryboardImages()
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if image is already in cache
  const cachedImage = getCachedImage(src)
  const [isLoaded, setIsLoaded] = useState(() => !!cachedImage)
  const [hasError, setHasError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    const cached = getCachedImage(src)
    if (cached) {
      setIsLoaded(true)
      setHasError(false)
    } else {
      setIsLoaded(false)
      setHasError(false)
    }
  }, [src, getCachedImage])

  // Check if image is already complete on ref attachment (for cached browser images)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Skeleton placeholder - visible while loading */}
      <div
        className={cn(
          'absolute inset-0 bg-neutral-200 dark:bg-neutral-700',
          'transition-opacity duration-200 ease-out',
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        aria-hidden="true"
      >
        {/* Animated shimmer effect */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-linear-to-r from-transparent via-neutral-100/50 to-transparent dark:via-neutral-600/50',
            'animate-shimmer'
          )}
        />
      </div>

      {/* Actual image - uses sync decoding to leverage pre-decoded cache */}
      {!hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          decoding="sync"
          loading="eager"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-200 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={style}
        />
      )}

      {/* Error state fallback */}
      {hasError && (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <span className="text-sm text-muted">Image unavailable</span>
        </div>
      )}
    </div>
  )
}
