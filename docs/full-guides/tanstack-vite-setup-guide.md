# TanStack Start + Vite Setup Guide

A comprehensive guide for setting up a fully functional TanStack Start application with Vite.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Configuration Files](#configuration-files)
- [Project Structure](#project-structure)
- [Core Application Files](#core-application-files)
- [Running the Application](#running-the-application)
- [Common Issues & Troubleshooting](#common-issues--troubleshooting)
- [Migration from Vinxi](#migration-from-vinxi)

---

## Prerequisites

### Required Versions

- **Node.js**: Latest LTS version
- **Package Manager**: pnpm (recommended), npm, or yarn
- **TanStack Start**: v1.121.0+ (Vite-based)
- **Vite**: v7.0.0+ (REQUIRED for TanStack Start peer dependencies)
- **React**: v19.0.0+ (REQUIRED for optimal SSR hydration)

### Why These Versions Matter

TanStack Start underwent a major migration from Vinxi to Vite in **v1.121.0**. If you're using v1.121.0 or later, you **must** use the Vite-based configuration described in this guide.

**Critical**: TanStack Start v1.135.0+ requires:
- **Vite 7.0.0+** - Earlier versions cause peer dependency warnings and potential build issues
- **React 19** - Provides improved SSR hydration and fixes many hydration mismatches

---

## Project Setup

### 1. Initialize Project

```bash
mkdir my-tanstack-app
cd my-tanstack-app
pnpm init
```

### 2. Install Dependencies

```json
{
  "name": "my-tanstack-app",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "start": "node .output/server/index.mjs"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.135.0",
    "@tanstack/react-start": "^1.135.0",
    "@tanstack/router-devtools": "^1.135.0",
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

**Key Changes from Older Examples**:
- `dev`: Use `vite dev` (explicit command) instead of just `vite`
- `build`: Includes `tsc --noEmit` for type checking before build
- `start`: Runs production server via `node .output/server/index.mjs` (not `vite preview`)
- `react` & `react-dom`: v19.0.0+ (improved SSR hydration)
- `vite`: v7.2.2+ (meets peer dependency requirements)
- React types updated to v19

```bash
pnpm install
```

---

## Configuration Files

### 1. vite.config.ts

**Critical**: This is the main configuration file. The old `app.config.ts` is obsolete for TanStack Start v1.121.0+.

```typescript
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces (0.0.0.0) for WSL2/Docker/remote
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'], // Explicit TypeScript path configuration
    }),
    tanstackStart({
      srcDirectory: 'src', // REQUIRED: Explicitly set source directory
    }),
    viteReact(), // React plugin MUST come after TanStack Start plugin
  ],
})
```

**Key Points**:
- `srcDirectory: 'src'` is **required** - without it, the router won't find your files
- **Plugin order is critical**: `tsConfigPaths` → `tanstackStart` → `viteReact`
- Use consistent naming: `viteReact` instead of `react` to avoid confusion
- The old Vinxi configuration pattern is incompatible
- `host: true` enables access from external networks (important for containers/WSL2)

### 2. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", ".vinxi", "dist"]
}
```

---

## Project Structure

```
my-tanstack-app/
├── src/
│   ├── routes/
│   │   ├── __root.tsx          # Root layout
│   │   └── index.tsx            # Home page
│   ├── router.tsx               # Router configuration
│   └── routeTree.gen.ts         # Auto-generated (don't create manually)
├── public/                      # Static assets
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

**Important**:
- Source code goes in `src/` directory
- Routes go in `src/routes/`
- `routeTree.gen.ts` is auto-generated - don't create or edit it manually
- No `app.config.ts` file needed
- No `src/ssr.tsx` or `src/client.tsx` needed (handled by Vite plugin)

---

## Core Application Files

### 1. src/router.tsx

**Critical**: The function MUST be named `getRouter`, not `createRouter`.

```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadDelay: 100,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

**Common Mistakes**:
- ❌ Naming function `createRouter` instead of `getRouter`
- ❌ Importing as `createRouter as createTanStackRouter`
- ✅ Function must be named `getRouter`

### 2. src/routes/__root.tsx

**Critical**: Use `shellComponent` property, import from `@tanstack/react-router` (not `@tanstack/react-start`).

```typescript
import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

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
  }),
  shellComponent: RootDocument, // Use shellComponent, not component
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

**Critical Hydration Fixes**:
- ✅ `suppressHydrationWarning` on `<html>` and `<body>` tags prevents browser extension warnings
- ✅ Browser extensions (password managers, Gyazo, etc.) inject attributes that cause hydration mismatches
- ✅ These warnings are harmless and expected - suppressing them is the official React solution
- ✅ Do NOT use `<Outlet />` - `shellComponent` receives `children` directly

**Common Mistakes**:
- ❌ Using `component` instead of `shellComponent`
- ❌ Importing `Meta` and `Scripts` from `@tanstack/react-start`
- ❌ Using separate `RootComponent` with `<Outlet />`
- ❌ Missing `suppressHydrationWarning` (causes console errors from browser extensions)
- ✅ All imports from `@tanstack/react-router`
- ✅ Use `HeadContent` not `Meta`
- ✅ Use `shellComponent` property
- ✅ Add `suppressHydrationWarning` to root HTML elements

### 3. src/routes/index.tsx

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4">Your application is running!</p>
    </div>
  )
}
```

---

## Adding Tailwind CSS (Optional)

### Why PostCSS Over Vite Plugin

**Critical**: Use `@tailwindcss/postcss` instead of `@tailwindcss/vite` to avoid hydration issues.

The Tailwind Vite plugin can cause hydration mismatches. PostCSS is the recommended approach for TanStack Start.

### Installation

```bash
pnpm add -D tailwindcss @tailwindcss/postcss postcss
```

### Configuration

#### 1. postcss.config.mjs

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### 2. src/globals.css

```css
@import 'tailwindcss';

/* Your custom styles */
@layer base {
  body {
    @apply bg-white text-black;
  }
}
```

#### 3. Update src/routes/__root.tsx

```typescript
import {
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '~/globals.css?url' // Import CSS as URL

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss }, // Add CSS to head
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

**Key Points**:
- ❌ **DON'T** use `@tailwindcss/vite` plugin (causes hydration issues)
- ✅ **DO** use `@tailwindcss/postcss` with PostCSS
- Import CSS as URL: `import appCss from '~/globals.css?url'`
- Add CSS to `head()` config via `links` array
- Ensure `postcss.config.mjs` is at project root

---

## Running the Application

### Development Server

```bash
pnpm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `vite.config.ts`).

### Build for Production

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run start
```

---

## Common Issues & Troubleshooting

### Issue 1: "Cannot read properties of undefined (reading 'client')"

**Error Message**:
```
ERROR  Cannot read properties of undefined (reading 'client')
    at configureServer (node_modules/@tanstack/start-plugin-core/plugin.js:120:46)
```

**Cause**: Using old Vinxi configuration pattern with new TanStack Start version.

**Solution**:
1. Delete `app.config.ts`
2. Create `vite.config.ts` as shown above
3. Update `package.json` scripts to use `vite` commands

### Issue 2: "routerEntry.getRouter is not a function"

**Error Message**:
```
TypeError: (intermediate value).routerEntry.getRouter is not a function
```

**Cause**: Router function named incorrectly or missing `srcDirectory` config.

**Solution**:
1. Ensure function in `src/router.tsx` is named `getRouter` (not `createRouter`)
2. Add `srcDirectory: 'src'` to `tanstackStart()` plugin config in `vite.config.ts`

### Issue 3: "Element type is invalid: expected a string... but got: undefined"

**Error Message**:
```
Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined.
Check your code at __root.tsx:38
```

**Cause**: Using incorrect imports from `@tanstack/react-start` instead of `@tanstack/react-router`.

**Solution**:
1. Import `HeadContent` and `Scripts` from `@tanstack/react-router`
2. Use `shellComponent` instead of `component` in route config
3. Remove references to `Meta` component

### Issue 4: Hydration Mismatch Errors

**Error Message**:
```
Warning: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
This won't be patched up. This can happen if a SSR-ed Client Component used...
```

**Common Causes**:

1. **Browser Extensions** (Most Common)
   - Password managers, Gyazo, and other extensions inject attributes into `<html>` and `<body>`
   - Attributes like `cz-shortcut-listen`, `data-__gyazo-expander-enabled`, etc.

   **Solution**: Add `suppressHydrationWarning` to root elements
   ```typescript
   <html suppressHydrationWarning>
   <body suppressHydrationWarning>
   ```

2. **Wrong Root Route Configuration**
   - Using `component` instead of `shellComponent`
   - Using `<Outlet />` manually in RootDocument

   **Solution**:
   ```typescript
   export const Route = createRootRoute({
     shellComponent: RootDocument, // NOT component
   })

   function RootDocument({ children }: { children: ReactNode }) {
     return <html>... {children} ...</html> // NOT <Outlet />
   }
   ```

3. **Tailwind Vite Plugin**
   - Using `@tailwindcss/vite` can cause style hydration issues

   **Solution**: Switch to PostCSS
   ```bash
   pnpm remove @tailwindcss/vite
   pnpm add -D @tailwindcss/postcss postcss
   ```

4. **React Version Mismatch**
   - Using React 18 instead of React 19

   **Solution**: Upgrade to React 19
   ```bash
   pnpm add react@^19.0.0 react-dom@^19.0.0
   pnpm add -D @types/react@^19.0.0 @types/react-dom@^19.0.0
   ```

### Issue 5: Vite Version Mismatch

**Warning**:
```
warning: TanStack Start expects Vite 7.0.0+
```

**Solution**: Update Vite to v7.0.0 or later:
```bash
pnpm add -D vite@latest
```

### Issue 6: Routes Not Found

**Symptoms**: 404 errors for all routes.

**Solution**:
1. Verify `srcDirectory: 'src'` is set in `vite.config.ts`
2. Ensure routes are in `src/routes/` directory
3. Check that route files follow naming convention (`index.tsx`, `about.tsx`, etc.)
4. Delete `.vinxi` and `node_modules/.vite` cache directories and restart

---

## Migration from Vinxi

If you have an existing TanStack Start project using Vinxi (v1.120.0 or earlier), follow these steps:

### 1. Update Dependencies

```bash
# Remove Vinxi
pnpm remove vinxi

# Update TanStack packages
pnpm add @tanstack/react-router@latest @tanstack/react-start@latest

# Ensure Vite is installed
pnpm add -D vite@latest
```

### 2. Delete Obsolete Files

```bash
rm app.config.ts
rm src/ssr.tsx
rm src/client.tsx
rm -rf .vinxi
```

### 3. Create vite.config.ts

Create the file as shown in [Configuration Files](#1-viteconfigts).

### 4. Update package.json Scripts

Change from:
```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start"
  }
}
```

To:
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "start": "node .output/server/index.mjs"
  }
}
```

**Important Changes**:
- `dev`: Use explicit `vite dev` command
- `build`: Add type checking with `tsc --noEmit`
- `start`: Production server uses Node.js, not `vite preview`

### 5. Update Router Export

In `src/router.tsx`, rename the function:

```typescript
// Before
export function createRouter() { ... }

// After
export function getRouter() { ... }
```

### 6. Update Root Route

In `src/routes/__root.tsx`:

```typescript
// Before
import { Meta, Scripts } from '@tanstack/react-start'
export const Route = createRootRoute({
  component: RootComponent,
})

// After
import { HeadContent, Scripts } from '@tanstack/react-router'
export const Route = createRootRoute({
  shellComponent: RootDocument,
})
```

### 7. Clean Install

```bash
rm -rf node_modules
pnpm install
pnpm run dev
```

---

## Best Practices

### 1. Plugin Order

Always place plugins in this order in `vite.config.ts`:
```typescript
plugins: [
  viteTsConfigPaths(), // First: path resolution
  tanstackStart(),     // Second: TanStack Start
  react(),             // Third: React plugin
  // Other plugins...
]
```

### 2. Type Safety

Always include the TypeScript declaration module in `router.tsx`:
```typescript
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

### 3. Clear Cache

When encountering mysterious errors, clear build caches:
```bash
rm -rf .vinxi node_modules/.vite dist
pnpm run dev
```

### 4. Development Tools

Add TanStack Router DevTools for debugging:

```bash
pnpm add @tanstack/router-devtools
```

```typescript
// src/routes/__root.tsx
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
```

---

## Quick Start Checklist

### Essential Setup
- [ ] Install dependencies with correct versions (TanStack Start v1.135.0+, Vite v7.0.0+, React v19.0.0+)
- [ ] Create `vite.config.ts` with proper plugin order: `tsConfigPaths` → `tanstackStart({ srcDirectory: 'src' })` → `viteReact()`
- [ ] Create `src/router.tsx` with `getRouter()` function (not `createRouter()`)
- [ ] Create `src/routes/__root.tsx` with `shellComponent` property (not `component`)
- [ ] Import `HeadContent` and `Scripts` from `@tanstack/react-router` (not `@tanstack/react-start`)
- [ ] Add `suppressHydrationWarning` to `<html>` and `<body>` tags
- [ ] Create at least one route (e.g., `src/routes/index.tsx`)

### Configuration
- [ ] Set up `package.json` scripts: `vite dev`, `vite build && tsc --noEmit`, `node .output/server/index.mjs`
- [ ] Configure `tsconfig.json` with `moduleResolution: "bundler"`
- [ ] Delete any `app.config.ts`, `src/ssr.tsx`, or `src/client.tsx` files

### Tailwind CSS (If Using)
- [ ] Install `@tailwindcss/postcss` (NOT `@tailwindcss/vite`)
- [ ] Create `postcss.config.mjs` with Tailwind PostCSS plugin
- [ ] Import CSS as URL: `import appCss from '~/globals.css?url'`
- [ ] Add CSS to `head()` config in root route

### Verification
- [ ] Run `pnpm run dev` and verify server starts on port 3000
- [ ] Check browser console for no hydration errors
- [ ] Test navigation between routes
- [ ] Run `pnpm build` to verify production build works

---

## Additional Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [Vite Documentation](https://vitejs.dev/)
- [Migration Guide: Vinxi to Vite](https://tanstack.com/start/latest/docs/framework/react/migrate-from-vinxi)

---

## Summary

The key differences between old Vinxi setup and new Vite setup:

| Aspect | Vinxi (Old) | Vite (New) |
|--------|-------------|------------|
| Config File | `app.config.ts` | `vite.config.ts` |
| Router Function | `createRouter()` | `getRouter()` |
| Entry Points | `src/ssr.tsx`, `src/client.tsx` | Handled by plugin |
| Root Component | `component` property | `shellComponent` property |
| Imports | `@tanstack/react-start` | `@tanstack/react-router` |
| Scripts | `vinxi dev`, `vinxi build` | `vite`, `vite build` |
| Plugin Config | Manual routers array | `tanstackStart({ srcDirectory })` |

**Remember**: TanStack Start v1.121.0+ requires the Vite-based configuration. The Vinxi pattern will not work and will produce cryptic errors.
