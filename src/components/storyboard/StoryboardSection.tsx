import { useState, useEffect, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import Snowfall from 'react-snowfall'
import Confetti from 'react-confetti'
import Sparkle from 'react-sparkle'
import { cn } from '~/lib/utils'
import { StoryboardMedia } from './StoryboardMedia'
import type { StoryboardSectionData, AnimationType } from '~/lib/storyboard-data'

// Typewriter animation component
interface TypewriterTextProps {
  text: string
  isActive: boolean
  delay?: number
  className?: string
  onComplete?: () => void
  speed?: number // ms per character
}

function TypewriterText({
  text,
  isActive,
  delay = 0,
  className,
  onComplete,
  speed = 40,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('')
      setIsComplete(false)
      return
    }

    let index = 0
    let intervalId: ReturnType<typeof setInterval>

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(intervalId)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)
    }, delay * 1000)

    return () => {
      clearTimeout(startTimeout)
      if (intervalId) clearInterval(intervalId)
    }
  }, [isActive, text, delay, onComplete, speed])

  return (
    <span className={className}>
      {displayedText}
      {isActive && !isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  )
}

// Typewriter with highlighted word for caption
interface HighlightTypewriterTextProps {
  text: string
  highlightWord: string
  isActive: boolean
  delay?: number
  className?: string
  onComplete?: () => void
}

function HighlightTypewriterText({
  text,
  highlightWord,
  isActive,
  delay = 0,
  className,
  onComplete,
}: HighlightTypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('')
      setIsComplete(false)
      return
    }

    let index = 0
    let intervalId: ReturnType<typeof setInterval>

    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(intervalId)
          setIsComplete(true)
          onComplete?.()
        }
      }, 50)
    }, delay * 1000)

    return () => {
      clearTimeout(startTimeout)
      if (intervalId) clearInterval(intervalId)
    }
  }, [isActive, text, delay, onComplete])

  // Render text with highlighted word
  const renderText = () => {
    if (!displayedText) return null

    const parts = displayedText.split(new RegExp(`(${highlightWord})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={i} className="text-lavender">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return (
    <span className={className}>
      {renderText()}
      {isActive && !isComplete && displayedText.length > 0 && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  )
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

// Animation variants for text elements
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

interface StoryboardSectionProps {
  section: StoryboardSectionData
  isActive: boolean
}

export function StoryboardSection({ section, isActive }: StoryboardSectionProps) {
  const { width, height } = useWindowSize()
  const [titleComplete, setTitleComplete] = useState(false)

  // Reset titleComplete when section becomes inactive
  useEffect(() => {
    if (!isActive) {
      setTitleComplete(false)
    }
  }, [isActive])

  const handleTitleComplete = useCallback(() => {
    setTitleComplete(true)
  }, [])

  const textColorClass =
    section.textColor === 'light' ? 'text-white' : 'text-neutral-900'

  const subtitleColorClass =
    section.textColor === 'light' ? 'text-white/80' : 'text-neutral-600'

  const footerColorClass =
    section.textColor === 'light' ? 'text-white' : 'text-neutral-900'

  const getVariant = (type?: AnimationType) => animations[type || 'fadeUp']

  // Timeline-based delays for Screen 5, otherwise standard staggered delays
  // Timeline animation has two modes:
  // 1. With title/images (closing screen): typewriter -> subtitle -> images -> video -> caption -> footer
  // 2. Video-only (final screen): video appears immediately -> caption -> footer -> badge
  const isTimeline = section.timelineAnimation
  const isVideoOnlyTimeline = isTimeline && !section.title && section.media.length === 1 && section.media[0].type === 'video'

  const titleDelay = isTimeline ? 0 : 0.1
  // For timeline, subtitle delay is handled by titleComplete state, otherwise use fixed delay
  const subtitleDelay = isTimeline ? 0.5 : 0.4
  // Calculate delays based on when subtitle would appear
  // Title "If there's one constant..." is 47 chars at 40ms = ~1.9s, + 0.5s pause = subtitle at ~2.4s
  // Images start 1s after subtitle
  const mediaDelay = isVideoOnlyTimeline ? 0.3 : isTimeline ? 3.4 : 0.7
  // For video-only: caption starts 1.5s after video, then footer/badge wait for typewriter to finish
  // Caption "Because your smile lights up mine" = 34 chars at 40ms = ~1.4s to type, finishes ~3.2s
  // For full timeline: Video is at mediaDelay + 4s (after 4 images at 1s each) = 7.4s, caption 2s after
  const captionDelay = isVideoOnlyTimeline ? 1.8 : isTimeline ? 9.4 : section.media.length > 0 ? 1.3 : 0.7
  const footerDelay = isVideoOnlyTimeline ? 3.5 : isTimeline ? 11.9 : section.media.length > 0 ? 1.5 : 0.9
  const badgeDelay = isVideoOnlyTimeline ? 4.5 : isTimeline ? 12.9 : footerDelay + 1.0

  const springTransition = {
    type: 'spring' as const,
    bounce: 0.35,
    duration: 0.9,
  }

  // Build background style for gradient support
  const backgroundStyle = section.backgroundGradient
    ? {
        background: `linear-gradient(${
          section.backgroundGradient.direction === 'to-t'
            ? 'to top'
            : section.backgroundGradient.direction === 'to-r'
              ? 'to right'
              : section.backgroundGradient.direction === 'to-l'
                ? 'to left'
                : 'to bottom'
        }, ${section.backgroundGradient.from}, ${section.backgroundGradient.to})`,
      }
    : undefined

  return (
    <section
      id={section.id}
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center px-6',
        !section.backgroundGradient && section.backgroundColor
      )}
      style={backgroundStyle}
    >
      {/* Snow effect */}
      {section.effect === 'snow' && isActive && (
        <Snowfall
          snowflakeCount={150}
          radius={[0.5, 2.5]}
          speed={[0.5, 2]}
          wind={[-0.5, 1]}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />
      )}

      {/* Confetti effect */}
      {section.effect === 'confetti' && isActive && width > 0 && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.1}
          colors={['#FFD700', '#FFA500', '#FF6347', '#98FB98', '#87CEEB', '#DDA0DD']}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />
      )}

      <div className="relative z-10 flex h-full w-full max-w-4xl flex-col items-center justify-center gap-4 py-20 pt-24 text-center md:gap-6 md:py-16 md:pt-20">
        {/* Title - with optional typewriter animation */}
        {section.title && (
          section.typewriterTitle ? (
            <h2
              className={cn(
                'font-serif text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl',
                textColorClass
              )}
            >
              <TypewriterText
                text={section.title}
                isActive={isActive}
                delay={titleDelay}
                onComplete={handleTitleComplete}
              />
            </h2>
          ) : (
            <motion.h2
              className={cn(
                'font-serif text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl',
                textColorClass
              )}
              variants={getVariant(section.titleAnimation)}
              initial="hidden"
              animate={isActive ? 'visible' : 'hidden'}
              transition={{ ...springTransition, delay: titleDelay }}
            >
              {section.title}
            </motion.h2>
          )
        )}

        {/* Subtitle - waits for typewriter title to complete on timeline screens */}
        {section.subtitle && (
          section.typewriterSubtitle ? (
            <p className={cn('text-lg sm:text-xl md:text-2xl', subtitleColorClass)}>
              <HighlightTypewriterText
                text={section.subtitle}
                highlightWord={section.subtitleHighlightWord || ''}
                isActive={isTimeline ? titleComplete : isActive}
                delay={subtitleDelay}
              />
            </p>
          ) : (
            <motion.p
              className={cn('text-lg sm:text-xl md:text-2xl', subtitleColorClass)}
              variants={getVariant(section.subtitleAnimation)}
              initial="hidden"
              animate={isTimeline ? (titleComplete ? 'visible' : 'hidden') : (isActive ? 'visible' : 'hidden')}
              transition={{ ...springTransition, delay: subtitleDelay }}
            >
              {section.subtitle}
            </motion.p>
          )
        )}

        {/* Media with side footer for scattered layout */}
        {section.media.length > 0 && section.mediaLayout === 'scattered' ? (
          <div className="relative w-full">
            <StoryboardMedia
              media={section.media}
              layout={section.mediaLayout}
              isActive={isActive}
              baseDelay={mediaDelay}
              sectionId={section.id}
              sparkle={section.mediaSparkle}
            />
            {/* Vertical footer positioned to the right of video */}
            {(section.footerText || section.footerBadge) && (
              <div className="mt-3 flex flex-col items-center gap-2 md:absolute md:bottom-4 md:right-4 md:mt-0 md:items-start lg:right-8">
                {section.footerText && (
                  <motion.p
                    className={cn('relative text-sm md:text-base', footerColorClass)}
                    variants={getVariant(section.footerAnimation)}
                    initial="hidden"
                    animate={isActive ? 'visible' : 'hidden'}
                    transition={{ ...springTransition, delay: footerDelay + 0.5 }}
                  >
                    {section.footerSparkle && isActive && (
                      <Sparkle
                        color="#FFD700"
                        count={10}
                        minSize={5}
                        maxSize={12}
                        overflowPx={8}
                        fadeOutSpeed={20}
                        flicker={false}
                      />
                    )}
                    {section.footerText}
                  </motion.p>
                )}
                {section.footerBadge && (
                  <motion.span
                    className="inline-block rounded-full bg-lavender px-3 py-1 text-sm font-semibold text-neutral-900 shadow-lg"
                    style={{
                      rotate: section.footerBadge.rotation
                        ? `${section.footerBadge.rotation}deg`
                        : undefined,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      bounce: 0.5,
                      duration: 0.8,
                      delay: footerDelay + 2.0,
                    }}
                  >
                    {section.footerBadge.text}
                  </motion.span>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Standard media */}
            {section.media.length > 0 && (
              <StoryboardMedia
                media={section.media}
                layout={section.mediaLayout}
                isActive={isActive}
                baseDelay={mediaDelay}
                sectionId={section.id}
                sparkle={section.mediaSparkle}
              />
            )}

            {/* Caption (appears below media) - with highlight typewriter on timeline screens */}
            {section.caption && (
              isTimeline ? (
                <p className={cn('text-lg sm:text-xl md:text-2xl', subtitleColorClass)}>
                  <HighlightTypewriterText
                    text={section.caption}
                    highlightWord="smile"
                    isActive={isActive}
                    delay={captionDelay}
                  />
                </p>
              ) : (
                <motion.p
                  className={cn('text-lg italic md:text-xl', subtitleColorClass)}
                  variants={getVariant(section.captionAnimation)}
                  initial="hidden"
                  animate={isActive ? 'visible' : 'hidden'}
                  transition={{ ...springTransition, delay: captionDelay }}
                >
                  {section.caption}
                </motion.p>
              )
            )}

            {/* Footer with optional accent badge */}
            {(section.footerText || section.footerBadge) && (
              <div className="relative mt-auto flex w-full items-center justify-center gap-3">
                {section.footerText && (
                  <motion.p
                    className={cn('relative text-base md:text-lg', footerColorClass)}
                    variants={getVariant(section.footerAnimation)}
                    initial="hidden"
                    animate={isActive ? 'visible' : 'hidden'}
                    transition={{ ...springTransition, delay: footerDelay }}
                  >
                    {section.footerSparkle && isActive && (
                      <Sparkle
                        color="#FFD700"
                        count={10}
                        minSize={5}
                        maxSize={12}
                        overflowPx={8}
                        fadeOutSpeed={20}
                        flicker={false}
                      />
                    )}
                    {section.footerText}
                  </motion.p>
                )}

                {section.footerBadge && (
                  <motion.span
                    className="inline-block rounded-full bg-lavender px-3 py-1 text-sm font-semibold text-neutral-900 shadow-lg md:px-4 md:py-1.5 md:text-base"
                    style={{
                      rotate: section.footerBadge.rotation
                        ? `${section.footerBadge.rotation}deg`
                        : undefined,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      bounce: 0.5,
                      duration: 0.8,
                      delay: badgeDelay,
                    }}
                  >
                    {section.footerBadge.text}
                  </motion.span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
