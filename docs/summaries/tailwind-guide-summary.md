# Tailwind CSS Component Guide - Quick Reference

## Overview

Comprehensive best practices for building production-ready components with Tailwind CSS v3+, covering utility-first patterns, variant management, responsive design, dark mode, and complete component implementations.

**Full Guide**: `tailwind-component-guide.md` (2358 lines)

---

## Guide Sections

### 1. Philosophy and Approach (Lines 23-52)
**Location**: Lines 23-52

- Utility-first vs component-first approaches
- The Tailwind hierarchy: Loops → Multi-cursor → Components → Custom CSS
- **When to extract components**: 3+ uses rule
- When to use inline utilities

### 2. Component Styling Patterns (Lines 54-185)
**Location**: Lines 54-185

- Utility-first patterns with examples
- Composition patterns for complex properties (filters, transforms)
- **Mobile-first responsive design** (don't use `sm:` for mobile!)
- Dark mode: 3 approaches (system preference, manual toggle, data attributes)
- FOUC prevention for dark mode
- Responsive design with breakpoints
- Targeting specific breakpoint ranges

### 3. Class Organization and Naming (Lines 187-332)
**Location**: Lines 187-332

- **Prettier plugin setup** for automatic class sorting
- **The `cn()` utility**: `clsx` + `tailwind-merge` combination
- Conditional class application patterns
- Avoiding class name conflicts with `tailwind-merge`
- Dynamic class conflicts and resolution
- Logical grouping: Layout → Spacing → Typography → Colors → Borders → Effects

### 4. Component Structure (Lines 334-807)
**Location**: Lines 334-807

- Base component pattern with TypeScript
- **Variant patterns using CVA** (Class Variance Authority)
- **Tailwind Variants library** (more powerful alternative to CVA)
- Slots for multi-part components
- Compound variants for conditional styling
- Compound slots (apply to multiple slots)
- **Polymorphic components** (as prop pattern)
- **asChild pattern** (Radix style)
- Compound components with context

### 5. Reusable Component Patterns (Lines 810-1400)
**Location**: Lines 810-1400

Complete implementations with TypeScript:

- **Button** (Lines 813-913): All variants, sizes, states, loading, polymorphic
- **Card** (Lines 915-1058): Multi-part system (Header, Title, Description, Content, Footer)
- **Blog Card** (Lines 991-1058): Real-world example with image, author, tags
- **Form Components** (Lines 1060-1218): Input with error states, Label, FormField
- **Layout Components** (Lines 1220-1400): Container, Stack, Grid with variants
- **Typography** (Lines 1402-1472): Heading and Text with responsive variants

### 6. Configuration and Customization (Lines 1474-1787)
**Location**: Lines 1474-1787

- **Tailwind v4** `@theme` directive (Lines 1477-1507)
- **Tailwind v3** config file (Lines 1509-1590)
- Design tokens with CSS variables (HSL for opacity support)
- Custom utility classes using `@layer` (v3) and `@utility` (v4)
- **Plugin development**: Basic and advanced (Lines 1715-1787)

### 7. Advanced Patterns (Lines 1789-1982)
**Location**: Lines 1789-1982

- Animations and transitions (Lines 1792-1909)
- Complex state styling (hover, focus, active, disabled, **group**, **peer**)
- Custom keyframe animations
- Reduced motion support (`motion-safe`, `motion-reduce`)
- **Arbitrary values** (when and how) (Lines 1910-1948)
- CSS variables with arbitrary values
- Container queries (Lines 1950-1982)
- Fluid typography with clamp
- Aspect ratio patterns

### 8. Performance Considerations (Lines 1984-2088)
**Location**: Lines 1984-2088

- JIT mode (built-in v3+, on-demand generation)
- Production optimization strategies
- **Avoiding dynamic class names** (Lines 2019-2052)
- Safelist configuration for dynamic classes
- Animation performance (transform/opacity vs layout props)
- **Bundle size optimization** (78% reduction possible!)
- Tree-shaking best practices

### 9. Complete Code Examples (Lines 2090-2357)
**Location**: Lines 2090-2357

- **Full blog layout** (Lines 2095-2134): Hero, grid, responsive design
- **Full blog post page** (Lines 2137-2246): Meta, tags, author, content
- **Utility helper functions** (Lines 2249-2289): cn, formatDate, readingTime, truncate
- **Summary and Quick Reference** (Lines 2292-2357): Decision trees, file structure

## Quick Start Checklist

### Installation

```bash
# Essential utilities
npm install clsx tailwind-merge

# Variant management (choose one)
npm install class-variance-authority
# OR
npm install tailwind-variants

# Prettier plugin
npm install -D prettier prettier-plugin-tailwindcss

# Optional: Polymorphic components
npm install @radix-ui/react-slot
```

### Essential Files

**lib/utils.ts** - The cn() utility:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**prettier.config.js** - Automatic class sorting:
```javascript
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
};
```

**app/globals.css** - Design tokens:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    /* ... more tokens */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}
```

## Key Concepts

### The cn() Utility

Why use it?
- **clsx**: Handles conditional classes elegantly
- **tailwind-merge**: Resolves conflicting Tailwind classes (last wins)

```tsx
// Without cn - unpredictable
<div className="p-4 p-8">  // Both applied

// With cn - p-8 wins
<div className={cn("p-4", "p-8")}>

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "bg-blue-500" : "bg-gray-500"
)}>
```

### Component Variants with CVA

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
      },
      size: {
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

// Usage in component
<button className={cn(buttonVariants({ variant, size }), className)}>
```

### Responsive Design (Mobile-First)

```tsx
// Base styles = mobile
// Add breakpoints to override
<div className="
  text-center sm:text-left
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6
">
```

### Dark Mode Co-location

```tsx
// Keep light and dark together
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
```

## Decision Tree

**Should I extract a component?**

```
Does pattern appear 3+ times?
├─ No → Use inline utilities
└─ Yes → Does it need variants?
    ├─ No → Simple component extraction
    └─ Yes → Use CVA/Tailwind Variants
        └─ Multi-part? → Use slots pattern
```

**Which variant library?**

- **CVA**: Simpler API, good for most use cases, 100% compatible with shadcn/ui
- **Tailwind Variants**: More features (slots, compound slots), better performance, more complex API

## Best Practices Summary

### DO

- Use mobile-first responsive design
- Co-locate light and dark mode variants
- Use the `cn()` utility for all className props
- Extract components that repeat 3+ times
- Use complete class names (not dynamic interpolation)
- Group classes logically for readability
- Use semantic color tokens (primary, secondary, etc.)
- Include proper TypeScript types
- Support forwardRef for all UI components
- Use Prettier plugin for automatic sorting

### DON'T

- Use `sm:` to target mobile devices
- Create dynamic class names with template literals
- Skip the `cn()` utility when accepting className props
- Overuse arbitrary values (breaks design system)
- Animate width/height (use transform/opacity instead)
- Forget accessibility (focus states, ARIA, keyboard nav)
- Mix inline styles with Tailwind classes
- Use `!important` (manage specificity with structure)

## File Structure

```
src/
├── components/
│   ├── ui/                    # Base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── form-field.tsx
│   │   ├── container.tsx
│   │   ├── stack.tsx
│   │   ├── grid.tsx
│   │   └── typography.tsx
│   ├── blog-card.tsx          # Composed components
│   └── [feature]/             # Feature-specific components
├── lib/
│   └── utils.ts               # cn() and helper functions
├── app/
│   ├── globals.css            # Theme tokens, custom utilities
│   └── [routes]/              # Page components
├── tailwind.config.js         # Tailwind configuration
└── prettier.config.js         # Prettier plugin config
```

## Common Patterns Cheat Sheet

### Button States
```tsx
<button className="
  bg-primary text-primary-foreground
  hover:bg-primary/90
  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  active:scale-95
  disabled:opacity-50 disabled:pointer-events-none
  transition-all
">
```

### Card Hover Effect
```tsx
<div className="
  group
  rounded-lg border bg-card
  shadow-md hover:shadow-lg
  transition-shadow
">
  <h3 className="group-hover:text-primary transition-colors">
    Title
  </h3>
</div>
```

### Input with Error State
```tsx
<input className={cn(
  "rounded-md border px-3 py-2",
  "focus:ring-2 focus:ring-ring",
  error && "border-destructive focus:ring-destructive"
)} />
```

### Responsive Grid
```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-6
">
```

### Loading State
```tsx
<button disabled={loading} className={cn(
  "inline-flex items-center gap-2",
  loading && "cursor-wait opacity-75"
)}>
  {loading && <Spinner />}
  {loading ? "Loading..." : "Submit"}
</button>
```

## Searchable Topics

Need detailed information? Jump to these line ranges in the full guide:

### Core Concepts
- **cn() utility implementation**: Lines 240-293
- **Mobile-first responsive**: Lines 101-128
- **Dark mode setup**: Lines 130-184
- **Class sorting with Prettier**: Lines 189-218

### Component Patterns
- **CVA variant system**: Lines 387-487
- **Tailwind Variants with slots**: Lines 489-610
- **Polymorphic components**: Lines 612-713
- **Compound components**: Lines 715-807

### Complete Components
- **Button (full example)**: Lines 813-913
- **Card system**: Lines 918-989
- **Blog card**: Lines 991-1058
- **Form input with errors**: Lines 1062-1218
- **Layout components**: Lines 1220-1400
- **Typography system**: Lines 1402-1472

### Configuration
- **Tailwind v4 @theme**: Lines 1477-1507
- **Design tokens (CSS vars)**: Lines 1593-1656
- **Custom utilities**: Lines 1669-1714
- **Plugin development**: Lines 1715-1787

### Advanced
- **Animations & transitions**: Lines 1792-1909
- **Group & peer states**: Lines 1823-1860
- **Arbitrary values**: Lines 1910-1948
- **Container queries**: Lines 1950-1960
- **Performance optimization**: Lines 2019-2088

---

## Resources

### Official Documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/docs)
- [Tailwind Variants](https://www.tailwind-variants.org/)
- [shadcn/ui](https://ui.shadcn.com/) - Reference implementation

### Libraries Used
- **clsx**: Conditional class names
- **tailwind-merge**: Conflict resolution
- **class-variance-authority** (CVA): Variant management
- **tailwind-variants**: Advanced variant system with slots
- **prettier-plugin-tailwindcss**: Auto-sorting

---

## Quick Lookup Table

| Topic | Line Range | Key Concept |
|-------|-----------|-------------|
| Philosophy | 23-52 | When to extract components |
| Mobile-first | 101-128 | Don't use `sm:` for mobile |
| Dark mode | 130-184 | 3 approaches + FOUC prevention |
| cn() utility | 240-293 | clsx + tailwind-merge |
| CVA basics | 387-428 | Basic variant system |
| CVA compound | 449-487 | Multiple variant combinations |
| Slots pattern | 536-610 | Multi-part components |
| Button component | 813-913 | Complete implementation |
| Card system | 918-989 | Compound component |
| Blog card | 991-1058 | Real-world example |
| Form input | 1062-1106 | Error states |
| Layout components | 1220-1400 | Container, Stack, Grid |
| v4 @theme | 1477-1507 | Modern configuration |
| Design tokens | 1593-1656 | CSS variables |
| Animations | 1792-1862 | Transitions & keyframes |
| Performance | 2019-2088 | Dynamic classes warning |
| Blog layout | 2095-2134 | Complete page example |

---

## Decision Trees

### Should I Extract a Component?

```
Pattern appears 3+ times?
├─ No → Use inline utilities
└─ Yes → Does it need variants?
    ├─ No → Simple component extraction
    └─ Yes → Use CVA/Tailwind Variants
        └─ Multi-part? → Use slots pattern
```

### Which Variant Library?

```
Complexity level?
├─ Simple variants → CVA (simpler API, shadcn/ui compatible)
└─ Complex/multi-part → Tailwind Variants (slots, compound slots)
```

---

## Pro Tips

- Copy the **Button component** (Lines 813-913) as a starting template
- Use **shadcn/ui** as inspiration (follows these exact patterns)
- Start with **Container, Stack, Grid** for layouts (Lines 1220-1364)
- Build **Card component early** - most reused pattern (Lines 918-989)
- Set up **dark mode from day one** (Lines 130-184)
- Use **CSS variables for theme colors** (enables runtime theming)
- Test components in **both light and dark modes**
- Include **accessibility from the start** (focus states, ARIA)
- Always use the **cn() utility** for className props (Lines 240-293)
- Install **Prettier plugin** for automatic class sorting (Lines 189-218)

---

## When to Use This Guide

- Building Tailwind-based component libraries
- Implementing design systems
- Creating reusable UI components
- Setting up variant management
- Configuring dark mode
- Optimizing bundle size
- Establishing team conventions
- Migrating to Tailwind CSS

---

**Remember**: This summary provides quick navigation and essential patterns. For complete implementations, detailed explanations, and all code examples, reference the specific line ranges in `tailwind-component-guide.md`.

**Last Updated**: November 2025 - Based on Tailwind CSS v3+, with v4 patterns included
