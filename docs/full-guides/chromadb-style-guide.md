# ChromaDB Website Style Guide

## 1. Overview

The ChromaDB website employs a modern, minimalist design aesthetic that combines elegant serif typography with clean, functional interface elements. The design philosophy centers around:

- **Mobile-First Responsive Design**: Built with Tailwind's mobile-first methodology, ensuring optimal experience on all devices starting from mobile
- **Clarity and Readability**: High contrast ratios with predominantly black text on white/off-white backgrounds
- **Mac-Style Card Design**: Cards feature distinctive offset shadows (brutalist/neo-brutalist style) that create depth and visual interest
- **Progressive Enhancement**: Subtle hover states and transitions that enhance interactivity without overwhelming the user
- **Typography-First Approach**: Large, elegant serif headings paired with readable sans-serif body text
- **Technical Sophistication**: Monospace fonts and code styling that appeal to the developer audience

### Design Philosophy
- **Mobile-first by default** - All components start with mobile design and scale up progressively
- Minimalist and functional with just enough personality
- Focus on content hierarchy and scannability
- Subtle color accents on interaction (hover states)
- Professional yet approachable tone
- Responsive text centering and spacing that adapts to screen size

---

## 2. Typography

### Font Families

The site uses a three-tier font system with carefully selected fallbacks:

```css
/* Primary Display Font - Headings */
--font-playfair-display: "Playfair Display", "Playfair Display Fallback", Georgia, serif;

/* Primary Sans-Serif - Body Text */
--font-inter: "Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Monospace - Code & Technical Labels */
--font-ibm-plex-mono: "IBM Plex Mono", "IBM Plex Mono Fallback", "Courier New", monospace;
```

**Usage Guidelines:**
- **Playfair Display**: Main headings (h1, h2), section titles. Conveys elegance and authority
- **Inter**: All body text, navigation, buttons, paragraphs. Provides excellent readability
- **IBM Plex Mono**: Code blocks, technical labels (uppercase section headers), terminal output

### Font Weights

```css
--font-weight-light: 300;     /* Subtle emphasis, rarely used */
--font-weight-normal: 400;    /* Default body text, display headings */
--font-weight-medium: 500;    /* Buttons, navigation links */
--font-weight-semibold: 600;  /* Card headings, emphasis text */
--font-weight-bold: 700;      /* Strong emphasis (rarely used) */
```

### Font Sizes & Line Heights

The type scale follows a modular approach with paired line heights for optimal readability:

```css
/* Extra Small - Small labels */
--text-xs: 0.75rem (12px);
--text-xs--line-height: 1rem (16px);

/* Small - Secondary text, code */
--text-sm: 0.875rem (14px);
--text-sm--line-height: 1.25rem (20px);

/* Base - Default body text */
--text-base: 1rem (16px);
--text-base--line-height: 1.5rem (24px);

/* Large - Emphasized paragraphs */
--text-lg: 1.125rem (18px);
--text-lg--line-height: 1.75rem (28px);

/* Extra Large - Small headings */
--text-xl: 1.25rem (20px);
--text-xl--line-height: 1.75rem (28px);

/* 2X Large - Medium headings */
--text-2xl: 1.5rem (24px);
--text-2xl--line-height: 2rem (32px);

/* 3X Large - Section headings (h2) */
--text-3xl: 1.875rem (30px);
--text-3xl--line-height: 2.25rem (36px);

/* 4X Large */
--text-4xl: 2.25rem (36px);
--text-4xl--line-height: 2.5rem (40px);

/* 5X Large - Hero headings (h1) */
--text-5xl: 3rem (48px);
--text-5xl--line-height: 1 (tight);
```

### Line Height System

```css
--leading-none: 1;         /* Tight headings */
--leading-tight: 1.25;     /* Display headings */
--leading-snug: 1.375;     /* Compact layouts */
--leading-normal: 1.5;     /* Default body text */
--leading-relaxed: 1.625;  /* Comfortable reading */
--leading-loose: 2;        /* Extra spacious */
```

### Typography Usage Patterns

**Hero Section:**
```css
h1 {
    font-size: 3.5rem (56px);  /* Custom size, larger than text-5xl */
    line-height: 1.2;
    font-weight: 400;           /* Light weight for elegance */
    font-family: 'Playfair Display', serif;
    margin-bottom: 2rem;
}
```

**Hero Subtitle:**
```css
font-size: 1.125rem (18px);
line-height: 1.75;
max-width: 900px;
```

**Section Headings (h2):**
```css
font-size: var(--text-3xl);      /* 1.875rem / 30px */
font-weight: var(--font-weight-normal);  /* 400 */
font-family: var(--font-playfair-display);
```

**Card Headings (h3 in features):**
```css
font-size: 1rem (16px);
font-weight: 600;
margin-bottom: 0.75rem;
```

**Technical Labels (h3 in feature boxes):**
```css
font-family: var(--font-ibm-plex-mono);
font-size: var(--text-sm);
font-weight: var(--font-weight-semibold);
letter-spacing: 0.05em;
text-transform: uppercase;
```

**Font Smoothing:**
```css
body, .antialiased {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```
This ensures crisp, readable text across all platforms.

---

## 3. Colors

### Primary Color Palette

**Base Colors:**
```css
/* Backgrounds */
--background: #fff;              /* Pure white for cards */
--foreground: #0a0a0a;          /* Almost black for text */
Body background: #fafafa;        /* Off-white for page background */

/* Borders */
--border: #e5e5e5;              /* Light gray for subtle borders */
Black borders: #000;             /* High contrast for emphasis */

/* Text Colors */
Primary text: #0a0a0a;          /* Default text */
Secondary text: #737373;         /* Muted text, comments */
```

**Semantic Colors:**
```css
/* Primary Actions */
--primary: #171717;              /* Dark gray/black */
--primary-foreground: #fafafa;   /* Off-white text on dark bg */

/* Secondary Actions */
--secondary: #f5f5f5;            /* Light gray */
--secondary-foreground: #171717; /* Dark text on light bg */

/* Muted/Subtle */
--muted: #f5f5f5;
--muted-foreground: #737373;

/* Destructive/Error */
--destructive: #ef4444;
--destructive-foreground: #fafafa;
```

### Accent Colors

The site uses theme-specific accent colors that appear on hover states:

```css
/* Terminal/Green Theme */
Terminal green: #00855d;
Usage: Terminal icon card hover border and text

/* Airplane/Orange Theme */
Airplane orange: #ff6b35;
Usage: Speed/latency icon card hover

/* Blocks/Purple Theme */
Blocks purple: #cba6f7;
Usage: Cost/efficiency icon card hover

/* Brush/Blue Theme */
Brush blue: #4a81de;
Usage: Operations icon card hover
```

### Code Block Colors (Catppuccino Mocha Theme)

```css
/* Background & Foreground */
--catppuccino-mocha-bg: #1e1e2e;     /* Dark background */
--catppuccino-mocha-fg: #f8f8f2;     /* Light text */

/* Syntax Highlighting */
--catppuccino-mocha-comment: #6c7086;    /* Comments */
--catppuccino-mocha-string: #a6e3a1;     /* Strings */
--catppuccino-mocha-operator: #89dceb;   /* Operators */
--catppuccino-mocha-keyword: #cba6f7;    /* Keywords */
--catppuccino-mocha-function: #89b4fa;   /* Functions */
--catppuccino-mocha-variable: #ffb7b7;   /* Variables */
```

### Light Code Block Colors

Used in feature grid code blocks:
```css
Background: #F8F8F8;          /* Very light gray */
Text: #0a0a0a;                /* Dark text */
Prompt: #737373;              /* Gray for prompts */
Comment: #737373;             /* Gray for comments */
```

### Extended Color System (from styles.css)

The styles.css file includes a comprehensive OKLCH color palette for potential future use:

```css
/* Example colors (full palette in file) */
--color-red-500: oklch(63.7% .237 25.331);
--color-orange-600: oklch(64.6% .222 41.116);
--color-amber-500: oklch(76.9% .188 70.08);
--color-green-500: oklch(72.3% .219 149.579);
--color-blue-500: oklch(62.3% .214 259.815);
```

### Chart Colors
```css
--chart-1: #e76e50;  /* Coral red */
--chart-2: #2a9d90;  /* Teal */
--chart-3: #274754;  /* Dark blue-gray */
--chart-4: #e8c468;  /* Golden yellow */
--chart-5: #f4a462;  /* Warm orange */
```

### Color Usage Guidelines

- **High Contrast**: Primary text (#0a0a0a) on light backgrounds (#fff, #fafafa)
- **Borders**: Use #e5e5e5 for subtle separation, #000 for emphasis/structure
- **Hover States**: Introduce subtle color on borders and text while maintaining readability
- **Code Blocks**: Dark background (#1e1e2e) with Catppuccino Mocha syntax colors for visual appeal

---

## 4. Spacing

The spacing system is built on a base unit with a multiplier pattern:

```css
/* Base Unit */
--spacing: 0.25rem;  /* 4px */

/* Usage Pattern */
calc(var(--spacing) * 2)   /* 8px */
calc(var(--spacing) * 3)   /* 12px */
calc(var(--spacing) * 4)   /* 16px */
calc(var(--spacing) * 5)   /* 20px */
calc(var(--spacing) * 6)   /* 24px */
calc(var(--spacing) * 8)   /* 32px */
```

### Common Spacing Values

**Padding:**
```css
/* Navigation */
padding: 1rem 3rem;  /* 16px top/bottom, 48px left/right */

/* Cards - Feature Cards */
padding: 1.25rem;    /* 20px all sides */

/* Cards - Feature Boxes */
padding-inline: calc(var(--spacing) * 5);   /* 20px horizontal */
padding-top: calc(var(--spacing) * 3);      /* 12px */
padding-bottom: calc(var(--spacing) * 2);   /* 8px */

/* Buttons */
padding: 0.5rem 1rem;       /* Standard: 8px 16px */
padding: 0.75rem 1.5rem;    /* Large: 12px 24px */
padding: 0.2rem 1rem;       /* Compact: 3.2px 16px */

/* Code Blocks */
padding: calc(var(--spacing) * 5);  /* 20px */
```

**Margins:**
```css
/* Hero Section */
margin-bottom: 2rem;   /* After h1 */

/* Section Spacing */
margin: 4rem auto;     /* Between major sections */
margin: 5rem auto;     /* Larger section gaps */

/* Element Spacing */
margin-bottom: 0.75rem;  /* Card headings */
margin-bottom: 1rem;     /* Paragraphs */
margin-bottom: 2rem;     /* Section headings */
```

**Gaps (Flexbox/Grid):**
```css
/* Navigation */
gap: 2rem;           /* Between nav sections */
gap: 0.5rem;         /* Within button groups */

/* Feature Cards Grid */
gap: 1.5rem;         /* Between cards */

/* Features Grid */
gap: calc(var(--spacing) * 5);  /* 20px */

/* Deploy Grid */
gap: calc(var(--spacing) * 5);  /* 20px */

/* Link Lists */
gap: 0.5rem;         /* Tight list spacing */
gap: 1rem;           /* Looser list spacing */
```

### Layout Containers

```css
/* Max Width Container */
max-width: 1200px;
margin: 0 auto;
padding: 0 3rem;     /* Horizontal padding */

/* Section Vertical Padding */
padding: 5rem 3rem 3rem;  /* Hero */
padding: 0 3rem;          /* Standard sections */
padding: 0 3rem 5rem;     /* FAQs (bottom padding) */
```

---

## 5. Shadows

The site uses a distinctive "Mac-style" shadow system with offset shadows that create a brutalist/neo-brutalist aesthetic.

### Shadow System

**Default State (Mac-style cards):**
```css
box-shadow: 6px 6px 0 0 #f0f0f0;
```
- Creates an offset, flat shadow effect
- Light gray (#f0f0f0) for subtle depth

**Hover State:**
```css
box-shadow: 8px 8px 0 0 #ccc;
transform: translateY(-2px);
```
- Shadow increases to 8px offset
- Darker gray (#ccc) for increased contrast
- Card lifts up 2px for enhanced interactivity

### Tailwind Shadow Variables

From styles.css:
```css
--tw-shadow: 0 0 #0000;  /* Default */

/* On hover (mac-style-hover) */
--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
```

### Button Shadows

**Secondary Buttons:**
```css
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
background: linear-gradient(to bottom, #ffffff, #f9f9f9);
border: 1px solid rgba(23, 23, 22, 0.4);
```

**Video Content Buttons:**
```css
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

### Shadow Application Patterns

**Feature Cards:**
```html
<div class="feature-card mac-style mac-style-default-hover">
```
- Base mac-style provides transition
- mac-style-default-hover adds shadow without pointer cursor

**Interactive Cards:**
```html
<div class="feature-box large mac-style mac-style-hover">
```
- mac-style-hover for interactive lifting effect

**Color-Themed Hover:**
```html
<div class="feature-card mac-style terminal-border-hover">
```
- Combines mac-style shadows with colored border on hover

---

## 6. Opacity

### Opacity Values

**Text & Elements:**
```css
/* Subtle decorative elements */
opacity: 0.5;   /* Progress bar in code block */

/* Diagrams & illustrations */
opacity: 0.4;   /* SVG diagrams for subtle presence */
opacity: 0.6;   /* Cloud illustration (slightly more visible) */

/* Transparent fills */
fill-opacity="0";  /* SVG rectangles used for spacing */
```

**RGBA/Color Mix Opacity:**
```css
/* Border colors */
border: 1px solid rgba(23, 23, 22, 0.4);  /* 40% opacity */

/* Shadow colors */
rgb(0 0 0 / 0.1)   /* 10% black for subtle shadows */
rgb(0 0 0 / 0.05)  /* 5% black for very subtle shadows */
```

### Hover Opacity Changes

**Buttons:**
```css
.btn:hover {
    opacity: 0.9;  /* 10% reduction for feedback */
}
```

**Video Content Buttons (Exception):**
```css
.video-content .btn:hover {
    opacity: 1;  /* Maintains full opacity */
    background: linear-gradient(to bottom, #f3f4f6, #f3f4f6);
}
```

### Tailwind Opacity Properties

From styles.css:
```css
@property --tw-shadow-alpha {
    initial-value: 100%;
}
@property --tw-drop-shadow-alpha {
    initial-value: 100%;
}
@property --tw-inset-shadow-alpha {
    initial-value: 100%;
}
```

---

## 7. Animations and Transitions

### Transition Properties

**Universal Transition (Mac-style):**
```css
.mac-style {
    transition: all .3s ease;
}
```
- Applies to all properties
- 300ms duration
- Ease timing function (smooth acceleration/deceleration)

**SVG Icon Transitions:**
```css
.mac-style svg {
    transition: color .3s;
    color: #888;  /* Default gray */
}
```

**Highlight Text Transitions:**
```css
.terminal-highlight,
.airplane-highlight,
.blocks-highlight,
.brush-highlight {
    transition: color .3s;
    color: inherit;
}
```

### Transform Animations

**Hover Lift Effect:**
```css
.mac-style-hover:hover {
    transform: translateY(-2px);
}
```

**Tailwind Transform Properties:**
```css
transform: translate(var(--tw-translate-x), var(--tw-translate-y))
           rotate(var(--tw-rotate))
           skewX(var(--tw-skew-x))
           skewY(var(--tw-skew-y))
           scaleX(var(--tw-scale-x))
           scaleY(var(--tw-scale-y));
```

### Hover State Behaviors

**1. Default Mac-style Hover (no cursor change):**
```css
.mac-style-default-hover:hover {
    transform: translateY(-2px);
    box-shadow: 8px 8px 0 0 #ccc;
    cursor: default;  /* Prevents pointer cursor */
}
```

**2. Interactive Mac-style Hover:**
```css
.mac-style-hover:hover {
    transform: translateY(-2px);
    box-shadow: 8px 8px 0 0 #ccc;
    /* cursor: pointer is implied */
}
```

**3. Themed Border Hover:**
```css
/* Terminal Green */
.terminal-border-hover:hover {
    border: 1px solid #00855d;
    box-shadow: 8px 8px 0 0 #ccc;
}
.terminal-border-hover:hover .terminal-svg,
.terminal-border-hover:hover .terminal-highlight {
    color: #00855d;
}

/* Airplane Orange */
.airplane-border-hover:hover {
    border: 1px solid #ff6b35;
    box-shadow: 8px 8px 0 0 #ccc;
}
.airplane-border-hover:hover .airplane-svg,
.airplane-border-hover:hover .airplane-highlight {
    color: #ff6b35;
}

/* Blocks Purple */
.block-border-hover:hover {
    border: 1px solid #cba6f7;
    box-shadow: 8px 8px 0 0 #ccc;
}
.block-border-hover:hover .blocks-svg,
.block-border-hover:hover .blocks-highlight {
    color: #cba6f7;
}

/* Brush Blue */
.brush-border-hover:hover {
    border: 1px solid #4a81de;
    box-shadow: 8px 8px 0 0 #ccc;
}
.brush-border-hover:hover .brush-svg,
.brush-border-hover:hover .brush-highlight {
    color: #4a81de;
}
```

**4. Button Hover:**
```css
.btn:hover {
    opacity: 0.9;
}

/* Video button variant */
.video-content .btn:hover {
    background: linear-gradient(to bottom, #f3f4f6, #f3f4f6);
    opacity: 1;
}
```

### Animation Custom Properties (from styles.css)

```css
@property --tw-animation-delay {
    initial-value: 0s;
}
@property --tw-animation-direction {
    initial-value: normal;
}
@property --tw-animation-iteration-count {
    initial-value: 1;
}
@property --tw-animation-fill-mode {
    initial-value: none;
}
```

### Timing Function
All animations use `ease` timing function for natural, organic motion.

---

## 8. SVGs and Images

### SVG Styling Patterns

**Fill and Stroke Classes:**
```css
.stroke-current {
    stroke: currentColor;
}

.fill-current {
    fill: currentColor;
}
```
These allow SVGs to inherit color from their parent, enabling dynamic theming.

**Icon Sizing:**
```css
/* Feature Card Icons */
.feature-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
}

/* Navigation Icons */
GitHub star icon: width="16" height="16"

/* General SVG sizing */
width: 50px;
height: 50px;
viewBox="0 0 40 40"  /* Maintains aspect ratio */
```

### SVG Patterns

**1. Feature Card Icons:**
```html
<svg class="terminal-svg" width="50" height="50" viewBox="0 0 40 40" fill="none">
    <rect class="fill-current stroke-current"></rect>
</svg>
```
- Uses `fill-current` and `stroke-current` for color inheritance
- Changes color on hover via parent class
- Consistent 50x50px display size

**2. Diagram SVGs:**
```html
<svg viewBox="0 0 200 200" width="200" height="200">
    <g opacity="0.4" stroke="#0a0a0a" stroke-width="1" fill="none">
        <!-- shapes -->
    </g>
</svg>
```
- Grouped elements with shared opacity (0.4)
- Uses explicit colors (#0a0a0a)
- Decorative, non-interactive

**3. Logo:**
```css
.logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
    border-radius: 8px;
}
```
- Uses CSS gradient instead of SVG
- Colorful, eye-catching brand element

### Image Handling

**Video Thumbnails:**
```css
.video-thumbnail {
    width: 280px;
    height: 160px;
    background-color: #e5e5e5;  /* Placeholder */
    border-radius: 8px;
    flex-shrink: 0;
}
```

**Deploy Card Images:**
```css
.deploy-image {
    flex: 1;
    background-color: #F8F8F8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(var(--spacing) * 5);
}
```

### SVG Transitions

Icons respond to hover states:
```css
.mac-style svg {
    transition: color .3s;
    color: #888;  /* Default muted */
}

/* On hover, specific color via parent class */
.terminal-border-hover:hover .terminal-svg {
    color: #00855d;
}
```

---

## 9. Buttons

### Button Base Class

```css
.btn {
    padding: 0.5rem 1rem;          /* 8px 16px */
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;               /* All buttons show pointer cursor */
    text-decoration: none;
    display: inline-block;
    font-weight: 500;              /* Medium weight */
}
```

**Design Rule:** All buttons must have `cursor: pointer` for consistent interaction feedback.

### Button Variants

**Primary Button:**
```css
.btn-primary {
    background-color: #171717;     /* Dark gray/black */
    color: #fafafa;                /* Off-white text */
    border: 1px solid #171717;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #404040;     /* Lighter gray on hover */
}
```
- High contrast
- Used for primary CTAs (Sign up, Start free)
- Hover effect uses noticeable color change (#171717 → #404040)

**Secondary Button:**
```css
.btn-secondary {
    background-color: #fff;        /* White */
    border: 1px solid #e5e5e5;     /* Light border */
    color: #0a0a0a;                /* Dark text */
    transition: background-color 0.3s;
}

.btn-secondary:hover {
    background-color: #f0f0f0;     /* Light gray on hover */
}
```
- Subtle, low contrast
- Used for secondary actions (Log in, Contact us)
- Hover effect uses noticeable color change (white → #f0f0f0)

**Design Rule:** Button hover effects must use background-color transitions for better contrast and visibility, not opacity changes.

**Video Content Button (Enhanced Secondary):**
```css
.video-content .btn {
    background: linear-gradient(to bottom, #ffffff, #f9f9f9);
    border: 1px solid rgba(23, 23, 22, 0.4);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: #27201C;
    padding: 0.2rem 1rem;          /* Shorter height */
    font-size: 0.875rem;           /* Smaller text */
}

.video-content .btn:hover {
    background: linear-gradient(to bottom, #f3f4f6, #f3f4f6);
    opacity: 1;                    /* No opacity change */
}
```

**Large Button:**
```css
.btn-large {
    padding: 0.75rem 1.5rem;       /* 12px 24px */
    font-size: 15px;
}
```
- Used in hero CTA section for prominence

### Button Groups

```css
.hero-cta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
```

**Navigation Button Group:**
```css
.nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}
```

### GitHub Star Button

```css
.github-star {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    text-decoration: none;
    color: #0a0a0a;
    font-size: 14px;
}
```
- Contains icon, text, and bold count
- Similar to secondary button but more compact

### Deploy Card Buttons

Used within deploy cards - inherit btn-secondary styling but placed at bottom of card:
```css
.deploy-card .btn {
    margin-top: auto;  /* Pushes to bottom */
}
```

### Button Placement in Cards

When buttons are placed at the bottom of a container (such as in CardFooter):
```css
.card-footer {
    margin-top: 1.5rem;  /* 24px - provides adequate spacing from content */
}
```

**Design Rule:** Buttons at the bottom of cards need sufficient top margin to separate them from content above.

### Button Best Practices

1. **Contrast**: Primary buttons for main actions, secondary for alternatives
2. **Spacing**: Use appropriate padding for button size (standard, large)
3. **States**: Use background-color transitions for noticeable hover feedback
4. **Alignment**: Left-align in content, center in hero sections
5. **Grouping**: Maintain consistent 1rem gap between buttons
6. **Cursor**: Always include `cursor: pointer` for all button styles

---

## 10. Cards

### Card and Button Interaction Rules

**IMPORTANT: Cards should either be interactive OR contain buttons, not both.**

```
✓ Correct Patterns:
  - Card with hover effect (variant="emphasisHover") → No buttons inside
  - Card with buttons → No hover effect (variant="emphasis" or "default")

✗ Incorrect Patterns:
  - Card with hover effect + buttons (creates competing interactions)
```

**Card Variants:**
```tsx
// Interactive card - no buttons, has hover effect
<Card variant="emphasisHover">
  {/* Content only, no buttons */}
</Card>

// Static emphasis card - has Mac-style shadow but no hover, can contain buttons
<Card variant="emphasis">
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Default card - subtle border, can contain buttons
<Card variant="default">
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Implementation Details:**
```css
/* Interactive card with hover - no buttons */
.emphasis-hover {
    border: 1px solid #000;
    box-shadow: 6px 6px 0 0 #f0f0f0;
    transition: all 0.3s ease;
}

.emphasis-hover:hover {
    box-shadow: 8px 8px 0 0 #ccc;
    transform: translateY(-2px);
}

/* Static emphasis card - Mac-style shadow, no hover, can have buttons */
.emphasis {
    border: 1px solid #000;
    box-shadow: 6px 6px 0 0 #f0f0f0;
}

/* Default card - subtle style, can have buttons */
.default {
    border: 1px solid #e5e5e5;
}
```

**Design Rule:** Use `variant="emphasis"` (static Mac-style shadow) for cards with buttons, and `variant="emphasisHover"` (animated shadow) for interactive cards without buttons.

The site uses two main card patterns: Feature Cards and Feature Boxes.

### Feature Cards (Small Grid Cards)

**Structure:**
```html
<div class="feature-card mac-style mac-style-default-hover terminal-border-hover">
    <svg class="terminal-svg">...</svg>
    <h3><span class="terminal-highlight">5M+</span> monthly downloads</h3>
    <p>Apache 2.0<br>21k Github stars</p>
</div>
```

**Base Styling:**
```css
.feature-card {
    background-color: #fff;
    border: 1px solid #000;      /* Black border for emphasis */
    border-radius: 2px;          /* Very subtle rounding */
    padding: 1.25rem;            /* 20px */
    min-height: 180px;
}
```

**Mac-style Shadow:**
```css
.mac-style {
    box-shadow: 6px 6px 0 0 #f0f0f0;
    transition: all .3s ease;
    border-radius: 2px;
}
```

**Grid Layout:**
```css
.feature-cards {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 0 3rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}
```

**Typography Within:**
```css
.feature-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.feature-card p {
    font-size: 0.875rem;
    color: #0a0a0a;
    line-height: 1.6;
}

.feature-card .highlight {
    color: #0a0a0a;
    font-weight: 600;
}
```

### Feature Boxes (Large Content Boxes)

**Structure:**
```html
<div class="feature-box large mac-style mac-style-hover">
    <h3>SIMPLE AND POWERFUL</h3>
    <hr>
    <p>Description text</p>
    <div class="code-block">...</div>
</div>
```

**Base Styling:**
```css
.feature-box {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.feature-box.large {
    grid-row: span 2;           /* Takes 2 rows */
}
```

**Typography:**
```css
.feature-box h3 {
    font-family: var(--font-ibm-plex-mono);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-inline: calc(var(--spacing) * 5);
    padding-top: calc(var(--spacing) * 3);
    padding-bottom: calc(var(--spacing) * 2);
}

.feature-box p {
    color: #0a0a0a;
    line-height: var(--leading-relaxed);
    margin-bottom: calc(var(--spacing) * 4);
    font-size: var(--text-sm);
    padding-inline: calc(var(--spacing) * 5);
}
```

**Horizontal Rule:**
```css
hr {
    border: none;
    border-top: 1px solid #000;
    margin: 0;
    margin-top: calc(var(--spacing) * 1);
    margin-bottom: calc(var(--spacing) * 3);
}
```

**Grid Layout:**
```css
.features-grid {
    max-width: 1200px;
    margin: 5rem auto;
    padding: 0 3rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: calc(var(--spacing) * 5);
}
```

### Deploy Cards

Hybrid layout combining text and code/image:

**Structure:**
```html
<div class="deploy-card mac-style">
    <div class="deploy-content">
        <h3>INSTALL</h3>
        <p>Get up and running instantly.</p>
        <a href="#" class="btn btn-secondary">Get started</a>
    </div>
    <div class="deploy-code">...</div>
</div>
```

**Styling:**
```css
.deploy-card {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    max-width: 600px;
}

.deploy-content {
    flex: 0 0 45%;              /* Fixed 45% width */
    min-width: 200px;
    padding: calc(var(--spacing) * 5) calc(var(--spacing) * 5) calc(var(--spacing) * 6);
    display: flex;
    flex-direction: column;
}

.deploy-content p {
    color: #0a0a0a;
    line-height: var(--leading-relaxed);
    margin-bottom: auto;        /* Pushes button down */
    padding-bottom: calc(var(--spacing) * 4);
    font-size: var(--text-sm);
}
```

### Card Content Sections

**Code Block:**
```css
.code-block {
    background-color: #F8F8F8;
    color: #0a0a0a;
    padding: calc(var(--spacing) * 5);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    margin-top: auto;           /* Pushes to bottom */
    overflow-x: auto;
}
```

**Dark Code Block:**
```css
.deploy-code {
    flex: 1;
    background-color: #1e1e2e;
    color: #f8f8f2;
    padding: calc(var(--spacing) * 5);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    overflow-x: auto;
}
```

**Diagram Section:**
```css
.diagram {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F8F8F8;
    padding: calc(var(--spacing) * 5) 0;
}

.diagram svg {
    max-width: 60%;
    height: auto;
}
```

**Language Grid:**
```css
.lang-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: calc(var(--spacing) * 4);
    padding: calc(var(--spacing) * 5);
    background-color: #F8F8F8;
    margin-top: auto;
}

.lang-box {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    padding: calc(var(--spacing) * 4) calc(var(--spacing) * 6);
    text-align: center;
    font-weight: var(--font-weight-semibold);
    border-radius: 4px;
}
```

---

## 11. Lists

### Navigation Lists

```css
.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
    align-items: center;
}

.nav-links a {
    text-decoration: none;
    color: #0a0a0a;
    font-size: 15px;
}
```

### Link Section Lists

**Basic Structure:**
```css
.link-section {
    list-style: none;
}

.link-section li {
    margin-bottom: 0.5rem;
}

.link-section a {
    color: #0a0a0a;
    text-decoration: none;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
```

**With Icons:**
```css
.link-section .icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
}

.link-section img.icon {
    width: 1.25rem;
    height: 1.25rem;
}

.link-section .link-text {
    text-decoration: underline;
}

/* Links without icons still underlined */
.link-section a:not(:has(.icon)) {
    text-decoration: underline;
}
```

### Vertical Link Lists

```css
.link-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 2rem;
}

.link-list a {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    color: #0a0a0a;
    text-decoration: underline;
}
```

### Horizontal Link Lists (Responsive)

```css
.link-list-secondary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
}

@media (min-width: 768px) {
    .link-list-secondary {
        flex-direction: row;
    }
}

.link-list-secondary a {
    display: flex;
    align-items: center;
    color: #0a0a0a;
    text-decoration: none;
}
```

**With Emoji Bullets:**
```css
.emoji-bullet {
    margin-right: 0.5rem;
    font-size: 1.25rem;
}

.separator {
    color: #0a0a0a;
    display: none;
}

@media (min-width: 768px) {
    .separator {
        display: block;
    }
}
```

### FAQ Lists

```css
.faq-item {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.75;
}

.faq-item a {
    color: #0a0a0a;
    text-decoration: underline;
}
```

---

## 12. Border Radius

The site uses minimal border radius for a modern, clean aesthetic:

### Border Radius Values

```css
/* Minimal Rounding (Cards) */
border-radius: 2px;           /* Feature cards, feature boxes */

/* Small Rounding (Buttons) */
border-radius: 4px;           /* Language boxes */
border-radius: 6px;           /* Buttons, GitHub star */

/* Medium Rounding (Images) */
border-radius: 8px;           /* Logo icon, video thumbnails */
```

### CSS Variable

```css
--radius: .6rem;  /* 9.6px - from styles.css */
```
This variable is defined but not actively used in chromadb.html, suggesting potential for future consistency.

### Application Patterns

**Cards:**
- Almost flat (2px) to maintain brutalist aesthetic
- Keeps focus on content and shadow effects

**Interactive Elements:**
- Slightly more rounded (6px) for approachability
- Buttons feel clickable and friendly

**Brand Elements:**
- More pronounced (8px) for the logo
- Adds personality without compromising minimalism

### Usage Guidelines

1. **Consistency**: Use 2px for structural cards, 6px for interactive elements
2. **Contrast**: The mix of sharp and soft creates visual hierarchy
3. **Restraint**: Keep radius values small to maintain the modern, technical feel

---

## 13. Common Tailwind CSS Utilities and Usage Patterns

While chromadb.html uses mostly vanilla CSS, styles.css includes Tailwind infrastructure for potential future use.

### Utility Class Patterns

**Font Families:**
```css
.font-display { font-family: var(--font-playfair-display); }
.font-sans { font-family: var(--font-inter); }
.font-mono { font-family: var(--font-ibm-plex-mono); }
```

**Font Weights:**
```css
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

**Line Heights:**
```css
.leading-none { line-height: 1; }
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
```

**Font Sizes:**
```css
.text-xs     /* 0.75rem */
.text-sm     /* 0.875rem */
.text-base   /* 1rem */
.text-lg     /* 1.125rem */
.text-xl     /* 1.25rem */
.text-2xl    /* 1.5rem */
.text-3xl    /* 1.875rem */
.text-4xl    /* 2.25rem */
.text-5xl    /* 3rem */

/* Arbitrary value support */
.text-\[2\.5rem\] { font-size: 2.5rem; }
```

### Component Classes (from styles.css)

**Mac-style Cards:**
```css
.mac-style {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
```

**Hover States:**
```css
.mac-style-hover:hover {
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    --tw-translate-y: -0.125rem;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) ...;
}
```

**Themed Borders:**
```css
.terminal-border-hover:hover {
    --tw-border-opacity: 1;
    border-color: rgb(137 220 235 / var(--tw-border-opacity));
}
```

**Code Blocks:**
```css
.code {
    --tw-bg-opacity: 1;
    background-color: rgb(30 30 46 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(248 248 242 / var(--tw-text-opacity));
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

**Syntax Highlighting:**
```css
.code .comment { color: rgb(108 112 134 / var(--tw-text-opacity)); }
.code .function { color: rgb(137 180 250 / var(--tw-text-opacity)); }
.code .string { color: rgb(166 227 161 / var(--tw-text-opacity)); }
.code .operator { color: rgb(137 220 235 / var(--tw-text-opacity)); }
.code .builtin { color: rgb(203 166 247 / var(--tw-text-opacity)); }
```

### Scrollbar Utilities

```css
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
```

### Custom Properties System

Tailwind v4-style @property declarations for advanced features:
- Transform properties (translate, scale, rotate)
- Shadow properties (box-shadow, inset-shadow, ring-shadow)
- Gradient properties (from, via, to positions)
- Animation properties (delay, direction, iteration-count)

---

## 14. Responsive Design Patterns

### Mobile-First Design Philosophy

**IMPORTANT: This design system follows Tailwind's mobile-first methodology.**

All base styles target mobile devices first, then progressively enhance for larger screens using min-width breakpoints. This approach ensures optimal performance and user experience on mobile devices while gracefully scaling up to tablets and desktops.

**Core Principles:**
1. **Mobile by default** - Base classes apply to all screen sizes
2. **Progressive enhancement** - Add breakpoint prefixes to modify for larger screens
3. **Content-first** - Mobile constraints force focus on essential content
4. **Performance** - Smaller screens load minimal styles first

### Tailwind Breakpoint System

The site uses Tailwind's standard mobile-first breakpoints:

```css
/* Mobile-first breakpoints (min-width) */
/* Base styles: 0px and up (no prefix needed) */

sm:  640px   /* Small tablets and up */
md:  768px   /* Tablets and up */
lg:  1024px  /* Laptops and up */
xl:  1280px  /* Desktops and up */
2xl: 1536px  /* Large desktops and up */
```

**Usage Pattern:**
```tsx
// Mobile: text-sm (14px)
// Small screens+: text-base (16px)
// Medium screens+: text-lg (18px)
className="text-sm sm:text-base md:text-lg"

// Mobile: padding 1rem
// Small screens+: padding 1.5rem
className="p-4 sm:p-6"
```

### Layout Adaptations

**Mobile-First Grid Patterns:**

All grids start with mobile layout and scale up. Use Tailwind's grid utilities with breakpoint prefixes:

```tsx
// Feature Cards Grid: 1 column → 2 columns → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* cards */}
</div>

// Features Grid: 1 column → 3 columns
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
  {/* features */}
</div>

// Bottom Sections: 1 column → 2 columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
  {/* sections */}
</div>
```

**Mobile-First Flexbox Patterns:**

```tsx
// Deploy Card: Column → Row
<div className="flex flex-col md:flex-row">
  <div className="flex-none w-full md:w-[45%]">
    {/* content */}
  </div>
  <div className="flex-1">
    {/* code/image */}
  </div>
</div>

// Navigation: Column → Row
<nav className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
  {/* nav items */}
</nav>
```

### Mobile-First Typography Scaling

**Heading Component (Mobile-First):**

All typography scales progressively from mobile to desktop:

```tsx
// H1: 3xl → 4xl → 5xl → custom
<Heading level="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]" />

// H2: 2xl → 3xl → custom
<Heading level="h2" className="text-2xl sm:text-3xl md:text-[1.875rem]" />

// H3: xl → 2xl
<Heading level="h3" className="text-xl sm:text-2xl" />
```

**Text Component (Mobile-First):**

```tsx
// Base text sizes with responsive scaling
size="sm"   → text-sm sm:text-base       (14px → 16px)
size="base" → text-sm sm:text-base       (14px → 16px)
size="lg"   → text-base sm:text-lg       (16px → 18px)
size="xl"   → text-lg sm:text-xl         (18px → 20px)
```

**Manual Typography Scaling:**

```tsx
// Paragraph text: smaller on mobile, standard on desktop
<p className="text-sm sm:text-base">Content text</p>

// Hero heading: progressive scaling
<h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
  Hero Title
</h1>
```

### Mobile-First Spacing Patterns

**Padding and Margins:**

```tsx
// Container padding: 1rem → 1.5rem
<Container className="px-4 sm:px-6" />

// Section spacing: 2rem → 3rem → 5rem
<section className="py-8 sm:py-12 md:py-20" />

// Element margins: 0.75rem → 1rem
<div className="mb-3 sm:mb-4" />

// Gap between elements: 0.75rem → 1rem
<div className="flex gap-3 sm:gap-4" />
```

**Component Spacing:**

```tsx
// Card padding scales with screen size
padding: {
  none: 'p-0',
  sm: 'p-2 sm:p-3',           // 0.5rem → 0.75rem
  default: 'p-4 sm:p-5',       // 1rem → 1.25rem
  lg: 'p-6 sm:p-8',           // 1.5rem → 2rem
}

// Button padding scales with screen size
size: {
  default: 'px-3 py-2 text-sm sm:px-4 sm:text-base',
  lg: 'px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg',
}
```

### Mobile-First Component Examples

**Home Page (Mobile-First):**

```tsx
<div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
  {/* Dark mode toggle: smaller positioning on mobile */}
  <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
    <DarkModeToggle />
  </div>

  {/* Heading: progressive text scaling */}
  <h1 className="text-center text-3xl font-bold sm:text-4xl md:text-5xl">
    Welcome to Tim's Blog
  </h1>

  {/* Centered text on all screen sizes */}
  <p className="mt-4 text-center text-muted">
    Work in progress...
  </p>

  {/* Button with centered text */}
  <a href="/components" className="mt-6 px-6 py-3 text-center sm:mt-8">
    View Components
  </a>
</div>
```

**Style Guide Sections (Mobile-First):**

```tsx
<section className="mb-16 sm:mb-20">
  {/* Section heading with scaled spacing */}
  <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
    Typography
  </Heading>

  {/* Subsection with scaled spacing */}
  <div className="mb-8 sm:mb-12">
    <Heading level="h3" className="mb-4 sm:mb-6">
      Headings
    </Heading>

    {/* Content with scaled gap */}
    <div className="space-y-3 sm:space-y-4">
      {/* items */}
    </div>
  </div>
</section>
```

**Card Components (Mobile-First):**

```tsx
// Card with responsive padding
<Card className="p-4 sm:p-5">
  <CardHeader className="space-y-1 sm:space-y-1.5">
    {/* Title scales from lg to xl */}
    <CardTitle className="text-lg sm:text-xl">Title</CardTitle>
  </CardHeader>

  <CardFooter className="mt-4 sm:mt-6">
    <Button size="default">Action</Button>
  </CardFooter>
</Card>
```

### Mobile-First Responsive Patterns Summary

**ALWAYS follow these mobile-first principles:**

1. **Start with Mobile** - Write base styles for mobile first, no breakpoint prefix
2. **Progressive Enhancement** - Add `sm:`, `md:`, `lg:` prefixes to scale up
3. **Single Column by Default** - Use `grid-cols-1` then scale to `sm:grid-cols-2`, `md:grid-cols-3`, etc.
4. **Flex Column First** - Use `flex-col` then scale to `md:flex-row`
5. **Smaller Text First** - Start with `text-sm` or `text-base`, scale to `sm:text-lg`, `md:text-xl`
6. **Tighter Spacing First** - Start with `gap-3` or `p-4`, scale to `sm:gap-4`, `sm:p-6`
7. **Text Centering** - Always include `text-center` for mobile when text should be centered
8. **Touch Targets** - Ensure buttons have adequate padding on mobile (min 2.5rem height)

**Common Mobile-First Patterns:**

```tsx
// Grid: 1 column → 2 columns → 3 columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// Flex: Column → Row
className="flex flex-col md:flex-row"

// Typography: Small → Medium → Large
className="text-sm sm:text-base md:text-lg"

// Spacing: Tight → Normal → Loose
className="gap-3 sm:gap-4 md:gap-6"
className="p-4 sm:p-6 md:p-8"
className="mb-3 sm:mb-4 md:mb-6"

// Positioning: Small offsets → Large offsets
className="right-4 top-4 sm:right-8 sm:top-8"
```

---

## 15. Responsive Design Patterns (continued)

### Container Patterns

**Max-width Container with Padding:**
```css
/* Desktop/Tablet */
max-width: 1200px;
margin: 0 auto;
padding: 0 3rem;

/* Mobile would typically reduce to 1.5rem or 1rem */
```

**Deploy Grid Responsive:**
```css
.deploy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: calc(var(--spacing) * 5);
}
```
- Uses `auto-fit` to automatically adjust columns
- `minmax(450px, 1fr)` ensures minimum width before wrapping

### Flexbox Shrinking

```css
.video-thumbnail {
    flex-shrink: 0;  /* Prevents thumbnail from shrinking */
}

.link-section .icon {
    flex-shrink: 0;  /* Keeps icon size consistent */
}
```

---

## 16. Example Component References

### Complete Component Examples

**1. Feature Card with Hover:**
```html
<div class="feature-card mac-style mac-style-default-hover terminal-border-hover">
    <svg class="terminal-svg" width="50" height="50" viewBox="0 0 40 40" fill="none">
        <!-- SVG paths with class="fill-current stroke-current" -->
    </svg>
    <h3><span class="terminal-highlight">5M+</span> monthly downloads</h3>
    <p>Apache 2.0<br>21k Github stars</p>
</div>
```

**CSS Classes Used:**
- `.feature-card`: Base card styling
- `.mac-style`: Adds transition and base shadow
- `.mac-style-default-hover`: Adds hover shadow without pointer cursor
- `.terminal-border-hover`: Changes border and icon color to green on hover
- `.terminal-svg`: Targets the SVG for color transition
- `.terminal-highlight`: Targets highlighted text for color transition

**2. Feature Box with Code:**
```html
<div class="feature-box large mac-style mac-style-hover">
    <h3>SIMPLE AND POWERFUL</h3>
    <hr>
    <p>From notebook to production...</p>
    <p class="small-text">Getting started is as easy as pip install...</p>
    <div class="code-block">
        <span class="prompt">&gt;</span> <span class="command">pip install chromadb</span>
        <span style="opacity: 0.5;">━━━━━━━━━━━━━━━━━</span>

        <span class="keyword">import</span> chromadb

        client = chromadb.<span class="function">Client</span>()
    </div>
</div>
```

**CSS Classes Used:**
- `.feature-box`: Base box styling
- `.large`: Makes box span 2 grid rows
- `.mac-style`: Adds transitions
- `.mac-style-hover`: Hover lift effect
- `.code-block`: Code styling with light background
- `.prompt`, `.command`, `.keyword`, `.function`: Syntax highlighting

**3. Deploy Card:**
```html
<div class="deploy-card mac-style">
    <div class="deploy-content">
        <h3>INSTALL</h3>
        <p>Get up and running instantly.</p>
        <a href="#" class="btn btn-secondary">Get started</a>
    </div>
    <div class="deploy-code">
        <span class="comment"># Install chroma</span>
        <span class="prompt">$</span> <span class="command">pip install chromadb</span>
    </div>
</div>
```

**CSS Classes Used:**
- `.deploy-card`: Base card with flex layout
- `.mac-style`: Shadow styling
- `.deploy-content`: Left content area (45% width)
- `.deploy-code`: Right code area with dark background
- `.btn.btn-secondary`: Secondary button styling

**4. Video Feature:**
```html
<div class="video-feature">
    <div class="video-thumbnail"></div>
    <div class="video-content">
        <a href="..." class="text-xl underline antialiased">Chroma For Code: Part 1</a>
        <p>Chroma powers code search for AI agents...</p>
        <a href="..." class="btn btn-secondary">Watch now</a>
    </div>
</div>
```

**CSS Classes Used:**
- `.video-feature`: Flex container (column on mobile, row on desktop)
- `.video-thumbnail`: Placeholder for video thumbnail
- `.video-content`: Text content area
- `.text-xl`: Font size utility
- `.underline`: Text decoration
- `.antialiased`: Font smoothing

**5. Link Section with Icons:**
```html
<ul class="link-section">
    <li>
        <a href="#">
            <span class="icon">💬</span>
            <span class="link-text">Join the Chroma Discord server</span>
        </a>
    </li>
</ul>
```

**CSS Classes Used:**
- `.link-section`: List styling
- `.icon`: Icon container (flex, no-shrink)
- `.link-text`: Underlined text portion

**6. Button Group:**
```html
<div class="hero-cta">
    <a href="#" class="btn btn-primary btn-large">Start free on Cloud</a>
    <a href="#" class="btn btn-secondary btn-large">Contact us</a>
</div>
```

**CSS Classes Used:**
- `.hero-cta`: Flex container with gap
- `.btn`: Base button styling
- `.btn-primary`: Dark button variant
- `.btn-secondary`: Light button variant
- `.btn-large`: Larger button size

---

## 17. Additional Notes

### Design Philosophy Deep Dive

**Brutalist Influences:**
- Sharp, minimal border radius (2px)
- High contrast black borders
- Offset flat shadows instead of soft gradients
- Functional, no-nonsense layout

**Refined Elegance:**
- Playfair Display serif adds sophistication
- Generous white space for breathing room
- Subtle hover transitions (0.3s ease)
- Careful typographic hierarchy

**Developer-Focused:**
- Prominent code blocks with syntax highlighting
- Monospace fonts for technical labels
- Terminal and code aesthetics
- Clear, scannable documentation-style layout

### Color Psychology

- **Black (#0a0a0a)**: Authority, professionalism, technical precision
- **White/Off-white (#fff, #fafafa)**: Clarity, cleanliness, simplicity
- **Accent Colors**: Playful personality on interaction without overwhelming
  - Green: Growth, reliability (terminal)
  - Orange: Energy, speed (airplane)
  - Purple: Creativity, innovation (blocks)
  - Blue: Trust, intelligence (brush)

### Accessibility Considerations

**Contrast Ratios:**
- Primary text (#0a0a0a) on white background: ~20.6:1 (Excellent)
- Secondary text (#737373) on white: ~4.7:1 (WCAG AA compliant)

**Font Sizes:**
- Minimum 14px (0.875rem) ensures readability
- Body text at 16px (1rem) for comfortable reading
- Large headings provide clear hierarchy

**Hover States:**
- Visual feedback on all interactive elements
- Transform + shadow changes are perceivable
- Color changes supplemented with visual movement

**Responsive Design:**
- Mobile-first approach ensures usability on all devices
- Touch targets appropriately sized (buttons 8px+ padding)
- Content reflows without horizontal scrolling

### Performance Considerations

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```
- Preconnects to font services for faster loading
- Displays 'swap' strategy (not shown but typical) prevents FOIT

**CSS Organization:**
- Inline styles reduce HTTP requests
- Custom properties for easy theming
- Minimal specificity for fast rendering

**Image Optimization:**
- SVGs for icons (scalable, small file size)
- Placeholder backgrounds for async image loading

### Browser Support

**Modern CSS Features Used:**
- CSS Custom Properties (var())
- CSS Grid
- Flexbox
- @property declarations (progressive enhancement)
- calc() for dynamic spacing
- OKLCH colors (with fallbacks in hex)

**Fallback Strategy:**
- Font stacks with system fonts
- Graceful degradation for older browsers
- Core functionality works without JS

### Naming Conventions

**BEM-Adjacent Pattern:**
- `.feature-card`, `.feature-box`: Block-level components
- `.hero-cta`, `.deploy-grid`: Semantic section names
- `.mac-style`: Modifier classes
- `.terminal-border-hover`: State-based modifiers

**Descriptive Naming:**
- Classes describe purpose, not appearance
- `.antialiased` describes rendering, not visual style
- `.btn-primary` describes hierarchy, not just "dark button"

### Code Block Styling Best Practices

**Light Theme (Feature Grid):**
- Use for Python code examples
- Light background (#F8F8F8) reduces eye strain
- Minimal syntax highlighting (grayscale focus)

**Dark Theme (Deploy Code):**
- Use for terminal commands
- Catppuccino Mocha for familiar developer aesthetic
- High contrast for readability

**Monospace Font Stack:**
```css
font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
```
- Platform-specific optimization
- Monaco (macOS), Menlo (macOS modern), Ubuntu Mono (Linux)

### Animation Timing

**Standard Transition: 0.3s ease**
- Fast enough to feel responsive
- Slow enough to be perceivable
- Ease curve feels natural (acceleration + deceleration)

**Transform on Hover: translateY(-2px)**
- Subtle lift suggests clickability
- 2px is noticeable without being jarring

**Shadow Increase: 6px → 8px**
- Proportional to transform
- Creates cohesive "floating" effect

### Grid vs Flexbox Usage

**CSS Grid Used For:**
- Feature cards (4 → 2 → 1 columns)
- Features grid (3 → 1 columns)
- Deploy grid (auto-fit responsive)
- Language grid (2x3 grid)
- Bottom sections (2 → 1 columns)

**Flexbox Used For:**
- Navigation (horizontal alignment)
- Button groups (row with gap)
- Video feature (column → row responsive)
- Deploy card (side-by-side content)
- Link lists (vertical/horizontal switching)

**Decision Criteria:**
- Grid: When you need explicit 2D layout control
- Flexbox: When you need flexible 1D alignment

### Typography Pairing Rationale

**Playfair Display + Inter:**
- Classic serif/sans-serif pairing
- Playfair's high contrast provides elegance
- Inter's neutrality provides clarity
- Both have extensive weight options

**IBM Plex Mono Addition:**
- Complements Inter (same design system family concept)
- Slightly warmer than typical monospace
- Professional without being sterile

### Semantic HTML Considerations

While not explicitly shown in the style guide, best practices would include:
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic nav, section, article elements
- Accessible link text (not just "click here")
- Alt text for images (not shown in SVGs here)

---

## 18. Dark Mode

The site implements a comprehensive dark mode theme that maintains the design system's aesthetic while providing optimal readability in low-light environments. Dark mode uses a class-based toggle system built with Tailwind CSS v4.

### Dark Mode Implementation

**Tailwind v4 Configuration:**
```css
@import 'tailwindcss';

@variant dark (&:where(.dark, .dark *));
```
- Uses class-based dark mode instead of media queries
- Applies `.dark` class to root HTML element
- All child elements inherit dark mode styles

**React Context Provider:**
```tsx
<DarkModeProvider>
  {children}
</DarkModeProvider>
```
- Manages theme state (light/dark)
- Persists preference to localStorage
- Detects system preference as fallback
- Prevents flash of unstyled content on load

### Dark Mode Color Palette

**Primary Colors:**
```css
/* Dark Mode */
--background: #0a0a0a;           /* Almost black */
--card-background: #1a1a1a;      /* Dark gray cards */
--foreground: #fafafa;           /* Off-white text */
--muted: #a3a3a3;                /* Light gray for muted text */
--border: #262626;               /* Dark gray borders */
--border-emphasis: #fff;         /* White for emphasis */
```

**Comparison to Light Mode:**
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | `#fafafa` | `#0a0a0a` |
| Card Background | `#fff` | `#1a1a1a` |
| Foreground | `#0a0a0a` | `#fafafa` |
| Muted | `#737373` | `#a3a3a3` |
| Border | `#e5e5e5` | `#262626` |
| Border Emphasis | `#000` | `#fff` |

**Accent Colors (Adjusted for Dark Mode):**
```css
/* Brighter, more vibrant versions for dark backgrounds */
--terminal-green: #10b981;      /* Light mode: #00855d */
--airplane-orange: #fb923c;     /* Light mode: #ff6b35 */
--blocks-purple: #d8b4fe;       /* Light mode: #cba6f7 */
--brush-blue: #60a5fa;          /* Light mode: #4a81de */
```
- Increased brightness for visibility on dark backgrounds
- Maintains brand color identity
- Ensures WCAG contrast compliance

**Code Block Colors:**
```css
/* Slightly darker background in dark mode */
--code-bg: #161616;             /* Light mode: #1e1e2e */
--code-fg: #f8f8f2;             /* Same as light mode */
```

### Dark Mode Shadows

The Mac-style shadow system adapts for dark mode with softer, subtler colors:

**Light Mode Shadows:**
```css
--shadow-mac: 6px 6px 0 0 #f0f0f0;
--shadow-mac-hover: 8px 8px 0 0 #ccc;
```

**Dark Mode Shadows:**
```css
--shadow-mac: 6px 6px 0 0 #262626;          /* Soft dark gray */
--shadow-mac-hover: 8px 8px 0 0 #404040;    /* Medium gray */
```

**Design Rationale:**
- Maintains Mac-style offset structure
- Uses gray tones instead of pure black
- Provides subtle depth without harsh contrast
- Hover state increases shadow visibility

### Dark Mode Button Styling

**Primary Button:**
```css
/* Same in both modes */
bg-[#171717] text-white hover:bg-[#404040]
```
- Consistent across themes
- Already optimized for dark backgrounds

**Secondary Button:**

*Light Mode:*
```css
bg-white
text-foreground
hover:bg-[#f0f0f0]
border border-[#e5e5e5]
```

*Dark Mode:*
```css
dark:bg-[#d4d4d4]       /* Muted light gray background */
dark:text-[#262626]     /* Dark text for contrast */
dark:hover:bg-[#c0c0c0] /* Neutral gray hover */
dark:border-[#b8b8b8]   /* Neutral border */
```

**Design Decision:**
- Secondary buttons use light gray background in dark mode
- Creates visual hierarchy (less prominent than primary)
- Dark text on light background maintains readability
- Neutral grays provide subtle, professional appearance

### Dark Mode Toggle Component

**Component Structure:**
```tsx
<DarkModeToggle />
```

**Visual Design:**
```css
/* Toggle switch */
height: 2rem (32px)
width: 4rem (64px)
border-radius: rounded-full

/* Slider */
height: 1.5rem (24px)
width: 1.5rem (24px)
background: white
transform: translateX based on theme
```

**States:**
- Light mode: Sun icon visible, slider on left, gray background
- Dark mode: Moon icon visible, slider on right, blue background
- Smooth transitions (0.3s) for all state changes
- Focus ring for keyboard accessibility

**Icon System:**
- Sun icon: Yellow (#fbbf24) for light mode
- Moon icon: Dark slate (#334155) for dark mode
- Icons animate with opacity transitions
- SVG icons embedded for performance

### Dark Mode Application

**Global CSS Variables:**
```css
@layer theme {
  :root {
    /* Light mode defaults */
  }

  :root.dark {
    /* Dark mode overrides */
  }
}
```

**Component-Level Dark Mode:**
```tsx
// Automatic based on CSS variables
className="bg-background text-foreground"

// Explicit dark mode styles
className="bg-white dark:bg-[#262626]"
```

**Utility Classes:**
- All color utilities automatically respond to dark mode via CSS variables
- Custom dark: prefixes for component-specific styling
- Mac-style shadow utility automatically adapts

### Dark Mode Best Practices

**1. Color Contrast:**
- Maintain WCAG AA compliance (4.5:1 for text)
- Test accent colors on dark backgrounds
- Ensure interactive elements are clearly visible

**2. Shadow Usage:**
- Use softer shadow colors in dark mode
- Avoid pure black shadows (#000)
- Maintain shadow structure across themes

**3. Button Hierarchy:**
- Primary buttons remain consistent
- Secondary buttons adapt to provide clear contrast
- Disabled states maintain appropriate opacity

**4. Code Blocks:**
- Keep syntax highlighting consistent
- Adjust background darkness for eye comfort
- Maintain code readability in both themes

**5. Accent Colors:**
- Brighten accent colors for dark backgrounds
- Test hover states in both themes
- Ensure brand colors remain recognizable

### Dark Mode Accessibility

**Contrast Ratios:**
- Primary text (#fafafa on #0a0a0a): ~19.8:1 (Excellent)
- Muted text (#a3a3a3 on #0a0a0a): ~8.3:1 (WCAG AAA)
- Secondary button text (#262626 on #d4d4d4): ~9.2:1 (Excellent)

**User Control:**
- Toggle switch clearly labeled with ARIA
- Preference persists across sessions
- Respects system preferences by default
- No flash of wrong theme on page load

**Focus States:**
- Focus rings visible in both themes
- Interactive elements clearly distinguishable
- Keyboard navigation fully supported

### Dark Mode CSS Reference

**Complete Variable Set:**
```css
:root.dark {
  /* Backgrounds & Foregrounds */
  --background: #0a0a0a;
  --card-background: #1a1a1a;
  --foreground: #fafafa;
  --muted: #a3a3a3;

  /* Borders */
  --border: #262626;
  --border-emphasis: #fff;

  /* Accents */
  --terminal-green: #10b981;
  --airplane-orange: #fb923c;
  --blocks-purple: #d8b4fe;
  --brush-blue: #60a5fa;

  /* Code */
  --code-bg: #161616;
  --code-fg: #f8f8f2;

  /* Shadows */
  --shadow-mac: 6px 6px 0 0 #262626;
  --shadow-mac-hover: 8px 8px 0 0 #404040;
}
```

**Usage Pattern:**
```tsx
// Using CSS variables (automatic)
<div className="bg-background text-foreground border border-border">

// Using dark: prefix (explicit)
<button className="bg-white dark:bg-[#d4d4d4] text-foreground dark:text-[#262626]">

// Mac-style shadow (automatic via variable)
<div className="mac-shadow">
```

---

## Quick Reference

### Mobile-First Breakpoints

```
Base (0px+):    No prefix - mobile default
sm (640px+):    sm: - small tablets and up
md (768px+):    md: - tablets and up
lg (1024px+):   lg: - laptops and up
xl (1280px+):   xl: - desktops and up
2xl (1536px+):  2xl: - large desktops and up
```

### Most Common Values

**Colors (Light Mode):**
- Text: `#0a0a0a`
- Background: `#fafafa` (page), `#fff` (cards)
- Border: `#e5e5e5` (subtle), `#000` (emphasis)
- Muted: `#737373`

**Colors (Dark Mode):**
- Text: `#fafafa`
- Background: `#0a0a0a` (page), `#1a1a1a` (cards)
- Border: `#262626` (subtle), `#fff` (emphasis)
- Muted: `#a3a3a3`

**Spacing (Mobile-First):**
- Padding: `px-4 sm:px-6` (1rem → 1.5rem)
- Margin: `mb-3 sm:mb-4` (0.75rem → 1rem)
- Gap: `gap-3 sm:gap-4` (0.75rem → 1rem)
- Section: `py-8 sm:py-12 md:py-20` (2rem → 3rem → 5rem)

**Typography (Mobile-First):**
- H1: `text-3xl sm:text-4xl md:text-5xl` (30px → 36px → 48px)
- H2: `text-2xl sm:text-3xl` (24px → 30px)
- H3: `text-xl sm:text-2xl` (20px → 24px)
- Body: `text-sm sm:text-base` (14px → 16px)
- Large: `text-base sm:text-lg` (16px → 18px)

**Border Radius:**
- Cards: 2px
- Buttons: 6px
- Logo: 8px

**Shadows (Light Mode):**
- Default: `6px 6px 0 0 #f0f0f0`
- Hover: `8px 8px 0 0 #ccc`

**Shadows (Dark Mode):**
- Default: `6px 6px 0 0 #262626`
- Hover: `8px 8px 0 0 #404040`

**Transitions:**
- Duration: `0.3s`
- Timing: `ease`

### Mobile-First Component Patterns

**Text Alignment:**
```tsx
// Always center text on mobile when needed
className="text-center"
```

**Responsive Grids:**
```tsx
// 1 column → 2 columns → 4 columns
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
```

**Responsive Flex:**
```tsx
// Column → Row
className="flex flex-col md:flex-row gap-4 md:gap-8"
```

**Responsive Sizing:**
```tsx
// Button sizing
size="default" → px-3 py-2 text-sm sm:px-4 sm:text-base
size="lg"      → px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg

// Card padding
padding="default" → p-4 sm:p-5
padding="lg"      → p-6 sm:p-8
```

---

This comprehensive style guide captures the design language, patterns, and implementation details of the ChromaDB website, providing a complete reference for maintaining consistency across all future development work.
