# TanStack Start + Vite Quick Reference

A one-page cheat sheet for TanStack Start v1.121.0+ with Vite.

---

## Minimal Working Setup

### package.json
```json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "start": "node .output/server/index.mjs"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.135.0",
    "@tanstack/react-start": "^1.135.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^7.2.2",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Use 0.0.0.0 for WSL2/Docker/remote environments
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({ srcDirectory: 'src' }), // REQUIRED
    viteReact(), // MUST come after tanstackStart
  ],
})
```

### src/router.tsx
```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() { // MUST be named "getRouter"
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

### src/routes/__root.tsx
```typescript
import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router' // NOT @tanstack/react-start
import appCss from '~/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      // Load external resources before your CSS to prevent FOUC
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument, // NOT "component"
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head><HeadContent /></head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

### src/routes/index.tsx
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>Hello TanStack Start!</div>,
})
```

---

## Critical Rules

| ❌ DON'T | ✅ DO |
|----------|-------|
| Name function `createRouter()` | Name function `getRouter()` |
| Import from `@tanstack/react-start` | Import from `@tanstack/react-router` |
| Use `component` property in root | Use `shellComponent` property |
| Use `<Outlet />` in RootDocument | Use `{children}` prop directly |
| Create `app.config.ts` | Create `vite.config.ts` |
| Create `src/ssr.tsx` or `src/client.tsx` | Let Vite plugin handle it |
| Use `vinxi dev` command | Use `vite dev` command |
| Forget `srcDirectory: 'src'` | Always set `srcDirectory` in plugin |
| Import `Meta` component | Import `HeadContent` component |
| Use CSS `@import` for external fonts | Use `<link>` tags in `head()` config |
| Use `@tailwindcss/vite` plugin | Use `@tailwindcss/postcss` plugin |
| Use React 18 | Use React 19 for better SSR hydration |
| Use Vite 6 | Use Vite 7+ (peer dependency requirement) |
| Forget `suppressHydrationWarning` | Add to `<html>` and `<body>` tags |

---

## File Structure

```
project/
├── src/
│   ├── routes/
│   │   ├── __root.tsx       # Root layout
│   │   └── index.tsx         # Home page
│   ├── router.tsx            # getRouter() function
│   └── routeTree.gen.ts      # Auto-generated
├── vite.config.ts            # Vite config
├── tsconfig.json
└── package.json
```

---

## Common Errors & Fixes

### Error: "Cannot read properties of undefined (reading 'client')"
```typescript
// FIX: Delete app.config.ts, create vite.config.ts instead
```

### Error: "routerEntry.getRouter is not a function"
```typescript
// FIX 1: Rename function in src/router.tsx
export function getRouter() { /* ... */ } // NOT createRouter()

// FIX 2: Add srcDirectory to vite.config.ts
tanstackStart({ srcDirectory: 'src' })
```

### Error: "Element type is invalid... got: undefined"
```typescript
// FIX: Update src/routes/__root.tsx imports
import { HeadContent, Scripts } from '@tanstack/react-router'
// NOT from '@tanstack/react-start'
```

### Error: "A tree hydrated but some attributes didn't match"
```typescript
// FIX 1: Add suppressHydrationWarning to root elements
<html suppressHydrationWarning>
<body suppressHydrationWarning>

// FIX 2: Use shellComponent, not component
export const Route = createRootRoute({
  shellComponent: RootDocument, // NOT component
})

// FIX 3: Use children prop, not <Outlet />
function RootDocument({ children }) {
  return <html>... {children} ...</html>
}

// FIX 4: Switch from @tailwindcss/vite to @tailwindcss/postcss
pnpm remove @tailwindcss/vite
pnpm add -D @tailwindcss/postcss postcss

// FIX 5: Upgrade to React 19
pnpm add react@^19.0.0 react-dom@^19.0.0
```

---

## Preventing Flash of Unstyled Content (FOUC)

### Problem: Font/Style Flashing on Route Changes

When using external fonts (like Google Fonts) or external stylesheets, you may experience a brief flash of unstyled content when navigating between routes.

### ❌ DON'T: Use CSS `@import` for external resources

```css
/* globals.css - AVOID THIS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
```

**Why this causes FOUC:**
- CSS `@import` blocks parsing and can't be parallelized
- Fonts are discovered late in the rendering process
- Browser must wait for CSS to parse before loading fonts

### ✅ DO: Use `<link>` tags in `__root.tsx` with preconnect

```typescript
// src/routes/__root.tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      // 1. Preconnect to external domains (speeds up DNS/TLS)
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // 2. Load fonts BEFORE your CSS
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      },
      // 3. Your application CSS loads after fonts
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})
```

### Key Benefits

1. **Early discovery**: Browser sees font links in `<head>` immediately
2. **Parallel loading**: Fonts load in parallel with other resources
3. **Proper ordering**: Fonts load before CSS that depends on them
4. **Persistent across routes**: Defined in root, so fonts stay cached during navigation
5. **No blocking**: Native `<link>` tags don't block CSS parsing

### Troubleshooting FOUC

If you still see flashing after moving fonts to `<link>` tags:

```bash
# Clear Vite cache and restart
rm -rf .vinxi node_modules/.vite
pnpm run dev
```

### Vite Server Configuration

For WSL2/Docker/Remote environments, ensure Vite binds to all interfaces:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    host: true, // Listen on 0.0.0.0 instead of localhost
  },
  // ... plugins
})
```

---

## Migration from Vinxi (v1.120.0 or earlier)

```bash
# 1. Remove old files
rm app.config.ts src/ssr.tsx src/client.tsx

# 2. Create vite.config.ts (see above)

# 3. Update package.json scripts
"dev": "vite dev"                       # was "vinxi dev"
"build": "vite build && tsc --noEmit"   # was "vinxi build"
"start": "node .output/server/index.mjs" # was "vinxi start"

# 4. Rename router function
# In src/router.tsx: createRouter → getRouter

# 5. Update root route
# In src/routes/__root.tsx:
# - component → shellComponent
# - Meta → HeadContent
# - Import from @tanstack/react-router
# - Add suppressHydrationWarning to <html> and <body>
# - Use {children} prop, not <Outlet />

# 6. Clean install
rm -rf node_modules .vinxi
pnpm install
```

---

## Version Requirements

- **TanStack Start**: v1.121.0+ (Vite migration)
- **Vite**: v7.0.0+ (REQUIRED for peer dependencies)
- **React**: v19.0.0+ (REQUIRED for optimal SSR hydration)
- **TypeScript**: v5.7.2+
- **Node.js**: Latest LTS

**Critical**: TanStack Start v1.135.0+ requires Vite 7+ and React 19 to avoid peer dependency warnings and hydration issues.

---

## Plugin Order (Critical)

```typescript
plugins: [
  tsConfigPaths({ projects: ['./tsconfig.json'] }),  // 1. Path resolution
  tanstackStart({ srcDirectory: 'src' }),             // 2. TanStack Start
  viteReact(),                                        // 3. React (MUST be after tanstackStart)
]
```

---

## Adding Tailwind CSS

### Install Dependencies
```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
```

**DON'T** use `@tailwindcss/vite` - it causes hydration issues!

### postcss.config.mjs
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### src/globals.css
```css
@import 'tailwindcss';

@layer base {
  body {
    @apply bg-white text-black;
  }
}
```

### Update __root.tsx
```typescript
import appCss from '~/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})
```

---

## Useful Commands

```bash
# Development
pnpm run dev

# Clear cache (when things break mysteriously)
rm -rf .vinxi node_modules/.vite dist

# Build for production
pnpm run build

# Preview production build
pnpm run start
```

---

## Starter Template

Quick copy-paste to get started:

```bash
# 1. Create project
mkdir my-app && cd my-app
pnpm init

# 2. Install deps
pnpm add @tanstack/react-router @tanstack/react-start react react-dom
pnpm add -D @vitejs/plugin-react typescript vite vite-tsconfig-paths
pnpm add -D @types/node @types/react @types/react-dom

# 3. Create files (copy from Minimal Working Setup above)
# - vite.config.ts
# - src/router.tsx
# - src/routes/__root.tsx
# - src/routes/index.tsx
# - tsconfig.json

# 4. Run
pnpm run dev
```

---

## Remember

1. **TanStack Start v1.121.0+ = Vite-based** (Vinxi is obsolete)
2. **Use React 19 and Vite 7+** (REQUIRED for peer dependencies and hydration)
3. **Function MUST be `getRouter()`** not `createRouter()`
4. **Set `srcDirectory: 'src'`** in vite.config.ts
5. **Import from `@tanstack/react-router`** not `@tanstack/react-start`
6. **Use `shellComponent`** not `component` in root route
7. **Use `{children}` prop** not `<Outlet />` in RootDocument
8. **Add `suppressHydrationWarning`** to `<html>` and `<body>` tags
9. **No `app.config.ts`** - use `vite.config.ts` instead
10. **No entry point files** - Vite plugin handles them
11. **Use PostCSS for Tailwind** not `@tailwindcss/vite` plugin
12. **Load external fonts via `<link>` tags** not CSS `@import` to prevent FOUC
13. **Plugin order matters**: `tsConfigPaths` → `tanstackStart` → `viteReact`
14. **Scripts**: Use `vite dev`, `vite build && tsc --noEmit`, `node .output/server/index.mjs`

---

For detailed explanations, see: [Full Setup Guide](./tanstack-vite-setup-guide.md)
