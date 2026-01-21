import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StoryboardProgress } from './StoryboardProgress'
import { StoryboardSection } from './StoryboardSection'
import type { StoryboardSectionData } from '~/lib/storyboard-data'

// Hoisted outside component to avoid recreation on every render (Rule 6.3)
const bgVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 100 : -100,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -100 : 100,
  }),
}

interface StoryboardContainerProps {
  sections: StoryboardSectionData[]
}

export function StoryboardContainer({ sections }: StoryboardContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const isFirstSlide = currentIndex === 0
  const isLastSlide = currentIndex === sections.length - 1

  // Using functional setState to avoid currentIndex in dependencies (Rule 5.5)
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < sections.length - 1) {
        setDirection(1)
        return prev + 1
      }
      return prev
    })
  }, [sections.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        setDirection(-1)
        return prev - 1
      }
      return prev
    })
  }, [])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex((prev) => {
      if (index === prev) return prev
      setDirection(index > prev ? 1 : -1)
      return index
    })
  }, [])

  const restart = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(0)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev])

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
    setTouchStart(null)
  }

  // Click zones: left 30% goes back, right 70% goes forward
  // On last slide, any click on right side restarts
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const threshold = rect.width * 0.3

    if (x < threshold) {
      goToPrev()
    } else {
      if (isLastSlide) {
        restart()
      } else {
        goToNext()
      }
    }
  }

  const currentSection = sections[currentIndex]

  return (
    <div
      className="relative h-screen w-full cursor-pointer overflow-hidden"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <StoryboardProgress
        total={sections.length}
        current={currentIndex}
        onSegmentClick={goToIndex}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0"
        >
          <StoryboardSection section={currentSection} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation hint - only on first slide */}
      {isFirstSlide && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.p
            className="text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Tap to begin
          </motion.p>
        </div>
      )}
    </div>
  )
}
