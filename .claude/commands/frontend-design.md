---
description: Design frontend components following the ChromaDB neobrutalist style guide
argument-hint: [component-description]
---

# Frontend Design Task

**User Request:** $ARGUMENTS

---

## Project Design System

This project uses a **ChromaDB-inspired neobrutalist design system**. All new components MUST adhere to this established aesthetic. Do NOT introduce generic or conflicting styles.

---

## Required Style Guide Research

Before implementing any new component, you MUST use these tools to understand the design system:

### 1. Read Project Style Guides

```
Read docs/summaries/chromadb-style-guide-summary.md   # Quick reference
Read docs/full-guides/chromadb-style-guide.md         # Complete details (2500+ lines)
Read src/globals.css                                   # CSS variables and theme
```

### 2. Study Existing Component Implementations

```
Read src/components/ui/button.tsx    # Button patterns with CVA
Read src/components/ui/card.tsx      # Card variants and Mac-style shadows
Read src/components/ui/heading.tsx   # Typography hierarchy
Read src/components/ui/text.tsx      # Text component patterns
```

### 3. Use DeepWiki MCP for External Libraries

When implementing features that use external libraries, query DeepWiki for implementation patterns:

```
# For animations and motion
mcp__deepwiki__ask_question(repoName: "motion/motion", question: "How do I implement staggered reveal animations?")
mcp__deepwiki__ask_question(repoName: "motion/motion", question: "What are the best practices for page transitions?")

# For React Router / TanStack Router
mcp__deepwiki__ask_question(repoName: "TanStack/router", question: "How do I implement view transitions?")

# For form handling
mcp__deepwiki__ask_question(repoName: "react-hook-form/react-hook-form", question: "How do I integrate with Zod validation?")

# For state management
mcp__deepwiki__ask_question(repoName: "TanStack/query", question: "How do I implement optimistic updates?")
```

---

## ChromaDB Neobrutalist Design System

### Core Design Philosophy

- **Brutalist/Neo-brutalist aesthetic**: Sharp edges, bold borders, flat offset shadows
- **Mac-Style Cards**: Distinctive 6px/8px offset shadows creating depth
- **Typography-First**: Elegant serif headings (Playfair Display) + readable sans-serif body (Inter)
- **High Contrast**: Black text on white/off-white, with accent colors on hover only
- **Mobile-First Responsive**: All styles start mobile, scale up with breakpoints

### Typography (MUST USE)

```css
/* Font Families - DO NOT change */
--font-family-sans: 'Inter', ui-sans-serif, ...;      /* Body text */
--font-family-serif: 'Playfair Display', ui-serif, ...;  /* Headings */
--font-family-mono: 'IBM Plex Mono', ui-monospace, ...;  /* Code, technical labels */
```

**Usage Rules:**

- `h1, h2, h3`: Use `font-family-serif` (Playfair Display)
- Body text, buttons, nav: Use `font-family-sans` (Inter)
- Code blocks, technical labels: Use `font-family-mono` (IBM Plex Mono)

### Color Palette (MUST USE)

```css
/* Light Mode */
--color-background: #fafafa;     /* Page background */
--color-card: #ffffff;           /* Card backgrounds */
--color-foreground: #0a0a0a;     /* Primary text */
--color-muted: #737373;          /* Secondary text */
--color-border: #e5e5e5;         /* Subtle borders */
Border emphasis: #000;            /* Strong borders on cards */

/* Dark Mode */
--color-background: #0a0a0a;
--color-card: #1a1a1a;
--color-foreground: #fafafa;
--color-muted: #a3a3a3;
--color-border: #262626;
Border emphasis: #fff;

/* Accent Colors (hover states ONLY) */
--color-emerald: #00855d / #10b981 (dark);   /* Terminal green */
--color-coral: #ff6b35 / #fb923c (dark);     /* Airplane orange */
--color-lavender: #cba6f7 / #d8b4fe (dark);  /* Blocks purple */
--color-sky: #4a81de / #60a5fa (dark);       /* Brush blue */
```

### Mac-Style Shadows (SIGNATURE ELEMENT)

```css
/* Light Mode */
--shadow-mac: 6px 6px 0 0 #f0f0f0;
--shadow-mac-hover: 8px 8px 0 0 #ccc;

/* Dark Mode */
--shadow-mac: 6px 6px 0 0 #262626;
--shadow-mac-hover: 8px 8px 0 0 #404040;

/* Usage */
.mac-shadow { box-shadow: var(--shadow-mac); transition: all 0.3s ease; }
.mac-shadow:hover { box-shadow: var(--shadow-mac-hover); transform: translateY(-2px); }
.mac-shadow-static { box-shadow: var(--shadow-mac); } /* No hover effect */
```

### Border Radius (MINIMAL)

```css
--radius-sm: 2px;   /* Cards - brutalist sharp edges */
--radius-md: 6px;   /* Buttons */
--radius-lg: 8px;   /* Logo, images */
```

### Spacing (Base Unit: 0.25rem / 4px)

```css
/* Common values */
Card padding: 1.25rem (20px)
Button padding: 0.5rem 1rem (8px 16px) standard, 0.75rem 1.5rem (12px 24px) large
Section gaps: 4rem, 5rem
Grid gaps: 1.5rem (cards), 20px (features)
```

### Animation & Transitions

```css
/* Universal transition */
transition: all 0.3s ease;

/* Hover lift effect */
transform: translateY(-2px);

/* Shadow increase on hover */
6px → 8px offset
```

---

## Component Patterns

### Card Variants (use existing Card component)

```tsx
// Interactive card - has hover effect, NO buttons inside
<Card variant="emphasisHover">
  {/* Content only */}
</Card>

// Static emphasis - Mac-style shadow, CAN contain buttons
<Card variant="emphasis">
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Default - subtle border, CAN contain buttons
<Card variant="default">
  {/* Content with optional buttons */}
</Card>
```

**RULE: Cards should either be interactive OR contain buttons, never both.**

### Button Variants (use existing Button component)

```tsx
<Button variant="primary">Primary Action</Button>   // Dark bg, light text
<Button variant="secondary">Secondary</Button>      // Light bg, dark text
<Button size="lg">Large Button</Button>             // Hero CTAs
```

### Mobile-First Responsive Patterns

```tsx
// Grid: 1 → 2 → 4 columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"

// Flex: Column → Row
className="flex flex-col md:flex-row gap-4 md:gap-8"

// Typography scaling
className="text-sm sm:text-base md:text-lg"

// Spacing scaling
className="p-4 sm:p-6 md:p-8"
className="mb-3 sm:mb-4 md:mb-6"
```

---

## What to AVOID

### DO NOT USE

- Soft gradients or glassmorphism effects
- Rounded corners > 8px (keep it brutalist)
- Drop shadows (use only flat offset Mac-style shadows)
- Purple gradients on white backgrounds
- Overused fonts (Roboto, Arial, system fonts)
- Opacity-based hover effects on buttons (use background-color changes)
- Competing hover effects (card hover + button inside)

### DO NOT INTRODUCE

- New color variables (use existing palette)
- New font families (stick to Inter, Playfair Display, IBM Plex Mono)
- New shadow styles (use mac-shadow utilities)
- New border radius values (use existing 2px/6px/8px)

---

## Implementation Checklist

Before implementing any new component:

1. [ ] Read the style guide summary: `docs/summaries/chromadb-style-guide-summary.md`
2. [ ] Check for similar existing components in `src/components/ui/`
3. [ ] Use CSS variables from `src/globals.css`
4. [ ] Apply mac-shadow utilities for emphasis cards
5. [ ] Follow mobile-first responsive patterns
6. [ ] Test in both light and dark modes
7. [ ] Ensure WCAG AA contrast compliance
8. [ ] Use CVA (class-variance-authority) for variant props

For external library integrations, use DeepWiki MCP to get implementation patterns that can be adapted to match our neobrutalist aesthetic.