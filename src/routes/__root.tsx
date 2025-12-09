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
      // SEO meta tags
      {
        title: 'wutims',
      },
      {
        name: 'description',
        content: 'wutims - Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.',
      },
      {
        name: 'author',
        content: 'Tim Wu',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      // Open Graph meta tags
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'wutims',
      },
      {
        property: 'og:title',
        content: 'wutims | ai blog',
      },
      {
        property: 'og:description',
        content: 'wutims - Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.',
      },
      {
        property: 'og:image',
        content: 'https://media.wutims.com/wutims_og_1200px.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:url',
        content: 'https://wutims.com',
      },
      {
        property: 'og:locale',
        content: 'en_US',
      },
      // Twitter Card meta tags
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'wutims | ai blog',
      },
      {
        name: 'twitter:description',
        content: 'wutims - Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.',
      },
      {
        name: 'twitter:image',
        content: 'https://media.wutims.com/wutims_og_1200px.png',
      },
      // Additional SEO tags
      {
        name: 'generator',
        content: 'TanStack Start',
      },
    ],
    links: [
      // Canonical URL
      { rel: 'canonical', href: 'https://wutims.com' },
      // Favicon links
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      // Web App Manifest
      { rel: 'manifest', href: '/site.webmanifest' },
      // Preconnect to media CDN for fonts and OG images
      { rel: 'preconnect', href: 'https://media.wutims.com', crossOrigin: 'anonymous' },
      // Preload critical fonts - Inter 400 (body) and Playfair 600 (headings)
      // Using font-display: swap in CSS for better LCP
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://media.wutims.com/fonts/inter-400.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: 'https://media.wutims.com/fonts/playfair-display-600.woff2',
        crossOrigin: 'anonymous',
      },
      // Application CSS
      { rel: 'stylesheet', href: appCss },
      // RSS Feed
      { rel: 'alternate', type: 'application/rss+xml', title: 'wutims RSS Feed', href: '/feed.xml' },
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
        {/* JSON-LD Structured Data for SEO and Agentic Discovery */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://wutims.com/#website',
                  url: 'https://wutims.com',
                  name: 'wutims',
                  description: 'Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.',
                  publisher: {
                    '@id': 'https://wutims.com/#person',
                  },
                  inLanguage: 'en-US',
                },
                {
                  '@type': 'Person',
                  '@id': 'https://wutims.com/#person',
                  name: 'Tim Wu',
                  url: 'https://wutims.com',
                  image: 'https://media.wutims.com/wutims_og_1200px.png',
                  sameAs: [
                    'https://github.com/wuTims',
                    'https://www.linkedin.com/in/timlwu',
                  ],
                  jobTitle: 'AI Engineer',
                  knowsAbout: [
                    'AI Development',
                    'Software Engineering',
                    'Agentic Workflows',
                    'Table Tennis',
                    'LLMs',
                    'RAG',
                    'Python',
                    'TypeScript',
                    'Java',
                    'React',
                    'Food'
                  ],
                },
                {
                  '@type': 'WebPage',
                  '@id': 'https://wutims.com/#webpage',
                  url: 'https://wutims.com',
                  name: 'wutims | ai blog',
                  isPartOf: {
                    '@id': 'https://wutims.com/#website',
                  },
                  about: {
                    '@id': 'https://wutims.com/#person',
                  },
                  description: 'wutims - Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.',
                  inLanguage: 'en-US',
                },
              ],
            }),
          }}
        />
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
