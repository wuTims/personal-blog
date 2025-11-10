import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '~/globals.css?url'
import { DarkModeProvider } from '~/components/DarkModeProvider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    scripts: [
      // CRITICAL: Apply theme before first paint to prevent flash
      // This blocking script runs synchronously before any content renders
      {
        children: `
          (function() {
            try {
              const stored = localStorage.getItem('theme');
              const theme = (stored === 'light' || stored === 'dark')
                ? stored
                : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              // Fail silently - don't block page load
            }
          })();
        `,
      },
    ],
    links: [
      // Preconnect to Google Fonts with crossorigin for better CORS handling
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // Preload Google Fonts CSS to start fetching immediately
      // Using block instead of swap to prevent FOUT (Flash of Unstyled Text)
      // block: Text invisible max 3s while font loads, then renders with correct font
      // This eliminates jarring font swaps
      {
        rel: 'preload',
        as: 'style',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=block',
      },
      // Load Google Fonts - using block to prevent font swapping flash
      // Only essential weights: 400 (regular), 600 (semibold/bold)
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=block',
      },
      // Application CSS
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4 text-muted">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <DarkModeProvider>{children}</DarkModeProvider>
        <Scripts />
      </body>
    </html>
  )
}
