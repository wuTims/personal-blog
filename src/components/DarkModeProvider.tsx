import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { DarkModeContext } from './useDarkMode'
import { getTheme, setTheme as setThemeUtil, type Theme } from '~/utils/theme'

interface DarkModeProviderProps {
  children: ReactNode
}

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  // Always start with 'light' for consistent SSR/client hydration
  // The blocking script in __root.tsx handles the initial visual appearance
  const [theme, setThemeState] = useState<Theme>('light')

  // Sync with localStorage after hydration (useLayoutEffect for minimal flash)
  useLayoutEffect(() => {
    setThemeState(getTheme())
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme)
      setThemeUtil(newTheme)
    }

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
    }

    return { theme, toggleTheme, setTheme }
  }, [theme])

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
