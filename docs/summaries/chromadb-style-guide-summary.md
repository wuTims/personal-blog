# ChromaDB Style Guide - Quick Reference

## Overview

This comprehensive guide documents the ChromaDB website's design system, featuring a **modern minimalist aesthetic** with brutalist/neo-brutalist influences, elegant serif typography, and Mac-style offset shadows.

**Full Guide**: `chromadb-style-guide.md` (2000+ lines)

---

## Design Philosophy

- **Clarity and Readability**: High contrast (black text on white/off-white backgrounds)
- **Mac-Style Cards**: Distinctive offset shadows creating depth
- **Progressive Enhancement**: Subtle hover states and transitions
- **Typography-First**: Large serif headings + readable sans-serif body
- **Developer-Focused**: Monospace fonts and code styling

---

## Guide Structure & Quick Navigation

### 1. Overview (Lines 1-20)
Design philosophy and core principles

### 2. Typography (Lines 21-157)
**Font System**:
- Display: Playfair Display (headings)
- Sans-Serif: Inter (body text)
- Monospace: IBM Plex Mono (code, technical labels)

**Key Sizes**:
- Hero h1: 3.5rem (56px) desktop, 2.5rem mobile
- Section h2: 1.875rem (30px)
- Base body: 1rem (16px), line-height 1.5

**Weights**: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### 3. Colors (Lines 160-275)
**Primary Palette**:
- Background: `#fff` (cards), `#fafafa` (page)
- Text: `#0a0a0a` (primary), `#737373` (secondary/muted)
- Borders: `#e5e5e5` (subtle), `#000` (emphasis)

**Accent Colors** (hover states):
- Terminal green: `#00855d`
- Airplane orange: `#ff6b35`
- Blocks purple: `#cba6f7`
- Brush blue: `#4a81de`

**Code Blocks**: Catppuccino Mocha theme (`#1e1e2e` background)

### 4. Spacing (Lines 277-367)
**Base Unit**: `--spacing: 0.25rem` (4px)

**Common Values**:
- Cards: 20px (`calc(var(--spacing) * 5)`)
- Buttons: 8px 16px (standard), 12px 24px (large)
- Section gaps: 4rem, 5rem
- Grid gaps: 1.5rem (cards), 20px (features)

### 5. Shadows (Lines 369-437)
**Mac-Style System**:
- Default: `box-shadow: 6px 6px 0 0 #f0f0f0`
- Hover: `box-shadow: 8px 8px 0 0 #ccc` + `translateY(-2px)`

### 6. Opacity (Lines 439-497)
- Diagrams/illustrations: 0.4-0.6
- Progress bars: 0.5
- Button hover: 0.9
- Border colors: rgba with 0.4 opacity

### 7. Animations & Transitions (Lines 499-647)
**Universal Transition**: `.mac-style { transition: all .3s ease; }`

**Hover Behaviors**:
1. Default mac-style (no pointer change)
2. Interactive mac-style (pointer cursor)
3. Themed border hover (green, orange, purple, blue)
4. Button opacity change

### 8. SVGs and Images (Lines 649-759)
**Icon Sizing**: 50x50px display, uses `fill-current` and `stroke-current`

**Patterns**:
- Feature icons: Dynamic color via `.terminal-svg`, `.airplane-svg`, etc.
- Diagrams: Opacity 0.4, decorative
- Logo: CSS gradient with border-radius

### 9. Buttons (Lines 761-886)
**Variants**:
- Primary: Dark bg (`#171717`), light text
- Secondary: White bg, light border
- Video buttons: Gradient bg with shadow

**Sizes**: Standard (8px 16px), Large (12px 24px)

### 10. Cards (Lines 888-1141)
**Types**:

**Feature Cards**:
- Small grid cards (4-column → responsive)
- Black border, mac-style shadow
- Min-height: 180px
- Padding: 1.25rem

**Feature Boxes**:
- Large content boxes (3-column grid)
- Technical labels (uppercase, monospace)
- Can span 2 rows with `.large`
- Contains code blocks or diagrams

**Deploy Cards**:
- Hybrid layout (45% text, 55% code/image)
- Flexbox composition

### 11. Lists (Lines 1143-1284)
**Navigation**: Horizontal flex with 2rem gaps

**Link Sections**: Vertical lists with icon support

**Responsive Patterns**: Column → row at md breakpoint

### 12. Border Radius (Lines 1286-1331)
- Cards: 2px (minimal)
- Buttons: 6px
- Logo/Images: 8px

### 13. Tailwind Utilities (Lines 1333-1451)
CSS variables and utility classes for potential Tailwind integration

### 14. Responsive Design (Lines 1453-1703)
**Breakpoints**: 768px (tablet), 1024px (desktop)

**Grid Adaptations**:
- Feature cards: 4 → 2 → 1 columns
- Features grid: 3 → 1 columns
- Deploy grid: auto-fit → 1 column

**Typography Scaling**: Hero reduces from 3.5rem → 2.5rem on mobile

### 15. Component Examples (Lines 1706-1828)
Complete HTML/CSS examples with all classes explained

### 16. Additional Notes (Lines 1830-2042)
- Color psychology
- Accessibility (contrast ratios, font sizes)
- Performance (font loading, CSS organization)
- Browser support
- Naming conventions
- Code block best practices
- Grid vs Flexbox usage

### 17. Quick Reference (Lines 2007-2040)
Most commonly used values for quick lookup

---

## Common Patterns Cheat Sheet

### Mac-Style Card
```html
<div class="feature-card mac-style mac-style-default-hover terminal-border-hover">
  <svg class="terminal-svg">...</svg>
  <h3><span class="terminal-highlight">Text</span></h3>
  <p>Description</p>
</div>
```

### Feature Box with Code
```html
<div class="feature-box large mac-style mac-style-hover">
  <h3>TECHNICAL LABEL</h3>
  <hr>
  <p>Description</p>
  <div class="code-block">
    <span class="keyword">import</span> chromadb
  </div>
</div>
```

### Button Group
```html
<div class="hero-cta">
  <a class="btn btn-primary btn-large">Primary Action</a>
  <a class="btn btn-secondary btn-large">Secondary</a>
</div>
```

---

## Key CSS Variables

```css
/* Typography */
--font-playfair-display: "Playfair Display", Georgia, serif;
--font-inter: "Inter", -apple-system, sans-serif;
--font-ibm-plex-mono: "IBM Plex Mono", "Courier New", monospace;

/* Spacing */
--spacing: 0.25rem;  /* Multiply by 2-8 for actual spacing */

/* Border Radius */
--radius: .6rem;  /* 9.6px */
```

---

## Searchable Topics

Need detailed information? Search the full guide for:

- **Lines 21-157**: Complete typography system
- **Lines 160-275**: All color definitions and semantic usage
- **Lines 277-367**: Spacing patterns and calculations
- **Lines 369-437**: Shadow system and hover effects
- **Lines 499-647**: Animation timing and transitions
- **Lines 649-759**: SVG styling and icon patterns
- **Lines 761-886**: Button variants and states
- **Lines 888-1141**: All card types with complete styling
- **Lines 1143-1284**: List patterns and navigation
- **Lines 1453-1703**: Responsive design patterns
- **Lines 1706-1828**: Complete component code examples

---

## Design Tokens Quick Lookup

| Token | Value | Usage |
|-------|-------|-------|
| Primary Text | `#0a0a0a` | Body text, headings |
| Secondary Text | `#737373` | Muted text, labels |
| Page Background | `#fafafa` | Body background |
| Card Background | `#fff` | Cards, modals |
| Subtle Border | `#e5e5e5` | Light dividers |
| Emphasis Border | `#000` | Strong borders |
| Base Spacing | `0.25rem` (4px) | Multiply for margins/padding |
| Card Padding | `1.25rem` (20px) | Standard card padding |
| Button Padding | `0.5rem 1rem` | Standard button |
| Large Button | `0.75rem 1.5rem` | Hero CTAs |
| Mac Shadow | `6px 6px 0 0 #f0f0f0` | Default card shadow |
| Hover Shadow | `8px 8px 0 0 #ccc` | On hover |
| Border Radius | 2px / 6px / 8px | Cards / Buttons / Logo |
| Transition | `all .3s ease` | Universal animation |

---

## When to Use This Guide

- Building ChromaDB-style websites
- Implementing brutalist/neo-brutalist designs
- Creating Mac-style card layouts
- Designing developer-focused UIs
- Establishing consistent shadows and spacing
- Implementing elegant serif + sans-serif typography
- Creating themed hover states

---

**Remember**: The full guide contains extensive code examples, detailed explanations, and visual patterns. Use this summary to quickly locate the information you need, then jump to the specific line ranges in `chromadb-style-guide.md` for complete implementation details.
