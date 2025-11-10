# Tailwind CSS Component Guide

**Comprehensive Best Practices for Component Styling, Structure, and Architecture**

Version: 1.0.0 (Tailwind CSS v3+)
Last Updated: November 2025

---

## Table of Contents

1. [Philosophy and Approach](#philosophy-and-approach)
2. [Component Styling Patterns](#component-styling-patterns)
3. [Class Organization and Naming](#class-organization-and-naming)
4. [Component Structure](#component-structure)
5. [Reusable Component Patterns](#reusable-component-patterns)
6. [Configuration and Customization](#configuration-and-customization)
7. [Advanced Patterns](#advanced-patterns)
8. [Performance Considerations](#performance-considerations)
9. [Code Examples](#code-examples)

---

## Philosophy and Approach

### Core Principles

Tailwind CSS follows a **utility-first approach** where you compose designs directly in your markup using utility classes. This guide balances that philosophy with practical component extraction for maintainable, scalable applications.

### The Tailwind Hierarchy of Approaches

When handling repeated styles, follow this priority order:

1. **Use Loops** - When markup repeats, use templating loops. The class list is written once, so there's no duplication.
2. **Multi-Cursor Editing** - For localized duplication in a single file, use editor features.
3. **Create Components** - For patterns across multiple files, extract into framework components.
4. **Custom CSS** - Last resort only, using `@layer components` with theme variables.

### When to Extract Components

Extract components when:
- The same pattern appears in 3+ places
- The pattern includes both structure and styling
- You need variant management (sizes, colors, states)
- The component will be part of a design system

Use inline utilities when:
- The style is used 1-2 times
- Rapid prototyping or one-off designs
- The combination is self-documenting
- Maximum flexibility is needed

---

## Component Styling Patterns

### Utility-First vs Component-First

**Utility-First (Recommended Default)**

```tsx
// Good: Self-contained, easy to modify
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
  <img className="h-12 w-12 rounded-full" src={avatar} alt="" />
  <div>
    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    <p className="text-sm text-gray-600">{role}</p>
  </div>
</div>
```

**Component Extraction**

```tsx
// Extract when pattern repeats 3+ times
function UserCard({ avatar, name, role }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
      <img className="h-12 w-12 rounded-full" src={avatar} alt="" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
}
```

### Composition Patterns

Tailwind uses CSS variable composition for complex properties. Multiple effects stack via variables:

```html
<!-- Filters compose automatically -->
<img class="blur-sm grayscale hover:blur-none hover:grayscale-0 transition-all" />

<!-- Transforms stack -->
<div class="scale-110 rotate-45 translate-x-4"></div>
```

### Responsive Design Patterns

**Mobile-First Approach**

```tsx
// Base styles apply to mobile, override at larger breakpoints
<div className="
  text-center          /* Mobile: center text */
  sm:text-left         /* 640px+: left align */
  grid grid-cols-1     /* Mobile: single column */
  md:grid-cols-2       /* 768px+: two columns */
  lg:grid-cols-3       /* 1024px+: three columns */
  gap-4                /* Consistent gap at all sizes */
  md:gap-6             /* Larger gap at medium+ */
">
```

**Important**: Don't use `sm:` to target mobile. Use unprefixed classes for mobile and override at larger breakpoints.

**Targeting Ranges**

```tsx
// Only apply between md and xl
<div className="md:max-xl:flex">

// Apply only at md breakpoint
<div className="md:max-lg:flex">
```

### Dark Mode Patterns

**Three Approaches**

1. **System Preference (Default)**

```tsx
// Automatically uses OS preference
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

2. **Manual Toggle with Class**

```css
/* In your CSS */
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
// Add/remove 'dark' class on html element
<div className="bg-white dark:bg-gray-800">
```

3. **Data Attribute Approach**

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

**Best Practices**

```tsx
// Co-locate light and dark variants
<Card className="
  bg-white dark:bg-gray-900
  border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-gray-100
">

// Use semantic color tokens
<Button className="bg-primary text-primary-foreground dark:bg-primary-dark">
```

**FOUC Prevention**

```html
<head>
  <script>
    // Run before page render
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  </script>
</head>
```

---

## Class Organization and Naming

### Class Ordering with Prettier

**Install and Configure**

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

```javascript
// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  // When using multiple plugins, tailwindcss should be last
};
```

**Ordering Rules**

Prettier automatically sorts classes following Tailwind's recommendations:

1. Base layer classes first
2. Components layer classes second
3. Utilities layer classes last
4. Modifiers grouped together (hover, focus, etc.)
5. Responsive modifiers at the end (smallest to largest)

**Manual Grouping Pattern**

When reading code, group logically:

```tsx
// Layout
// Spacing
// Typography
// Colors/Backgrounds
// Borders
// Effects
<div className="
  flex items-center justify-between
  px-6 py-4 gap-4
  text-lg font-semibold
  text-gray-900 bg-white
  border border-gray-200 rounded-lg
  shadow-md hover:shadow-lg
">
```

### Conditional Class Application

**The cn Utility**

The standard pattern combines `clsx` and `tailwind-merge`:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why This Combination?**

- **clsx**: Handles conditional classes elegantly
- **tailwind-merge**: Resolves conflicting Tailwind classes (last wins)

**Usage Patterns**

```tsx
import { cn } from "@/lib/utils";

// Object syntax
<div className={cn({
  "bg-blue-500": isPrimary,
  "bg-gray-500": !isPrimary,
  "opacity-50": isDisabled,
})}>

// Ternary operators
<button className={cn(
  "px-4 py-2 rounded",
  isActive ? "bg-blue-600" : "bg-gray-200",
  isLoading && "cursor-wait opacity-75"
)}>

// Array syntax
<div className={cn([
  "flex items-center",
  isVertical && "flex-col",
  className, // Accept className prop
])}>

// Merging with base classes (tailwind-merge handles conflicts)
function Button({ className, variant }) {
  return (
    <button className={cn(
      "px-4 py-2",        // Base
      "bg-blue-500",      // Default background
      className           // Override - if className has bg-red-500, it wins
    )}>
  );
}
```

### Avoiding Class Name Conflicts

**The Problem**

```tsx
// Without tailwind-merge
<div className="p-4 p-8">  // Both applied, unpredictable result
```

**The Solution**

```tsx
// With tailwind-merge
cn("p-4", "p-8")  // Result: "p-8" (last wins)
```

**Dynamic Class Conflicts**

```tsx
// Base component with default padding
function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-6 shadow-md",  // p-6 is default
        className  // If className has p-8, it replaces p-6
      )}
      {...props}
    />
  );
}

// Usage - p-8 wins over p-6
<Card className="p-8">
```

---

## Component Structure

### Base Component Pattern

**Anatomy of a Well-Structured Component**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg bg-white",

          // Variants
          {
            "shadow-sm border border-gray-200": variant === "outlined",
            "shadow-md": variant === "default",
            "shadow-lg": variant === "elevated",
          },

          // Padding variants
          {
            "p-0": padding === "none",
            "p-4": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",
          },

          // Accept className overrides
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
```

### Variant Patterns with CVA

**Class Variance Authority (CVA)**

CVA provides type-safe variant management without CSS-in-JS:

```bash
npm install class-variance-authority
```

**Basic Usage**

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Compound Variants**

Apply styles when multiple variants are active simultaneously:

```typescript
const buttonVariants = cva("base-styles", {
  variants: {
    variant: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
    size: {
      sm: "text-sm",
      lg: "text-lg",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
  compoundVariants: [
    {
      // When primary AND large
      variant: "primary",
      size: "lg",
      class: "uppercase font-bold",
    },
    {
      // When either primary or secondary AND disabled
      variant: ["primary", "secondary"],
      disabled: true,
      class: "cursor-not-allowed",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "sm",
    disabled: false,
  },
});
```

### Tailwind Variants Library

**More Powerful Alternative to CVA**

```bash
npm install tailwind-variants
```

**Basic Usage**

```typescript
import { tv } from "tailwind-variants";

const button = tv({
  base: "font-medium bg-blue-500 text-white rounded-lg active:opacity-80",
  variants: {
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-purple-500 text-white",
      success: "bg-green-500 text-white",
    },
    size: {
      sm: "text-sm px-3 py-1",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed pointer-events-none",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      size: "lg",
      class: "shadow-lg",
    },
  ],
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

// Usage
<button className={button({ color: "secondary", size: "lg" })}>
```

**Slots for Multi-Part Components**

```typescript
import { tv } from "tailwind-variants";

const card = tv({
  slots: {
    base: "rounded-lg border bg-white shadow-md",
    header: "flex items-center justify-between border-b p-4",
    body: "p-4",
    footer: "border-t p-4 bg-gray-50",
  },
  variants: {
    variant: {
      default: {
        base: "border-gray-200",
      },
      success: {
        base: "border-green-500",
        header: "bg-green-50",
      },
      danger: {
        base: "border-red-500",
        header: "bg-red-50",
      },
    },
  },
});

// Usage
function Card({ variant, children }) {
  const { base, header, body, footer } = card({ variant });

  return (
    <div className={base()}>
      <div className={header()}>Header</div>
      <div className={body()}>{children}</div>
      <div className={footer()}>Footer</div>
    </div>
  );
}
```

**Compound Slots**

Apply classes to multiple slots at once:

```typescript
const pagination = tv({
  slots: {
    base: "flex gap-2",
    item: "rounded-md px-3 py-1",
    prev: "rounded-md px-3 py-1",
    next: "rounded-md px-3 py-1",
  },
  variants: {
    size: {
      sm: {},
      lg: {},
    },
  },
  compoundSlots: [
    {
      slots: ["item", "prev", "next"],
      size: "sm",
      class: "text-sm",
    },
    {
      slots: ["item", "prev", "next"],
      size: "lg",
      class: "text-lg",
    },
  ],
});
```

### Polymorphic Components (as Prop Pattern)

**Basic Implementation**

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// Text component that can render as any heading or paragraph
export type TextProps<C extends React.ElementType = "p"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small";
    }
  >;

export const Text = React.forwardRef(
  <C extends React.ElementType = "p">(
    { as, variant, className, children, ...props }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "p";

    return (
      <Component
        ref={ref}
        className={cn(
          {
            "text-4xl font-bold": variant === "h1",
            "text-3xl font-bold": variant === "h2",
            "text-2xl font-semibold": variant === "h3",
            "text-xl font-semibold": variant === "h4",
            "text-base": variant === "body",
            "text-sm": variant === "small",
          },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

// Usage
<Text as="h1" variant="h1">Heading</Text>
<Text as="h2" variant="h2">Subheading</Text>
<Text as="p" variant="body">Body text</Text>
<Text as="a" href="#" variant="body">Link with body styling</Text>
```

**Alternative: asChild Pattern (Radix Style)**

```typescript
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn("px-4 py-2 rounded bg-blue-500 text-white", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

// Usage
<Button>Regular button</Button>
<Button asChild>
  <a href="/link">Link styled as button</a>
</Button>
```

### Compound Components

**Pattern for Related Components**

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

// Context for shared state
const CardContext = React.createContext<{
  variant?: "default" | "outlined";
} | null>(null);

// Root component
export function Card({
  variant = "default",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outlined" }) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={cn(
          "rounded-lg bg-white",
          variant === "outlined" && "border border-gray-200",
          variant === "default" && "shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// Sub-components
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

// Usage
<Card variant="outlined">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## Reusable Component Patterns

### Button Component

**Full Implementation with All Patterns**

```typescript
// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Usage Examples**

```tsx
// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon">
  <IconTrash />
</Button>

// As child (polymorphic)
<Button asChild>
  <a href="/link">Link styled as button</a>
</Button>

// Loading state
<Button loading disabled>
  Saving...
</Button>

// With icon
<Button>
  <IconPlus />
  Add Item
</Button>
```

### Card Component

**Complete Card System**

```typescript
// components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**Blog Card Example**

```tsx
// components/blog-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  date: Date;
  image?: string;
  slug: string;
  tags?: string[];
}

export function BlogCard({ title, description, author, date, image, slug, tags }: BlogCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src={author.avatar} alt={author.name} className="h-6 w-6 rounded-full" />
          <span>{author.name}</span>
          <span>•</span>
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary">
          <a href={`/blog/${slug}`}>{title}</a>
        </CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      {tags && tags.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter>
        <Button variant="ghost" asChild className="w-full">
          <a href={`/blog/${slug}`}>Read more →</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Form Input Components

**Input Component**

```typescript
// components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
```

**Label Component**

```typescript
// components/ui/label.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export { Label };
```

**Form Field Component**

```typescript
// components/ui/form-field.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  description,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

**Usage**

```tsx
<form className="space-y-6">
  <FormField
    label="Email"
    htmlFor="email"
    required
    error={errors.email}
    description="We'll never share your email"
  >
    <Input
      id="email"
      type="email"
      placeholder="you@example.com"
      error={errors.email}
    />
  </FormField>

  <FormField
    label="Password"
    htmlFor="password"
    required
    error={errors.password}
  >
    <Input
      id="password"
      type="password"
      error={errors.password}
    />
  </FormField>

  <Button type="submit" className="w-full">Sign In</Button>
</form>
```

### Layout Components

**Container**

```typescript
// components/ui/container.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("mx-auto w-full px-4", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      xl: "max-w-[1400px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  );
}
```

**Stack**

```typescript
// components/ui/stack.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    spacing: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
  },
  defaultVariants: {
    direction: "column",
    spacing: 4,
  },
});

interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export function Stack({ className, direction, spacing, align, justify, ...props }: StackProps) {
  return (
    <div
      className={cn(stackVariants({ direction, spacing, align, justify }), className)}
      {...props}
    />
  );
}
```

**Grid**

```typescript
// components/ui/grid.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      0: "gap-0",
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    },
    responsive: {
      true: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 4,
  },
});

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export function Grid({ className, cols, gap, responsive, ...props }: GridProps) {
  return (
    <div
      className={cn(gridVariants({ cols, gap, responsive }), className)}
      {...props}
    />
  );
}
```

**Usage**

```tsx
// Container
<Container size="lg">
  <h1>Page Title</h1>
</Container>

// Stack
<Stack direction="column" spacing={6}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Stack>

// Horizontal stack
<Stack direction="row" spacing={4} align="center" justify="between">
  <h2>Title</h2>
  <Button>Action</Button>
</Stack>

// Grid
<Grid cols={3} gap={6}>
  <BlogCard {...post1} />
  <BlogCard {...post2} />
  <BlogCard {...post3} />
</Grid>

// Responsive grid
<Grid responsive gap={8}>
  {posts.map(post => <BlogCard key={post.id} {...post} />)}
</Grid>
```

### Typography Components

```typescript
// components/ui/typography.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-bold tracking-tight", {
  variants: {
    level: {
      1: "text-4xl sm:text-5xl lg:text-6xl",
      2: "text-3xl sm:text-4xl lg:text-5xl",
      3: "text-2xl sm:text-3xl lg:text-4xl",
      4: "text-xl sm:text-2xl lg:text-3xl",
      5: "text-lg sm:text-xl",
      6: "text-base sm:text-lg",
    },
  },
  defaultVariants: {
    level: 1,
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ as, level, className, ...props }: HeadingProps) {
  const Comp = as || `h${level || 1}` as "h1";

  return (
    <Comp
      className={cn(headingVariants({ level: level || (parseInt(as?.[1] || "1") as any) }), className)}
      {...props}
    />
  );
}

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-7",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export function Text({ as: Comp = "p", variant, className, ...props }: TextProps) {
  return (
    <Comp
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}
```

---

## Configuration and Customization

### Extending the Tailwind Theme

**Basic Configuration (Tailwind v4 with @theme)**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Custom Colors */
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-900: #1e3a8a;

  /* Custom Spacing */
  --spacing-18: 4.5rem;
  --spacing-72: 18rem;

  /* Custom Breakpoints */
  --breakpoint-3xl: 1920px;

  /* Custom Fonts */
  --font-display: "Inter", sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Custom Shadows */
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.5);
}
```

**Legacy Configuration (Tailwind v3)**

```javascript
// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Design Tokens with CSS Variables

**Color System**

```css
/* app/globals.css */
@layer base {
  :root {
    /* Semantic color tokens */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
```

**Using Design Tokens**

```tsx
// Automatically uses CSS variables
<div className="bg-background text-foreground">
  <Button className="bg-primary text-primary-foreground">Primary</Button>
  <Button className="bg-secondary text-secondary-foreground">Secondary</Button>
</div>
```

### Custom Utility Classes

**Using @layer Directive (v3)**

```css
/* app/globals.css */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .bg-grid {
    background-image: linear-gradient(to right, #80808012 1px, transparent 1px),
                      linear-gradient(to bottom, #80808012 1px, transparent 1px);
    background-size: 24px 24px;
  }
}
```

**Using @utility Directive (v4)**

```css
@utility text-balance {
  text-wrap: balance;
}

@utility content-auto {
  content-visibility: auto;
}

/* With variants */
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

### Plugin Development

**Basic Plugin Structure**

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function({ addUtilities, addComponents, theme, e }) {
      // Add utilities
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.content-hidden': {
          'content-visibility': 'hidden',
        },
        '.content-visible': {
          'content-visibility': 'visible',
        },
      });

      // Add components
      addComponents({
        '.btn': {
          padding: theme('spacing.4'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.semibold'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.blue.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.600'),
          },
        },
      });
    }),
  ],
};
```

**Advanced Plugin with Variants**

```javascript
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      // Dynamic utilities with theme values
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }, {
      // Define theme values
      theme: {
        textShadow: {
          sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
          DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
          lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
        },
      },
    }),
  ],
};
```

---

## Advanced Patterns

### Animation and Transition Patterns

**Basic Transitions**

```tsx
// Hover effects
<div className="transition-colors hover:bg-gray-100">
<div className="transition-transform hover:scale-105">
<div className="transition-all hover:shadow-lg hover:-translate-y-1">

// With duration and easing
<div className="transition-all duration-300 ease-in-out hover:scale-105">

// Multiple properties
<div className="transition-[background-color,transform] duration-200">
```

**Complex State Styling**

```tsx
// Combine multiple states
<button className="
  bg-blue-500 text-white
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  active:bg-blue-700
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  transition-all duration-150
">
```

**Group Hover**

```tsx
// Parent-child hover interactions
<div className="group rounded-lg border p-6 hover:shadow-lg">
  <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
    Title
  </h3>
  <p className="text-gray-600 group-hover:text-gray-900">
    Description
  </p>
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    View More
  </button>
</div>
```

**Peer State**

```tsx
// Sibling interactions
<div>
  <input
    type="checkbox"
    className="peer sr-only"
    id="toggle"
  />
  <label
    htmlFor="toggle"
    className="
      block h-8 w-14 rounded-full bg-gray-300
      peer-checked:bg-blue-500
      peer-focus:ring-2 peer-focus:ring-blue-300
      transition-colors
    "
  />
</div>
```

**Custom Animations**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
};
```

```tsx
// Usage
<div className="animate-shimmer bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:1000px_100%]">
  Loading...
</div>

<div className="animate-fade-in">
  Fades in smoothly
</div>
```

**Reduced Motion Support**

```tsx
// Respect user preferences
<div className="
  transition-transform
  motion-safe:hover:scale-105
  motion-reduce:transition-none
">
```

### Arbitrary Values

**When to Use**

Use arbitrary values for one-off customizations outside your theme:

```tsx
// Specific measurements
<div className="top-[117px] lg:top-[344px]">

// Custom colors
<div className="bg-[#bada55] text-[22px]">

// With modifiers
<div className="hover:bg-[#ff0000] md:text-[18px]">
```

**CSS Variables with Arbitrary Values**

```tsx
// Shorthand (var() added automatically)
<div className="bg-[--my-color]">

// With fallback
<div className="bg-[var(--my-color,#000)]">

// Type hints for ambiguous cases
<div className="text-[length:--my-var]">
<div className="text-[color:--my-var]">
```

**Arbitrary Properties**

```tsx
// For properties not in Tailwind
<div className="[mask-image:linear-gradient(to_bottom,black,transparent)]">
<div className="[text-wrap:balance]">
```

### Complex Responsive Patterns

**Container Queries**

```tsx
// Style based on parent size, not viewport
<div className="@container">
  <div className="@lg:grid @lg:grid-cols-2">
    Content adapts to container size
  </div>
</div>
```

**Responsive Typography**

```tsx
// Fluid typography with clamp
<h1 className="text-[clamp(2rem,5vw,4rem)]">
  Scales smoothly
</h1>
```

**Aspect Ratio Patterns**

```tsx
// Common aspect ratios
<div className="aspect-video">16:9</div>
<div className="aspect-square">1:1</div>
<div className="aspect-[4/3]">4:3</div>

// Responsive aspect ratios
<div className="aspect-square md:aspect-video">
```

---

## Performance Considerations

### JIT Mode (Built-in v3+)

Tailwind v3+ uses JIT by default, which:
- Generates styles on-demand as you write classes
- Eliminates the need for PurgeCSS
- Reduces build times significantly
- Supports arbitrary values natively

### Production Optimization

**Automatic in v3+**

```javascript
// Next.js or Vite - automatic optimization
// No additional config needed
```

**Manual Purge Config (if needed)**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
```

### Best Practices for Performance

**1. Avoid Dynamic Class Names**

```tsx
// Bad - JIT can't detect these
<div className={`text-${color}-500`}>

// Good - Use complete class names
<div className={color === 'blue' ? 'text-blue-500' : 'text-red-500'}>

// Better - Use variants
const variants = {
  blue: 'text-blue-500',
  red: 'text-red-500',
};
<div className={variants[color]}>
```

**2. Use Safelist for Dynamic Classes**

```javascript
// tailwind.config.js
module.exports = {
  safelist: [
    'text-blue-500',
    'text-red-500',
    'text-green-500',
    {
      pattern: /bg-(red|green|blue)-(100|500|900)/,
      variants: ['hover', 'focus'],
    },
  ],
};
```

**3. Optimize Animations**

```tsx
// Prefer transform and opacity (GPU accelerated)
<div className="transition-transform hover:scale-105">  // Good

// Avoid layout-triggering properties
<div className="transition-all hover:w-64">  // Slower
```

**4. Use will-change Sparingly**

```tsx
// Only for animations that need it
<div className="will-change-transform hover:scale-150">
```

### Bundle Size Optimization

**Measured Impact (Real-world)**

Following these optimizations can reduce CSS bundle size by 78%:

1. JIT mode enabled (default in v3+)
2. Proper content paths configured
3. Unused plugins removed
4. Custom CSS minimized

**Tree-Shaking with Modules**

```javascript
// Import only what you need
import { Button } from '@/components/ui/button';  // Good
import * as UI from '@/components/ui';  // Avoid if possible
```

---

## Code Examples

### Complete Blog Layout

```tsx
// app/blog/page.tsx
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts } from "@/lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-16 lg:py-24">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Thoughts, ideas, and insights on web development, design, and technology.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts Grid */}
      <section className="py-12 lg:py-16">
        <Container size="lg">
          <Grid responsive gap={8}>
            {posts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </Grid>
        </Container>
      </section>
    </div>
  );
}
```

### Complete Blog Post Layout

```tsx
// app/blog/[slug]/page.tsx
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return (
    <article className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b py-16 lg:py-24">
        <Container size="md">
          <div className="space-y-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.date.toISOString()}>
                {formatDate(post.date)}
              </time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Description */}
            <Text variant="lead">
              {post.description}
            </Text>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 border-t pt-6">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="mx-auto max-w-5xl px-4 py-8">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-video w-full rounded-xl object-cover shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <Container size="md" className="py-12">
        <div
          className="prose prose-gray max-w-none dark:prose-invert
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-pre:bg-muted prose-pre:border
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Container>

      {/* Footer */}
      <footer className="border-t py-12">
        <Container size="md">
          <div className="flex flex-col items-center gap-6 text-center">
            <Text variant="large">
              Thanks for reading!
            </Text>
            <div className="flex gap-4">
              <Button asChild>
                <a href="/blog">← Back to Blog</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#top">↑ Back to Top</a>
              </Button>
            </div>
          </div>
        </Container>
      </footer>
    </article>
  );
}
```

### Utility Helper Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}
```

---

## Summary and Quick Reference

### Decision Tree: When to Extract Components

```
Does the pattern appear 3+ times?
├─ No → Use inline utilities
└─ Yes → Does it need variants?
    ├─ No → Extract simple component
    └─ Yes → Use CVA or Tailwind Variants
        └─ Multi-part component? → Use slots
```

### Essential Utilities Setup

```bash
# Required packages
npm install clsx tailwind-merge

# For variants
npm install class-variance-authority
# OR
npm install tailwind-variants

# For polymorphic components (optional)
npm install @radix-ui/react-slot

# Prettier plugin
npm install -D prettier prettier-plugin-tailwindcss
```

### File Structure

```
src/
├── components/
│   ├── ui/              # Base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── container.tsx
│   │   └── ...
│   └── blog-card.tsx    # Composed components
├── lib/
│   └── utils.ts         # cn() and helpers
└── app/
    └── globals.css      # Theme and custom utilities
```

### Key Principles

1. **Mobile-first**: Start with base styles, override at larger breakpoints
2. **Utility-first**: Prefer inline utilities over custom CSS
3. **Component extraction**: Extract when patterns repeat 3+ times
4. **Variants management**: Use CVA or Tailwind Variants for complex components
5. **Class merging**: Always use `cn()` utility for className props
6. **Performance**: Use complete class names, avoid dynamic interpolation
7. **Accessibility**: Include focus states, ARIA attributes, keyboard navigation
8. **Dark mode**: Co-locate dark variants with light variants

---

**End of Guide**

This guide provides comprehensive patterns for building maintainable, scalable applications with Tailwind CSS. For specific use cases or advanced scenarios, consult the official Tailwind CSS documentation and the respective library documentation (CVA, Tailwind Variants, etc.).
