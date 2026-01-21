import { motion } from 'framer-motion'

interface StoryboardProgressProps {
  total: number
  current: number
  onSegmentClick: (index: number) => void
}

export function StoryboardProgress({
  total,
  current,
  onSegmentClick,
}: StoryboardProgressProps) {
  return (
    <div
      className="absolute left-0 right-0 top-0 z-50 flex gap-1 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation()
            onSegmentClick(index)
          }}
          className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/30 transition-colors hover:bg-white/40"
          aria-label={`Go to section ${index + 1}`}
        >
          {index < current && (
            <div className="absolute inset-0 bg-white" />
          )}
          {index === current && (
            <motion.div
              className="absolute inset-y-0 left-0 bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              key={current}
            />
          )}
        </button>
      ))}
    </div>
  )
}
