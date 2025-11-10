export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  // Server-side: always return 'light' for SSR
  if (typeof window === 'undefined') return 'light'

  // Client-side: read from localStorage or system preference
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme: Theme): void {
  // No-op on server
  if (typeof window === 'undefined') return

  // Client-side: persist to localStorage and update DOM
  localStorage.setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
