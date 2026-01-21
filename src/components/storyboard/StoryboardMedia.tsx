import { useRef, useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import Sparkle from 'react-sparkle'
import { ImageWithSkeleton } from '~/components/ui/image-with-skeleton'
import { getMediaUrl, cn } from '~/lib/utils'
import type {
  StoryboardMedia as StoryboardMediaType,
  MediaLayout,
  AnimationType,
} from '~/lib/storyboard-data'

// Animation variants
const animations: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  fadeDown: {
    hidden: { y: -40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  scaleUp: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
  scaleBounce: {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.5,
        duration: 0.8,
      },
    },
  },
  slideLeft: {
    hidden: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideRight: {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  blur: {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: { filter: 'blur(0px)', opacity: 1 },
  },
  rotate: {
    hidden: { rotate: -10, scale: 0.9, opacity: 0 },
    visible: { rotate: 0, scale: 1, opacity: 1 },
  },
  pop: {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.4,
        times: [0, 0.7, 1],
      },
    },
  },
}

interface MediaItemProps {
  item: StoryboardMediaType
  isActive: boolean
  baseDelay: number
  className?: string
  style?: React.CSSProperties
  showBorder?: boolean
  borderColor?: 'lavender' | 'white'
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
}

function MediaItem({
  item,
  isActive,
  baseDelay,
  className,
  style,
  showBorder,
  borderColor = 'lavender',
  objectFit = 'cover',
  objectPosition,
}: MediaItemProps) {
  const animation = item.animation || 'scaleUp'
  const delay = baseDelay + (item.delay || 0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle autoplay with sound for final video - start after delay, mute after first loop
  useEffect(() => {
    if (item.type === 'video' && item.autoplayWithSound && videoRef.current && isActive) {
      const video = videoRef.current

      // Mute after first loop completes
      const handleEnded = () => {
        video.muted = true
        video.play() // Continue looping but muted
      }
      video.addEventListener('ended', handleEnded)

      // Start playing with sound after animation delay
      const timer = setTimeout(() => {
        video.currentTime = 0
        video.muted = false
        video.play().catch(() => {
          // If autoplay with sound fails, keep it muted
          video.muted = true
          video.play()
        })
      }, delay * 1000)

      return () => {
        clearTimeout(timer)
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [item.type, item.autoplayWithSound, isActive, delay])

  const borderClass = showBorder
    ? borderColor === 'lavender'
      ? 'ring-2 ring-lavender'
      : 'ring-2 ring-white'
    : ''

  // For 'pop' animation, use inline animation to preserve delay (variants override delay)
  const usesInlineAnimation = animation === 'pop'

  return (
    <motion.div
      className={cn('overflow-hidden rounded-lg shadow-2xl', borderClass, className)}
      style={{
        ...style,
        rotate: item.rotation ? `${item.rotation}deg` : undefined,
      }}
      {...(usesInlineAnimation
        ? {
            initial: { scale: 0.9, opacity: 0 },
            animate: isActive
              ? { scale: 1, opacity: 1 }
              : { scale: 0.9, opacity: 0 },
            transition: {
              duration: 0.6,
              ease: 'easeOut',
              delay,
            },
          }
        : {
            variants: animations[animation],
            initial: 'hidden',
            animate: isActive ? 'visible' : 'hidden',
            transition: {
              type: 'spring',
              bounce: 0.35,
              duration: 0.8,
              delay,
            },
          })}
    >
      {item.type === 'image' ? (
        <ImageWithSkeleton
          src={getMediaUrl(item.src)}
          alt={item.alt}
          className={cn('h-full w-full', objectFit === 'contain' ? 'object-contain' : 'object-cover')}
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : (
        <video
          ref={videoRef}
          src={getMediaUrl(item.src)}
          poster={item.poster ? getMediaUrl(item.poster) : undefined}
          autoPlay={!item.autoplayWithSound}
          muted
          loop={!item.autoplayWithSound}
          playsInline
          className={cn('h-full w-full', objectFit === 'contain' ? 'object-contain' : 'object-cover')}
          style={objectPosition ? { objectPosition } : undefined}
        />
      )}
    </motion.div>
  )
}

// Polaroid-style media item with white border
function PolaroidItem({
  item,
  isActive,
  baseDelay,
  className,
}: {
  item: StoryboardMediaType
  isActive: boolean
  baseDelay: number
  className?: string
}) {
  const animation = item.animation || 'rotate'
  const delay = baseDelay + (item.delay || 0)

  return (
    <motion.div
      className={cn(
        'flex flex-col bg-white p-2 pb-6 shadow-xl sm:p-3 sm:pb-10',
        className
      )}
      style={{ rotate: item.rotation ? `${item.rotation}deg` : undefined }}
      variants={animations[animation]}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
      transition={{
        type: 'spring',
        bounce: 0.35,
        duration: 0.8,
        delay,
      }}
    >
      <div className="aspect-square w-full overflow-hidden">
        {item.type === 'image' ? (
          <ImageWithSkeleton
            src={getMediaUrl(item.src)}
            alt={item.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            src={getMediaUrl(item.src)}
            poster={item.poster ? getMediaUrl(item.poster) : undefined}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </motion.div>
  )
}

interface StoryboardMediaProps {
  media: StoryboardMediaType[]
  layout?: MediaLayout
  isActive: boolean
  baseDelay?: number
  sectionId?: string
  sparkle?: boolean
}

export function StoryboardMedia({
  media,
  layout = 'row',
  isActive,
  baseDelay = 0.7,
  sectionId: _sectionId,
  sparkle = false,
}: StoryboardMediaProps) {
  // Detect if mobile (< 640px = sm breakpoint) for heroVideo layout
  // Must be at top level to follow React hooks rules
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : true
  )

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (media.length === 0) return null

  // Single image - large centered (but not heroVideo which handles single videos differently)
  if (layout === 'single' || (media.length === 1 && layout !== 'heroVideo')) {
    return (
      <div className="w-full max-w-lg">
        <MediaItem
          item={media[0]}
          isActive={isActive}
          baseDelay={baseDelay}
          className="aspect-[4/3] w-full"
        />
      </div>
    )
  }

  // Row layout - horizontal flex
  if (layout === 'row') {
    return (
      <div className="flex w-full max-w-4xl gap-4">
        {media.map((item, index) => (
          <MediaItem
            key={index}
            item={item}
            isActive={isActive}
            baseDelay={baseDelay + index * 0.15}
            className="aspect-[4/3] flex-1"
          />
        ))}
      </div>
    )
  }

  // Grid layout - 2x2
  if (layout === 'grid') {
    return (
      <div className="grid w-full max-w-xl grid-cols-2 gap-3">
        {media.slice(0, 4).map((item, index) => (
          <MediaItem
            key={index}
            item={item}
            isActive={isActive}
            baseDelay={baseDelay}
            className="aspect-square w-full"
          />
        ))}
      </div>
    )
  }

  // Collage layout - overlapping with rotations
  if (layout === 'collage') {
    const positions = [
      { className: 'z-10 -rotate-3', style: { width: '55%', left: '5%', top: '10%' } },
      { className: 'z-20 rotate-2', style: { width: '50%', right: '5%', top: '5%' } },
      { className: 'z-30 -rotate-1', style: { width: '45%', left: '25%', bottom: '10%' } },
    ]

    return (
      <div className="relative h-80 w-full max-w-xl sm:h-96">
        {media.slice(0, 3).map((item, index) => {
          const pos = positions[index % positions.length]
          return (
            <MediaItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className={cn('absolute aspect-[4/3]', pos.className)}
              style={pos.style}
            />
          )
        })}
      </div>
    )
  }

  // Scattered layout for Disney screen - polaroids with video below
  if (layout === 'scattered') {
    // Separate images from video
    const images = media.filter((m) => m.type === 'image')
    const video = media.find((m) => m.type === 'video')

    return (
      <div className="flex flex-col items-center gap-6 md:gap-6">
        {/* Mobile: Horizontal row of small polaroids */}
        <div className="flex justify-center gap-2.5 px-2 sm:gap-3 md:hidden">
          {images.slice(0, 3).map((item, index) => (
            <PolaroidItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className="w-28 sm:w-32"
            />
          ))}
        </div>

        {/* Desktop: Spread out horizontal layout - no overlap */}
        <div className="hidden justify-center gap-8 md:flex lg:gap-12">
          {images.slice(0, 3).map((item, index) => (
            <PolaroidItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className="w-44 lg:w-56"
            />
          ))}
        </div>

        {/* Video with lavender border */}
        {video && (
          <MediaItem
            item={video}
            isActive={isActive}
            baseDelay={baseDelay}
            className="aspect-[4/3] w-80 flex-shrink-0 sm:w-80 md:w-96 lg:w-[420px]"
            showBorder
            borderColor="lavender"
          />
        )}
      </div>
    )
  }

  // Polaroid layout - styled like instant photos
  if (layout === 'polaroid') {
    return (
      <div className="flex w-full max-w-2xl justify-center gap-4 sm:gap-8">
        {media.map((item, index) => (
          <PolaroidItem
            key={index}
            item={item}
            isActive={isActive}
            baseDelay={baseDelay + (item.delay || index * 0.2)}
            className="w-32 sm:w-48"
          />
        ))}
      </div>
    )
  }

  // Stack layout - cards stacked with offsets
  if (layout === 'stack') {
    return (
      <div className="relative h-72 w-full max-w-sm sm:h-80">
        {media.slice(0, 3).map((item, index) => {
          const offset = index * 8
          const rotation = (index - 1) * 3

          return (
            <MediaItem
              key={index}
              item={{ ...item, rotation: item.rotation ?? rotation }}
              isActive={isActive}
              baseDelay={baseDelay + index * 0.1}
              className="absolute aspect-[3/4] w-full"
              style={{
                left: offset,
                top: offset,
                zIndex: media.length - index,
              }}
            />
          )
        })}
      </div>
    )
  }

  // Checkerboard layout - vertical staggered on mobile, horizontal row on desktop
  if (layout === 'checkerboard') {
    return (
      <div className="relative">
        {sparkle && isActive && (
          <Sparkle
            color="#FFD700"
            count={20}
            minSize={5}
            maxSize={12}
            overflowPx={20}
            fadeOutSpeed={20}
            flicker={false}
          />
        )}
        {/* Mobile: Vertical staggered layout */}
        <div className="flex w-full max-w-xs flex-col gap-1.5 md:hidden">
          {media.slice(0, 4).map((item, index) => {
            const isLeft = index % 2 === 0

            return (
              <div key={index} className="grid grid-cols-2 gap-1.5">
                {isLeft ? (
                  <>
                    <MediaItem
                      item={item}
                      isActive={isActive}
                      baseDelay={baseDelay}
                      className="aspect-[5/4] w-full"
                    />
                    <div /> {/* Spacer */}
                  </>
                ) : (
                  <>
                    <div /> {/* Spacer */}
                    <MediaItem
                      item={item}
                      isActive={isActive}
                      baseDelay={baseDelay}
                      className="aspect-[5/4] w-full"
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Desktop: Horizontal row with alternating vertical positions */}
        <div className="hidden items-start justify-center gap-0 md:flex md:mt-8 lg:mt-12">
          {media.slice(0, 4).map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className={cn(
                'aspect-[4/3] w-60 lg:w-72',
                index % 2 === 0 ? 'mt-[180px] lg:mt-[216px]' : ''
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  // Bento layout - CSS Grid with flush edges, 8 items
  if (layout === 'bento') {
    // Bento grid: 3 columns, 4 rows with fixed cell size (100px mobile, 120px lg)
    // Layout pattern for 8 images:
    // [large 2x2] [small]
    //             [small]
    // [wide 2x1]  [small]
    // [small] [small] [small]
    const cellSize = 100 // px - base cell size
    const lgCellSize = 120 // px - large screen cell size

    const bentoPositions = [
      { gridArea: '1 / 1 / 3 / 3' }, // 0: large 2x2 top-left
      { gridArea: '1 / 3 / 2 / 4' }, // 1: small row 1, col 3
      { gridArea: '2 / 3 / 3 / 4' }, // 2: small row 2, col 3
      { gridArea: '3 / 1 / 4 / 3' }, // 3: wide row 3, cols 1-2
      { gridArea: '3 / 3 / 4 / 4' }, // 4: small row 3, col 3
      { gridArea: '4 / 1 / 5 / 2' }, // 5: small row 4, col 1
      { gridArea: '4 / 2 / 5 / 3' }, // 6: small row 4, col 2
      { gridArea: '4 / 3 / 5 / 4' }, // 7: small row 4, col 3
    ]

    return (
      <>
        {/* Mobile */}
        <div
          className="grid overflow-hidden rounded-xl lg:hidden"
          style={{
            gridTemplateColumns: `repeat(3, ${cellSize}px)`,
            gridTemplateRows: `repeat(4, ${cellSize}px)`,
            width: cellSize * 3,
            height: cellSize * 4,
          }}
        >
          {media.slice(0, 8).map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className="h-full w-full rounded-none"
              style={{ gridArea: bentoPositions[index].gridArea }}
            />
          ))}
        </div>

        {/* Desktop */}
        <div
          className="hidden overflow-hidden rounded-xl lg:grid"
          style={{
            gridTemplateColumns: `repeat(3, ${lgCellSize}px)`,
            gridTemplateRows: `repeat(4, ${lgCellSize}px)`,
            width: lgCellSize * 3,
            height: lgCellSize * 4,
          }}
        >
          {media.slice(0, 8).map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className="h-full w-full rounded-none"
              style={{ gridArea: bentoPositions[index].gridArea }}
            />
          ))}
        </div>
      </>
    )
  }

  // Shrine layout - symmetrical: 2 small | 2 large | 2 small
  if (layout === 'shrine') {
    // Expects 6 items: [small1, small2, large1, large2, small3, small4]
    const topSmall = media.slice(0, 2)
    const centerLarge = media.slice(2, 4)
    const bottomSmall = media.slice(4, 6)

    return (
      <>
        {/* Mobile: Vertical layout - small above, large center, small below */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 md:hidden">
          {/* Top row - 2 small squares */}
          <div className="flex gap-3">
            {topSmall.map((item, index) => (
              <MediaItem
                key={`top-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-square w-24 sm:w-28"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>

          {/* Center - 2 large portraits side by side */}
          <div className="flex gap-3">
            {centerLarge.map((item, index) => (
              <MediaItem
                key={`center-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-[3/4] w-36 sm:w-44"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>

          {/* Bottom row - 2 small squares */}
          <div className="flex gap-3">
            {bottomSmall.map((item, index) => (
              <MediaItem
                key={`bottom-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-square w-24 sm:w-28"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal layout - small | large | small */}
        <div className="mt-12 hidden w-full max-w-6xl items-center justify-center gap-5 md:flex">
          {/* Left column - 2 small squares */}
          <div className="flex flex-col gap-5">
            {topSmall.map((item, index) => (
              <MediaItem
                key={`left-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-square w-36 lg:w-44"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>

          {/* Center - 2 large portraits side by side */}
          <div className="flex gap-5">
            {centerLarge.map((item, index) => (
              <MediaItem
                key={`center-desktop-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-[3/4] w-64 lg:w-80"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>

          {/* Right column - 2 small squares */}
          <div className="flex flex-col gap-5">
            {bottomSmall.map((item, index) => (
              <MediaItem
                key={`right-${index}`}
                item={item}
                isActive={isActive}
                baseDelay={baseDelay}
                className="aspect-square w-36 lg:w-44"
                showBorder
                borderColor="lavender"
              />
            ))}
          </div>
        </div>
      </>
    )
  }

  // Hero Video layout - large centered video for final screen
  // Mobile: 340x400, Desktop: 540x580 (fixed dimensions)
  // Uses object-position to show bottom-left of portrait video
  // Uses JS detection (isMobile hook at top) to render only ONE video
  if (layout === 'heroVideo') {
    const video = media.find((m) => m.type === 'video')
    if (!video) return null

    return (
      <div className="flex w-full flex-col items-center justify-center">
        <MediaItem
          item={video}
          isActive={isActive}
          baseDelay={baseDelay}
          className="overflow-hidden"
          style={isMobile ? { width: 340, height: 400 } : { width: 540, height: 580 }}
          showBorder
          borderColor="lavender"
          objectPosition="left 80%"
        />
      </div>
    )
  }

  // Media Strip layout - 2 rows: images on top, video below
  if (layout === 'mediaStrip') {
    const images = media.filter((m) => m.type === 'image')
    const video = media.find((m) => m.type === 'video')

    return (
      <div className="flex w-full flex-col items-center gap-3 md:gap-6">
        {/* Images: 2x2 grid on mobile, single row on desktop */}
        <div className="grid max-w-[260px] grid-cols-2 gap-2 sm:max-w-[300px] sm:gap-2.5 md:flex md:max-w-none md:items-center md:justify-center md:gap-3">
          {images.map((item, index) => (
            <MediaItem
              key={index}
              item={item}
              isActive={isActive}
              baseDelay={baseDelay}
              className="aspect-[4/3] w-full md:h-28 md:w-auto lg:h-32"
              showBorder
              borderColor="lavender"
            />
          ))}
        </div>

        {/* Video below */}
        {video && (
          <MediaItem
            item={video}
            isActive={isActive}
            baseDelay={baseDelay}
            className="aspect-[4/3] w-full max-w-[300px] sm:max-w-sm md:w-[520px] lg:w-[600px]"
            showBorder
            borderColor="lavender"
          />
        )}
      </div>
    )
  }

  // Default fallback to row
  return (
    <div className="flex w-full max-w-4xl gap-4">
      {media.map((item, index) => (
        <MediaItem
          key={index}
          item={item}
          isActive={isActive}
          baseDelay={baseDelay + index * 0.15}
          className="aspect-[4/3] flex-1"
        />
      ))}
    </div>
  )
}
