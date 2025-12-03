import {
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '~/globals.css?url'
import { DarkModeProvider } from '~/components/DarkModeProvider'
import { getThemeServerFn } from '~/utils/theme.server'

export const Route = createRootRoute({
  loader: async () => {
    const theme = await getThemeServerFn()
    return { theme }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#ffffff', // Default light theme, will be updated by script/React
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

import { SiteNavbar } from '~/components/SiteNavbar'
import { Footer } from '~/components/Footer'

// ... imports

function RootDocument({ children }: { children: ReactNode }) {
  const { theme } = Route.useLoaderData()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <html className={theme === 'dark' ? 'dark' : ''} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check if theme cookie exists
                const themeCookie = document.cookie
                  .split('; ')
                  .find(row => row.startsWith('theme='));

                // If no cookie, detect system preference and apply immediately
                if (!themeCookie) {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = prefersDark ? 'dark' : 'light';

                  // Set data attribute so React can read it during hydration
                  document.documentElement.setAttribute('data-theme', theme);

                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  }

                  // Update theme-color meta tag for mobile browsers
                  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
                  if (themeColorMeta) {
                    themeColorMeta.setAttribute('content', prefersDark ? '#0a0a0a' : '#ffffff');
                  }
                }
              })();
            `,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <DarkModeProvider initialTheme={theme}>
          <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
            <SiteNavbar />
            <main className="flex-1">
              {children}
            </main>
            {!isHomePage && <Footer />}
          </div>
        </DarkModeProvider>
        <Scripts />
      </body>
    </html>
  )
}
