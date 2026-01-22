import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  imageCache,
  preloadSectionMedia,
  clearImageCache,
  type StoryboardSectionData,
} from '~/lib/storyboard-data'

interface StoryboardImageContextValue {
  /** True when initial sections (0-1) are preloaded and ready */
  isReady: boolean
  /** Get a cached image element by URL */
  getCachedImage: (src: string) => HTMLImageElement | undefined
  /** Preload sections around the current index (current ± 1) */
  preloadSection: (currentIndex: number) => void
}

const StoryboardImageContext = createContext<StoryboardImageContextValue | null>(null)

interface StoryboardImageProviderProps {
  children: ReactNode
  sections: StoryboardSectionData[]
  getMediaUrl: (path: string) => string
}

export function StoryboardImageProvider({
  children,
  sections,
  getMediaUrl,
}: StoryboardImageProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [preloadedSections, setPreloadedSections] = useState<Set<number>>(new Set())

  // Initial load: preload sections 0-1 with high priority, then background-load remaining
  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      // Preload first two sections with high priority for faster initial display
      const initialSections = sections.slice(0, 2)
      await preloadSectionMedia(initialSections, getMediaUrl, 'high')

      if (cancelled) return
      setIsReady(true)
      setPreloadedSections(new Set([0, 1]))

      // Background preload remaining sections
      const remainingSections = sections.slice(2)
      if (remainingSections.length > 0) {
        await preloadSectionMedia(remainingSections, getMediaUrl, 'low')
        if (!cancelled) {
          setPreloadedSections(new Set(sections.map((_, i) => i)))
        }
      }
    }

    initialLoad()

    return () => {
      cancelled = true
    }
  }, [sections, getMediaUrl])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearImageCache()
    }
  }, [])

  const getCachedImage = useCallback((src: string) => {
    return imageCache.get(src)
  }, [])

  // Progressive preload on navigation (current ± 1 sections)
  const preloadSection = useCallback(
    (currentIndex: number) => {
      const indicesToPreload = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
        (i) => i >= 0 && i < sections.length && !preloadedSections.has(i)
      )

      if (indicesToPreload.length === 0) return

      const sectionsToPreload = indicesToPreload.map((i) => sections[i])
      preloadSectionMedia(sectionsToPreload, getMediaUrl, 'low').then(() => {
        setPreloadedSections((prev) => {
          const next = new Set(prev)
          indicesToPreload.forEach((i) => next.add(i))
          return next
        })
      })
    },
    [sections, getMediaUrl, preloadedSections]
  )

  const value: StoryboardImageContextValue = {
    isReady,
    getCachedImage,
    preloadSection,
  }

  return (
    <StoryboardImageContext.Provider value={value}>
      {children}
    </StoryboardImageContext.Provider>
  )
}

export function useStoryboardImages(): StoryboardImageContextValue {
  const context = useContext(StoryboardImageContext)
  if (!context) {
    throw new Error('useStoryboardImages must be used within a StoryboardImageProvider')
  }
  return context
}
