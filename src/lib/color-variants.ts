/**
 * Centralized accent color system for the entire application.
 * Import these utilities instead of defining color mappings inline.
 */

/** Available accent colors */
export type AccentColor = 'emerald' | 'coral' | 'lavender' | 'sky'

/** Tag variant type including default option */
export type TagVariant = 'default' | AccentColor

// ============================================
// Solid Background Colors
// ============================================

/** Solid background color classes */
export const accentBg: Record<AccentColor, string> = {
  emerald: 'bg-emerald',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  sky: 'bg-sky',
}

// ============================================
// Transparent/Light Background Colors
// ============================================

/** Light transparent background (10% opacity, 20% in dark mode) */
export const accentBgLight: Record<AccentColor, string> = {
  emerald: 'bg-emerald/10 dark:bg-emerald/20',
  coral: 'bg-coral/10 dark:bg-coral/20',
  lavender: 'bg-lavender/10 dark:bg-lavender/20',
  sky: 'bg-sky/10 dark:bg-sky/20',
}

// ============================================
// Text Colors
// ============================================

/** Text color classes */
export const accentText: Record<AccentColor, string> = {
  emerald: 'text-emerald',
  coral: 'text-coral',
  lavender: 'text-lavender',
  sky: 'text-sky',
}

/** Active text styling (text color + font weight) */
export const accentActiveText: Record<AccentColor, string> = {
  emerald: 'text-emerald font-semibold',
  coral: 'text-coral font-semibold',
  lavender: 'text-lavender font-semibold',
  sky: 'text-sky font-semibold',
}

// ============================================
// Border Colors
// ============================================

/** Border color classes */
export const accentBorder: Record<AccentColor, string> = {
  emerald: 'border-emerald',
  coral: 'border-coral',
  lavender: 'border-lavender',
  sky: 'border-sky',
}

// ============================================
// Combined Styling (Background + Effects)
// ============================================

/** Active pill styling - transparent bg with shadow/glow in dark mode */
export const accentActivePill: Record<AccentColor, string> = {
  emerald: 'bg-emerald/10 dark:bg-emerald/20 shadow-sm dark:glow-emerald',
  coral: 'bg-coral/10 dark:bg-coral/20 shadow-sm dark:glow-coral',
  lavender: 'bg-lavender/10 dark:bg-lavender/20 shadow-sm dark:glow-lavender',
  sky: 'bg-sky/10 dark:bg-sky/20 shadow-sm dark:glow-sky',
}

/** Glow shadow classes (for dark mode effects) */
export const accentGlow: Record<AccentColor, string> = {
  emerald: 'shadow-sm dark:glow-emerald',
  coral: 'shadow-sm dark:glow-coral',
  lavender: 'shadow-sm dark:glow-lavender',
  sky: 'shadow-sm dark:glow-sky',
}

// ============================================
// Tag Styling (for Badge/Tag components)
// ============================================

/** Tag background + text color combinations (includes default) */
export const tagVariants: Record<TagVariant, string> = {
  default: 'bg-neutral-100 text-foreground dark:bg-neutral-800',
  emerald: 'bg-emerald/10 text-emerald',
  coral: 'bg-coral/10 text-coral',
  lavender: 'bg-lavender/10 text-lavender',
  sky: 'bg-sky/10 text-sky',
}
