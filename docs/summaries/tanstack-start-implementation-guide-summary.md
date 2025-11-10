# TanStack Start Implementation Guide - Quick Reference

## Overview

Complete implementation guide for building production-ready blog sites with TanStack Start, covering SSR, edge deployment to Cloudflare, type-safe routing, server functions, and optimal SEO practices.

**Full Guide**: `tanstack-start-implementation-guide.md` (4335 lines)
**Version**: TanStack Start RC (Latest as of November 2025)
**Target Use Case**: Production-ready blog sites with SSR and edge deployment

---

## What is TanStack Start?

Full-stack React meta-framework built on TanStack Router, extending type-safe client-first routing with:
- **Server-side rendering (SSR)** with streaming
- **Server functions** (type-safe RPCs)
- **File-based routing** with zero-config code splitting
- **Universal deployment** (Cloudflare, Vercel, Netlify)
- **Progressive enhancement** (forms work without JS)

**Philosophy**: "Isomorphic by default" - code runs on both server and client unless explicitly constrained.

---

## Quick Assessment

### ✅ Perfect For
- Type-safe full-stack applications
- Content-heavy sites (blogs, documentation)
- Projects needing edge deployment
- Teams prioritizing type safety and DX
- Applications requiring fine-grained SSR control

### ❌ Consider Alternatives For
- Rapid prototyping needing mature ecosystem
- Teams unfamiliar with TypeScript
- Projects requiring extensive MDX/CMS integrations
- Applications needing proven production stability (RC status)

### Complexity
- **Installation**: Low (single CLI command)
- **Learning Curve**: Medium-High (Router + Start concepts)
- **Production Readiness**: Medium (RC status, early adopters using in production)
- **Maintenance**: Low (excellent TypeScript tooling)

---

## Guide Structure & Navigation

### 1. Executive Summary (Lines 32-78)
**Location**: Lines 32-78

- What is TanStack Start
- Key strengths and limitations
- Ideal use cases and alternatives
- Complexity assessment

### 2. Getting Started (Lines 80-234)
**Location**: Lines 80-234

- **Prerequisites**: Node.js 18+, TypeScript knowledge, React 18+
- **Installation** (Line 92): `pnpm create @tanstack/start@latest`
- **Alternative**: Clone official examples (Line 110)
- **Development commands** (Line 128): dev, build, preview
- **Minimal working example** (Lines 143-234): Complete starter code

### 3. Core Concepts (Lines 236-355)
**Location**: Lines 236-355

- **TanStack Router vs Start** (Line 239): Router = client routing, Start = full-stack framework
- **Execution environments** (Line 257): Server vs Client, isomorphic by default
- **File-based routing architecture** (Line 277): Conventions and patterns
- **Route component lifecycle** (Line 304): Matching → Pre-loading → Loading
- **Server functions** (Line 322): Type-safe RPCs between client/server
- **SSR and streaming** (Line 344): Rendering flow

### 4. Project Setup & Configuration (Lines 357-502)
**Location**: Lines 357-502

- **Recommended project structure** (Line 359): Feature-based organization
- **TypeScript configuration** (Line 398): Complete tsconfig.json
- **Environment variables** (Line 434): .env setup, PUBLIC_ prefix for client
- **Vite configuration** (Line 465): TanStack Start plugin setup
- **Development workflow** (Line 493): HMR, auto route regeneration

### 5. Routing & Navigation (Lines 504-880)
**Location**: Lines 504-880

#### File-Based Routing Patterns (Lines 507-670)
- **Basic static routes** (Line 511): index.tsx, about.tsx
- **Dynamic parameters** (Line 533): $slug.tsx → /:slug
- **Nested routing & layouts** (Line 569): <Outlet /> pattern
- **Pathless layouts** (Line 613): _authenticated/ prefix
- **Catch-all routes** (Line 646): $.tsx for wildcards

#### Navigation Components (Lines 672-751)
- **Link component** (Line 673): Type-safe, preloading
- **Programmatic navigation** (Line 718): useNavigate hook
- **Router instance navigation** (Line 740): Outside React components

#### Search Parameters (Lines 753-818)
- **Defining search schemas** (Line 756): Zod validation
- **Updating search params** (Line 788): Via Link or navigate

#### 404 Handling (Lines 820-878)
- **Default NotFound component** (Line 822)
- **Throwing notFound in loaders** (Line 863)

### 6. Data Loading Patterns (Lines 882-1171)
**Location**: Lines 882-1171

- **Built-in route loaders** (Line 886): Basic loader pattern
- **Loader with dependencies** (Line 919): loaderDeps for cache keys
- **Loader context** (Line 944): Passing data from parents
- **Server functions for data** (Line 967): Creating and using
- **Caching configuration** (Line 1050): staleTime, gcTime, shouldReload
- **Error handling in loaders** (Line 1078): errorComponent pattern
- **Integrating TanStack Query** (Line 1103): Advanced caching, mutations

**Decision**: TanStack Query for complex mutations/optimistic updates, built-in loaders for simple SSR-first apps

### 7. Server Functions & Actions (Lines 1173-1462)
**Location**: Lines 1173-1462

- **Creating server functions** (Line 1178): Basic pattern with createServerFn
- **With input validation** (Line 1198): Zod schemas
- **HTTP method specification** (Line 1226): GET, POST, PUT, DELETE
- **Form handling** (Line 1242): Progressive enhancement
- **Mutations with invalidation** (Line 1341): router.invalidate()
- **Redirects from server functions** (Line 1382)
- **Middleware pattern** (Line 1403): withAuth composition
- **Server context API** (Line 1432): Headers, cookies, response

### 8. Component Patterns (Lines 1465-1670)
**Location**: Lines 1465-1670

- **Route component structure** (Line 1467): Loader, component, error, pending
- **Layout components** (Line 1515): Root layout with <Outlet />
- **Shared/reusable components** (Line 1560): Organization in src/components/
- **Client-only components** (Line 1593): <ClientOnly> wrapper
- **Pending states & suspense** (Line 1643): pendingMs, pendingMinMs

### 9. SEO & Meta Tags (Lines 1672-1903)
**Location**: Lines 1672-1903

- **HeadContent component** (Line 1677): Must be in <head>
- **Setting meta tags in routes** (Line 1700): head() option
- **Dynamic meta tags** (Line 1728): From loader data
- **Open Graph & Twitter Cards** (Line 1761): Complete SEO utility (Lines 1763-1838)
- **Canonical URLs** (Line 1840): Alternate languages
- **JSON-LD structured data** (Line 1871): BlogPosting schema

### 10. Styling Integration (Lines 1905-2100+)
**Location**: Lines 1905-2100+

#### Tailwind CSS (Lines 1909-1979)
- **Installation** (Line 1914): @tailwindcss/vite
- **Configuration** (Line 1919): vite.config.ts setup
- **Usage** (Line 1961): Component examples

#### CSS Modules (Lines 1981-2000+)
- Built-in support via Vite
- Scoped styles per component

### 11. State Management (Lines 2100-2400+)
**Location**: Estimated Lines 2100-2400

- Route-level state with search params
- Context API for cross-component state
- TanStack Query for server state
- Local storage patterns

### 12. Error Handling (Lines 2400-2600+)
**Location**: Estimated Lines 2400-2600

- Route error boundaries
- Global error handling
- 404 and custom error pages
- Error recovery patterns

### 13. Blog-Specific Implementation (Lines 2600-3000+)
**Location**: Estimated Lines 2600-3000

- Blog post data structure
- MDX integration (custom implementation)
- Syntax highlighting setup
- Reading time calculation
- Table of contents generation
- Tag/category systems
- Search functionality
- RSS feed generation

### 14. Cloudflare Deployment (Lines 3000-3500+)
**Location**: Estimated Lines 3000-3500

- Cloudflare Pages setup
- Build configuration
- Environment variables
- Custom domains
- CDN and edge caching
- Preview deployments
- Production optimization

### 15. Performance Optimization (Lines 3500-3800+)
**Location**: Estimated Lines 3500-3800

- Code splitting strategies
- Image optimization
- Font loading
- Bundle size reduction
- Preloading and prefetching
- Streaming SSR
- Edge caching strategies

### 16. Best Practices (Lines 3800-4000+)
**Location**: Estimated Lines 3800-4000

- Project organization
- TypeScript patterns
- Testing strategies
- Security considerations
- Accessibility guidelines
- SEO checklist

### 17. Complete Code Examples (Lines 4000-4200+)
**Location**: Estimated Lines 4000-4200

- Full blog layout
- Blog post page
- Admin dashboard
- Authentication flow
- Search implementation

### 18. Decision Framework (Lines 4200-4335)
**Location**: Estimated Lines 4200-4335

- When to use TanStack Start
- Router vs Start decision tree
- Data loading strategy selection
- Deployment platform choice

---

## Quick Start Checklist

### Installation
```bash
# Create new project
pnpm create @tanstack/start@latest

# Install dependencies
cd my-blog
pnpm install

# Start dev server
pnpm run dev
```

### Essential Files Setup

1. **Root Route** (`src/routes/__root.tsx`):
   - HTML shell with <HeadContent /> and <Scripts />
   - Global layout (Header, Footer)
   - Error boundary

2. **Router Config** (`src/router.tsx`):
   - Create router instance
   - Configure scroll restoration
   - TypeScript module augmentation

3. **Vite Config** (`vite.config.ts`):
   - TanStack Start plugin
   - Auto code splitting
   - Path aliases

4. **TypeScript Config** (`tsconfig.json`):
   - Strict mode enabled
   - Path aliases configured
   - Bundler module resolution

---

## Key Patterns Cheat Sheet

### Basic Route
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => <h1>About</h1>
})
```

### Dynamic Route with Loader
```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw notFound()
    return { post }
  },
  component: () => {
    const { post } = Route.useLoaderData()
    return <article>{post.title}</article>
  }
})
```

### Server Function
```tsx
import { createServerFn } from '@tanstack/react-start'

export const getPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Server-only code
    return await db.post.findMany()
  })

// Call from anywhere
const posts = await getPosts()
```

### Form with Server Action
```tsx
const submitForm = createServerFn({ method: 'POST' })
  .inputValidator((data) => {
    const formData = data as FormData
    return { name: formData.get('name')?.toString() }
  })
  .handler(async ({ data }) => {
    await saveToDb(data)
    return { success: true }
  })

function ContactForm() {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await submitForm(new FormData(e.currentTarget))
    }}>
      <input name="name" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Search Parameters with Validation
```tsx
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().int().positive().catch(1),
  sort: z.enum(['date', 'title']).catch('date')
})

export const Route = createFileRoute('/blog/')({
  validateSearch: searchSchema,
  component: () => {
    const { page, sort } = Route.useSearch()
    return <div>Page {page}, sorted by {sort}</div>
  }
})
```

### SEO with Dynamic Meta
```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.post.title} | My Blog` },
      { name: 'description', content: loaderData.post.excerpt },
      { property: 'og:image', content: loaderData.post.coverImage }
    ]
  })
})
```

---

## File Naming Conventions

| Pattern | Route | Description |
|---------|-------|-------------|
| `index.tsx` | `/` or parent path | Index route |
| `about.tsx` | `/about` | Static route |
| `$slug.tsx` | `/:slug` | Dynamic parameter |
| `$postId.edit.tsx` | `/:postId/edit` | Dynamic with suffix |
| `$.tsx` | `/*` | Catch-all wildcard |
| `_layout/child.tsx` | `/child` | Pathless layout (URL not affected) |
| `_layout.child.tsx` | `/child` | Alternative pathless syntax |
| `__root.tsx` | Always renders | Root layout (HTML shell) |

---

## Decision Trees

### Should I Use TanStack Start?

```
Project requirements?
├─ Need type safety + SSR? → Yes, TanStack Start
├─ Need mature ecosystem? → Consider Next.js
├─ Simple static site? → Consider Astro
├─ SPA only? → TanStack Router alone
└─ Already using Next.js? → Stick with Next.js
```

### Data Loading Strategy

```
What type of data?
├─ Route-specific + SSR → Built-in loaders
├─ Complex mutations → TanStack Query
├─ Real-time updates → TanStack Query
├─ Simple fetching → Built-in loaders
└─ Cross-route sharing → TanStack Query
```

### Server Functions vs API Routes

```
When to use Server Functions?
├─ Type-safe calls needed? → Server Functions
├─ Form submissions? → Server Functions
├─ Third-party API integration? → API Routes
├─ Webhooks? → API Routes
└─ Internal data ops? → Server Functions
```

---

## Searchable Topics

Need detailed information? Jump to these locations in the full guide:

### Getting Started
- **Quick installation**: Lines 92-109
- **Minimal example**: Lines 143-234
- **Development commands**: Lines 128-141

### Core Concepts
- **Router vs Start**: Lines 239-256
- **Execution environments**: Lines 257-276
- **File-based routing**: Lines 277-303
- **Server functions explained**: Lines 322-343
- **SSR flow**: Lines 344-355

### Routing
- **Dynamic parameters**: Lines 533-568
- **Nested layouts**: Lines 569-612
- **Pathless layouts**: Lines 613-645
- **Search parameters**: Lines 753-818
- **404 handling**: Lines 820-878

### Data Loading
- **Basic loaders**: Lines 886-918
- **Loader dependencies**: Lines 919-943
- **Server functions**: Lines 967-1049
- **Caching config**: Lines 1050-1077
- **TanStack Query integration**: Lines 1103-1171

### Server Functions
- **Creating functions**: Lines 1178-1197
- **Input validation**: Lines 1198-1224
- **Form handling**: Lines 1242-1339
- **Mutations**: Lines 1341-1381
- **Middleware pattern**: Lines 1403-1431

### SEO
- **Meta tags**: Lines 1700-1727
- **Dynamic SEO**: Lines 1728-1760
- **SEO utility function**: Lines 1763-1838
- **Structured data**: Lines 1871-1903

### Styling
- **Tailwind setup**: Lines 1909-1979
- **CSS Modules**: Lines 1981-2000+

### Deployment
- **Cloudflare setup**: Lines 3000-3500+ (estimated)
- **Build configuration**: Within deployment section
- **Environment variables**: Within deployment section

---

## Common Gotchas

### 1. Server Functions
❌ **Don't**: Use browser APIs in server functions
```tsx
export const getData = createServerFn().handler(async () => {
  localStorage.getItem('token') // Error! Not available on server
})
```

✅ **Do**: Use server-only code
```tsx
export const getData = createServerFn().handler(async () => {
  return process.env.SECRET_KEY // Server-only
})
```

### 2. Environment Variables
❌ **Don't**: Access server env vars on client
```tsx
function MyComponent() {
  const secret = process.env.DATABASE_URL // Exposed to client!
}
```

✅ **Do**: Use PUBLIC_ prefix for client, or server functions
```tsx
// Client-safe
const apiUrl = import.meta.env.PUBLIC_API_URL

// Server-only via function
const data = await getSecretData() // Server function
```

### 3. Route Parameters
❌ **Don't**: Forget type safety
```tsx
const { slug } = useParams() // Loses type information
```

✅ **Do**: Use Route.useParams()
```tsx
const { slug } = Route.useParams() // Fully typed!
```

### 4. Search Parameter Updates
❌ **Don't**: Replace entire search object
```tsx
<Link to="/blog" search={{ page: 2 }}> // Loses other params!
```

✅ **Do**: Merge with previous
```tsx
<Link to="/blog" search={(prev) => ({ ...prev, page: 2 })}>
```

---

## Quick Lookup Table

| Topic | Line Range | Key Information |
|-------|-----------|-----------------|
| Installation | 92-109 | CLI commands, setup |
| Minimal example | 143-234 | Complete starter code |
| File routing rules | 277-303 | Conventions table |
| Server functions | 322-343, 1173-1462 | Creation and usage |
| Dynamic routes | 533-568 | $slug pattern |
| Loaders | 886-1077 | Data loading patterns |
| Search params | 753-818 | Validation with Zod |
| Form handling | 1242-1339 | Progressive enhancement |
| SEO setup | 1672-1903 | Complete meta tags |
| Tailwind setup | 1909-1979 | Configuration |
| Deployment | 3000-3500+ | Cloudflare Pages |

---

## Pro Tips

- **Use Type-Safe Routing**: Always use `Route.useParams()` and `Route.useSearch()` for full TypeScript inference
- **Server Functions for Auth**: Wrap auth checks in server functions to keep secrets server-side
- **Preload Links**: Use `preload="intent"` on Links for hover preloading
- **Cache Configuration**: Set appropriate `staleTime` based on data freshness requirements
- **Search Params as State**: Treat URL search params as application state for better UX
- **Progressive Enhancement**: Build forms to work without JS, enhance with JS
- **Error Boundaries**: Define `errorComponent` on routes for graceful degradation
- **Route Groups**: Use `_` prefix for layouts that don't affect URLs
- **Loader Dependencies**: Use `loaderDeps` to maintain separate cache entries for different search params
- **Invalidation**: Call `router.invalidate()` after mutations to refresh data

---

## When to Use This Guide

- Setting up a new TanStack Start project
- Building a blog or content site with SSR
- Deploying to Cloudflare Pages/Workers
- Implementing type-safe full-stack features
- Optimizing SEO for React applications
- Learning server functions and server-side patterns
- Migrating from Next.js or Remix
- Establishing team conventions for TanStack Start

---

## Resources

### Official Documentation
- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

### Related Guides
- `react-component-architecture-guide.md` - Component patterns
- `tailwind-component-guide.md` - Styling components
- `chromadb-style-guide.md` - Design system example

---

**Remember**: This summary provides quick navigation to the full guide. For complete implementations, detailed examples, and best practices, reference the specific line ranges in `tanstack-start-implementation-guide.md`.

**Last Updated**: November 2025 - TanStack Start RC
