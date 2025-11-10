# Dark Theme Toggle Guide for TanStack Start

**Version:** 1.0
**Last Updated:** 2025-11-10
**Framework:** TanStack Start (React)

---

## Overview

This guide provides a production-ready pattern for implementing dark mode in TanStack Start applications using server-first architecture. The approach eliminates hydration mismatches, provides true SSR support, and follows TanStack Start best practices.

**Key Benefits:**
- ✅ True SSR-safe (no flash of wrong theme)
- ✅ No hydration mismatches (no `suppressHydrationWarning` needed)
- ✅ Cookie-based persistence (works across devices)
- ✅ Progressive enhancement (works without JavaScript)
- ✅ Instant UI feedback with server-side persistence

---

## Architecture Pattern

### Core Concepts

1. **Server Functions** - Use `createServerFn` to handle theme logic on the server
2. **Cookie Storage** - Store theme preference in HTTP cookies (accessible during SSR)
3. **Route Loader** - Fetch theme during SSR to render correct initial state
4. **Context Provider** - Manage theme state and sync with server
5. **Router Invalidation** - Trigger re-renders after theme changes

### Why Not localStorage?

localStorage is **not accessible during SSR**, leading to:
- Server/client mismatches
- Flash of wrong theme
- Requiring `suppressHydrationWarning` (code smell)
- Blocking inline scripts (performance/security issue)

Cookies solve this by being available during server-side rendering.

---

## Implementation Steps

### Step 1: Create Server Functions

**File:** `src/utils/theme.server.ts`

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

export type Theme = 'light' | 'dark'

// Server function to GET theme from cookie
export const getThemeServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const theme = getCookie('theme') as Theme | undefined

  // Default to 'light' if no cookie exists
  // Note: System preference detection requires client-side logic
  return theme || 'light'
})

// Server function to SET theme cookie
const themeSchema = z.object({ theme: z.enum(['light', 'dark']) })

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(themeSchema)
  .handler(async ({ data }) => {
    setCookie('theme', data.theme, {
      path: '/',
      maxAge: 31536000, // 1 year
      httpOnly: false, // Allow client-side access for instant feedback
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return { success: true }
  })
```

**Key Points:**
- `createServerFn` creates RPC-style functions that run only on server
- `getCookie`/`setCookie` work during SSR unlike localStorage
- Input validation with Zod prevents invalid values
- `httpOnly: false` allows client-side DOM updates for instant feedback

---

### Step 2: Setup Root Route Loader

**File:** `src/routes/__root.tsx`

```typescript
import { createRootRoute } from '@tanstack/react-router'
import { getThemeServerFn } from '~/utils/theme.server'
import { DarkModeProvider } from '~/components/DarkModeProvider'

export const Route = createRootRoute({
  // Fetch theme during SSR
  loader: async () => {
    const theme = await getThemeServerFn()
    return { theme }
  },

  shellComponent: RootDocument,

  // ... other route config
})

function RootDocument({ children }: { children: ReactNode }) {
  const { theme } = Route.useLoaderData()

  return (
    <html className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <HeadContent />
      </head>
      <body>
        <DarkModeProvider initialTheme={theme}>
          {children}
        </DarkModeProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

**Key Points:**
- Loader runs during SSR and fetches theme from cookie
- Apply theme class to `<html>` element for Tailwind CSS dark mode
- Pass theme to provider as `initialTheme` prop
- No blocking scripts needed - server renders correct theme

---

### Step 3: Create Theme Provider

**File:** `src/components/DarkModeProvider.tsx`

```typescript
import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { DarkModeContext } from './useDarkMode'
import { setThemeServerFn, type Theme } from '~/utils/theme.server'

interface DarkModeProviderProps {
  children: ReactNode
  initialTheme: Theme
}

export function DarkModeProvider({ children, initialTheme }: DarkModeProviderProps) {
  // Initialize with server-provided theme (no mismatch!)
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const router = useRouter()

  const contextValue = useMemo(() => {
    const setTheme = async (newTheme: Theme) => {
      // Update local state immediately for instant UI feedback
      setThemeState(newTheme)

      // Persist to server cookie
      await setThemeServerFn({ data: { theme: newTheme } })

      // Invalidate router to trigger loader re-run
      // This updates the <html> className
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
```

**Key Points:**
- Initialize state with `initialTheme` from server (prevents mismatch)
- No `useLayoutEffect` needed - state is correct from the start
- `router.invalidate()` triggers root loader to re-run and update `<html>` class
- Optimistic UI update for instant feedback

---

### Step 4: Create Theme Hook

**File:** `src/components/useDarkMode.ts`

```typescript
import { createContext, useContext } from 'react'
import type { Theme } from '~/utils/theme.server'

export interface DarkModeContextType {
  theme: Theme
  toggleTheme: () => Promise<void>
  setTheme: (theme: Theme) => Promise<void>
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
```

**Key Points:**
- Methods are async (server function calls)
- Type-safe with shared `Theme` type
- Standard context pattern

---

### Step 5: Create Toggle Component

**Example:** `src/components/ui/dark-mode-toggle.tsx`

```typescript
import { useDarkMode } from '~/components/useDarkMode'

export function DarkModeToggle() {
  const { theme, toggleTheme } = useDarkMode()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={isDark ? 'dark-mode-styles' : 'light-mode-styles'}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      type="button"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
```

**Key Points:**
- No `suppressHydrationWarning` needed (server/client match)
- React handles async `onClick` handlers
- Use semantic HTML and ARIA attributes

---

## Tailwind CSS Configuration

Ensure your Tailwind config uses `class` strategy for dark mode:

**File:** `tailwind.config.ts`

```typescript
export default {
  darkMode: 'class', // Use class strategy (not 'media')
  // ... rest of config
}
```

This allows you to toggle dark mode via the `dark` class on `<html>`.

---

## Advanced: System Preference Detection

The server cannot detect system preference (`prefers-color-scheme`). Two options:

### Option 1: Default to Light (Recommended)

```typescript
export const getThemeServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const theme = getCookie('theme') as Theme | undefined
  return theme || 'light' // Simple default
})
```

**Pros:** Simple, predictable
**Cons:** Doesn't respect system preference on first visit

### Option 2: Client-Side Detection on First Visit

Add small inline script before hydration:

```typescript
// In __root.tsx head
scripts: [
  {
    children: `
      (function() {
        const theme = document.cookie.match(/theme=([^;]+)/)?.[1];
        if (!theme) {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemDark) {
            document.documentElement.classList.add('dark');
            document.cookie = 'theme=dark; path=/; max-age=31536000';
          }
        }
      })();
    `,
  },
],
```

**Pros:** Better UX on first visit
**Cons:** Requires inline script (CSP considerations)

**Recommendation:** Use Option 1 for simplicity unless system detection is critical.

---

## Common Pitfalls & Solutions

### ❌ Hydration Mismatch Errors

**Problem:** Server renders `light`, client renders `dark`
**Solution:** Use cookie-based storage and loader to sync server/client state

### ❌ Flash of Wrong Theme

**Problem:** Theme flickers on page load
**Solution:** Loader fetches theme before render; no client-side sync needed

### ❌ Using `suppressHydrationWarning`

**Problem:** Hiding React warnings instead of fixing root cause
**⚠️ WARNING:** This should be a **last resort**. If you need this, your architecture is likely wrong. Fix the server/client mismatch instead.

**Only use if:**
- Third-party library causes unavoidable mismatch
- Temporary workaround with plan to fix properly
- **NEVER** use to hide theme-related mismatches

### ❌ Theme Doesn't Persist

**Problem:** Cookie not being set correctly
**Solution:** Check cookie settings (`path`, `sameSite`, `httpOnly`)

### ❌ Slow Theme Toggle

**Problem:** Waiting for server round-trip
**Solution:** Use optimistic UI update (update state immediately, persist in background)

---

## Testing Checklist

After implementation:

- [ ] No hydration warnings in console
- [ ] No flash of wrong theme on page load
- [ ] Theme persists across page refreshes
- [ ] Theme persists across browser sessions
- [ ] Toggle works instantly (optimistic update)
- [ ] Works with JavaScript disabled (progressive enhancement)
- [ ] SSR renders correct theme from cookie
- [ ] No `suppressHydrationWarning` in codebase
- [ ] Production build works correctly

---

## Dependencies

```bash
# Install required dependencies
npm install zod
```

- `zod` - Input validation for server functions
- `@tanstack/react-start` - Framework (includes server function utilities)
- `@tanstack/react-router` - Router (for invalidation)

---

## Performance Considerations

### Cookie Size
- Theme cookie is tiny (~10 bytes)
- Sent with every request (minimal overhead)

### Server Function Calls
- Async but optimistic UI prevents perceived lag
- Server function validates and persists in background

### Router Invalidation
- Only re-runs root loader (lightweight)
- Avoids full page refresh

---

## Security Considerations

### `httpOnly: false`
- Allows client-side JavaScript to read/write cookie
- Safe for theme preference (not sensitive data)
- Alternative: `httpOnly: true` requires server round-trip for every toggle (slower)

### Cookie Attributes
```typescript
setCookie('theme', data.theme, {
  path: '/',           // Available site-wide
  maxAge: 31536000,    // 1 year expiration
  httpOnly: false,     // Allow client-side access
  secure: true,        // HTTPS only in production
  sameSite: 'lax',     // CSRF protection
})
```

---

## Reference Implementation

This guide is based on a production implementation. See the source repository for:
- Complete working example
- Additional UI components
- Edge cases handling

---

## Resources & Further Reading

### Official Documentation
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [TanStack Start Cookies](https://tanstack.com/start/latest/docs/framework/react/guide/cookies)
- [TanStack Router Route Loaders](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)

### Community Guides
- [Dark Mode in TanStack Start Tutorial](https://nisabmohd.vercel.app/tanstack-dark)
- [SSR-Friendly Theme Provider](https://dev.to/tigawanna/tanstack-start-ssr-friendly-theme-provider-5gee)

### Related Topics
- [React Hydration Best Practices](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Zod Schema Validation](https://zod.dev/)

---

## Summary

This pattern provides:

1. **True SSR Support** - Server renders correct theme from cookie
2. **No Hydration Mismatches** - Server and client state match perfectly
3. **Instant UI Feedback** - Optimistic updates while persisting to server
4. **Progressive Enhancement** - Works without JavaScript
5. **Cross-Device Sync** - Cookie-based persistence
6. **Framework Idiomatic** - Uses TanStack Start patterns correctly

**Remember:** If you find yourself reaching for `suppressHydrationWarning`, stop and fix the underlying server/client mismatch instead. It's a sign of architectural issues, not a solution.

---

**Questions or Issues?**
Refer to the TanStack Start documentation or community guides listed above.
