
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

export interface StatusIndicatorProps {
  /** Array of topics to rotate through */
  topics: string[]
  /** Label shown before the rotating topic */
  label?: string
  /** Interval between topic changes in milliseconds */
  interval?: number
  /** Additional class names */
  className?: string
}

export function StatusIndicator({
  topics,
  label = 'Currently exploring:',
  interval = 3000,
  className,
}: StatusIndicatorProps) {
  const [topicIndex, setTopicIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const measureContainerRef = useRef<HTMLSpanElement>(null)

  // Stable key for detecting actual content changes
  const topicsKey = topics.join('|')

  // Pre-measure all topic widths on mount or when topics change
  useEffect(() => {
    if (measureContainerRef.current) {
      const children = measureContainerRef.current.children
      const measured = Array.from(children).map((child) => (child as HTMLElement).offsetWidth)
      setWidths(measured)
    }
  }, [topicsKey])

  useEffect(() => {
    const timer = setInterval(() => {
      setTopicIndex((prev) => (prev + 1) % topics.length)
    }, interval)
    return () => clearInterval(timer)
  }, [topics.length, interval])

  const currentWidth = widths[topicIndex]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full bg-neutral-100 px-4 py-1.5 text-sm text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400',
        className
      )}
    >
      <GlowingDot />
      <span className="relative flex items-center gap-1 overflow-hidden">
        {label}{' '}
        {/* Hidden measurement container - must not cause overflow */}
        <span
          ref={measureContainerRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 opacity-0"
        >
          {topics.map((topic, i) => (
            <span
              key={i}
              className="font-medium whitespace-nowrap pr-1"
            >
              {topic}
            </span>
          ))}
        </span>
        <motion.span
          className="relative inline-flex h-5 items-center overflow-hidden"
          animate={{ width: currentWidth ?? 'auto' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={topicIndex}
              className="absolute left-0 font-medium text-neutral-900 dark:text-neutral-200 whitespace-nowrap pr-1"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              {topics[topicIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    </div>
  )
}

export interface GlowingDotProps {
  /** Duration of one full pulse cycle in seconds */
  duration?: number
  /** Additional class names for the container */
  className?: string
}

export function GlowingDot({ duration = 4, className }: GlowingDotProps) {
  return (
    <span className={cn('relative flex h-1.5 w-1.5', className)}>
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 dark:bg-emerald-400/30"
        animate={{
          opacity: [0.35, 0.8, 0.35],
          scale: [1, 1.5, 1],
          boxShadow: [
            '0 0 3px 1px rgba(52, 211, 153, 0.15), 0 0 6px 2px rgba(52, 211, 153, 0.08)',
            '0 0 8px 2px rgba(52, 211, 153, 0.35), 0 0 14px 4px rgba(52, 211, 153, 0.18)',
            '0 0 3px 1px rgba(52, 211, 153, 0.15), 0 0 6px 2px rgba(52, 211, 153, 0.08)',
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/50 dark:bg-emerald-400/40" />
    </span>
  )
}