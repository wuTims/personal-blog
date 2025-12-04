import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import contentCollections from '@content-collections/vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces (0.0.0.0)
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    contentCollections(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    cloudflare({
      configPath: './wrangler.jsonc',
      viteEnvironment: { name: 'ssr' },
      persistState: true,
    }),
    viteReact(),
  ],
  ssr: {
    target: 'webworker',
    noExternal: true,
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
      externalConditions: ['workerd', 'worker'],
    },
  },
})
