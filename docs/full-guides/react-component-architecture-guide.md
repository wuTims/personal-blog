# Modern React Component Architecture Guide

## Executive Summary

This comprehensive guide provides industry-standard best practices for building scalable React applications in 2025. Modern React architecture emphasizes **feature-based organization**, **type safety with TypeScript**, **composition over configuration**, and **progressive complexity** - starting simple and evolving as your application grows.

### Key Principles
- **Colocation**: Keep related files (components, styles, tests, types) together
- **Feature-Based Structure**: Organize by business domain rather than technical type
- **Component Composition**: Build complex UIs from simple, reusable pieces
- **Type Safety**: Leverage TypeScript for robust component APIs
- **Progressive Enhancement**: Start simple, refactor as complexity demands

### When to Use This Guide
- Building new React applications from scratch
- Refactoring existing codebases for better scalability
- Establishing team conventions and standards
- Implementing complex component patterns
- Architecting blog platforms or content-heavy sites

---

## 1. File & Folder Organization

### 1.1 Progressive Organization Strategy

React projects should evolve through distinct phases as complexity grows:

#### Phase 1: Simple Structure (< 10 components)
Start with minimal organization when prototyping:

```
src/
├── App.tsx
├── index.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Button.tsx
└── styles/
    └── global.css
```

**When to use**: Initial prototypes, proof-of-concepts, small utilities.

#### Phase 2: Technical Separation (10-50 components)
Introduce folders for shared technical concerns:

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── contexts/         # React Context providers
├── services/         # API calls, utilities
├── types/            # TypeScript definitions
├── constants/        # Static values
└── pages/            # Page-level components
```

**When to use**: Growing applications with clear technical boundaries.

#### Phase 3: Feature-Based Structure (50+ components)
Organize by business domain for maximum scalability:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   ├── LoginForm.module.css
│   │   │   │   └── index.ts
│   │   │   └── SignupForm/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSession.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   └── index.ts          # Public API
│   │
│   ├── blog/
│   │   ├── components/
│   │   │   ├── ArticleCard/
│   │   │   ├── ArticleList/
│   │   │   └── TableOfContents/
│   │   ├── hooks/
│   │   │   └── useArticles.ts
│   │   └── index.ts
│   │
│   └── ui/                   # Shared UI components
│       ├── Button/
│       ├── Card/
│       ├── Modal/
│       └── index.ts
│
├── pages/                    # Route components
│   ├── HomePage.tsx
│   ├── BlogPage.tsx
│   └── ArticlePage.tsx
│
├── lib/                      # Third-party integrations
│   ├── api.ts
│   └── analytics.ts
│
└── app/                      # App-level setup
    ├── App.tsx
    ├── routes.tsx
    └── providers.tsx
```

**When to use**: Large applications (50K+ lines), multiple teams, long-term maintenance.

### 1.2 Component Folder Structure

Each component gets its own folder with collocated files:

```
ComponentName/
├── ComponentName.tsx         # Component implementation
├── ComponentName.test.tsx    # Unit tests
├── ComponentName.stories.tsx # Storybook stories (optional)
├── ComponentName.module.css  # Scoped styles
├── useComponentName.ts       # Component-specific hook (optional)
├── ComponentName.types.ts    # Type definitions (if complex)
├── ComponentName.utils.ts    # Helper functions (if needed)
└── index.ts                  # Public API (exports only)
```

**Benefits of this structure:**
- **Discoverability**: Everything related to a component lives together
- **Maintenance**: Easy to find and modify related files
- **Portability**: Move entire folders without breaking imports
- **Deletion**: Remove entire folders when components are obsolete

**Best Practices:**
- Limit nesting to **2-3 levels maximum** within component folders
- Keep component folders focused - if it grows beyond 8-10 files, consider splitting
- Use `index.ts` as a clean public API, hiding implementation details

### 1.3 Index Files (Barrel Exports)

Index files aggregate exports from a directory, providing cleaner imports:

```typescript
// features/blog/components/index.ts
export { ArticleCard } from './ArticleCard/ArticleCard';
export { ArticleList } from './ArticleList/ArticleList';
export { TableOfContents } from './TableOfContents/TableOfContents';
```

**Pros:**
- Clean import paths: `import { ArticleCard } from '@features/blog/components'`
- Centralized public API - clear what's meant to be used externally
- Easier refactoring - internal file moves don't break external imports
- Better for library development

**Cons (2025 Performance Concerns):**
- **Hinders tree-shaking**: Bundlers struggle to eliminate unused exports
- **Increases bundle size**: Can import more than needed
- **Circular dependency risk**: Easy to create import loops
- **Slower development**: Hot reload may reload more modules than necessary
- **IDE performance**: Jump-to-definition lands in index file, not source

**2025 Best Practices:**
1. **Avoid barrel files in application code** - use direct imports instead
2. **Use barrels for library entry points** (package.json main/exports)
3. **If using barrels**, keep them shallow (one level only)
4. **For Next.js**, leverage `optimizePackageImports` in next.config.js
5. **Prefer explicit imports** for better performance and clarity:

```typescript
// ❌ Avoid: Barrel import
import { ArticleCard, ArticleList } from '@features/blog/components';

// ✅ Better: Direct imports
import { ArticleCard } from '@features/blog/components/ArticleCard/ArticleCard';
import { ArticleList } from '@features/blog/components/ArticleList/ArticleList';
```

### 1.4 Monorepo vs Single Repo

#### Single Repository (Standard Approach)

**When to use:**
- Single application or website
- Small to medium teams (< 10 developers)
- Simpler deployment pipeline
- Faster setup and iteration

**Structure:**
```
my-app/
├── src/
├── public/
├── package.json
└── tsconfig.json
```

#### Monorepo Architecture

**When to use:**
- Multiple related applications (web, mobile, admin)
- Shared component library across projects
- Large teams with clear boundaries
- Need for independent versioning and releases

**Popular Tools (2025):**
- **Nx**: Full-featured with powerful caching and build orchestration
- **Turborepo**: Fast, simple, acquired by Vercel
- **pnpm Workspaces**: Lightweight, efficient disk usage
- **Bit**: Component-focused with isolated build/test pipelines

**Typical Structure:**
```
monorepo/
├── apps/
│   ├── web/                  # Main website
│   ├── admin/                # Admin dashboard
│   └── mobile/               # React Native app
│
├── packages/
│   ├── ui/                   # Shared component library
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                # Shared utilities
│   └── types/                # Shared TypeScript types
│
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # Workspace config
└── turbo.json                # Turborepo config
```

**Monorepo Best Practices:**
- **Clear boundaries**: Each package should have a single responsibility
- **Versioning strategy**: Consider independent vs. fixed versioning
- **Build caching**: Leverage tools like Turborepo for fast incremental builds
- **Shared tooling**: Consistent ESLint, Prettier, TypeScript configs
- **Documentation**: Maintain clear READMEs for each package

---

## 2. Component Naming Conventions

### 2.1 Component Names (Code)

**Rule: Always use PascalCase for component names**

```typescript
// ✅ Correct
function UserProfile() {}
const LoginForm = () => {};
export default ArticleCard;

// ❌ Wrong
function userProfile() {}     // lowercase
const login_form = () => {};  // snake_case
```

**Why PascalCase?**
- React treats lowercase names as HTML elements (`<div>`, `<span>`)
- PascalCase prevents naming collisions
- JSX requires PascalCase for custom components
- Universal convention across React ecosystem

### 2.2 File Naming Conventions

**No official standard exists** - teams are divided between two approaches:

#### Option A: PascalCase Files (Recommended)

```
components/
├── UserProfile.tsx
├── LoginForm.tsx
├── ArticleCard.tsx
└── Button.tsx
```

**Pros:**
- File name matches component name exactly
- Easier to search and identify component files
- Clear distinction from utility files
- Better autocomplete in IDEs

**Cons:**
- Can conflict on case-insensitive filesystems (rare edge case)

#### Option B: kebab-case Files

```
components/
├── user-profile.tsx
├── login-form.tsx
├── article-card.tsx
└── button.tsx
```

**Pros:**
- Prevents case-sensitivity issues across filesystems
- Traditional web convention
- Works well with URL routing

**Cons:**
- File name doesn't match component name
- Extra mental mapping required

**2025 Recommendation:**
Use **PascalCase for component files** to match component names. Modern tooling and filesystems handle this well. Reserve kebab-case for non-component files (utilities, hooks).

### 2.3 Folder Naming

**Rule: Use kebab-case for folders**

```
features/
├── user-profile/
├── blog-posts/
└── auth-flow/

components/
├── article-card/
├── table-of-contents/
└── code-snippet/
```

**Why kebab-case?**
- Prevents filesystem conflicts
- Easier to type (no shift key)
- URL-friendly
- Standard web convention

### 2.4 Props Interface Naming

**Pattern 1: ComponentNameProps (Most Common)**

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

**Pattern 2: Inline Type (Simple Components)**

```typescript
function Avatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} />;
}
```

**Pattern 3: Generic Props (Advanced)**

```typescript
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}
```

**Best Practices:**
- Use `Props` suffix consistently (`ButtonProps`, not `IButtonProps` or `ButtonProperties`)
- Export props interfaces for reusability
- Document complex props with JSDoc comments
- Keep props interfaces close to component definition

### 2.5 Event Handler Naming

**Pattern: handle + EventName**

```typescript
function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => { /* ... */ };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const handlePasswordBlur = () => { /* ... */ };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleEmailChange} onBlur={handlePasswordBlur} />
    </form>
  );
}
```

**For Prop Callbacks:**

```typescript
interface ButtonProps {
  onClick?: () => void;      // Props use "on" prefix
  onHover?: () => void;
  onFocus?: () => void;
}

function Button({ onClick, onHover }: ButtonProps) {
  const handleClick = () => {
    // Internal logic
    onClick?.();             // Call prop callback
  };

  return <button onClick={handleClick}>Click</button>;
}
```

**Best Practices:**
- Internal handlers: `handle + EventName` (handleClick, handleChange)
- Prop handlers: `on + EventName` (onClick, onChange)
- Specific over generic: `handleEmailChange` not `handleChange`
- Avoid arrow functions in JSX unless necessary (performance)

### 2.6 Boolean Prop Naming

**Pattern: is/has/should/can + Adjective**

```typescript
interface ComponentProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  hasError?: boolean;
  hasChildren?: boolean;
  shouldAutoFocus?: boolean;
  canSubmit?: boolean;
}
```

**Examples in Context:**

```typescript
// ✅ Good: Clear boolean semantics
<Button isLoading={loading} isDisabled={!canSubmit} />
<Modal isOpen={showModal} hasCloseButton />
<Input hasError={!!error} isRequired />

// ❌ Avoid: Ambiguous or redundant
<Button loading={loading} />          // Could be a number
<Modal open={showModal} />            // open could be a function
<Input error={!!error} />             // error could be the error object
```

**Special Cases:**

```typescript
// For negations, prefer positive phrasing
isEnabled    // ✅ Better than isDisabled (when true is default)
isVisible    // ✅ Better than isHidden
isValid      // ✅ Better than isInvalid

// But sometimes negative is more natural
isDisabled   // ✅ Natural for buttons
isHidden     // ✅ Natural for visibility
```

---

## 3. Component Categories & Organization

### 3.1 UI/Presentational Components

**Purpose**: Pure visual components without business logic or side effects.

**Characteristics:**
- Receive all data via props
- No API calls or side effects
- Highly reusable across features
- Easy to test and document
- Live in shared `ui/` directory

**Examples:**

```typescript
// components/ui/Button/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

```typescript
// components/ui/Card/Card.tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  isElevated?: boolean;
}

export function Card({ children, title, footer, isElevated }: CardProps) {
  return (
    <div className={`card ${isElevated ? 'card-elevated' : ''}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

### 3.2 Feature/Smart Components

**Purpose**: Components with business logic, state management, and data fetching.

**Characteristics:**
- Contain application logic
- Fetch and manage data
- Pass data to presentational components
- Feature-specific (not reusable)
- Live in feature directories

**Examples:**

```typescript
// features/blog/components/ArticleList/ArticleList.tsx
import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../ArticleCard/ArticleCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function ArticleList() {
  const { articles, isLoading, error } = useArticles();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          excerpt={article.excerpt}
          author={article.author}
          publishedAt={article.publishedAt}
        />
      ))}
    </div>
  );
}
```

```typescript
// features/auth/components/LoginForm/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        hasError={!!error}
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />
      <Button type="submit" isLoading={isLoading}>
        Log In
      </Button>
    </form>
  );
}
```

### 3.3 Layout Components

**Purpose**: Define page structure and composition patterns.

**Characteristics:**
- Provide consistent page structure
- Accept content via children prop or slots
- Minimal logic, mostly composition
- Define responsive breakpoints
- Often use compound component pattern

**Examples:**

```typescript
// components/layouts/MainLayout/MainLayout.tsx
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  fullWidth?: boolean;
}

export function MainLayout({ children, sidebar, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout-body">
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <main className={fullWidth ? 'container-fluid' : 'container'}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

```typescript
// components/layouts/ArticleLayout/ArticleLayout.tsx
interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  author: string;
  publishedAt: Date;
  tableOfContents?: React.ReactNode;
}

export function ArticleLayout({
  children,
  title,
  author,
  publishedAt,
  tableOfContents,
}: ArticleLayoutProps) {
  return (
    <article className="article-layout">
      <header className="article-header">
        <h1>{title}</h1>
        <div className="article-meta">
          <span>By {author}</span>
          <time dateTime={publishedAt.toISOString()}>
            {publishedAt.toLocaleDateString()}
          </time>
        </div>
      </header>

      {tableOfContents && (
        <aside className="article-sidebar">
          {tableOfContents}
        </aside>
      )}

      <div className="article-content">
        {children}
      </div>
    </article>
  );
}
```

### 3.4 Page Components

**Purpose**: Route-level components that compose features into pages.

**Characteristics:**
- One per route/URL
- Compose layout + feature components
- Handle page-level data fetching
- Define page metadata (SEO)
- Live in `pages/` or `app/` directory

**Examples:**

```typescript
// pages/BlogPage.tsx
import { MainLayout } from '@/components/layouts/MainLayout';
import { ArticleList } from '@/features/blog/components/ArticleList';
import { BlogSidebar } from '@/features/blog/components/BlogSidebar';
import { Helmet } from 'react-helmet-async';

export function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Blog | My Site</title>
        <meta name="description" content="Read our latest articles" />
      </Helmet>

      <MainLayout sidebar={<BlogSidebar />}>
        <h1>Blog</h1>
        <ArticleList />
      </MainLayout>
    </>
  );
}
```

```typescript
// pages/ArticlePage.tsx
import { useParams } from 'react-router-dom';
import { useArticle } from '@/features/blog/hooks/useArticle';
import { ArticleLayout } from '@/components/layouts/ArticleLayout';
import { TableOfContents } from '@/features/blog/components/TableOfContents';
import { MDXRenderer } from '@/components/MDXRenderer';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, isLoading } = useArticle(slug);

  if (isLoading) return <LoadingSpinner />;
  if (!article) return <NotFound />;

  return (
    <ArticleLayout
      title={article.title}
      author={article.author}
      publishedAt={article.publishedAt}
      tableOfContents={<TableOfContents headings={article.headings} />}
    >
      <MDXRenderer source={article.content} />
    </ArticleLayout>
  );
}
```

### 3.5 Utility Components

**Purpose**: Provide non-visual functionality or logic.

**Examples:**

```typescript
// components/utils/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

```typescript
// components/utils/ClientOnly.tsx
import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <>{fallback}</>;

  return <>{children}</>;
}
```

### 3.6 HOCs and Render Props (Legacy Patterns)

**Status in 2025**: Largely replaced by custom hooks, but still valid for specific use cases.

#### Higher-Order Components (HOCs)

**When to use:**
- Cross-cutting concerns at app level (auth, logging, layout)
- Working with class components
- Third-party library requirements

**Example:**

```typescript
// hocs/withAuth.tsx
import { ComponentType } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;

    return <Component {...props} />;
  };
}

// Usage
export const ProtectedPage = withAuth(DashboardPage);
```

**2025 Alternative (Preferred):**

```typescript
// Use custom hooks instead
export function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return <div>Dashboard content</div>;
}
```

#### Render Props Pattern

**When to use:**
- Need support for both class and function components
- Very specific component-level customization
- Hooks are cumbersome for the use case

**Example:**

```typescript
// components/MouseTracker.tsx
import { useState, useEffect, ReactNode } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => ReactNode;
}

export function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{render(position)}</>;
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse at {x}, {y}</p>} />
```

**2025 Alternative (Preferred):**

```typescript
// Use custom hooks instead
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Usage
function MyComponent() {
  const { x, y } = useMousePosition();
  return <p>Mouse at {x}, {y}</p>;
}
```

**Key Takeaway**: In 2025, **prefer custom hooks** over HOCs and render props for logic reuse. They're simpler, more composable, and easier to understand.

---

## 4. Component Design Patterns

### 4.1 Composition Patterns

#### Pattern 1: Children Prop (Basic Composition)

```typescript
// Simplest form - accept any renderable content
interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content here</p>
</Card>
```

#### Pattern 2: Named Slots (Structured Composition)

```typescript
// More structured - specific slots for content
interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ header, children, footer, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {header}
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// Usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  header={<h2>Confirm Action</h2>}
  footer={
    <>
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
    </>
  }
>
  <p>Are you sure you want to continue?</p>
</Modal>
```

#### Pattern 3: Compound Components

**Most powerful composition pattern** - components that work together through shared context.

```typescript
// components/ui/Tabs/Tabs.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Context for sharing state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab components must be used within Tabs');
  return context;
}

// Parent component manages state
interface TabsProps {
  children: ReactNode;
  defaultTab: string;
}

export function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// Child components consume context
interface TabListProps {
  children: ReactNode;
}

function TabList({ children }: TabListProps) {
  return <div className="tab-list" role="tablist">{children}</div>;
}

interface TabProps {
  id: string;
  children: ReactNode;
}

function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`tab ${isActive ? 'tab-active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
}

function TabPanel({ id, children }: TabPanelProps) {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;

  return <div role="tabpanel" className="tab-panel">{children}</div>;
}

// Attach child components as static properties
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
    <Tabs.Tab id="notifications">Notifications</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel id="profile">
    <UserProfile />
  </Tabs.Panel>
  <Tabs.Panel id="settings">
    <UserSettings />
  </Tabs.Panel>
  <Tabs.Panel id="notifications">
    <Notifications />
  </Tabs.Panel>
</Tabs>
```

**Benefits of Compound Components:**
- Clear, declarative API
- Flexible composition
- Automatic state sharing
- Reduced prop drilling
- Better separation of concerns

#### Pattern 4: Provider Pattern

```typescript
// features/blog/contexts/ArticleContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface ArticleContextValue {
  article: Article;
  updateArticle: (updates: Partial<Article>) => void;
}

const ArticleContext = createContext<ArticleContextValue | undefined>(undefined);

export function useArticle() {
  const context = useContext(ArticleContext);
  if (!context) throw new Error('useArticle must be used within ArticleProvider');
  return context;
}

interface ArticleProviderProps {
  article: Article;
  children: ReactNode;
}

export function ArticleProvider({ article, children }: ArticleProviderProps) {
  const [currentArticle, setCurrentArticle] = useState(article);

  const updateArticle = (updates: Partial<Article>) => {
    setCurrentArticle((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ArticleContext.Provider value={{ article: currentArticle, updateArticle }}>
      {children}
    </ArticleContext.Provider>
  );
}

// Usage
function ArticlePage() {
  const article = useArticleData();

  return (
    <ArticleProvider article={article}>
      <ArticleHeader />
      <ArticleContent />
      <ArticleFooter />
    </ArticleProvider>
  );
}

function ArticleHeader() {
  const { article } = useArticle();
  return <h1>{article.title}</h1>;
}
```

### 4.2 Controlled vs Uncontrolled Components

#### Controlled Components (Recommended)

**When to use:**
- Complex forms with validation
- Need real-time feedback
- Dynamic UI based on input
- Integration with state management

```typescript
// Controlled input - React manages state
function SearchForm() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Real-time suggestions
    if (value.length > 2) {
      fetchSuggestions(value).then(setSuggestions);
    }
  };

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <SuggestionsList suggestions={suggestions} />
      )}
    </>
  );
}
```

#### Uncontrolled Components

**When to use:**
- Simple forms
- Integration with non-React code
- File inputs (always uncontrolled)
- Legacy code migration

```typescript
// Uncontrolled input - DOM manages state
function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;

    submitForm({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" name="name" defaultValue="" />
      <input ref={emailRef} type="email" name="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**2025 Best Practice**: Prefer **controlled components** for predictability and testability. Use uncontrolled only when necessary (file uploads, legacy integration).

### 4.3 Custom Hooks Patterns

Custom hooks are the **preferred pattern for 2025** - replacing most HOC and render prop use cases.

#### Pattern 1: Data Fetching Hook

```typescript
// hooks/useArticles.ts
import { useState, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
}

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, isLoading, error, refetch: fetchArticles };
}
```

#### Pattern 2: Form Management Hook

```typescript
// hooks/useForm.ts
import { useState, ChangeEvent, FormEvent } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
}

// Usage
function LoginForm() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

#### Pattern 3: Local Storage Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

// Usage
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

**Custom Hook Best Practices:**
- Always prefix with `use` (e.g., `useArticles`, not `getArticles`)
- Name based on purpose: `useAuth`, `useForm`, `useArticles`
- Return objects for multiple values, arrays for pairs: `const [value, setValue]`
- Keep hooks focused on single responsibility
- Document complex hooks with JSDoc
- Extract hooks when logic is reused 2+ times

### 4.4 Component Coupling Considerations

**Coupling Spectrum:**

```
Tightly Coupled ←------------------------→ Loosely Coupled
(Inflexible)                              (Flexible)

Hardcoded values → Props → Slots → Compound → Headless
```

#### Level 1: Tightly Coupled (Avoid)

```typescript
// ❌ Bad - hardcoded, inflexible
function UserCard() {
  const user = { name: 'John', email: 'john@example.com' };
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

#### Level 2: Props-Based (Good)

```typescript
// ✅ Better - accepts props
interface UserCardProps {
  name: string;
  email: string;
}

function UserCard({ name, email }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
```

#### Level 3: Composition (Better)

```typescript
// ✅ Best - flexible composition
function UserCard({ children }: { children: React.ReactNode }) {
  return <div className="user-card">{children}</div>;
}

// Usage allows any content
<UserCard>
  <h2>John</h2>
  <p>john@example.com</p>
  <Avatar src="/john.jpg" />
  <Button>Follow</Button>
</UserCard>
```

#### Level 4: Headless Components (Most Flexible)

```typescript
// Logic separated from presentation
function useSelect<T>(options: T[], defaultValue?: T) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  return {
    value,
    isOpen,
    options,
    select: setValue,
    toggle: () => setIsOpen((v) => !v),
    close: () => setIsOpen(false),
  };
}

// Can render however you want
function MySelect() {
  const select = useSelect(['Apple', 'Banana', 'Cherry']);

  return (
    <div>
      <button onClick={select.toggle}>
        {select.value || 'Select fruit'}
      </button>
      {select.isOpen && (
        <ul>
          {select.options.map((option) => (
            <li key={option} onClick={() => select.select(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Decision Guide:**
- **Tightly coupled**: Never acceptable in production code
- **Props-based**: Default for most components
- **Composition**: For layouts and containers
- **Compound components**: For complex, related component groups
- **Headless**: When you need maximum flexibility (design systems, libraries)

---

## 5. TypeScript Patterns

### 5.1 Props Typing Patterns

#### Basic Props Interface

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

function Button({ children, onClick, type = 'button', disabled }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

#### Extending HTML Element Props

```typescript
// Inherit all native button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

function Button({ variant = 'primary', isLoading, children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

// Usage - gets full type safety for native props
<Button
  variant="primary"
  onClick={handleClick}
  disabled={true}
  aria-label="Submit form"
/>
```

#### Polymorphic Components

```typescript
// Component that can render as different elements
type As = React.ElementType;

interface PolymorphicProps<T extends As> {
  as?: T;
  children: React.ReactNode;
}

type Props<T extends As> = PolymorphicProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicProps<T>>;

function Text<T extends As = 'span'>({ as, children, ...rest }: Props<T>) {
  const Component = as || 'span';
  return <Component {...rest}>{children}</Component>;
}

// Usage - type-safe for any element
<Text>Default span</Text>
<Text as="p" style={{ color: 'blue' }}>Paragraph</Text>
<Text as="h1" id="title">Heading</Text>
<Text as={Link} to="/home">Link component</Text>
```

### 5.2 Generic Components

```typescript
// Reusable select component with type-safe options
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
}

function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={getValue(value)}
      onChange={(e) => {
        const selectedValue = options.find(
          (opt) => getValue(opt) === e.target.value
        );
        if (selectedValue) onChange(selectedValue);
      }}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Usage with full type safety
interface User {
  id: string;
  name: string;
}

function UserSelect() {
  const [user, setUser] = useState<User>(users[0]);

  return (
    <Select
      options={users}
      value={user}
      onChange={setUser}
      getLabel={(u) => u.name}      // TypeScript knows u is User
      getValue={(u) => u.id}        // Full autocomplete
    />
  );
}
```

### 5.3 Discriminated Unions for Variants

**Most powerful pattern for type-safe component variants.**

```typescript
// Each variant has specific required props
interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  onClick: () => void;
}

interface LinkButtonProps extends BaseButtonProps {
  variant: 'link';
  href: string;
  target?: '_blank' | '_self';
}

interface LoadingButtonProps extends BaseButtonProps {
  variant: 'loading';
  progress: number;  // Required only for loading
}

// Union of all variants - TypeScript narrows based on variant
type ButtonProps = PrimaryButtonProps | LinkButtonProps | LoadingButtonProps;

function Button(props: ButtonProps) {
  // TypeScript knows which props are available based on variant
  switch (props.variant) {
    case 'primary':
      return (
        <button onClick={props.onClick} disabled={props.disabled}>
          {props.children}
        </button>
      );

    case 'link':
      return (
        <a href={props.href} target={props.target}>
          {props.children}
        </a>
      );

    case 'loading':
      return (
        <button disabled>
          {props.children} ({props.progress}%)
        </button>
      );
  }
}

// Usage - TypeScript enforces correct props for each variant
<Button variant="primary" onClick={handleClick}>Click</Button>
<Button variant="link" href="/about">About</Button>
<Button variant="loading" progress={50}>Loading</Button>

// ❌ TypeScript errors
<Button variant="primary" href="/about">Error</Button>  // href not valid for primary
<Button variant="loading">Error</Button>                // progress required
```

#### Complex Example: Form Field

```typescript
interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

interface CheckboxFieldProps extends BaseFieldProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (checked: boolean) => void;
}

type FieldProps = TextFieldProps | SelectFieldProps | CheckboxFieldProps;

function Field(props: FieldProps) {
  const { label, name, error } = props;

  let input: React.ReactNode;

  if (props.type === 'select') {
    input = (
      <select
        name={name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  } else if (props.type === 'checkbox') {
    input = (
      <input
        type="checkbox"
        name={name}
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
    );
  } else {
    input = (
      <input
        type={props.type}
        name={name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {input}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

**Benefits of Discriminated Unions:**
- Prevents impossible states (e.g., `loading && data` simultaneously)
- TypeScript auto-completion shows only valid props per variant
- Compiler catches mismatched prop combinations
- Self-documenting API

### 5.4 Ref Forwarding Patterns

#### Basic forwardRef (React 18 and earlier)

```typescript
interface InputProps {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div className="input-group">
        <label>{label}</label>
        <input ref={ref} {...rest} />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Usage
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <Input ref={inputRef} label="Email" />;
}
```

#### React 19: Direct Ref Props (Simplified)

```typescript
// React 19 - ref is just a regular prop
interface InputProps extends React.ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
}

function Input({ label, error, ref, ...rest }: InputProps) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input ref={ref} {...rest} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage is identical
<Input ref={inputRef} label="Email" />
```

#### useImperativeHandle Pattern

```typescript
// Expose custom ref handle
interface ModalRef {
  open: () => void;
  close: () => void;
}

interface ModalProps {
  children: React.ReactNode;
}

const Modal = forwardRef<ModalRef, ModalProps>(({ children }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;

  return (
    <div className="modal">
      {children}
      <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  );
});

// Usage
function App() {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <button onClick={() => modalRef.current?.open()}>Open Modal</button>
      <Modal ref={modalRef}>
        <h2>Modal Content</h2>
      </Modal>
    </>
  );
}
```

### 5.5 Children Typing Patterns

#### ReactNode (Most Common)

```typescript
// Accepts anything React can render
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

function Card({ children, title }: CardProps) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

// Can pass text, elements, arrays, null, etc.
<Card>Hello</Card>
<Card><Button>Click</Button></Card>
<Card>{items.map(item => <div key={item.id}>{item.name}</div>)}</Card>
```

#### PropsWithChildren (Helper Type)

```typescript
// React 18+ - PropsWithChildren helper
import { PropsWithChildren } from 'react';

interface CardProps {
  title: string;
}

// Automatically adds children: React.ReactNode
function Card({ children, title }: PropsWithChildren<CardProps>) {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

#### Typed Children (Function as Child)

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, isLoading: boolean, error: Error | null) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [url]);

  return <>{children(data, isLoading, error)}</>;
}

// Usage with full type safety
<DataFetcher<User[]> url="/api/users">
  {(users, isLoading, error) => {
    if (isLoading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return users?.map((user) => <UserCard key={user.id} {...user} />);
  }}
</DataFetcher>
```

#### Strict Children Validation

```typescript
// Only accept specific element types
import { Children, ReactElement } from 'react';

interface TabsProps {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

function Tabs({ children }: TabsProps) {
  const tabs = Children.toArray(children) as ReactElement<TabProps>[];

  return (
    <div>
      {tabs.map((tab, index) => (
        <div key={index}>{tab}</div>
      ))}
    </div>
  );
}

// Only Tab components allowed
<Tabs>
  <Tab id="1">Tab 1</Tab>
  <Tab id="2">Tab 2</Tab>
  {/* <div>Not allowed</div> */}
</Tabs>
```

---

## 6. Blog-Specific Component Patterns

### 6.1 Article/Post Components

#### Article Card (List Item)

```typescript
// features/blog/components/ArticleCard/ArticleCard.tsx
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: Date;
  readingTime?: number;
  tags?: string[];
  coverImage?: string;
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  author,
  publishedAt,
  readingTime,
  tags,
  coverImage,
}: ArticleCardProps) {
  return (
    <article className="article-card">
      {coverImage && (
        <Link to={`/blog/${slug}`} className="article-card-image">
          <img src={coverImage} alt={title} loading="lazy" />
        </Link>
      )}

      <div className="article-card-content">
        <div className="article-card-meta">
          <img src={author.avatar} alt={author.name} className="avatar-sm" />
          <span>{author.name}</span>
          <span>·</span>
          <time dateTime={publishedAt.toISOString()}>
            {formatDate(publishedAt)}
          </time>
          {readingTime && (
            <>
              <span>·</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>

        <Link to={`/blog/${slug}`}>
          <h2 className="article-card-title">{title}</h2>
        </Link>

        <p className="article-card-excerpt">{excerpt}</p>

        {tags && tags.length > 0 && (
          <div className="article-card-tags">
            {tags.map((tag) => (
              <Link key={tag} to={`/blog/tag/${tag}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
```

#### Full Article Component

```typescript
// features/blog/components/Article/Article.tsx
import { MDXRenderer } from '@/components/MDXRenderer';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { AuthorBio } from '../AuthorBio/AuthorBio';
import { ShareButtons } from '../ShareButtons/ShareButtons';
import { RelatedArticles } from '../RelatedArticles/RelatedArticles';

interface ArticleProps {
  frontmatter: {
    title: string;
    author: {
      name: string;
      bio: string;
      avatar: string;
    };
    publishedAt: Date;
    updatedAt?: Date;
    tags: string[];
    readingTime: number;
  };
  content: string;
  headings: Array<{ id: string; text: string; level: number }>;
  relatedArticles?: Array<{ slug: string; title: string }>;
}

export function Article({ frontmatter, content, headings, relatedArticles }: ArticleProps) {
  return (
    <article className="article">
      {/* Article Header */}
      <header className="article-header">
        <h1>{frontmatter.title}</h1>

        <div className="article-meta">
          <img
            src={frontmatter.author.avatar}
            alt={frontmatter.author.name}
            className="avatar"
          />
          <div>
            <div className="author-name">{frontmatter.author.name}</div>
            <div className="article-meta-details">
              <time dateTime={frontmatter.publishedAt.toISOString()}>
                {formatDate(frontmatter.publishedAt)}
              </time>
              <span>·</span>
              <span>{frontmatter.readingTime} min read</span>
              {frontmatter.updatedAt && (
                <>
                  <span>·</span>
                  <span>Updated {formatDate(frontmatter.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="article-tags">
          {frontmatter.tags.map((tag) => (
            <Link key={tag} to={`/blog/tag/${tag}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>

        <ShareButtons title={frontmatter.title} />
      </header>

      {/* Article Body with Sidebar */}
      <div className="article-layout">
        <aside className="article-sidebar">
          <TableOfContents headings={headings} />
        </aside>

        <div className="article-content">
          <MDXRenderer source={content} />
        </div>
      </div>

      {/* Article Footer */}
      <footer className="article-footer">
        <AuthorBio
          name={frontmatter.author.name}
          bio={frontmatter.author.bio}
          avatar={frontmatter.author.avatar}
        />

        {relatedArticles && relatedArticles.length > 0 && (
          <RelatedArticles articles={relatedArticles} />
        )}
      </footer>
    </article>
  );
}
```

### 6.2 Navigation Components

#### Header Component

```typescript
// components/Header/Header.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const navigation = [
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`header-nav-link ${isActive(item.href) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`mobile-menu-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

#### Footer Component

```typescript
// components/Footer/Footer.tsx
import { Link } from 'react-router-dom';

const footerLinks = {
  main: [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/username', icon: TwitterIcon },
    { name: 'GitHub', href: 'https://github.com/username', icon: GitHubIcon },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/username', icon: LinkedInIcon },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Main Links */}
          <div className="footer-section">
            <h3>Navigation</h3>
            <ul>
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link to={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3>Connect</h3>
            <ul className="social-links">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Your Name. All rights reserved.</p>
          <ul>
            {footerLinks.legal.map((link) => (
              <li key={link.name}>
                <Link to={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

#### Sidebar Component

```typescript
// features/blog/components/BlogSidebar/BlogSidebar.tsx
import { useCategories } from '../../hooks/useCategories';
import { usePopularPosts } from '../../hooks/usePopularPosts';

export function BlogSidebar() {
  const { categories } = useCategories();
  const { posts } = usePopularPosts(5);

  return (
    <aside className="blog-sidebar">
      {/* Search */}
      <div className="sidebar-section">
        <h3>Search</h3>
        <SearchInput />
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link to={`/blog/category/${category.slug}`}>
                {category.name} ({category.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Posts */}
      <div className="sidebar-section">
        <h3>Popular Posts</h3>
        <ul className="popular-posts">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`}>
                {post.title}
              </Link>
              <span className="post-views">{post.views} views</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tag Cloud */}
      <div className="sidebar-section">
        <h3>Tags</h3>
        <TagCloud />
      </div>
    </aside>
  );
}
```

#### Pagination Component

```typescript
// components/Pagination/Pagination.tsx
import { Link } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show limited page numbers (e.g., 1 ... 4 5 6 ... 10)
  const getPageNumbers = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(-5)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          to={`${baseUrl}?page=${currentPage - 1}`}
          className="pagination-button"
          aria-label="Previous page"
        >
          Previous
        </Link>
      ) : (
        <span className="pagination-button disabled">Previous</span>
      )}

      {/* Page Numbers */}
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <Link
              key={page}
              to={`${baseUrl}?page=${page}`}
              className={`pagination-number ${
                page === currentPage ? 'active' : ''
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          to={`${baseUrl}?page=${currentPage + 1}`}
          className="pagination-button"
          aria-label="Next page"
        >
          Next
        </Link>
      ) : (
        <span className="pagination-button disabled">Next</span>
      )}
    </nav>
  );
}
```

### 6.3 Content Components (MDX)

#### MDX Component Provider

```typescript
// components/MDXRenderer/MDXRenderer.tsx
import { MDXRemote } from 'next-mdx-remote';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { Image } from './Image';
import { Link } from './Link';

// Custom components for MDX
const components = {
  // Override default HTML elements
  h1: (props: any) => <h1 className="heading-1" {...props} />,
  h2: (props: any) => <h2 className="heading-2" id={slugify(props.children)} {...props} />,
  h3: (props: any) => <h3 className="heading-3" id={slugify(props.children)} {...props} />,
  p: (props: any) => <p className="paragraph" {...props} />,
  a: Link,
  img: Image,
  pre: (props: any) => <div {...props} />,
  code: CodeBlock,

  // Custom components
  Callout,
  CodeSandbox: (props: any) => <CodeSandbox {...props} />,
  Tweet: (props: any) => <Tweet {...props} />,
  YouTube: (props: any) => <YouTube {...props} />,
};

interface MDXRendererProps {
  source: any; // MDX compiled source
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="mdx-content">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
```

#### Code Block Component

```typescript
// components/MDXRenderer/CodeBlock.tsx
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  children: string;
  className?: string;
  showLineNumbers?: boolean;
  title?: string;
}

export function CodeBlock({
  children,
  className,
  showLineNumbers = true,
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace(/language-/, '') || 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      {title && (
        <div className="code-block-header">
          <span className="code-block-title">{title}</span>
          <button
            onClick={handleCopy}
            className="code-block-copy"
            aria-label="Copy code"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      )}

      <Highlight theme={themes.nightOwl} code={children.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span className="line-number">{i + 1}</span>
                  )}
                  <span className="line-content">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
```

#### Callout Component

```typescript
// components/MDXRenderer/Callout.tsx
interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const icons = {
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    success: CheckCircleIcon,
  };

  const Icon = icons[type];

  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-header">
        <Icon className="callout-icon" />
        {title && <span className="callout-title">{title}</span>}
      </div>
      <div className="callout-content">{children}</div>
    </div>
  );
}

// Usage in MDX
/*
<Callout type="warning" title="Important">
  This is a warning message with custom styling.
</Callout>
*/
```

### 6.4 Author/Bio Components

```typescript
// features/blog/components/AuthorBio/AuthorBio.tsx
interface AuthorBioProps {
  name: string;
  bio: string;
  avatar: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export function AuthorBio({ name, bio, avatar, socials }: AuthorBioProps) {
  return (
    <div className="author-bio">
      <img src={avatar} alt={name} className="author-avatar" />

      <div className="author-info">
        <h3 className="author-name">{name}</h3>
        <p className="author-bio-text">{bio}</p>

        {socials && (
          <div className="author-socials">
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
              </a>
            )}
            {socials.website && (
              <a href={socials.website} target="_blank" rel="noopener noreferrer">
                <WebsiteIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 6.5 Tag/Category Components

```typescript
// features/blog/components/TagCloud/TagCloud.tsx
import { Link } from 'react-router-dom';
import { useTags } from '../../hooks/useTags';

export function TagCloud() {
  const { tags } = useTags();

  // Calculate font size based on count
  const getTagSize = (count: number, min: number, max: number) => {
    const minSize = 0.875; // 14px
    const maxSize = 1.5;   // 24px
    const scale = (count - min) / (max - min);
    return minSize + scale * (maxSize - minSize);
  };

  const counts = tags.map((t) => t.count);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  return (
    <div className="tag-cloud">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          to={`/blog/tag/${tag.slug}`}
          className="tag-cloud-item"
          style={{
            fontSize: `${getTagSize(tag.count, minCount, maxCount)}rem`,
          }}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
```

### 6.6 SEO Components

```typescript
// components/SEO/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    tags: string[];
  };
  canonical?: string;
}

export function SEO({
  title,
  description,
  image = '/default-og-image.jpg',
  article,
  canonical,
}: SEOProps) {
  const siteUrl = 'https://yourdomain.com';
  const fullTitle = `${title} | Your Site Name`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const canonicalUrl = canonical || siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Article-specific OG tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          <meta property="article:author" content={article.author} />
          {article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description: description,
            image: fullImage,
            datePublished: article.publishedTime,
            dateModified: article.modifiedTime || article.publishedTime,
            author: {
              '@type': 'Person',
              name: article.author,
            },
            keywords: article.tags.join(', '),
          })}
        </script>
      )}
    </Helmet>
  );
}

// Usage in Article page
<SEO
  title={article.title}
  description={article.excerpt}
  image={article.coverImage}
  article={{
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt?.toISOString(),
    author: article.author.name,
    tags: article.tags,
  }}
  canonical={`https://yourdomain.com/blog/${article.slug}`}
/>
```

### 6.7 Table of Contents Component

```typescript
// features/blog/components/TableOfContents/TableOfContents.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="table-of-contents">
      <h3>On This Page</h3>
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-level-${heading.level} ${
              activeId === heading.id ? 'active' : ''
            }`}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## 7. Code Examples

### 7.1 Complete Feature Structure Example

```
features/
└── blog/
    ├── components/
    │   ├── ArticleCard/
    │   │   ├── ArticleCard.tsx
    │   │   ├── ArticleCard.test.tsx
    │   │   ├── ArticleCard.module.css
    │   │   └── index.ts
    │   │
    │   ├── ArticleList/
    │   │   ├── ArticleList.tsx
    │   │   ├── ArticleList.test.tsx
    │   │   ├── useArticleFilters.ts
    │   │   └── index.ts
    │   │
    │   ├── TableOfContents/
    │   │   ├── TableOfContents.tsx
    │   │   ├── TableOfContents.module.css
    │   │   ├── useActiveHeading.ts
    │   │   └── index.ts
    │   │
    │   └── index.ts              # Barrel export (use sparingly)
    │
    ├── hooks/
    │   ├── useArticles.ts
    │   ├── useArticle.ts
    │   ├── useCategories.ts
    │   └── useTags.ts
    │
    ├── api/
    │   ├── articles.api.ts
    │   └── categories.api.ts
    │
    ├── types/
    │   ├── article.types.ts
    │   └── category.types.ts
    │
    ├── utils/
    │   ├── formatDate.ts
    │   ├── calculateReadingTime.ts
    │   └── slugify.ts
    │
    ├── contexts/
    │   └── BlogContext.tsx
    │
    └── index.ts                  # Public API for feature
```

### 7.2 Type Definition Examples

```typescript
// features/blog/types/article.types.ts

export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number;
  tags: string[];
  category: string;
  coverImage?: string;
}

export interface Article extends ArticleMetadata {
  id: string;
  author: Author;
  content: string;
  headings: Heading[];
  relatedArticles?: string[];
  views?: number;
  likes?: number;
}

export interface Heading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ArticleFilters {
  category?: string;
  tag?: string;
  author?: string;
  sortBy?: 'publishedAt' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedArticles {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}
```

### 7.3 Composition Pattern Example

```typescript
// Full example of flexible Card component using composition

// components/ui/Card/Card.tsx
import { PropsWithChildren } from 'react';

interface CardProps {
  isElevated?: boolean;
  onClick?: () => void;
}

function CardRoot({ children, isElevated, onClick }: PropsWithChildren<CardProps>) {
  return (
    <div
      className={`card ${isElevated ? 'card-elevated' : ''} ${onClick ? 'card-clickable' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }: PropsWithChildren) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: PropsWithChildren) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: PropsWithChildren) {
  return <div className="card-footer">{children}</div>;
}

interface CardImageProps {
  src: string;
  alt: string;
}

function CardImage({ src, alt }: CardImageProps) {
  return (
    <div className="card-image">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

function CardTitle({ children, as: Component = 'h3' }: CardTitleProps) {
  return <Component className="card-title">{children}</Component>;
}

// Attach subcomponents
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Image: CardImage,
  Title: CardTitle,
});

// Usage Examples

// Example 1: Simple card
<Card>
  <Card.Body>
    <p>Simple content</p>
  </Card.Body>
</Card>

// Example 2: Full-featured card
<Card isElevated onClick={() => navigate('/article')}>
  <Card.Image src="/image.jpg" alt="Article" />
  <Card.Header>
    <Card.Title as="h2">Article Title</Card.Title>
  </Card.Header>
  <Card.Body>
    <p>Article excerpt goes here...</p>
  </Card.Body>
  <Card.Footer>
    <span>5 min read</span>
    <span>·</span>
    <time>Jan 15, 2025</time>
  </Card.Footer>
</Card>

// Example 3: Custom composition
<Card>
  <Card.Body>
    <Card.Title as="h4">Quick Stats</Card.Title>
    <StatsList stats={stats} />
  </Card.Body>
  <Card.Footer>
    <Button>View Details</Button>
  </Card.Footer>
</Card>
```

---

## 8. Best Practices Summary

### 8.1 General Principles

1. **Start Simple, Refactor When Needed**
   - Don't over-engineer from day one
   - Add complexity only when justified by actual needs
   - "Premature optimization is the root of all evil"

2. **Colocation Over Separation**
   - Keep related files together
   - Feature folders over type folders for large apps
   - Tests, styles, and components live together

3. **Composition Over Configuration**
   - Build complex UIs from simple pieces
   - Prefer children props over boolean flags
   - Use compound components for related groups

4. **Type Safety First**
   - Use TypeScript for all new projects
   - Leverage discriminated unions for variants
   - Export and reuse type definitions

5. **Progressive Enhancement**
   - Phase 1: Simple structure (< 10 components)
   - Phase 2: Technical separation (10-50 components)
   - Phase 3: Feature-based (50+ components)

### 8.2 Naming Checklist

- [ ] Components: PascalCase (`UserProfile.tsx`)
- [ ] Component files: Match component name exactly
- [ ] Folders: kebab-case (`user-profile/`)
- [ ] Props interfaces: `ComponentNameProps`
- [ ] Event handlers: `handle + EventName` (`handleClick`)
- [ ] Prop callbacks: `on + EventName` (`onClick`)
- [ ] Boolean props: `is/has/should/can + Adjective` (`isLoading`)
- [ ] Custom hooks: `use + Purpose` (`useArticles`)

### 8.3 TypeScript Checklist

- [ ] Use discriminated unions for variant props
- [ ] Extend HTML element props when wrapping native elements
- [ ] Use `React.ReactNode` for children (or `PropsWithChildren`)
- [ ] Leverage generics for reusable components
- [ ] Export complex type definitions for reuse
- [ ] Use `forwardRef` for ref-forwarding (or direct props in React 19)

### 8.4 Architecture Checklist

- [ ] Feature-based structure for apps with 50+ components
- [ ] Collocate tests, styles, types with components
- [ ] Use custom hooks instead of HOCs/render props
- [ ] Avoid barrel exports in application code (2025)
- [ ] Keep component folders flat (max 2-3 levels nesting)
- [ ] Separate UI components from feature components
- [ ] Page components only compose, don't contain logic

### 8.5 Blog-Specific Checklist

- [ ] SEO components with metadata, OG tags, structured data
- [ ] MDX integration with custom components
- [ ] Table of contents with active heading tracking
- [ ] Reading time calculation
- [ ] Responsive navigation (mobile menu)
- [ ] Pagination for article lists
- [ ] Author bio components
- [ ] Tag/category filtering
- [ ] Social sharing buttons
- [ ] Related articles suggestions

---

## 9. Common Anti-Patterns to Avoid

### 9.1 Prop Drilling Hell

```typescript
// ❌ Bad: Passing props through many levels
function App() {
  const user = useUser();
  return <Layout user={user} />;
}

function Layout({ user }: { user: User }) {
  return <Sidebar user={user} />;
}

function Sidebar({ user }: { user: User }) {
  return <UserMenu user={user} />;
}

// ✅ Better: Use Context or composition
const UserContext = createContext<User | null>(null);

function App() {
  const user = useUser();
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  // Direct access, no drilling
}
```

### 9.2 Massive Component Files

```typescript
// ❌ Bad: 500+ line component file
function ArticlePage() {
  // 100 lines of state and logic
  // 200 lines of JSX
  // 200 lines of helper functions
}

// ✅ Better: Extract logic and subcomponents
// hooks/useArticleData.ts
export function useArticleData(slug: string) {
  // Data fetching logic
}

// components/ArticleHeader.tsx
export function ArticleHeader(props) {
  // Header-specific JSX
}

// pages/ArticlePage.tsx
function ArticlePage() {
  const data = useArticleData(slug);
  return (
    <>
      <ArticleHeader {...data} />
      <ArticleContent {...data} />
      <ArticleFooter {...data} />
    </>
  );
}
```

### 9.3 Boolean Prop Explosion

```typescript
// ❌ Bad: Too many boolean flags
interface ButtonProps {
  isPrimary?: boolean;
  isSecondary?: boolean;
  isDanger?: boolean;
  isLarge?: boolean;
  isSmall?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

// ✅ Better: Use variant and size props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
}
```

### 9.4 Inconsistent Naming

```typescript
// ❌ Bad: Mixed naming conventions
interface Props {
  onClick: () => void;     // camelCase
  is_loading: boolean;     // snake_case
  ShowIcon: boolean;       // PascalCase
  disabled: boolean;       // no prefix
}

// ✅ Better: Consistent conventions
interface ButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasIcon: boolean;
  isDisabled: boolean;
}
```

### 9.5 Tight Coupling

```typescript
// ❌ Bad: Hardcoded dependencies
function ArticleCard() {
  const articles = useContext(ArticleContext); // Tightly coupled to context
  const article = articles[0];
  return <div>{article.title}</div>;
}

// ✅ Better: Accept props
interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return <div>{article.title}</div>;
}
```

---

## 10. Migration Guide

### From Type-Based to Feature-Based Structure

#### Step 1: Identify Features

Group components by business domain:
- Authentication (login, signup, password reset)
- Blog (articles, comments, tags)
- User Profile (settings, avatar, bio)

#### Step 2: Create Feature Directories

```bash
mkdir -p src/features/{auth,blog,profile}
mkdir -p src/features/ui  # Shared UI components
```

#### Step 3: Move Components Gradually

Move one feature at a time:

```typescript
// Before
src/components/LoginForm.tsx
src/components/SignupForm.tsx
src/hooks/useAuth.ts

// After
src/features/auth/
├── components/
│   ├── LoginForm/
│   └── SignupForm/
├── hooks/
│   └── useAuth.ts
└── index.ts
```

#### Step 4: Update Imports

Use path aliases for clean imports:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@components/*": ["src/components/*"]
    }
  }
}

// Before
import { useAuth } from '../../../hooks/useAuth';

// After
import { useAuth } from '@features/auth';
```

#### Step 5: Establish Feature Public APIs

```typescript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm/LoginForm';
export { SignupForm } from './components/SignupForm/SignupForm';
export { useAuth } from './hooks/useAuth';
export type { User, AuthState } from './types/auth.types';

// Usage
import { LoginForm, useAuth } from '@features/auth';
```

---

## 11. Tooling Recommendations

### 11.1 Essential Tools (2025)

**Build Tools:**
- **Vite**: Fastest development experience, HMR
- **Next.js**: Full-stack React framework with SSR/SSG
- **Turbopack**: Next-gen bundler (built into Next.js 13+)

**TypeScript:**
- **TypeScript 5.0+**: Latest features, improved inference
- **ts-reset**: Better default types for TypeScript

**Linting & Formatting:**
- **ESLint 9+** with TypeScript support
- **Prettier**: Code formatting
- **eslint-plugin-react-hooks**: Enforce hooks rules
- **eslint-plugin-jsx-a11y**: Accessibility linting

**Testing:**
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: User-centric component tests
- **Playwright**: E2E testing

**Documentation:**
- **Storybook 8**: Component documentation and isolation
- **TypeDoc**: Generate docs from TypeScript comments

### 11.2 VS Code Extensions

- **ESLint**: Real-time linting
- **Prettier**: Auto-formatting
- **Error Lens**: Inline error messages
- **Auto Rename Tag**: Sync HTML/JSX tag names
- **ES7+ React/Redux Snippets**: Productivity shortcuts
- **Pretty TypeScript Errors**: Readable TS errors

### 11.3 Recommended ESLint Config

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

---

## 12. Resources & Further Reading

### Official Documentation
- [React Official Docs](https://react.dev) - Modern React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Comprehensive TypeScript guide
- [Next.js Documentation](https://nextjs.org/docs) - Full-stack React framework

### Architecture & Patterns
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) - Scalable architecture guide
- [Patterns.dev](https://www.patterns.dev/react) - React design patterns
- [Kent C. Dodds Blog](https://kentcdodds.com/blog) - React best practices

### TypeScript Patterns
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) - Comprehensive patterns
- [Total TypeScript](https://www.totaltypescript.com/) - Advanced TypeScript techniques

### Component Libraries for Reference
- [Radix UI](https://www.radix-ui.com/) - Headless component primitives
- [shadcn/ui](https://ui.shadcn.com/) - Composable component examples
- [Material UI](https://mui.com/) - Comprehensive design system

### Blog-Specific Resources
- [Josh W Comeau's Blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog/) - Production blog architecture
- [MDX Documentation](https://mdxjs.com/) - Markdown + JSX
- [Next.js Blog Starter](https://vercel.com/templates/next.js/blog-starter-kit) - Official blog template

---

## Conclusion

Modern React component architecture in 2025 emphasizes:

1. **Progressive complexity** - start simple, evolve as needed
2. **Feature-based organization** - group by domain, not technical type
3. **Type safety** - leverage TypeScript for robust APIs
4. **Composition** - build complex UIs from simple pieces
5. **Custom hooks** - prefer hooks over HOCs and render props
6. **Direct imports** - avoid barrel files for performance
7. **Colocation** - keep related files together

Remember: **There is no one-size-fits-all architecture.** Adapt these patterns to your specific needs, team size, and project complexity. Start with the simplest structure that works, and refactor as your application grows.

The best architecture is one that your team understands, can maintain, and allows you to deliver value quickly without accumulating technical debt.

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Author**: Research-based compilation from industry best practices
**License**: MIT - Free to use and adapt
