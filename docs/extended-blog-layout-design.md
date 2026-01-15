# Extended Blog Layout Design

> Architecture decision document for scaling the blog as content grows.

---

## Problem Statement

As the number of posts and projects increases, the current layout will not scale:

- **Landing page** shows all posts/projects in a list — will become too long
- **`/blog` route** displays all content in card grids — no pagination, grows unbounded
- **No dedicated archives** for posts-only or projects-only browsing

This document outlines the recommended architecture for handling content growth while maintaining the neobrutalist design aesthetic.

---

## Current State

### Route Structure

| Route | Purpose | Content Display |
|-------|---------|-----------------|
| `/` | Landing/intro page | Recent posts + projects in minimal list format with hover-reveal descriptions |
| `/blog` | Content hub | ALL posts + ALL projects in card grid, two sections |
| `/blog/posts/$slug` | Individual post | Full article |
| `/blog/projects/$slug` | Individual project | Full article |

### What's Missing

- `/blog/posts` — Standalone posts archive with pagination
- `/blog/projects` — Standalone projects archive with pagination
- Content limits on landing page and `/blog` hub
- Tab navigation for filtering content types

---

## Recommended Architecture

### Route Structure

```
/                        → Landing page (limited preview)
/blog                    → Hub with tab navigation, shows preview of both
/blog/posts              → All posts archive, paginated
/blog/projects           → All projects archive, paginated
/blog/posts/$slug        → Individual post (exists)
/blog/projects/$slug     → Individual project (exists)
```

### File Structure

```
src/routes/
├── index.tsx                    # Landing page
├── blog/
│   ├── route.tsx                # Layout with shared tab navigation
│   ├── index.tsx                # /blog - combined preview view
│   ├── posts/
│   │   ├── index.tsx            # /blog/posts - all posts, paginated
│   │   └── $slug.tsx            # /blog/posts/$slug (exists)
│   └── projects/
│       ├── index.tsx            # /blog/projects - all projects, paginated
│       └── $slug.tsx            # /blog/projects/$slug (exists)
```

---

## Content Flow by Page

### Landing Page (`/`)

**Purpose:** Personal introduction, gateway to content

**Content limits:**
- Show **3-4 most recent posts** (list format, hover-reveal)
- Show **3-4 most recent projects** (list format, hover-reveal)

**Navigation:**
- "View all posts →" link to `/blog/posts`
- "View all projects →" link to `/blog/projects`
- Existing CTAs: "Read the Blog" → `/blog`, "Component Library" → `/components`

**Rationale:** Landing page should remain focused on introduction, not become a content dump. Limited preview entices exploration without overwhelming first-time visitors.

### Blog Hub (`/blog`)

**Purpose:** Central content hub with filtering capability

**Content limits:**
- Show **6 most recent posts** in card grid
- Show **6 most recent projects** in card grid
- Or: Show **12 items total** when "All" tab is active

**Navigation:**
- Tab navigation: `All | Posts | Projects`
- "View all →" links within each section if content exceeds limit
- Cards link to individual post/project pages

**Tab behavior:**
| Tab | Route | Content |
|-----|-------|---------|
| All | `/blog` | 6 posts + 6 projects (or 12 mixed, date-sorted) |
| Posts | `/blog/posts` | Redirects to posts archive |
| Projects | `/blog/projects` | Redirects to projects archive |

**Alternative:** Tabs could filter in-place on `/blog` using query params (`/blog?tab=posts`), but dedicated routes are better for SEO and shareability.

### Posts Archive (`/blog/posts`)

**Purpose:** Complete, browsable posts collection

**Content:** All published posts, paginated

**Pagination:**
- 9 or 12 posts per page (3x3 or 3x4 grid)
- URL structure: `/blog/posts?page=2` or `/blog/posts/page/2`

**Navigation:**
- Tab navigation (shared from layout, "Posts" tab active)
- Pagination controls at bottom
- Cards link to `/blog/posts/$slug`

### Projects Archive (`/blog/projects`)

**Purpose:** Complete, browsable projects collection

**Content:** All published projects, paginated

**Pagination:**
- 9 or 12 projects per page
- URL structure: `/blog/projects?page=2`

**Navigation:**
- Tab navigation (shared from layout, "Projects" tab active)
- Pagination controls at bottom
- Cards link to `/blog/projects/$slug`

---

## Component Designs

### Tab Navigation

**Location:** `src/routes/blog/route.tsx` (shared layout)

**Neobrutalist styling:**
- Sharp underline indicator (no pills, no rounded tabs)
- Uppercase, tracked lettering
- Bold border-bottom on active state
- High contrast: black text on white, inverts in dark mode

```tsx
// Conceptual implementation
<nav className="mb-8 flex gap-6 border-b-2 border-neutral-200 dark:border-neutral-800">
  {tabs.map((tab) => (
    <Link
      key={tab.href}
      to={tab.href}
      className={cn(
        "pb-3 text-sm font-semibold uppercase tracking-wider transition-colors",
        isActive(tab.href)
          ? "border-b-2 border-foreground text-foreground -mb-[2px]"
          : "text-muted hover:text-foreground"
      )}
    >
      {tab.label}
      {tab.count && (
        <span className="ml-2 text-xs text-muted">({tab.count})</span>
      )}
    </Link>
  ))}
</nav>
```

**Visual representation:**
```
   All (24)      Posts (16)      Projects (8)
   ════════      ──────────      ────────────
   (active)
```

### Pagination Component

**Neobrutalist styling:**
- Sharp rectangular buttons with black borders
- Mac-shadow on hover for current page indicator
- No rounded corners (use `rounded-sm` / 2px max)
- Clear disabled states

```tsx
// Conceptual implementation
<nav className="mt-12 flex items-center justify-center gap-2">
  <PaginationButton disabled={page === 1}>
    ← Previous
  </PaginationButton>

  {pageNumbers.map((num) => (
    <PaginationButton
      key={num}
      active={num === currentPage}
    >
      {num}
    </PaginationButton>
  ))}

  <PaginationButton disabled={page === totalPages}>
    Next →
  </PaginationButton>
</nav>
```

**Button states:**
| State | Style |
|-------|-------|
| Default | `border border-neutral-300 bg-white text-foreground` |
| Hover | `border-foreground shadow-mac transform -translate-y-0.5` |
| Active | `bg-foreground text-background border-foreground` |
| Disabled | `opacity-50 cursor-not-allowed` |

### "View All" Link Pattern

**Used on:** Landing page, Blog hub (within sections)

```tsx
<Link
  to="/blog/posts"
  className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
>
  View all {count} posts
  <span className="transition-transform group-hover:translate-x-1">→</span>
</Link>
```

---

## Implementation Considerations

### URL Strategy

**Recommended:** Nested routes over query parameters

| Approach | URL | Pros | Cons |
|----------|-----|------|------|
| Nested routes | `/blog/posts` | SEO-friendly, shareable, bookmarkable | More files to create |
| Query params | `/blog?tab=posts` | Single route file | Less SEO-friendly, state management needed |

**Decision:** Use nested routes for archives, query params only for pagination within archives.

### Pagination Strategy

**Options considered:**

| Strategy | Description | Fit |
|----------|-------------|-----|
| Numbered pages | Traditional 1, 2, 3... navigation | ✓ Best — clear, brutalist, accessible |
| Load more button | Single button appends content | ○ Simpler but less precise navigation |
| Infinite scroll | Auto-loads on scroll | ✗ Conflicts with footer, harder to bookmark |

**Decision:** Numbered pagination with Previous/Next buttons.

**Items per page:** 9 (3x3 grid) or 12 (3x4 grid) — maintains grid alignment across breakpoints.

### Content Sorting

**Default sort:** Date descending (newest first)

**Future consideration:** Add sort controls if needed:
- Date (newest/oldest)
- Title (A-Z)
- Featured first

For MVP, date descending is sufficient and matches user expectations.

### SEO Considerations

Each archive page should have:
- Unique `<title>`: "Posts | Blog | wutims", "Projects | Blog | wutims"
- Unique meta description
- Canonical URL (especially for paginated pages)
- Proper heading hierarchy: h1 for page title, h2 for card titles

Paginated pages:
- Include page number in title: "Posts - Page 2 | Blog | wutims"
- Use `rel="prev"` and `rel="next"` link tags
- Canonical should point to page 1 for SEO consolidation (debatable)

---

## Migration Path

### Phase 1: Add Archive Routes

1. Create `/blog/posts/index.tsx` with all posts, no pagination yet
2. Create `/blog/projects/index.tsx` with all projects, no pagination yet
3. Update `/blog/route.tsx` to include tab navigation
4. Test navigation flow

### Phase 2: Add Content Limits

1. Update landing page to show only 3-4 items per section
2. Add "View all →" links to landing page
3. Update `/blog/index.tsx` to show 6 items per section
4. Add "View all →" links to blog hub sections

### Phase 3: Add Pagination

1. Create reusable `Pagination` component
2. Add pagination to `/blog/posts/index.tsx`
3. Add pagination to `/blog/projects/index.tsx`
4. Handle URL state with TanStack Router search params

### Phase 4: Polish

1. Add loading states for page transitions
2. Add empty states for filtered views
3. Test responsive behavior
4. Verify dark mode styling
5. Accessibility audit (keyboard navigation, screen readers)

---

## Design System Compliance

All new components must follow the ChromaDB neobrutalist design system:

| Element | Requirement |
|---------|-------------|
| Typography | Serif headings (Playfair Display), sans-serif body (Inter) |
| Colors | Use existing CSS variables, accent colors on hover only |
| Borders | Sharp edges, 2px max radius, black/white emphasis borders |
| Shadows | Mac-style offset shadows only (`--shadow-mac`) |
| Spacing | Base unit 4px, consistent with existing patterns |
| Animation | 0.3s ease transitions, subtle translateY on hover |

**Reference files:**
- `docs/summaries/chromadb-style-guide-summary.md`
- `src/globals.css`
- `src/components/ui/button.tsx` (CVA patterns)
- `src/components/ui/card.tsx` (Mac-shadow patterns)

---

## Alternatives Considered

### Horizontal Scroll Carousels

**Rejected because:**
- Hides content, reduces discoverability
- Conflicts with mobile scroll gestures
- Harder to navigate with keyboard
- Doesn't match the typography-focused aesthetic

### Infinite Scroll

**Rejected because:**
- Makes footer unreachable or requires sticky footer
- Harder to bookmark specific content
- No clear sense of content boundaries
- Can feel overwhelming with large datasets

### Accordion Sections on Landing

**Considered but deferred:**
- Could work for landing page to show more content on demand
- Adds interaction complexity
- May revisit if "View all" links feel insufficient

### Separate `/posts` and `/projects` at Root

**Rejected because:**
- Breaks the `/blog` as content hub mental model
- Feels disconnected from the blog brand
- Less intuitive navigation hierarchy

---

## Open Questions

1. **Should `/blog` "All" tab show interleaved date-sorted content or separate sections?**
   - Current: Separate sections (Posts, then Projects)
   - Alternative: Single mixed feed sorted by date

2. **Pagination: Query params or path segments?**
   - `/blog/posts?page=2` (recommended for simplicity)
   - `/blog/posts/page/2` (cleaner URLs but more routing complexity)

3. **Should the tab navigation be sticky on scroll?**
   - Pro: Always accessible for switching views
   - Con: Takes up vertical space, may feel heavy

4. **Featured content treatment?**
   - Should featured posts/projects pin to top regardless of date?
   - Should they have visual distinction in archives?

---

## Summary

| Page | Content Limit | Pagination | Navigation |
|------|---------------|------------|------------|
| Landing `/` | 3-4 each | No | "View all →" links |
| Blog hub `/blog` | 6 each | No | Tab navigation |
| Posts archive `/blog/posts` | All | Yes (9-12/page) | Tabs + pagination |
| Projects archive `/blog/projects` | All | Yes (9-12/page) | Tabs + pagination |

This architecture scales gracefully, maintains the neobrutalist aesthetic, and provides clear navigation patterns for users exploring content.
