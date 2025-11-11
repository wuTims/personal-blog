import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { DarkModeContext } from './useDarkMode'
import { setThemeServerFn, type Theme } from '~/utils/theme.server'

interface DarkModeProviderProps {
  children: ReactNode
  initialTheme: Theme
}

// Helper to get system preference
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Helper to resolve actual theme (converts 'system' to 'light' or 'dark')
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemPreference()
  }
  return theme
}

export function DarkModeProvider({ children, initialTheme }: DarkModeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  // Initialize resolvedTheme to match server-side render (always 'light' for 'system')
  // We'll sync with the inline script's detection in useLayoutEffect
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    initialTheme === 'system' ? 'light' : initialTheme
  )

  // useLayoutEffect runs after hydration but before paint
  // Read the data-theme attribute set by inline script and sync state
  // This prevents hydration mismatch while avoiding flash
  useLayoutEffect(() => {
    if (initialTheme === 'system') {
      const dataTheme = document.documentElement.getAttribute('data-theme')
      if (dataTheme === 'dark' || dataTheme === 'light') {
        setResolvedTheme(dataTheme)
        setThemeState(dataTheme)
      } else {
        const resolved = getSystemPreference()
        setResolvedTheme(resolved)
        setThemeState(resolved)
      }

      // Save resolved theme to cookie (fire and forget)
      const themeToSave = dataTheme === 'dark' || dataTheme === 'light'
        ? dataTheme
        : getSystemPreference()
      setThemeServerFn({ data: { theme: themeToSave } }).catch(() => {
        // Ignore errors - cookie setting is not critical
      })
    }
    // Only run once on mount with initialTheme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Directly update <html> className when resolved theme changes
  // This avoids hydration mismatch and gives instant visual feedback
  useEffect(() => {
    const html = document.documentElement
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)

    if (resolved === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Update theme-color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', resolved === 'dark' ? '#0a0a0a' : '#ffffff')
    }
  }, [theme])

  const contextValue = useMemo(() => {
    const setTheme = async (newTheme: Theme) => {
      // Update local state (useEffect will update <html> className immediately)
      setThemeState(newTheme)

      // Persist to server (cookie) in background
      await setThemeServerFn({ data: { theme: newTheme } })
    }

    const toggleTheme = async () => {
      // Toggle based on what the user currently sees (resolvedTheme)
      // This makes it a simple binary toggle that always works in one click
      const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
      await setTheme(newTheme)
    }

    return { theme, toggleTheme, setTheme, resolvedTheme }
  }, [theme, resolvedTheme])

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
