import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { DarkModeContext } from './useDarkMode'
import { setThemeServerFn, type Theme } from '~/utils/theme.server'

interface DarkModeProviderProps {
  children: ReactNode
  initialTheme: Theme  // NEW: from server
}

export function DarkModeProvider({ children, initialTheme }: DarkModeProviderProps) {
  // Initialize with server-provided theme (no mismatch!)
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const router = useRouter()

  // NO useLayoutEffect needed - state is correct from start!

  const contextValue = useMemo(() => {
    const setTheme = async (newTheme: Theme) => {
      // Update local state for immediate UI feedback
      setThemeState(newTheme)

      // Persist to server (cookie)
      await setThemeServerFn({ data: { theme: newTheme } })

      // Invalidate router to trigger loader re-run
      // This will re-render __root.tsx with the new theme className
      router.invalidate()
    }

    const toggleTheme = async () => {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      await setTheme(newTheme)
    }

    return { theme, toggleTheme, setTheme }
  }, [theme, router])

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  )
}
