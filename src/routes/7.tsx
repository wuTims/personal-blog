import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { StoryboardContainer } from '~/components/storyboard/StoryboardContainer'
import {
  fetchStoryboardConfig,
  preloadStoryboardMedia,
  type StoryboardSectionData,
} from '~/lib/storyboard-data'
import { getMediaUrl } from '~/lib/utils'
import { createPageMeta, seoConfig } from '~/lib/seo'

const STORYBOARD_FOLDER = 'a80c6c41'

const UNLOCK_HASH =
  'cce311caebdf2d75585714038fb835c1bb7d81ca8323633600a5317ac7d7bc2e'
const STORAGE_KEY = '7-unlocked'

function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore errors (incognito mode, quota exceeded, etc.)
  }
}

export const Route = createFileRoute('/7')({
  head: () => ({
    meta: [
      ...createPageMeta({
        title: '7',
        description: '7',
        url: `${seoConfig.siteUrl}/7`,
      }),
      { name: 'robots', content: 'noindex, nofollow' },
    ],
    links: [{ rel: 'canonical', href: `${seoConfig.siteUrl}/7` }],
  }),
  component: SevenPage,
})

function SevenPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [error, setError] = useState(false)

  // Config loading state
  const [sections, setSections] = useState<StoryboardSectionData[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadConfig = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await fetchStoryboardConfig(STORYBOARD_FOLDER)
      // Wait for all images to load before showing
      await preloadStoryboardMedia(data, getMediaUrl)
      setSections(data)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (getStorageItem(STORAGE_KEY) === 'true') {
      setIsUnlocked(true)
    }
  }, [])

  // Fetch config when unlocked
  useEffect(() => {
    if (isUnlocked && !sections && !isLoading) {
      loadConfig()
    }
  }, [isUnlocked, sections, isLoading, loadConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const encoder = new TextEncoder()
    const data = encoder.encode(phrase)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    if (hash === UNLOCK_HASH) {
      setStorageItem(STORAGE_KEY, 'true')
      setIsUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setPhrase('')
    }
  }

  if (isUnlocked) {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="text-sm text-white/60">Loading...</p>
          </div>
        </div>
      )
    }

    // Error state
    if (loadError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-white/80">Something went wrong</p>
            <p className="text-sm text-white/50">{loadError}</p>
            <button
              onClick={loadConfig}
              className="mt-2 rounded-md bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    // Content loaded
    if (sections) {
      return <StoryboardContainer sections={sections} />
    }

    // Initial loading state (brief)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  // Render form by default - avoids blank screen flash
  // Server renders form, client hydrates with form, then switches to storyboard if unlocked
  return (
    <>
      <div
        id="seven-unlock-form"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 p-8"
        >
          <label htmlFor="phrase" className="text-lg text-foreground">
            Enter the phrase to continue
          </label>
          <input
            id="phrase"
            type="password"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="rounded-md border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            autoComplete="off"
          />
          {error ? (
            <p className="text-sm text-red-500">Incorrect phrase, try again</p>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Unlock
          </button>
        </form>
      </div>
      {/* Hide form immediately for unlocked users before React hydrates */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{if(localStorage.getItem('${STORAGE_KEY}')==='true'){var f=document.getElementById('seven-unlock-form');if(f)f.style.display='none'}}catch(e){}})();`,
        }}
      />
    </>
  )
}
