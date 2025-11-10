# Theme Management Refactor Plan: Migrating to TanStack Start Server Functions

**Status:** Planning (Not Yet Implemented)
**Created:** 2025-11-10
**Goal:** Migrate from client-side localStorage hack to proper TanStack Start SSR-safe theme management

---

## Current Implementation Issues

### Architecture Overview
Our current implementation uses a **client-side workaround** with the following components:

1. **Blocking inline script** in `__root.tsx` (lines 21-41)
   - Reads from `localStorage` synchronously before React hydration
   - Manually applies `dark` class to `<html>` element
   - Required to prevent flash of wrong theme

2. **DarkModeProvider** (client-only state)
   - Always initializes with `'light'` on server
   - Uses `useLayoutEffect` to sync with localStorage after hydration
   - Creates server/client mismatch that we suppress with `suppressHydrationWarning`

3. **localStorage-based persistence**
   - No server-side awareness of theme preference
   - Cannot SSR the correct theme
   - Requires client-side JavaScript to work

### Specific Problems

❌ **Hydration Mismatch**
- Server renders: `theme = 'light'`, `<html>` (no dark class)
- Client hydrates: `theme = 'dark'` (from localStorage), `<html class="dark">`
- React warns about mismatch (we suppress it)

❌ **Not SSR-Safe**
- Server cannot render correct theme (no access to localStorage)
- Blocking script is a hack to hide the problem
- Flash still visible on slow connections

❌ **Not Following TanStack Start Patterns**
- Not using `createServerFn` for server-side logic
- Not using cookies for SSR-compatible state
- Not leveraging route loaders

❌ **Requires `suppressHydrationWarning`**
- Hiding React warnings instead of fixing root cause
- Code smell indicating architectural issue

---

## TanStack Start Best Practice Approach

### Architecture Overview

The proper TanStack Start pattern uses **server-first theme management**:

1. **Server Functions** (`createServerFn`)
   - Store theme in HTTP cookie (accessible on server)
   - Server function to get theme from cookie
   - Server function to set theme cookie

2. **Route Loader**
   - Root route loader fetches theme during SSR
   - Server renders correct theme from cookie
   - No client-side sync needed

3. **Context Provider**
   - Receives initial theme from server
   - Calls server function to update cookie
   - Invalidates router to trigger re-render

### Benefits

✅ **True SSR-Safe**
- Server renders correct theme from cookie
- No flash, no blocking script needed
- Works without JavaScript

✅ **No Hydration Mismatches**
- Server and client render identical HTML
- No `suppressHydrationWarning` needed
- Clean React hydration

✅ **Follows TanStack Start Patterns**
- Uses `createServerFn` for server logic
- Uses route loaders for data fetching
- Leverages framework capabilities

✅ **Better UX**
- Theme preference syncs across devices (cookie-based)
- Faster initial render (no useLayoutEffect delay)
- Progressive enhancement (works without JS)

---

## Implementation Plan

### Phase 1: Create Server Functions

**File:** `src/utils/theme.server.ts` (new file)

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

export type Theme = 'light' | 'dark'

// Server function to get theme from cookie
export const getThemeServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const theme = getCookie('theme') as Theme | undefined

  // If no cookie, detect from system preference would require client-side logic
  // So we default to 'light' on server
  return theme || 'light'
})

// Server function to set theme cookie
const themeSchema = z.object({ theme: z.enum(['light', 'dark']) })

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .validator(themeSchema)
  .handler(async ({ data }) => {
    setCookie('theme', data.theme, {
      path: '/',
      maxAge: 31536000, // 1 year
      httpOnly: false, // Allow JS access for client-side updates
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return { success: true }
  })
```

**Key Points:**
- `createServerFn` creates RPC-style server functions
- Runs only on server, callable from client
- Uses HTTP cookies for SSR-compatible persistence
- GET function for reading, POST function for writing

---

### Phase 2: Update Root Route with Loader

**File:** `src/routes/__root.tsx`

**Changes:**

1. **Add loader to fetch theme:**
```typescript
export const Route = createRootRoute({
  loader: async () => {
    const theme = await getThemeServerFn()
    return { theme }
  },
  // ... rest of config
})
```

2. **Remove blocking script:**
```typescript
// DELETE lines 21-41 (the entire blocking script)
scripts: [
  // No longer needed! Server renders correct theme
],
```

3. **Update RootDocument to use loader data:**
```typescript
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
- Loader runs on server during SSR
- Theme applied to `<html>` before rendering
- No flash, no blocking script
- Remove `suppressHydrationWarning` (not needed)

---

### Phase 3: Update DarkModeProvider

**File:** `src/components/DarkModeProvider.tsx`

**Changes:**

```typescript
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
      // Optimistically update local state
      setThemeState(newTheme)

      // Also update DOM immediately for instant feedback
      document.documentElement.classList.toggle('dark', newTheme === 'dark')

      // Call server function to persist in cookie
      await setThemeServerFn({ theme: newTheme })

      // Invalidate router to trigger loader re-run
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

**Key Changes:**
1. Accept `initialTheme` prop from server
2. Remove `useLayoutEffect` (not needed)
3. Call `setThemeServerFn` when theme changes
4. Invalidate router to trigger loader re-run
5. Optimistically update DOM for instant feedback

---

### Phase 4: Update useDarkMode Hook

**File:** `src/components/useDarkMode.ts`

**Changes:**

Update import to use new server function type:

```typescript
import { createContext, useContext } from 'react'
import type { Theme } from '~/utils/theme.server'  // NEW: from server file

export interface DarkModeContextType {
  theme: Theme
  toggleTheme: () => Promise<void>  // NEW: async
  setTheme: (theme: Theme) => Promise<void>  // NEW: async
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

**Key Changes:**
1. Import `Theme` type from server file
2. Make `toggleTheme` and `setTheme` return `Promise<void>` (now async)

---

### Phase 5: Update Dark Mode Toggle Component

**File:** `src/components/ui/dark-mode-toggle.tsx`

**Changes:**

Remove `suppressHydrationWarning` attributes (no longer needed):

```typescript
export function DarkModeToggle() {
  const { theme, toggleTheme } = useDarkMode()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}  // Now async but React handles it
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brush focus:ring-offset-2 dark:focus:ring-offset-background ${
        isDark ? 'bg-blue-400' : 'bg-neutral-300'
      }`}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      type="button"
      // REMOVE: suppressHydrationWarning
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          isDark ? 'translate-x-9' : 'translate-x-1'
        }`}
        // REMOVE: suppressHydrationWarning
      >
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 h-6 w-6 p-1 text-yellow-500 transition-opacity duration-200 ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          // REMOVE: suppressHydrationWarning
        >
          {/* ... path ... */}
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 h-6 w-6 p-1 text-slate-700 transition-opacity duration-200 ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          // REMOVE: suppressHydrationWarning
        >
          {/* ... path ... */}
        </svg>
      </span>
    </button>
  )
}
```

**Key Changes:**
1. Remove all `suppressHydrationWarning` attributes
2. `toggleTheme` is now async (but React onClick handles promises)

---

### Phase 6: Remove Old Files

**Files to delete:**
- `src/utils/theme.ts` (replaced by `theme.server.ts`)

---

## Testing Checklist

After implementation, verify:

- [ ] SSR renders correct theme from cookie
- [ ] No hydration warnings in console
- [ ] No flash of wrong theme on page load
- [ ] Toggle works and persists across refreshes
- [ ] Toggle works and persists across devices (same cookie)
- [ ] Theme works with JavaScript disabled (progressive enhancement)
- [ ] System preference detection works on first visit
- [ ] No `suppressHydrationWarning` in codebase
- [ ] Dev build has no warnings
- [ ] Production build works correctly

---

## Migration Strategy

### Option A: Big Bang (Recommended)
Implement all phases at once in a single PR. This is cleaner since the old and new approaches are incompatible.

**Steps:**
1. Create new `theme.server.ts` file
2. Update all files in sequence
3. Delete old `theme.ts` file
4. Test thoroughly
5. Commit

**Pros:** Clean cut-over, easier to review
**Cons:** Requires all changes at once

### Option B: Feature Flag
Keep both implementations and toggle between them.

**Steps:**
1. Implement new approach alongside old
2. Add feature flag to switch between them
3. Test new approach in production
4. Remove old approach after validation

**Pros:** Safer rollback
**Cons:** More complex, maintenance burden

**Recommendation:** Use Option A (Big Bang) since this is a small codebase and the changes are straightforward.

---

## Additional Considerations

### System Preference Detection

The server cannot detect system preference (requires client-side `matchMedia`). Options:

**Option 1:** Default to `'light'` on first visit
- Simple, predictable
- User can toggle if desired

**Option 2:** Client-side detection on first visit
- Add small inline script to detect and set cookie before hydration
- More complex but better UX

**Recommendation:** Option 1 for simplicity. Most users either have a preference (cookie exists) or are fine with light mode default.

### Cookie Security

Current plan uses `httpOnly: false` to allow client-side access. This is safe for theme preference (not sensitive data).

Alternative: Use `httpOnly: true` and only allow server-side updates. This is more secure but requires server round-trip for every toggle (slower UX).

**Recommendation:** Use `httpOnly: false` for better UX.

### Zod Validation

Adding Zod for input validation is best practice:

```bash
npm install zod
```

This prevents invalid theme values from being set.

---

## Resources

- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [TanStack Start Cookies](https://tanstack.com/start/latest/docs/framework/react/guide/cookies)
- [Dark Mode in TanStack Start (Tutorial)](https://nisabmohd.vercel.app/tanstack-dark)
- [SSR-Friendly Theme Provider (DEV Community)](https://dev.to/tigawanna/tanstack-start-ssr-friendly-theme-provider-5gee)

---

## Summary

This refactor will:
1. ✅ Remove client-side hacks (blocking script, localStorage)
2. ✅ Use proper TanStack Start patterns (server functions, cookies, loaders)
3. ✅ Eliminate hydration mismatches
4. ✅ Improve performance (no useLayoutEffect delay)
5. ✅ Enable progressive enhancement (works without JS)
6. ✅ Provide better UX (cross-device theme sync)

**Estimated Effort:** 2-3 hours
**Risk Level:** Low (well-documented pattern)
**Priority:** Medium (current solution works, but not idiomatic)
