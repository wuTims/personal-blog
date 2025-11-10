# TanStack Start + Cloudflare Deployment: Complete Implementation Guide for Blog Sites

**Version:** TanStack Start RC (Latest)
**Last Updated:** November 2025
**Target Use Case:** Production-ready blog site with SSR, optimal SEO, and edge deployment

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Project Setup & Configuration](#project-setup--configuration)
5. [Routing & Navigation](#routing--navigation)
6. [Data Loading Patterns](#data-loading-patterns)
7. [Server Functions & Actions](#server-functions--actions)
8. [Component Patterns](#component-patterns)
9. [SEO & Meta Tags](#seo--meta-tags)
10. [Styling Integration](#styling-integration)
11. [State Management](#state-management)
12. [Error Handling](#error-handling)
13. [Blog-Specific Implementation](#blog-specific-implementation)
14. [Cloudflare Deployment](#cloudflare-deployment)
15. [Performance Optimization](#performance-optimization)
16. [Best Practices](#best-practices)
17. [Complete Code Examples](#complete-code-examples)
18. [Decision Framework](#decision-framework)

---

## Executive Summary

### What is TanStack Start?

TanStack Start is a full-stack React meta-framework built on top of TanStack Router. It extends the router's type-safe, client-first routing capabilities with server-side rendering (SSR), streaming, server functions, and production-ready deployment features.

**Key Philosophy:** TanStack Start is "isomorphic by default" - code runs on both server and client unless explicitly constrained, giving you fine-grained control over execution environments.

### Key Strengths

- **End-to-End Type Safety:** Full TypeScript inference across routes, params, loaders, and server functions
- **File-Based Routing:** Automatic route generation from file structure with zero-config code splitting
- **Server Functions:** Type-safe RPCs between client and server without manual API endpoint creation
- **Flexible Rendering:** SSR, streaming, static generation, or SPA modes as needed
- **Built on Vite:** Fast dev server, optimized production builds, excellent DX
- **Universal Deployment:** Deploy to any Vite-compatible host (Cloudflare, Vercel, Netlify, etc.)
- **Progressive Enhancement:** Forms work without JavaScript, enhanced when available

### Limitations

- **Release Candidate Status:** Still in RC (as of November 2025), API may evolve
- **Learning Curve:** Requires understanding both TanStack Router and Start-specific patterns
- **Smaller Ecosystem:** Newer than Next.js/Remix, fewer third-party integrations
- **MDX Integration:** No official MDX support yet, requires custom implementation

### Ideal Use Cases

✅ **Perfect For:**
- Type-safe full-stack applications
- Content-heavy sites (blogs, documentation)
- Projects needing edge deployment
- Teams prioritizing type safety and DX
- Applications requiring fine-grained SSR control

❌ **Consider Alternatives For:**
- Rapid prototyping needing mature ecosystem
- Teams unfamiliar with TypeScript
- Projects requiring extensive MDX/CMS integrations
- Applications needing proven production stability

### Complexity Assessment

- **Installation Complexity:** Low (single CLI command)
- **Learning Curve:** Medium-High (requires Router + Start concepts)
- **Production Readiness:** Medium (RC status, but used in production by early adopters)
- **Maintenance Burden:** Low (excellent TypeScript tooling, clear patterns)

---

## Getting Started

### Prerequisites

- **Node.js:** 18.x or later
- **Package Manager:** npm, pnpm, or yarn
- **TypeScript Knowledge:** Strongly recommended
- **React Familiarity:** Required (React 18+)

### Installation

The fastest way to create a TanStack Start project:

```bash
# Using pnpm (recommended)
pnpm create @tanstack/start@latest

# Using npm
npm create @tanstack/start@latest

# Using yarn
yarn create @tanstack/start
```

The CLI will prompt you to configure:
- Project name
- Tailwind CSS (optional)
- ESLint (optional)

### Alternative: Clone an Example

For specific use cases, start with an official example:

```bash
# Basic starter
npx gitpick TanStack/router/tree/main/examples/react/start-basic start-basic

# With authentication
npx gitpick TanStack/router/tree/main/examples/react/start-clerk-basic start-auth

# Install dependencies
cd start-basic
npm install
npm run dev
```

### Development Commands

```bash
# Start development server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run build  # includes tsc --noEmit
```

### Minimal Working Example

Here's the absolute minimum for a working TanStack Start app:

**File Structure:**
```
my-app/
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── router.tsx
│   └── routeTree.gen.ts (auto-generated)
├── vite.config.ts
├── package.json
└── tsconfig.json
```

**src/routes/__root.tsx:**
```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  ),
})
```

**src/routes/index.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div>
      <h1>Welcome to TanStack Start!</h1>
      <p>Your blog starts here.</p>
    </div>
  )
}
```

**src/router.tsx:**
```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
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

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart(),
    viteReact(),
  ],
})
```

Run `npm run dev` and navigate to `http://localhost:3000` to see your app.

---

## Core Concepts

### TanStack Router vs TanStack Start

**TanStack Router:**
- Client-side routing library
- Type-safe route definitions
- Data loading with SWR caching
- Search parameter validation
- Can be used standalone in SPAs

**TanStack Start:**
- Full-stack framework built ON TanStack Router
- Adds SSR, streaming, and server functions
- Production deployment capabilities
- API routes and middleware
- Universal deployment to edge platforms

**Mental Model:** Router = React Router + type safety. Start = Next.js/Remix, but built on Router.

### Execution Environments

TanStack Start code runs in **two environments**:

1. **Server Environment** (Node.js/Edge Runtime)
   - SSR rendering
   - Server functions
   - API endpoints
   - Build-time operations

2. **Client Environment** (Browser)
   - Hydration after SSR
   - Client-side navigation
   - Interactive user actions

**Isomorphic by Default:** Code executes in both environments unless you use:
- `createServerFn()` - Server only
- `createClientOnlyFn()` - Client only
- `<ClientOnly>` component - Renders only on client

### File-Based Routing Architecture

Routes are defined by your file structure in `src/routes/`:

```
src/routes/
├── __root.tsx          → Always rendered (HTML shell)
├── index.tsx           → / (home page)
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog (blog listing)
│   └── $slug.tsx       → /blog/:slug (dynamic post)
└── _authenticated/     → Pathless layout (for auth)
    └── dashboard.tsx   → /dashboard (protected)
```

**File Naming Conventions:**

| Pattern | Route | Description |
|---------|-------|-------------|
| `index.tsx` | `/` or parent path | Index route |
| `about.tsx` | `/about` | Static route |
| `$param.tsx` | `/:param` | Dynamic segment |
| `$.tsx` | `/*` | Catch-all wildcard |
| `_layout/child.tsx` | `/child` | Pathless layout |
| `__root.tsx` | Always renders | Root layout |

### Route Component Lifecycle

Every navigation follows this sequence:

1. **Route Matching** (top-down)
   - Parse URL params
   - Validate search parameters

2. **Route Pre-Loading** (serial, top-down)
   - Execute `beforeLoad` hooks
   - Check authentication
   - Set up context

3. **Route Loading** (parallel)
   - Run `loader` functions
   - Fetch data from server
   - Render components

### Server Functions

Server functions are the bridge between client and server:

```tsx
import { createServerFn } from '@tanstack/react-start'

export const getServerTime = createServerFn().handler(async () => {
  // This code ONLY runs on the server
  return new Date().toISOString()
})

// Call from anywhere (client or server):
const time = await getServerTime()
```

**How it works:**
- During build, server code is extracted from client bundle
- Client calls become `fetch()` requests
- Server executes the actual function logic
- Type safety maintained across the boundary

### SSR and Streaming

TanStack Start renders your app on the server before sending HTML to the client:

1. **Server renders** initial HTML
2. **HTML sent** to browser (fast First Contentful Paint)
3. **Client hydrates** React app
4. **Navigation** happens client-side

**Streaming:** Data can stream to the client as it becomes available, improving perceived performance.

---

## Project Setup & Configuration

### Recommended Project Structure

```
my-blog/
├── src/
│   ├── routes/              # File-based routes
│   │   ├── __root.tsx       # Root layout (HTML shell)
│   │   ├── index.tsx        # Home page
│   │   ├── blog/
│   │   │   ├── index.tsx    # Blog listing
│   │   │   └── $slug.tsx    # Individual post
│   │   └── _authenticated/  # Protected routes
│   │       └── admin.tsx
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── BlogPostCard.tsx
│   ├── server/              # Server-only code
│   │   ├── db.ts            # Database utilities
│   │   └── auth.ts          # Authentication logic
│   ├── lib/                 # Shared utilities
│   │   ├── utils.ts
│   │   └── seo.ts
│   ├── types/               # TypeScript types
│   │   └── blog.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── router.tsx           # Router configuration
│   └── routeTree.gen.ts     # Auto-generated route tree
├── public/                  # Static assets
│   ├── images/
│   └── robots.txt
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables
└── package.json
```

### TypeScript Configuration

**tsconfig.json:**
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
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Environment Variables

TanStack Start uses Vite's environment variable system.

**Create `.env` files:**
```bash
# .env.local (gitignored, for secrets)
DATABASE_URL=postgresql://localhost:5432/myblog
SESSION_SECRET=your-super-secret-key

# .env (committed, for defaults)
PUBLIC_SITE_URL=http://localhost:3000
```

**Access in server functions:**
```tsx
import { createServerFn } from '@tanstack/react-start'

export const getDatabaseUrl = createServerFn().handler(async () => {
  // Server-only access to env vars
  return process.env.DATABASE_URL
})
```

**Access in client (must be prefixed with `PUBLIC_`):**
```tsx
const siteUrl = import.meta.env.PUBLIC_SITE_URL
```

**⚠️ Security:** NEVER access non-public env vars on the client. Use server functions.

### Vite Configuration

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // Enable automatic code splitting
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'routes',
        autoCodeSplitting: true, // 🔥 Automatic route-based code splitting
      },
    }),
    viteReact(),
    tsconfigPaths(), // Support tsconfig path aliases
  ],
})
```

### Development Workflow

1. **Start dev server:** `npm run dev`
2. **Edit routes in `src/routes/`** - routes auto-reload
3. **Route tree regenerates** automatically via file watcher
4. **TypeScript errors** show in IDE immediately
5. **Build for production:** `npm run build`

**Hot Module Replacement (HMR):** Changes to components update without full page reload.

---

## Routing & Navigation

### File-Based Routing Patterns

TanStack Start uses your file structure to generate routes automatically.

#### Basic Static Routes

```
src/routes/
├── index.tsx        → /
├── about.tsx        → /about
└── contact.tsx      → /contact
```

**src/routes/about.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return <h1>About Us</h1>
}
```

#### Dynamic Route Parameters

Use `$` prefix for dynamic segments:

```
src/routes/
└── blog/
    └── $slug.tsx    → /blog/:slug
```

**src/routes/blog/$slug.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostComponent,
})

function BlogPostComponent() {
  const { slug } = Route.useParams() // Type-safe!
  return <h1>Post: {slug}</h1>
}
```

**Accessing params:**
```tsx
// In component
const params = Route.useParams()

// In loader
loader: async ({ params }) => {
  const post = await fetchPost(params.slug)
  return { post }
}
```

#### Nested Routing & Layouts

Create layouts with `<Outlet />`:

```
src/routes/
├── blog.tsx         → /blog (layout)
└── blog/
    ├── index.tsx    → /blog (content)
    └── $slug.tsx    → /blog/:slug
```

**src/routes/blog.tsx (layout):**
```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: BlogLayoutComponent,
})

function BlogLayoutComponent() {
  return (
    <div className="blog-layout">
      <aside>
        <h2>Blog Sidebar</h2>
        <nav>{/* Navigation */}</nav>
      </aside>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
```

**Component tree for `/blog/my-post`:**
```
<Root>
  <BlogLayout>
    <BlogPost /> ← Outlet renders this
  </BlogLayout>
</Root>
```

#### Pathless Layout Routes

Use `_` prefix to create layouts without changing the URL:

```
src/routes/
└── _authenticated/
    ├── dashboard.tsx   → /dashboard
    └── settings.tsx    → /settings
```

**src/routes/_authenticated.tsx:**
```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/server/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    return { user }
  },
  component: () => <Outlet />,
})
```

All routes under `_authenticated/` are protected without affecting URLs.

#### Catch-All Routes

Use `$.tsx` for wildcard matching:

```
src/routes/
└── docs/
    └── $.tsx        → /docs/* (catches all)
```

**src/routes/docs/$.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/$')({
  component: DocsComponent,
})

function DocsComponent() {
  const params = Route.useParams()
  const splatPath = params['_splat'] // Everything after /docs/
  return <div>Docs path: {splatPath}</div>
}
```

### Navigation Components

#### Link Component

Type-safe navigation with preloading:

```tsx
import { Link } from '@tanstack/react-router'

function Navigation() {
  return (
    <nav>
      {/* Static link */}
      <Link to="/about">About</Link>

      {/* Dynamic link with params */}
      <Link to="/blog/$slug" params={{ slug: 'my-post' }}>
        My Post
      </Link>

      {/* With search params */}
      <Link
        to="/blog"
        search={{ page: 1, sort: 'date' }}
      >
        Blog
      </Link>

      {/* Active link styling */}
      <Link
        to="/blog"
        activeProps={{ className: 'font-bold text-blue-600' }}
        inactiveProps={{ className: 'text-gray-600' }}
      >
        Blog
      </Link>

      {/* Preload on hover (default: 'intent') */}
      <Link to="/blog" preload="intent">
        Blog (preloads on hover)
      </Link>
    </nav>
  )
}
```

#### Programmatic Navigation

Use `useNavigate` hook:

```tsx
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: '/blog/$slug',
      params: { slug: 'new-post' },
      search: { highlight: true },
    })
  }

  return <button onClick={handleClick}>Go to Post</button>
}
```

#### Router Instance Navigation

For navigation outside React components:

```tsx
import { router } from '@/router'

router.navigate({
  to: '/login',
  search: { redirect: window.location.href },
})
```

### Search Parameters

TanStack Router treats search params as first-class application state.

#### Defining Search Schemas

**src/routes/blog/index.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const blogSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  sort: z.enum(['date', 'title', 'popular']).catch('date'),
  tag: z.string().optional(),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: blogSearchSchema,
  component: BlogListingComponent,
})

function BlogListingComponent() {
  const { page, sort, tag } = Route.useSearch()
  // All type-safe! page: number, sort: 'date' | 'title' | 'popular'

  return (
    <div>
      <p>Page: {page}, Sort: {sort}</p>
      {tag && <p>Filtered by: {tag}</p>}
    </div>
  )
}
```

#### Updating Search Parameters

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

function Pagination() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  return (
    <div>
      {/* Using Link */}
      <Link
        to="/blog"
        search={(prev) => ({ ...prev, page: prev.page + 1 })}
      >
        Next Page
      </Link>

      {/* Using navigate */}
      <button onClick={() => {
        navigate({
          to: '/blog',
          search: { ...search, page: search.page + 1 },
        })
      }}>
        Next
      </button>
    </div>
  )
}
```

### 404 Not Found Handling

#### Default Not Found Component

**src/routes/__root.tsx:**
```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { NotFound } from '@/components/NotFound'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <html>
      <head>{/* ... */}</head>
      <body>
        <Outlet />
      </body>
    </html>
  )
}
```

**src/components/NotFound.tsx:**
```tsx
import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-8 inline-block text-blue-600">
        Go Home
      </Link>
    </div>
  )
}
```

#### Throwing NotFound in Loaders

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPost } from '@/server/blog'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) {
      throw notFound() // Triggers notFoundComponent
    }
    return { post }
  },
})
```

---

## Data Loading Patterns

TanStack Start provides multiple approaches to data loading, each optimized for different use cases.

### Built-In Route Loaders

Route loaders run during navigation and cache results with SWR (Stale-While-Revalidate).

#### Basic Loader

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { getPosts } from '@/server/blog'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const posts = await getPosts()
    return { posts }
  },
  component: BlogListingComponent,
})

function BlogListingComponent() {
  const { posts } = Route.useLoaderData()

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

#### Loader with Dependencies

Use `loaderDeps` to cache based on search params:

```tsx
export const Route = createFileRoute('/blog/')({
  // Define dependencies for caching
  loaderDeps: ({ search }) => ({
    page: search.page,
    tag: search.tag,
  }),

  // Loader receives deps
  loader: async ({ deps }) => {
    const posts = await getPosts({
      page: deps.page,
      tag: deps.tag,
    })
    return { posts }
  },
})
```

**Why use loaderDeps?** Different search param combinations maintain separate cache entries.

#### Loader Context

Pass data from parent routes to children:

```tsx
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    return { user } // Available to all child routes
  },
})

// src/routes/_authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async ({ context }) => {
    // Access user from parent
    const stats = await getUserStats(context.user.id)
    return { stats }
  },
})
```

### Server Functions for Data Fetching

Server functions provide type-safe RPC for data operations.

#### Creating a Server Function

**src/server/blog.ts:**
```tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from './db'

const getPostsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  tag: z.string().optional(),
})

export const getPostsServerFn = createServerFn({ method: 'GET' })
  .inputValidator(getPostsSchema)
  .handler(async ({ data }) => {
    const offset = (data.page - 1) * data.limit

    const posts = await db.post.findMany({
      where: data.tag ? { tags: { has: data.tag } } : {},
      skip: offset,
      take: data.limit,
      orderBy: { publishedAt: 'desc' },
    })

    return posts
  })
```

#### Using in Route Loaders

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { getPostsServerFn } from '@/server/blog'

export const Route = createFileRoute('/blog/')({
  loaderDeps: ({ search }) => ({
    page: search.page,
    tag: search.tag
  }),
  loader: async ({ deps }) => {
    const posts = await getPostsServerFn({
      page: deps.page,
      tag: deps.tag,
    })
    return { posts }
  },
})
```

#### Using in Components

```tsx
import { useServerFn } from '@tanstack/react-router'
import { getPostsServerFn } from '@/server/blog'

function BlogPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    const morePosts = await getPostsServerFn({ page: 2 })
    setPosts([...posts, ...morePosts])
    setLoading(false)
  }

  return (
    <div>
      {/* Render posts */}
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  )
}
```

### Caching Configuration

Control data freshness and garbage collection:

```tsx
export const Route = createFileRoute('/blog/')({
  loader: async () => await getPosts(),

  // Data fresh for 10 seconds
  staleTime: 10_000,

  // Cache cleared after 5 minutes of inactivity
  gcTime: 5 * 60 * 1000,

  // Custom reload logic
  shouldReload: ({ routeMatch }) => {
    // Only reload if >30s since last load
    const lastLoaded = routeMatch.updatedAt
    return Date.now() - lastLoaded > 30_000
  },
})
```

**Cache Behavior:**
- `staleTime: 0` (default) - Always revalidate on navigation
- `staleTime: Infinity` - Never revalidate (cache forever)
- `preloadStaleTime: 30_000` (default) - Preloaded data fresh for 30s

### Error Handling in Loaders

```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    try {
      const post = await getPost(params.slug)
      if (!post) throw notFound()
      return { post }
    } catch (error) {
      if (error.status === 404) throw notFound()
      throw error // Triggers errorComponent
    }
  },

  errorComponent: ({ error, reset }) => (
    <div>
      <h1>Error loading post</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  ),
})
```

### Integrating TanStack Query

For advanced caching, mutations, and optimistic updates:

**Install:**
```bash
npm install @tanstack/react-query
```

**Setup query client:**
```tsx
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute
    },
  },
})
```

**Use in route loaders:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { getPosts } from '@/server/blog'

const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: () => getPosts(),
})

export const Route = createFileRoute('/blog/')({
  // Preload in loader
  loader: () => queryClient.ensureQueryData(postsQueryOptions),

  component: BlogListingComponent,
})

function BlogListingComponent() {
  // Use in component
  const { data: posts } = useSuspenseQuery(postsQueryOptions)

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}
```

**When to use TanStack Query:**
- Complex mutation logic
- Optimistic updates
- Real-time data synchronization
- Cross-route data sharing
- Advanced caching strategies

**When to use built-in loaders:**
- Simple data fetching
- Route-specific data
- Minimal setup needed
- SSR-first applications

---

## Server Functions & Actions

Server functions are TanStack Start's solution for type-safe, server-only logic callable from anywhere in your application.

### Creating Server Functions

#### Basic Server Function

```tsx
// src/server/time.ts
import { createServerFn } from '@tanstack/react-start'

export const getServerTime = createServerFn().handler(async () => {
  // This code ONLY runs on server
  return new Date().toISOString()
})
```

**Call from client:**
```tsx
const time = await getServerTime()
console.log(time) // "2025-01-10T12:00:00.000Z"
```

#### With Input Validation

```tsx
// src/server/blog.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).max(5),
})

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator(createPostSchema)
  .handler(async ({ data }) => {
    // data is fully typed and validated!
    const post = await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags,
      },
    })
    return post
  })
```

#### HTTP Method Specification

```tsx
// GET for fetching
export const getPosts = createServerFn({ method: 'GET' })
  .handler(async () => { /* ... */ })

// POST for mutations
export const createPost = createServerFn({ method: 'POST' })
  .handler(async () => { /* ... */ })

// PUT, PATCH, DELETE also supported
export const updatePost = createServerFn({ method: 'PUT' })
  .handler(async () => { /* ... */ })
```

### Form Handling

Server functions integrate seamlessly with HTML forms for progressive enhancement.

#### Basic Form Action

**src/server/contact.ts:**
```tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
})

export const sendContactForm = createServerFn({ method: 'POST' })
  .inputValidator((data) => {
    // Handle FormData
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData')
    }

    return contactFormSchema.parse({
      name: data.get('name')?.toString(),
      email: data.get('email')?.toString(),
      message: data.get('message')?.toString(),
    })
  })
  .handler(async ({ data }) => {
    // Send email, save to DB, etc.
    await sendEmail({
      to: 'contact@example.com',
      from: data.email,
      subject: `Contact from ${data.name}`,
      body: data.message,
    })

    return { success: true }
  })
```

**Component with progressive enhancement:**
```tsx
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { sendContactForm } from '@/server/contact'

function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await sendContactForm(formData)
      setMessage('Message sent successfully!')
      e.currentTarget.reset()
    } catch (error) {
      setMessage('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
```

### Mutations with Invalidation

After data mutations, invalidate the router cache to refetch data:

```tsx
import { createServerFn } from '@tanstack/react-start'
import { useRouter } from '@tanstack/react-router'

export const deletePost = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.post.delete({ where: { id: data.id } })
    return { success: true }
  })

// Component
function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return

    setDeleting(true)
    await deletePost({ id: postId })

    // Invalidate cache and refetch
    await router.invalidate()

    // Navigate away
    router.navigate({ to: '/blog' })
  }

  return (
    <button onClick={handleDelete} disabled={deleting}>
      {deleting ? 'Deleting...' : 'Delete Post'}
    </button>
  )
}
```

### Redirects from Server Functions

```tsx
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

export const requireAuth = createServerFn().handler(async () => {
  const user = await getCurrentUser()

  if (!user) {
    // Redirect to login
    throw redirect({
      to: '/login',
      search: { redirect: '/dashboard' },
    })
  }

  return user
})
```

### Middleware Pattern

Compose server functions for shared logic:

```tsx
// src/server/middleware.ts
import { createServerFn } from '@tanstack/react-start'

export const withAuth = <T extends (...args: any[]) => any>(
  handler: T
) => {
  return createServerFn()
    .handler(async (ctx) => {
      const user = await getCurrentUser()
      if (!user) {
        throw redirect({ to: '/login' })
      }
      return handler({ ...ctx, user })
    })
}

// Usage
export const getMyPosts = withAuth(async ({ user }) => {
  return await db.post.findMany({
    where: { authorId: user.id },
  })
})
```

### Server Context API

Access request headers, cookies, and set response headers:

```tsx
import { createServerFn } from '@tanstack/react-start'
import {
  getRequest,
  getRequestHeader,
  setResponseHeader,
  setResponseStatus,
} from '@tanstack/react-start/server'

export const checkAuth = createServerFn().handler(async () => {
  // Access request
  const request = getRequest()

  // Read headers
  const userAgent = getRequestHeader('user-agent')
  const cookie = getRequestHeader('cookie')

  // Set response headers
  setResponseHeader('X-Custom-Header', 'value')

  // Set response status
  setResponseStatus(200)

  return { userAgent }
})
```

---

## Component Patterns

### Route Component Structure

Standard pattern for route components:

```tsx
import { createFileRoute } from '@tanstack/react-router'

// 1. Export Route definition
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },
  component: BlogPostComponent,
  errorComponent: ErrorComponent,
  pendingComponent: LoadingComponent,
})

// 2. Main component (uses Route hooks)
function BlogPostComponent() {
  const { post } = Route.useLoaderData()
  const { slug } = Route.useParams()

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}

// 3. Error component
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )
}

// 4. Loading component
function LoadingComponent() {
  return <div>Loading post...</div>
}
```

### Layout Components

Create reusable layouts with `<Outlet />`:

**src/routes/__root.tsx:**
```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import appCss from '@/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Outlet /> {/* Child routes render here */}
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
```

### Shared/Reusable Components

Organize in `src/components/`:

**src/components/BlogPostCard.tsx:**
```tsx
import { Link } from '@tanstack/react-router'
import type { Post } from '@/types/blog'

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="border rounded-lg p-6 hover:shadow-lg transition">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="block"
      >
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          <span>{post.readingTime} min read</span>
        </div>
      </Link>
    </article>
  )
}
```

### Client-Only Components

For components requiring browser APIs:

```tsx
import { ClientOnly } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/ThemeToggle'

function Header() {
  return (
    <header>
      <h1>My Blog</h1>

      {/* ThemeToggle uses localStorage, only render on client */}
      <ClientOnly fallback={<div className="w-10 h-10" />}>
        {() => <ThemeToggle />}
      </ClientOnly>
    </header>
  )
}
```

**ThemeToggle.tsx:**
```tsx
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Access localStorage only on client
    const saved = localStorage.getItem('theme') as 'light' | 'dark'
    if (saved) setTheme(saved)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### Pending States & Suspense

Show loading states during navigation:

```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },

  // Show pending component if loader takes >1s
  pendingMs: 1000,

  // Keep pending component visible for at least 500ms
  pendingMinMs: 500,

  pendingComponent: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
})
```

---

## SEO & Meta Tags

TanStack Start provides powerful head management for SEO optimization.

### HeadContent Component

The `<HeadContent />` component must be in the `<head>` of your root route:

**src/routes/__root.tsx:**
```tsx
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <html lang="en">
      <head>
        <HeadContent /> {/* Renders all head tags */}
      </head>
      <body>
        <Outlet />
        <Scripts /> {/* Loads client-side JS */}
      </body>
    </html>
  ),
})
```

### Setting Meta Tags in Routes

Use the `head` option in route definitions:

**src/routes/index.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'My Blog - Thoughts on Web Development',
      },
      {
        name: 'description',
        content: 'A blog about React, TypeScript, and modern web development.',
      },
      {
        name: 'keywords',
        content: 'react, typescript, web development, blog',
      },
    ],
  }),
  component: HomeComponent,
})
```

### Dynamic Meta Tags

Generate meta tags from loader data:

**src/routes/blog/$slug.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { getPost } from '@/server/blog'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.post.title} | My Blog`,
      },
      {
        name: 'description',
        content: loaderData.post.excerpt,
      },
      {
        name: 'author',
        content: loaderData.post.author.name,
      },
    ],
  }),
})
```

### Open Graph & Twitter Cards

**src/lib/seo.ts (utility function):**
```tsx
interface SEOProps {
  title: string
  description?: string
  image?: string
  keywords?: string
  type?: 'website' | 'article'
  publishedAt?: string
  author?: string
}

export function seo({
  title,
  description,
  image,
  keywords,
  type = 'website',
  publishedAt,
  author,
}: SEOProps) {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },

    // Conditionally add image
    ...(image ? [
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image },
    ] : []),

    // Article-specific tags
    ...(type === 'article' && publishedAt ? [
      { property: 'article:published_time', content: publishedAt },
      { property: 'article:author', content: author },
    ] : []),
  ]

  return tags.filter(tag => tag.content !== undefined)
}
```

**Usage in route:**
```tsx
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },

  head: ({ loaderData }) => ({
    meta: seo({
      title: loaderData.post.title,
      description: loaderData.post.excerpt,
      image: loaderData.post.coverImage,
      keywords: loaderData.post.tags.join(', '),
      type: 'article',
      publishedAt: loaderData.post.publishedAt,
      author: loaderData.post.author.name,
    }),
  }),
})
```

### Canonical URLs & Alternate Languages

```tsx
export const Route = createFileRoute('/blog/$slug')({
  head: ({ params, loaderData }) => ({
    meta: [
      { title: loaderData.post.title },
      { name: 'description', content: loaderData.post.excerpt },
    ],
    links: [
      // Canonical URL
      {
        rel: 'canonical',
        href: `https://myblog.com/blog/${params.slug}`,
      },
      // Alternate language versions
      {
        rel: 'alternate',
        hreflang: 'en',
        href: `https://myblog.com/blog/${params.slug}`,
      },
      {
        rel: 'alternate',
        hreflang: 'es',
        href: `https://myblog.com/es/blog/${params.slug}`,
      },
    ],
  }),
})
```

### JSON-LD Structured Data

```tsx
export const Route = createFileRoute('/blog/$slug')({
  head: ({ loaderData }) => {
    const { post } = loaderData

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    }

    return {
      meta: [{ title: post.title }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    }
  },
})
```

---

## Styling Integration

### Tailwind CSS Setup

Tailwind CSS integrates seamlessly with TanStack Start.

#### Installation

```bash
npm install -D @tailwindcss/vite tailwindcss
```

#### Configuration

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(), // Add Tailwind plugin
    tanstackStart(),
    viteReact(),
  ],
})
```

**src/styles/globals.css:**
```css
@import 'tailwindcss';

/* Your custom styles */
body {
  @apply antialiased;
}
```

**Import in root route:**
```tsx
import { createRootRoute } from '@tanstack/react-router'
import appCss from '@/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
})
```

#### Usage

```tsx
function BlogPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">
        My Blog Post
      </h1>
      <p className="text-gray-600 mb-8">
        Published on January 10, 2025
      </p>
      <div className="prose prose-lg">
        {/* Content */}
      </div>
    </article>
  )
}
```

### CSS Modules

TanStack Start supports CSS Modules out of the box via Vite.

**BlogPost.module.css:**
```css
.article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.content {
  line-height: 1.8;
  color: #333;
}
```

**Usage:**
```tsx
import styles from './BlogPost.module.css'

function BlogPost() {
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>My Blog Post</h1>
      <div className={styles.content}>
        {/* Content */}
      </div>
    </article>
  )
}
```

### Global Styles

Define global styles in `src/styles/globals.css`:

```css
@import 'tailwindcss';

:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### Font Loading

**Using Google Fonts:**

```tsx
export const Route = createRootRoute({
  head: () => ({
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
      },
    ],
  }),
})
```

**Using local fonts:**

Place fonts in `public/fonts/` and reference:

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'CustomFont', sans-serif;
}
```

---

## State Management

### URL State (Search Params)

TanStack Router treats search params as first-class state.

**Define schema:**
```tsx
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().catch(1),
  sort: z.enum(['date', 'title']).catch('date'),
  filter: z.string().optional(),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: searchSchema,
})
```

**Read state:**
```tsx
function BlogListing() {
  const { page, sort, filter } = Route.useSearch()

  return (
    <div>
      <p>Page: {page}, Sort: {sort}</p>
      {filter && <p>Filter: {filter}</p>}
    </div>
  )
}
```

**Update state:**
```tsx
import { useNavigate } from '@tanstack/react-router'

function Filters() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const updateSort = (sort: 'date' | 'title') => {
    navigate({
      to: '/blog',
      search: { ...search, sort },
    })
  }

  return (
    <select
      value={search.sort}
      onChange={(e) => updateSort(e.target.value as any)}
    >
      <option value="date">Date</option>
      <option value="title">Title</option>
    </select>
  )
}
```

### Client State (React)

Use standard React state management:

**useState for local state:**
```tsx
function CommentForm() {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await submitComment(comment)
    setComment('')
    setSubmitting(false)
  }

  return (
    <div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={submitting}>
        Submit
      </button>
    </div>
  )
}
```

**Context for shared state:**
```tsx
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be within ThemeProvider')
  return ctx
}
```

### Router Context

Pass data from parent routes to children:

```tsx
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    return { user }
  },
})

// src/routes/_authenticated/dashboard.tsx
function Dashboard() {
  const { user } = Route.useRouteContext()
  return <h1>Welcome, {user.name}!</h1>
}
```

### TanStack Query Integration

For server state management:

```tsx
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

const postsQuery = queryOptions({
  queryKey: ['posts'],
  queryFn: () => getPosts(),
})

function BlogListing() {
  const { data: posts } = useSuspenseQuery(postsQuery)

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
      <button onClick={() => createMutation.mutate({ title: 'New' })}>
        Create Post
      </button>
    </div>
  )
}
```

---

## Error Handling

### Error Boundaries

TanStack Start provides route-level error boundaries.

#### Default Error Component

**src/routes/__root.tsx:**
```tsx
import { createRootRoute, ErrorComponent } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  ),
})
```

#### Per-Route Error Components

```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw new Error('Post not found')
    return { post }
  },

  errorComponent: ({ error, reset }) => {
    const router = useRouter()

    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Error Loading Post</h1>
        <p className="text-red-600 mb-4">{error.message}</p>
        <div className="space-x-4">
          <button
            onClick={() => router.invalidate()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
          <button
            onClick={() => router.navigate({ to: '/blog' })}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )
  },
})
```

### Not Found Handling

#### Default Not Found

```tsx
const router = createRouter({
  defaultNotFoundComponent: () => (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-8">This page doesn't exist.</p>
      <Link to="/" className="text-blue-600">Go Home</Link>
    </div>
  ),
})
```

#### Route-Specific Not Found

```tsx
export const Route = createFileRoute('/blog')({
  component: BlogLayout,
  notFoundComponent: () => (
    <div>
      <p>This blog section doesn't exist!</p>
      <Link to="/blog">Browse all posts</Link>
    </div>
  ),
})
```

#### Throwing notFound()

```tsx
import { notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
})
```

### Error Handling in Loaders

```tsx
export const Route = createFileRoute('/blog/')({
  loader: async () => {
    try {
      const posts = await getPosts()
      return { posts }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new Error('Database is temporarily unavailable')
      }
      throw error
    }
  },

  onError: ({ error }) => {
    // Log to error tracking service
    console.error('Loader error:', error)
  },
})
```

### Error Handling in Server Functions

```tsx
import { createServerFn } from '@tanstack/react-start'

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator(createPostSchema)
  .handler(async ({ data }) => {
    try {
      const post = await db.post.create({ data })
      return post
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('A post with this slug already exists')
      }
      throw new Error('Failed to create post')
    }
  })
```

**Client-side handling:**
```tsx
async function handleCreate() {
  try {
    await createPost({ title, content })
    router.navigate({ to: '/blog' })
  } catch (error) {
    setError(error.message)
  }
}
```

---

## Blog-Specific Implementation

### Blog Post Routing Structure

**Recommended structure:**
```
src/routes/
├── index.tsx              → / (home page)
├── blog.tsx               → /blog (layout)
└── blog/
    ├── index.tsx          → /blog (listing)
    ├── $slug.tsx          → /blog/:slug (post)
    ├── tag.$tag.tsx       → /blog/tag/:tag (tag filter)
    └── archive.tsx        → /blog/archive
```

### Blog Post Type Definition

**src/types/blog.ts:**
```tsx
export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  readingTime: number
  views: number
}

export interface PostMetadata {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  readingTime: number
}
```

### Blog Listing Page

**src/routes/blog/index.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getPosts } from '@/server/blog'
import { BlogPostCard } from '@/components/BlogPostCard'
import { Pagination } from '@/components/Pagination'
import { seo } from '@/lib/seo'

const blogSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  tag: z.string().optional(),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: blogSearchSchema,

  loaderDeps: ({ search }) => ({
    page: search.page,
    tag: search.tag,
  }),

  loader: async ({ deps }) => {
    const posts = await getPosts({
      page: deps.page,
      limit: 10,
      tag: deps.tag,
    })
    const totalPosts = await getPostCount({ tag: deps.tag })

    return {
      posts,
      totalPages: Math.ceil(totalPosts / 10),
    }
  },

  head: ({ search }) => ({
    meta: seo({
      title: search.tag
        ? `Posts tagged "${search.tag}" | My Blog`
        : 'Blog | My Blog',
      description: 'Read articles about web development, React, and TypeScript.',
      keywords: 'blog, web development, react, typescript',
    }),
  }),

  component: BlogListingComponent,
})

function BlogListingComponent() {
  const { posts, totalPages } = Route.useLoaderData()
  const { page, tag } = Route.useSearch()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {tag ? `Posts tagged "${tag}"` : 'Blog'}
      </h1>

      {tag && (
        <Link
          to="/blog"
          className="inline-block mb-6 text-blue-600"
        >
          ← All posts
        </Link>
      )}

      <div className="space-y-8">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/blog"
        />
      )}
    </div>
  )
}
```

### Individual Blog Post Page

**src/routes/blog/$slug.tsx:**
```tsx
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPost } from '@/server/blog'
import { seo } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw notFound()
    return { post }
  },

  head: ({ loaderData }) => {
    const { post } = loaderData

    return {
      meta: seo({
        title: `${post.title} | My Blog`,
        description: post.excerpt,
        image: post.coverImage,
        keywords: post.tags.join(', '),
        type: 'article',
        publishedAt: post.publishedAt,
        author: post.author.name,
      }),
      links: [
        {
          rel: 'canonical',
          href: `https://myblog.com/blog/${post.slug}`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Person',
              name: post.author.name,
            },
          }),
        },
      ],
    }
  },

  component: BlogPostComponent,
})

function BlogPostComponent() {
  const { post } = Route.useLoaderData()

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded-lg mb-8"
        />
      )}

      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <div className="flex items-center gap-4 mt-4">
          {post.author.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-gray-600">{post.author.bio}</p>
            )}
          </div>
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-12 pt-8 border-t">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              to="/blog"
              search={{ tag }}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </footer>
    </article>
  )
}
```

### MDX Integration Pattern

While TanStack Start doesn't have official MDX support, here's a pattern for integrating it:

**1. Install dependencies:**
```bash
npm install @mdx-js/mdx @mdx-js/react
```

**2. Create MDX processor:**

**src/lib/mdx.server.ts:**
```tsx
import { compile } from '@mdx-js/mdx'
import { createServerFn } from '@tanstack/react-start'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export const compileMDX = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const filePath = path.join(process.cwd(), 'content', `${data.slug}.mdx`)
    const source = await fs.readFile(filePath, 'utf-8')

    // Compile MDX to JavaScript
    const compiled = await compile(source, {
      outputFormat: 'function-body',
    })

    return {
      code: String(compiled),
      frontmatter: extractFrontmatter(source),
    }
  })

function extractFrontmatter(source: string) {
  const match = source.match(/^---\n(.*?)\n---/s)
  if (!match) return {}

  // Parse YAML frontmatter
  const yaml = match[1]
  const lines = yaml.split('\n')
  const frontmatter: Record<string, any> = {}

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim()
    }
  })

  return frontmatter
}
```

**3. Use in route:**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { compileMDX } from '@/lib/mdx.server'
import { MDXProvider } from '@mdx-js/react'
import { useMemo } from 'react'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const { code, frontmatter } = await compileMDX({ slug: params.slug })
    return { code, frontmatter }
  },

  component: BlogPostComponent,
})

function BlogPostComponent() {
  const { code, frontmatter } = Route.useLoaderData()

  const MDXContent = useMemo(() => {
    const { default: Component } = new Function(code)()
    return Component
  }, [code])

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <MDXProvider>
        <MDXContent />
      </MDXProvider>
    </article>
  )
}
```

**Note:** This is a simplified example. Production implementations should handle errors, caching, and security considerations.

### Tag Filtering

**src/routes/blog/tag.$tag.tsx:**
```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/tag/$tag')({
  beforeLoad: ({ params }) => {
    // Redirect to blog listing with tag search param
    throw redirect({
      to: '/blog',
      search: { tag: params.tag },
    })
  },
})
```

### RSS Feed Generation

**src/routes/rss.xml.tsx:**
```tsx
import { createFileRoute } from '@tanstack/react-start'
import { getPosts } from '@/server/blog'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getPosts({ limit: 20 })

        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Blog</title>
    <link>https://myblog.com</link>
    <description>A blog about web development</description>
    <language>en</language>
    <atom:link href="https://myblog.com/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://myblog.com/blog/${post.slug}</link>
      <guid>https://myblog.com/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>
    `).join('\n')}
  </channel>
</rss>`

        return new Response(rss, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
```

---

## Cloudflare Deployment

TanStack Start has first-class support for Cloudflare Pages deployment.

### Prerequisites

- Cloudflare account (free tier works)
- GitHub or GitLab repository
- Wrangler CLI (optional, for local deployment)

### Project Configuration

#### 1. Install Cloudflare Tools

```bash
pnpm add -D @cloudflare/vite-plugin wrangler
```

#### 2. Update Vite Configuration

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // Cloudflare plugin MUST come first
    cloudflare({
      viteEnvironment: { name: 'ssr' }
    }),
    tailwindcss(),
    tanstackStart({
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
})
```

#### 3. Create Wrangler Configuration

**wrangler.jsonc:**
```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-blog",
  "compatibility_date": "2025-01-10",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry"
}
```

#### 4. Update Package Scripts

**package.json:**
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && tsc --noEmit",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy",
    "cf-typegen": "wrangler types"
  }
}
```

### Deployment Methods

#### Method 1: Deploy via Git (Recommended)

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Configure for Cloudflare deployment"
git push origin main
```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**
   - Click **Create Application** > **Pages** > **Connect to Git**
   - Select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** (leave blank unless monorepo)
     - **Environment variables:** Add any required vars

3. **Deploy:**
   - Cloudflare automatically deploys on every push to main
   - Preview deployments created for pull requests

#### Method 2: Deploy via Wrangler CLI

1. **Authenticate:**
```bash
npx wrangler login
```

2. **Deploy:**
```bash
npm run deploy
```

3. **View deployment:**
```bash
npx wrangler pages deployment list
```

### Environment Variables

#### Setting Environment Variables in Cloudflare

1. Go to **Workers & Pages** > Your project > **Settings** > **Environment Variables**
2. Add variables for **Production** and **Preview** environments:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `PUBLIC_SITE_URL`

**⚠️ Important:** Only variables prefixed with `PUBLIC_` are accessible on the client.

#### Accessing Environment Variables

**Server-side (server functions):**
```tsx
import { createServerFn } from '@tanstack/react-start'

export const getDatabaseUrl = createServerFn().handler(async () => {
  return process.env.DATABASE_URL
})
```

**Client-side:**
```tsx
const siteUrl = import.meta.env.PUBLIC_SITE_URL
```

### Custom Domains

1. **Add custom domain in Cloudflare:**
   - Go to your Pages project > **Custom Domains**
   - Click **Set up a custom domain**
   - Enter your domain (e.g., `myblog.com`)

2. **Configure DNS:**
   - If domain is on Cloudflare: DNS configured automatically
   - If external: Add CNAME record pointing to your Pages URL

3. **SSL/TLS:**
   - Automatically provisioned by Cloudflare
   - Force HTTPS in **SSL/TLS** settings

### Preview Deployments

Cloudflare automatically creates preview deployments for:
- **Pull Requests:** `https://pr-123.your-project.pages.dev`
- **Branches:** `https://branch-name.your-project.pages.dev`

Access preview deployments from:
- Pull request comments (automatic)
- Cloudflare dashboard > **Deployments**

### Build Configuration

**cloudflare-pages.json (optional):**
```json
{
  "production_branch": "main",
  "preview_branch_includes": ["*"],
  "preview_branch_excludes": [],
  "build": {
    "command": "npm run build",
    "destination": "dist"
  }
}
```

### Cloudflare-Specific Optimizations

#### 1. Cache Headers

Set appropriate cache headers for static assets:

```tsx
export const Route = createFileRoute('/blog/$slug')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getPost(params.slug)

        return new Response(JSON.stringify(post), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          },
        })
      },
    },
  },
})
```

#### 2. Edge Caching

Leverage Cloudflare's edge network:

```tsx
import { setResponseHeader } from '@tanstack/react-start/server'

export const getCachedPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    const posts = await getPosts()

    // Cache at edge for 1 hour
    setResponseHeader('Cache-Control', 'public, max-age=3600')
    setResponseHeader('CDN-Cache-Control', 'public, max-age=86400')

    return posts
  })
```

#### 3. Image Optimization with Cloudflare Images

```tsx
function BlogPostImage({ src, alt }: { src: string; alt: string }) {
  // Use Cloudflare Images for optimization
  const optimizedSrc = `/cdn-cgi/image/width=800,format=auto/${src}`

  return <img src={optimizedSrc} alt={alt} />
}
```

### Monitoring and Analytics

1. **Enable Web Analytics:**
   - Go to **Analytics** > **Web Analytics**
   - Add your domain
   - No JavaScript beacon needed for Pages

2. **View Deployment Logs:**
   - Cloudflare Dashboard > Your project > **Deployments**
   - Click on deployment > **View Logs**

3. **Real-time Logs (Wrangler):**
```bash
npx wrangler pages deployment tail
```

### Troubleshooting

**Build fails:**
- Check build logs in Cloudflare Dashboard
- Ensure Node version is compatible (set in package.json `engines` field)
- Verify environment variables are set

**404 on routes:**
- Ensure `dist` folder contains generated files
- Check `_routes.json` is generated correctly
- Verify SSR entry point is configured in `wrangler.jsonc`

**Slow cold starts:**
- Enable Cloudflare Workers paid plan for faster cold starts
- Optimize bundle size (see Performance Optimization section)

---

## Performance Optimization

### Code Splitting

TanStack Start automatically code-splits routes when `autoCodeSplitting: true` is enabled.

**vite.config.ts:**
```ts
export default defineConfig({
  plugins: [
    tanstackStart({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        // Customize splitting behavior
        defaultBehavior: {
          component: 'split',
          errorComponent: 'split',
          notFoundComponent: 'split',
          pendingComponent: 'split',
        },
      },
    }),
  ],
})
```

**Manual lazy loading:**
```tsx
import { lazy } from 'react'

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'))

function MyRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Preloading

Improve perceived performance by preloading routes:

**Router configuration:**
```tsx
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent', // Preload on hover/touch
    defaultPreloadDelay: 50,  // Delay before preloading (ms)
    defaultPreloadStaleTime: 30_000, // Cache preloaded data for 30s
  })
  return router
}
```

**Per-link preloading:**
```tsx
<Link to="/blog" preload="intent">
  Blog (preloads on hover)
</Link>

<Link to="/blog" preload="viewport">
  Blog (preloads when visible)
</Link>

<Link to="/blog" preload="render">
  Blog (preloads immediately)
</Link>

<Link to="/blog" preload={false}>
  Blog (no preload)
</Link>
```

**Manual preloading:**
```tsx
const router = useRouter()

const handleMouseEnter = () => {
  router.preloadRoute({ to: '/blog/$slug', params: { slug: 'my-post' } })
}

<div onMouseEnter={handleMouseEnter}>
  Hover to preload
</div>
```

### Asset Optimization

#### Image Optimization

**Use modern formats:**
```tsx
<picture>
  <source srcSet="/images/hero.avif" type="image/avif" />
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero" />
</picture>
```

**Lazy load images:**
```tsx
<img
  src="/images/post.jpg"
  alt="Post cover"
  loading="lazy"
  decoding="async"
/>
```

**Cloudflare Image Resizing:**
```tsx
function OptimizedImage({ src, width, alt }: Props) {
  const optimizedSrc = `/cdn-cgi/image/width=${width},format=auto,quality=85/${src}`
  return <img src={optimizedSrc} alt={alt} />
}
```

#### Font Optimization

**Preload critical fonts:**
```tsx
export const Route = createRootRoute({
  head: () => ({
    links: [
      {
        rel: 'preload',
        href: '/fonts/Inter-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
})
```

**Use font-display:**
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-display: swap; /* Show fallback font while loading */
}
```

### Caching Strategies

#### Route Loader Caching

```tsx
export const Route = createFileRoute('/blog/')({
  loader: async () => await getPosts(),

  // Keep data fresh for 5 minutes
  staleTime: 5 * 60 * 1000,

  // Clear cache after 30 minutes of inactivity
  gcTime: 30 * 60 * 1000,
})
```

#### HTTP Caching Headers

```tsx
import { setResponseHeader } from '@tanstack/react-start/server'

export const getPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    const posts = await db.post.findMany()

    // Browser cache: 5 minutes
    // CDN cache: 1 hour
    setResponseHeader(
      'Cache-Control',
      'public, max-age=300, s-maxage=3600'
    )

    return posts
  })
```

### Bundle Size Optimization

**Analyze bundle:**
```bash
npm install -D rollup-plugin-visualizer
```

**vite.config.ts:**
```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

**Tree-shaking:**
- Import only what you need:
```tsx
// ❌ Bad: imports entire library
import _ from 'lodash'

// ✅ Good: imports specific function
import debounce from 'lodash/debounce'
```

**Dynamic imports for large libraries:**
```tsx
const handleExport = async () => {
  const { exportToPDF } = await import('heavy-pdf-library')
  await exportToPDF(data)
}
```

### Lighthouse Optimization

**Target scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Key optimizations:**
1. Minimize JavaScript execution time
2. Eliminate render-blocking resources
3. Properly size images
4. Use efficient cache policies
5. Minimize main thread work

---

## Best Practices

### File Organization

**Recommended structure:**
```
src/
├── routes/           # File-based routes (ONLY route files)
├── components/       # Reusable UI components
├── server/           # Server-only code (database, auth)
├── lib/              # Shared utilities (isomorphic)
├── types/            # TypeScript types
├── styles/           # Global styles
└── hooks/            # Custom React hooks
```

**Anti-patterns to avoid:**
- ❌ Mixing components and routes in same directory
- ❌ Server-only code outside `server/` directory
- ❌ Database queries in components
- ❌ Accessing `process.env` on client

### TypeScript Typing Patterns

**Infer types from loaders:**
```tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    return { post }
  },
})

// Automatic type inference!
function Component() {
  const { post } = Route.useLoaderData() // post is fully typed
}
```

**Share types between server and client:**
```tsx
// src/types/blog.ts
export interface Post {
  id: string
  title: string
  content: string
}

// src/server/blog.ts
import type { Post } from '@/types/blog'

export const getPosts = createServerFn().handler(async (): Promise<Post[]> => {
  return await db.post.findMany()
})

// Components automatically get correct types
```

**Use zod for runtime validation:**
```tsx
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

type Post = z.infer<typeof postSchema>
```

### Error Handling Best Practices

1. **Use specific error components:**
```tsx
// Don't use generic error for everything
errorComponent: ({ error }) => {
  if (error.message.includes('not found')) {
    return <NotFoundError />
  }
  if (error.message.includes('unauthorized')) {
    return <UnauthorizedError />
  }
  return <GenericError error={error} />
}
```

2. **Log errors to monitoring service:**
```tsx
onError: ({ error }) => {
  // Send to Sentry, LogRocket, etc.
  errorMonitoring.captureException(error)
}
```

3. **Provide recovery actions:**
```tsx
errorComponent: ({ error, reset }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={() => router.invalidate()}>Retry</button>
    <button onClick={() => router.navigate({ to: '/' })}>Go Home</button>
  </div>
)
```

### Security Considerations

**Never expose secrets on client:**
```tsx
// ❌ BAD: Exposes API key to client
const API_KEY = process.env.API_KEY
fetch(`/api/data?key=${API_KEY}`)

// ✅ GOOD: Keep secrets on server
export const fetchData = createServerFn().handler(async () => {
  const API_KEY = process.env.API_KEY
  return await fetch(`/api/data?key=${API_KEY}`)
})
```

**Validate all inputs:**
```tsx
export const createPost = createServerFn({ method: 'POST' })
  .inputValidator(postSchema) // Always validate!
  .handler(async ({ data }) => {
    // data is validated and typed
  })
```

**Use CSRF protection:**
```tsx
// Add CSRF token to forms
import { getCSRFToken } from '@/server/csrf'

const token = await getCSRFToken()

<form>
  <input type="hidden" name="_csrf" value={token} />
  {/* other fields */}
</form>
```

**Sanitize user content:**
```tsx
import DOMPurify from 'isomorphic-dompurify'

function BlogPost({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content)
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}
```

### Testing Strategies

**Route testing:**
```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { Route } from './routes/blog/$slug'

test('renders blog post', async () => {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: ['/blog/my-post'],
    }),
  })

  render(<RouterProvider router={router} />)

  expect(await screen.findByText('My Post')).toBeInTheDocument()
})
```

**Server function testing:**
```tsx
import { getPosts } from './server/blog'

test('getPosts returns posts', async () => {
  const posts = await getPosts()
  expect(posts).toHaveLength(10)
})
```

### Common Pitfalls

1. **Forgetting to invalidate after mutations:**
```tsx
// ❌ BAD: Cache not updated
await createPost(data)
router.navigate({ to: '/blog' })

// ✅ GOOD: Invalidate cache
await createPost(data)
await router.invalidate()
router.navigate({ to: '/blog' })
```

2. **Using client-only APIs on server:**
```tsx
// ❌ BAD: window is undefined on server
const width = window.innerWidth

// ✅ GOOD: Use ClientOnly
<ClientOnly>
  {() => <ComponentUsingWindow />}
</ClientOnly>
```

3. **Not handling loading states:**
```tsx
// ❌ BAD: No loading feedback
const posts = Route.useLoaderData()

// ✅ GOOD: Show pending state
pendingComponent: () => <LoadingSkeleton />
```

4. **Over-fetching data:**
```tsx
// ❌ BAD: Fetching all posts when only showing 10
const allPosts = await db.post.findMany()

// ✅ GOOD: Fetch only what's needed
const posts = await db.post.findMany({ take: 10 })
```

---

## Complete Code Examples

### Example 1: Complete Blog Post Route

**src/routes/blog/$slug.tsx:**
```tsx
import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { getPost, incrementViews } from '@/server/blog'
import { seo } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import DOMPurify from 'isomorphic-dompurify'

export const Route = createFileRoute('/blog/$slug')({
  // Load data
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) throw notFound()

    // Increment view count (fire and forget)
    incrementViews(params.slug).catch(console.error)

    return { post }
  },

  // SEO meta tags
  head: ({ loaderData }) => {
    const { post } = loaderData

    return {
      meta: seo({
        title: `${post.title} | My Blog`,
        description: post.excerpt,
        image: post.coverImage,
        keywords: post.tags.join(', '),
        type: 'article',
        publishedAt: post.publishedAt,
        author: post.author.name,
      }),
      links: [
        {
          rel: 'canonical',
          href: `https://myblog.com/blog/${post.slug}`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Person',
              name: post.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'My Blog',
              logo: {
                '@type': 'ImageObject',
                url: 'https://myblog.com/logo.png',
              },
            },
          }),
        },
      ],
    }
  },

  // Loading state
  pendingComponent: () => (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  ),

  // Error state
  errorComponent: ({ error }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Error Loading Post</h1>
      <p className="text-red-600 mb-8">{error.message}</p>
      <Link
        to="/blog"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Blog
      </Link>
    </div>
  ),

  // Main component
  component: BlogPostComponent,
})

function BlogPostComponent() {
  const { post } = Route.useLoaderData()
  const sanitizedContent = DOMPurify.sanitize(post.content)

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-lg mb-8"
          loading="eager"
        />
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>{post.views.toLocaleString()} views</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4">
          {post.author.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-gray-600">{post.author.bio}</p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* Footer - Tags */}
      <footer className="pt-8 border-t">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Tagged with
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              to="/blog"
              search={{ tag }}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </footer>

      {/* Related Posts (optional) */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <aside className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {post.relatedPosts.map(related => (
              <Link
                key={related.id}
                to="/blog/$slug"
                params={{ slug: related.slug }}
                className="block p-6 border rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-semibold mb-2">{related.title}</h3>
                <p className="text-sm text-gray-600">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  )
}
```

### Example 2: Blog Listing with Pagination

**src/routes/blog/index.tsx:**
```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { getPosts, getPostCount } from '@/server/blog'
import { BlogPostCard } from '@/components/BlogPostCard'
import { seo } from '@/lib/seo'

const blogSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  tag: z.string().optional(),
  sort: z.enum(['date', 'popular', 'title']).catch('date'),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: blogSearchSchema,

  loaderDeps: ({ search }) => ({
    page: search.page,
    tag: search.tag,
    sort: search.sort,
  }),

  loader: async ({ deps }) => {
    const limit = 12
    const offset = (deps.page - 1) * limit

    const [posts, totalCount] = await Promise.all([
      getPosts({
        limit,
        offset,
        tag: deps.tag,
        sortBy: deps.sort,
      }),
      getPostCount({ tag: deps.tag }),
    ])

    return {
      posts,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  },

  head: ({ search }) => ({
    meta: seo({
      title: search.tag
        ? `Posts tagged "${search.tag}" | My Blog`
        : 'Blog | My Blog',
      description: 'Read articles about web development, React, and TypeScript.',
      keywords: 'blog, web development, react, typescript',
    }),
  }),

  pendingComponent: () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  ),

  component: BlogListingComponent,
})

function BlogListingComponent() {
  const { posts, totalPages, totalCount } = Route.useLoaderData()
  const { page, tag, sort } = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {tag ? `Posts tagged "${tag}"` : 'Blog'}
        </h1>
        <p className="text-gray-600">
          {totalCount} {totalCount === 1 ? 'post' : 'posts'}
        </p>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        {tag && (
          <Link
            to="/blog"
            className="text-blue-600 hover:underline"
          >
            ← All posts
          </Link>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => {
              navigate({
                to: '/blog',
                search: (prev) => ({ ...prev, sort: e.target.value as any }),
              })
            }}
            className="px-3 py-1 border rounded"
          >
            <option value="date">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-2">
          <Link
            to="/blog"
            search={(prev) => ({ ...prev, page: Math.max(1, page - 1) })}
            disabled={page === 1}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Link>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              const isActive = pageNum === page

              return (
                <Link
                  key={pageNum}
                  to="/blog"
                  search={(prev) => ({ ...prev, page: pageNum })}
                  className={`px-4 py-2 border rounded ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
          </div>

          <Link
            to="/blog"
            search={(prev) => ({ ...prev, page: Math.min(totalPages, page + 1) })}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  )
}
```

### Example 3: Authentication Pattern

**src/routes/_authenticated.tsx:**
```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/server/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()

    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    return { user }
  },

  component: () => <Outlet />,
})
```

**src/server/auth.ts:**
```tsx
import { createServerFn } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { db } from './db'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const getCurrentUser = createServerFn().handler(async () => {
  const session = await useSession()

  if (!session.data.userId) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.data.userId },
    select: { id: true, email: true, name: true },
  })

  return user
})

export const login = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const user = await db.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash)

    if (!valid) {
      throw new Error('Invalid email or password')
    }

    const session = await useSession()
    await session.update({
      userId: user.id,
      email: user.email,
    })

    return { success: true }
  })

export const logout = createServerFn({ method: 'POST' })
  .handler(async () => {
    const session = await useSession()
    await session.clear()
    return { success: true }
  })
```

**src/routes/login.tsx:**
```tsx
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { login, getCurrentUser } from '@/server/auth'
import { z } from 'zod'

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch('/'),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,

  beforeLoad: async ({ search }) => {
    const user = await getCurrentUser()
    if (user) {
      throw redirect({ to: search.redirect || '/' })
    }
  },

  component: LoginComponent,
})

function LoginComponent() {
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      await router.invalidate()
      router.navigate({ to: redirectTo || '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## Decision Framework

### When to Use TanStack Start

✅ **Choose TanStack Start if:**

- You need **end-to-end type safety** with TypeScript
- You want **fine-grained control** over SSR vs client rendering
- You're building **content-heavy** applications (blogs, docs)
- You value **modern DX** and development speed
- You need **edge deployment** (Cloudflare, Vercel Edge)
- You want **file-based routing** with automatic code splitting
- Your team is comfortable with **TypeScript** and modern React patterns
- You need **progressive enhancement** for forms
- You want to **avoid vendor lock-in** (works with any Vite host)

❌ **Consider alternatives if:**

- You need **proven production stability** (consider Next.js 14+)
- You require **extensive CMS integrations** (Next.js has more)
- You want **zero-config** setup without learning Router concepts
- Your team is **unfamiliar with TypeScript**
- You need **built-in MDX support** (Next.js, Astro better)
- You're building a **simple static site** (consider Astro)
- You need **mature enterprise ecosystem** (Next.js)

### TanStack Start vs Next.js

| Feature | TanStack Start | Next.js |
|---------|---------------|---------|
| Type Safety | Full, end-to-end | Partial (routes not fully typed) |
| File-based Routing | ✅ With type inference | ✅ Basic |
| Server Functions | ✅ Type-safe RPCs | Server Actions (similar) |
| Deployment | Universal (any Vite host) | Optimized for Vercel |
| Edge Runtime | ✅ Excellent | ✅ Excellent |
| Learning Curve | Medium-High | Medium |
| Ecosystem Maturity | Growing | Mature |
| MDX Support | Manual setup | Built-in |
| Code Splitting | Automatic | Automatic |
| Bundle Size | Smaller | Larger |

**Choose Next.js:** Production stability, mature ecosystem, ISR/ISG
**Choose TanStack Start:** Type safety, flexibility, modern DX

### TanStack Start vs Remix

| Feature | TanStack Start | Remix |
|---------|---------------|--------|
| Type Safety | Full TypeScript | TypeScript support |
| Data Loading | Loaders + Server Fns | Loaders + Actions |
| Progressive Enhancement | ✅ Excellent | ✅ Excellent |
| Nested Routing | ✅ File-based | ✅ File-based |
| Server Functions | Type-safe RPCs | Actions |
| Deployment | Universal | Multiple adapters |
| Error Boundaries | Route-level | Route-level |
| Learning Curve | Medium-High | Medium |

**Choose Remix:** Web fundamentals focus, mature patterns
**Choose TanStack Start:** Type safety, server function flexibility

### Total Cost of Adoption

**Learning Investment:**
- **TanStack Router basics:** 4-8 hours
- **TanStack Start specifics:** 2-4 hours
- **Server functions patterns:** 2-3 hours
- **Total:** ~8-15 hours for experienced React developers

**Migration Cost:**
- From **Create React App:** Medium (add SSR, server functions)
- From **Next.js Pages Router:** Medium (different routing paradigm)
- From **Next.js App Router:** Low (similar patterns)
- From **Remix:** Low (similar data loading)

**Maintenance Burden:**
- TypeScript tooling catches errors early
- Automatic route tree generation reduces boilerplate
- Clear separation of server/client code
- **Overall:** Low maintenance with high type safety

### Recommendations by Project Size

**Small Projects (< 10 pages):**
- Consider: Astro (if mostly static), TanStack Start (if interactive)
- Benefit: Fast development, minimal setup

**Medium Projects (10-50 pages):**
- **Recommended:** TanStack Start
- Benefit: Scales well, type safety prevents bugs

**Large Projects (50+ pages, multiple teams):**
- Consider: TanStack Start (type safety) or Next.js (maturity)
- Benefit: Team coordination, strong TypeScript contracts

**Enterprise:**
- Evaluate: Next.js (proven) vs TanStack Start (modern)
- Consider: RC status, support needs, ecosystem requirements

---

## Conclusion

TanStack Start represents the cutting edge of React meta-frameworks, combining the type-safe routing of TanStack Router with full-stack capabilities rivaling Next.js and Remix. While still in RC status, its strong foundations in TanStack Router, excellent TypeScript support, and universal deployment capabilities make it a compelling choice for modern web applications.

**Key Takeaways:**

1. **Type Safety First:** End-to-end TypeScript inference across routes, loaders, and server functions
2. **Flexible Rendering:** Fine-grained control over SSR, streaming, and client-side rendering
3. **Universal Deployment:** Deploy anywhere with Vite support (Cloudflare, Vercel, Netlify, etc.)
4. **Modern DX:** File-based routing, automatic code splitting, hot module replacement
5. **Progressive Enhancement:** Forms work without JavaScript, enhanced when available

**For blog sites specifically**, TanStack Start excels at:
- SEO-optimized server-side rendering
- Type-safe content management
- Edge deployment for global performance
- Flexible data loading patterns
- Rich meta tag management

**Next Steps:**

1. Start with the official `create @tanstack/start` CLI
2. Follow the examples in this guide
3. Deploy to Cloudflare Pages for production
4. Join the TanStack community for support
5. Monitor the project for RC → stable transition

**Resources:**

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [GitHub Repository](https://github.com/TanStack/router)
- [Discord Community](https://tlinz.com/discord)
- [Example Apps](https://github.com/TanStack/router/tree/main/examples/react)

Happy building with TanStack Start! 🚀
