// Persistent cache to prevent garbage collection of preloaded images
export const imageCache = new Map<string, HTMLImageElement>()

/**
 * Preloads and decodes a single image, storing it in the cache.
 * Uses decode() API to force bitmap decoding before render.
 */
export async function preloadAndDecodeImage(src: string): Promise<HTMLImageElement> {
  // Return cached image if already loaded
  const cached = imageCache.get(src)
  if (cached) {
    return cached
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = async () => {
      try {
        // Force bitmap decode before resolving
        await img.decode()
        imageCache.set(src, img)
        resolve(img)
      } catch {
        // decode() can fail on some browsers/images, still cache the loaded image
        imageCache.set(src, img)
        resolve(img)
      }
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Preloads and decodes images for specific sections with priority control.
 * High priority loads sequentially for faster first paint.
 * Low priority loads in parallel for background preloading.
 */
export async function preloadSectionMedia(
  sections: StoryboardSectionData[],
  getMediaUrl: (path: string) => string,
  priority: 'high' | 'low' = 'low'
): Promise<void> {
  const imageSources: string[] = []

  for (const section of sections) {
    for (const media of section.media) {
      if (media.type === 'image') {
        imageSources.push(getMediaUrl(media.src))
      }
    }
  }

  if (priority === 'high') {
    // Sequential loading for critical images - faster first paint
    for (const src of imageSources) {
      try {
        await preloadAndDecodeImage(src)
      } catch {
        // Don't block on failed images
      }
    }
  } else {
    // Parallel loading for background preloading
    await Promise.all(
      imageSources.map((src) =>
        preloadAndDecodeImage(src).catch(() => {
          // Don't block on failed images
        })
      )
    )
  }
}

/**
 * Clears the image cache. Call on unmount to free memory.
 */
export function clearImageCache(): void {
  imageCache.clear()
}

export type AnimationType =
  | 'fadeUp'
  | 'fadeDown'
  | 'scaleUp'
  | 'scaleBounce'
  | 'slideLeft'
  | 'slideRight'
  | 'blur'
  | 'rotate'
  | 'pop'

export type MediaLayout =
  | 'single' // One large centered image
  | 'row' // Horizontal row
  | 'grid' // 2x2 grid
  | 'collage' // Overlapping with slight rotations
  | 'scattered' // Random positions like photos on a wall
  | 'polaroid' // Polaroid-style with tape/pins
  | 'stack' // Stacked cards
  | 'checkerboard' // 2-column alternating grid with spacers
  | 'bento' // CSS Grid with named areas, flush edges
  | 'shrine' // Symmetrical: 2 small | 2 large | 2 small
  | 'mediaStrip' // Horizontal strip with fixed height
  | 'heroVideo' // Large centered video for final screen

export interface StoryboardMedia {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
  // Per-media animation config
  animation?: AnimationType
  delay?: number // Additional delay offset in seconds
  // For scattered/collage layouts - position hints
  rotation?: number // degrees
  offsetX?: number // percentage offset
  offsetY?: number // percentage offset
  scale?: number // size multiplier
  // Video-specific
  autoplayWithSound?: boolean // For final screen video
}

export type SectionEffect = 'snow' | 'confetti' | 'sparkles'

export interface AccentBadge {
  text: string
  rotation?: number // degrees
}

export interface StoryboardSectionData {
  id: string
  title?: string
  subtitle?: string
  // Background can be solid color class or gradient
  backgroundColor: string
  backgroundGradient?: {
    from: string
    to: string
    direction?: 'to-b' | 'to-t' | 'to-r' | 'to-l'
  }
  textColor: 'light' | 'dark'
  media: StoryboardMedia[]
  mediaLayout?: MediaLayout
  // Caption appears below media
  caption?: string
  // Footer text appears at bottom with optional accent badge
  footerText?: string
  footerSparkle?: boolean // Add sparkle effect to footer text
  footerBadge?: AccentBadge
  // Animation hints for text elements
  titleAnimation?: AnimationType
  subtitleAnimation?: AnimationType
  captionAnimation?: AnimationType
  footerAnimation?: AnimationType
  // Visual effects
  effect?: SectionEffect
  mediaSparkle?: boolean // Add sparkle effect to media container
  // For timeline-based animations (Screen 5)
  timelineAnimation?: boolean
  // For typewriter title animation
  typewriterTitle?: boolean
  // For typewriter subtitle animation with optional highlight word
  typewriterSubtitle?: boolean
  subtitleHighlightWord?: string
}

/**
 * Preloads all images from the storyboard sections and returns a promise
 * that resolves when all images are loaded.
 */
export function preloadStoryboardMedia(
  sections: StoryboardSectionData[],
  getMediaUrl: (path: string) => string
): Promise<void> {
  const imagePromises: Promise<void>[] = []

  for (const section of sections) {
    for (const media of section.media) {
      if (media.type === 'image') {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve() // Don't block on failed images
          img.src = getMediaUrl(media.src)
        })
        imagePromises.push(promise)
      }
    }
  }

  return Promise.all(imagePromises).then(() => {})
}

/**
 * Fetches storyboard config from R2 and prepends the folder path to all media src paths.
 */
export async function fetchStoryboardConfig(
  folder: string
): Promise<StoryboardSectionData[]> {
  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL
  if (!baseUrl) {
    throw new Error('VITE_MEDIA_BASE_URL is not configured')
  }

  const url = `${baseUrl}/${folder}/config.json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load storyboard config: ${res.status}`)
  }

  const sections: StoryboardSectionData[] = await res.json()

  // Prepend folder path to all media src paths
  for (const section of sections) {
    for (const media of section.media) {
      media.src = `${folder}/${media.src}`
    }
  }

  return sections
}
