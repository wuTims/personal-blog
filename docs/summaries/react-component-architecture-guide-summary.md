# Modern React Component Architecture Guide - Quick Reference

## Overview

Industry-standard best practices for building scalable React applications in 2025, emphasizing **feature-based organization**, **TypeScript**, **composition patterns**, and **progressive complexity**.

**Full Guide**: `react-component-architecture-guide.md` (2000+ lines)

---

## Core Principles (2025)

1. **Colocation**: Keep related files together
2. **Feature-Based Structure**: Organize by business domain, not technical type
3. **Component Composition**: Build complex UIs from simple pieces
4. **Type Safety**: Leverage TypeScript for robust APIs
5. **Progressive Enhancement**: Start simple, refactor as needed
6. **Custom Hooks Over HOCs**: Prefer hooks for logic reuse

---

## Guide Structure & Navigation

### 1. File & Folder Organization (Lines 23-251)

**Progressive Phases**:
- **Phase 1** (< 10 components): Simple flat structure
- **Phase 2** (10-50 components): Technical separation (components/, hooks/, services/)
- **Phase 3** (50+ components): **Feature-based** (RECOMMENDED for scale)

**Feature-Based Structure**:
```
src/
├── features/
│   ├── auth/          # Auth feature
│   ├── blog/          # Blog feature
│   └── ui/            # Shared UI components
├── pages/             # Route components
├── lib/               # Third-party integrations
└── app/               # App-level setup
```

**Component Folder Pattern**:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.module.css
├── useComponentName.ts      # Optional
└── index.ts                 # Public API
```

**⚠️ 2025 Warning on Barrel Exports** (Lines 146-184):
- **Avoid barrel files** in application code (hurts tree-shaking, bundle size, hot reload)
- Use direct imports instead: `import { X } from '@/features/X/X'`
- Only use barrels for library entry points

**Monorepo Considerations** (Lines 186-251):
- When: Multiple apps, shared component library, large teams
- Tools: Nx, Turborepo, pnpm Workspaces

### 2. Component Naming Conventions (Lines 253-468)

**Component Names**: Always **PascalCase**
```typescript
function UserProfile() {}      // ✅
const LoginForm = () => {};    // ✅
function userProfile() {}      // ❌
```

**File Naming** (Lines 276-320):
- **Recommended**: PascalCase files (`UserProfile.tsx`) to match component names
- Alternative: kebab-case (`user-profile.tsx`) - traditional web convention

**Folder Naming**: **kebab-case**
```
features/
├── user-profile/
├── blog-posts/
└── auth-flow/
```

**Props Interface**: `ComponentNameProps`
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}
```

**Event Handlers** (Lines 384-424):
- Internal: `handle + EventName` (`handleClick`, `handleSubmit`)
- Props: `on + EventName` (`onClick`, `onChange`)

**Boolean Props** (Lines 426-468):
- Pattern: `is/has/should/can + Adjective`
- Examples: `isLoading`, `hasError`, `shouldAutoFocus`, `canSubmit`

### 3. Component Categories (Lines 470-947)

#### UI/Presentational Components (Lines 473-535)
- Pure visual, no business logic
- All data via props
- Highly reusable
- Live in `ui/` directory

#### Feature/Smart Components (Lines 537-617)
- Business logic and data fetching
- Pass data to presentational components
- Feature-specific
- Live in feature directories

#### Layout Components (Lines 619-701)
- Define page structure
- Accept content via children/slots
- Minimal logic, composition-focused

#### Page Components (Lines 703-766)
- One per route/URL
- Compose layout + features
- Handle page-level data fetching
- Define SEO metadata

#### Utility Components (Lines 768-829)
- Non-visual functionality
- Examples: ErrorBoundary, ClientOnly

#### HOCs & Render Props (Lines 831-947)
- **Status**: Legacy patterns, replaced by custom hooks
- Only use for specific edge cases
- **Prefer custom hooks** for all new code

### 4. Component Design Patterns (Lines 949-1588)

#### Composition Patterns (Lines 952-1193)

**Pattern 1: Children Prop** (Lines 954-971)
```typescript
function Card({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

**Pattern 2: Named Slots** (Lines 973-1016)
```typescript
interface ModalProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Pattern 3: Compound Components** (Lines 1018-1129) **[POWERFUL]**
- Components working together via shared context
- Example: Tabs with `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`
- Benefits: Clear API, flexible composition, automatic state sharing

**Pattern 4: Provider Pattern** (Lines 1131-1193)
- Share state across component tree without prop drilling

#### Controlled vs Uncontrolled (Lines 1194-1268)
- **Controlled** (recommended): React manages state
- **Uncontrolled**: DOM manages state (use refs)
- **2025 Best Practice**: Prefer controlled for predictability

#### Custom Hooks Patterns (Lines 1269-1477) **[PREFERRED 2025]**

**Pattern 1: Data Fetching** (Lines 1273-1319)
```typescript
function useArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic...

  return { articles, isLoading, error, refetch };
}
```

**Pattern 2: Form Management** (Lines 1321-1424)
**Pattern 3: Local Storage** (Lines 1426-1468)

**Best Practices**:
- Prefix with `use`
- Name based on purpose
- Return objects for multiple values, arrays for pairs
- Single responsibility
- Extract when reused 2+ times

#### Component Coupling (Lines 1478-1588)
```
Tightly Coupled ←→ Loosely Coupled
Hardcoded → Props → Slots → Compound → Headless
```

- **Headless components**: Logic separated from presentation (maximum flexibility)

### 5. TypeScript Patterns (Lines 1590-2000+)

#### Props Typing (Lines 1592-1663)

**Basic**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Extending HTML Props** (Lines 1614-1637):
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}
```

**Polymorphic Components** (Lines 1639-1663):
- Component that can render as different elements
- Type-safe `as` prop

#### Generic Components (Lines 1665-1716)
```typescript
function Select<T>({ options, value, onChange }: SelectProps<T>) {
  // Fully type-safe with any data type
}
```

#### Discriminated Unions (Lines 1717-1870) **[POWERFUL]**
- Type-safe component variants
- Each variant has specific required props
- TypeScript enforces correct prop combinations

```typescript
type ButtonProps =
  | { variant: 'primary'; onClick: () => void }
  | { variant: 'link'; href: string }
  | { variant: 'loading'; progress: number };
```

**Benefits**:
- Prevents impossible states
- Auto-completion shows only valid props
- Compiler catches mismatched combinations

#### Ref Forwarding (Lines 1871-1974)

**React 18**:
```typescript
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...rest }, ref) => {
    return <input ref={ref} {...rest} />;
  }
);
```

**React 19** (simplified):
```typescript
function Input({ label, ref, ...rest }: InputProps) {
  return <input ref={ref} {...rest} />;
}
```

**useImperativeHandle**: Expose custom ref API (Lines 1931-1974)

#### Children Typing (Lines 1976-2000+)
- `React.ReactNode`: Most common, accepts anything React can render
- `React.ReactElement`: Only React elements (no strings/numbers)
- Function as children: Render prop pattern

---

## Quick Start Checklist

### Project Structure Decision Tree

```
Project size?
├─ < 10 components → Simple flat structure
├─ 10-50 components → Technical separation
└─ 50+ components → Feature-based structure
```

### Essential TypeScript Patterns

1. **Always define props interfaces** (`ComponentNameProps`)
2. **Extend HTML props** when wrapping native elements
3. **Use discriminated unions** for variants
4. **Forward refs** for reusable form components
5. **Generic components** for type-safe lists/selects

### Modern React Patterns (2025)

✅ **USE**:
- Custom hooks for logic reuse
- Compound components for related UI groups
- Controlled components for forms
- Feature-based folder structure (50+ components)
- TypeScript discriminated unions for variants
- Direct imports (not barrel files)

❌ **AVOID**:
- HOCs (use custom hooks instead)
- Render props (use custom hooks instead)
- Barrel exports in app code
- Uncontrolled components (except file inputs)
- Prop drilling (use context/compound components)

---

## Common Patterns Cheat Sheet

### Custom Hook
```typescript
function useArticles() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic...

  return { data, isLoading, error, refetch };
}
```

### Compound Component
```typescript
const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

### Discriminated Union
```typescript
type Props =
  | { variant: 'primary'; onClick: () => void }
  | { variant: 'link'; href: string };

function Button(props: Props) {
  if (props.variant === 'primary') {
    // TypeScript knows onClick exists
    return <button onClick={props.onClick} />;
  }
  // TypeScript knows href exists
  return <a href={props.href} />;
}
```

### Extending HTML Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

function Button({ variant, ...rest }: ButtonProps) {
  return <button {...rest} className={`btn-${variant}`} />;
}
```

---

## Searchable Topics

Need detailed information? Search the full guide for:

- **Lines 23-251**: Complete folder organization strategies
- **Lines 146-184**: Barrel exports warning (2025 best practices)
- **Lines 253-468**: All naming conventions
- **Lines 470-947**: Component categories with examples
- **Lines 1018-1129**: Compound components pattern
- **Lines 1269-1477**: Custom hooks patterns
- **Lines 1717-1870**: Discriminated unions (powerful!)
- **Lines 1871-1974**: Ref forwarding patterns
- **Lines 1976-2000+**: Children typing patterns

---

## Decision Guides

### Should I Extract a Component?

```
Is logic reused 2+ times?
├─ No → Keep inline
└─ Yes → Extract
    ├─ Just logic? → Custom hook
    ├─ UI + logic? → Component
    └─ Related UI group? → Compound component
```

### How Should I Type Props?

```
What are you building?
├─ Simple component → Basic interface
├─ Wrapping HTML element → Extend HTML props
├─ Multiple variants → Discriminated union
├─ Type-safe for any data → Generic component
└─ Accepts children → React.ReactNode
```

### How Should I Organize My Project?

```
How many components?
├─ < 10 → Flat structure
├─ 10-50 → Technical folders (components/, hooks/)
└─ 50+ → Feature-based structure (features/auth/, features/blog/)
```

---

## Key Takeaways for 2025

1. **Feature-based structure** scales best for large apps
2. **Custom hooks** replace most HOCs and render props
3. **Avoid barrel exports** in application code
4. **Discriminated unions** provide type-safe variants
5. **Compound components** eliminate prop drilling
6. **Controlled components** are preferred for forms
7. **TypeScript** is essential for robust component APIs
8. **Colocation** improves maintainability

---

## When to Use This Guide

- Starting a new React project
- Refactoring existing codebase for scalability
- Establishing team conventions
- Building component libraries
- Implementing complex component patterns
- Migrating to TypeScript
- Setting up feature-based architecture
- Choosing between HOCs, render props, and hooks

---

**Note**: The full guide contains extensive code examples, real-world implementations, and detailed explanations of every pattern. Use this summary to quickly locate topics, then reference the specific line ranges in `react-component-architecture-guide.md` for complete implementation details.

**Full guide covers**: State management, performance optimization, testing strategies, accessibility patterns, and advanced TypeScript techniques (continued beyond line 2000).
