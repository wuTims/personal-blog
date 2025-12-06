import * as React from 'react'
import { cn } from '~/lib/utils'

export interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Alt text for the image (required for accessibility) */
  alt: string
  /** Image position for object-fit (e.g., "top", "center", "bottom", "30%") */
  objectPosition?: string
  /** Optional fallback image URL on error */
  fallbackSrc?: string
  /** Container className for additional styling */
  containerClassName?: string
}

/**
 * Image component with skeleton loading state.
 * Shows an animated skeleton placeholder while the image loads,
 * then fades in the image smoothly for a seamless experience.
 *
 * Handles the race condition where cached images may load before
 * React attaches event handlers by checking img.complete on ref attachment.
 */
const ImageWithSkeleton = React.forwardRef<HTMLImageElement, ImageWithSkeletonProps>(
  ({ src, alt, objectPosition, fallbackSrc, className, containerClassName, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
    const [currentSrc, setCurrentSrc] = React.useState(src)
    const prevSrcRef = React.useRef(src)

    // Callback ref that checks if image is already loaded (cached)
    const imgCallbackRef = React.useCallback(
      (node: HTMLImageElement | null) => {
        // Forward ref to external ref if provided
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        // Check if image is already complete (cached/loaded before mount)
        if (node?.complete && node.naturalWidth > 0) {
          setIsLoaded(true)
        }
      },
      [ref]
    )

    // Reset state only when src actually changes (not on initial mount)
    React.useEffect(() => {
      if (prevSrcRef.current !== src) {
        setIsLoaded(false)
        setHasError(false)
        setCurrentSrc(src)
        prevSrcRef.current = src
      }
    }, [src])

    const handleLoad = React.useCallback(() => {
      setIsLoaded(true)
    }, [])

    const handleError = React.useCallback(() => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setIsLoaded(false)
      } else {
        setHasError(true)
      }
    }, [fallbackSrc, currentSrc])

    return (
      <div className={cn('relative h-full w-full overflow-hidden', containerClassName)}>
        {/* Skeleton placeholder - visible while loading */}
        <div
          className={cn(
            'absolute inset-0 bg-neutral-200 dark:bg-neutral-700',
            'transition-opacity duration-300 ease-out',
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
          aria-hidden="true"
        >
          {/* Animated shimmer effect */}
          <div
            className={cn(
              'absolute inset-0',
              'bg-gradient-to-r from-transparent via-neutral-100/50 to-transparent dark:via-neutral-600/50',
              'animate-shimmer'
            )}
          />
        </div>

        {/* Actual image - fades in when loaded */}
        {!hasError && (
          <img
            ref={imgCallbackRef}
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full object-cover',
              'transition-opacity duration-300 ease-out',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            style={objectPosition ? { objectPosition: `center ${objectPosition}` } : undefined}
            {...props}
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
)
ImageWithSkeleton.displayName = 'ImageWithSkeleton'

export { ImageWithSkeleton }
