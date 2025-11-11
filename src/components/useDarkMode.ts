import { createContext, useContext } from 'react'
import type { Theme } from '~/utils/theme.server'  // NEW: from server file

export interface DarkModeContextType {
  theme: Theme
  toggleTheme: () => Promise<void>  // NEW: async
  setTheme: (theme: Theme) => Promise<void>  // NEW: async
  resolvedTheme: 'light' | 'dark'  // The actual theme being applied (resolves 'system')
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
)

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
