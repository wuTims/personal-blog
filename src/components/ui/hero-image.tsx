import { ImageWithSkeleton } from './image-with-skeleton'
import { cn } from '~/lib/utils'

interface HeroImageProps {
  src: string
  alt: string
  position?: string
  className?: string
}

/**
 * Wide hero image component for article pages.
 * Displays above the article header with a cinematic aspect ratio.
 * Breaks out of the prose container slightly for visual impact.
 */
export function HeroImage({ src, alt, position, className }: HeroImageProps) {
  return (
    <div
      className={cn(
        // Wide aspect ratio for cinematic effect
        'aspect-[21/9] w-full overflow-hidden rounded-sm',
        // Negative margin to break out of prose container
        '-mx-4 sm:-mx-8 mb-8',
        // Compensate width for negative margin
        'w-[calc(100%+2rem)] sm:w-[calc(100%+4rem)]',
        className
      )}
    >
      <ImageWithSkeleton
        src={src}
        alt={alt}
        objectPosition={position}
        loading="eager"
      />
    </div>
  )
}
