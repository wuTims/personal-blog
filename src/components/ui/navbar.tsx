import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { cn } from '~/lib/utils'
import {
  type AccentColor,
  accentActivePill,
  accentBgLight,
  accentText,
} from '~/lib/color-variants'
import { CloseIcon, MenuIcon } from './icons'

/* ============================================
   Navbar Component
   - Mobile-first responsive navigation
   - ChromaDB style: Inter font, high contrast, minimal aesthetic
   ============================================ */

const navbarVariants = cva(
  'w-full font-sans',
  {
    variants: {
      variant: {
        default: 'bg-background border-b border-border',
        transparent: 'bg-transparent',
        glass: 'bg-white/80 dark:bg-neutral-950/80 sm:bg-white/50 sm:dark:bg-neutral-950/60 backdrop-blur-sm sm:backdrop-blur-md sm:backdrop-saturate-150 border-b border-white/20 dark:border-white/10 shadow-sm shadow-black/5 dark:shadow-black/20',
        elevated: 'bg-card border-b border-border shadow-sm',
      },
      sticky: {
        true: 'sticky top-0 z-[var(--z-sticky)] will-change-transform',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      sticky: false,
    },
  }
)

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {}

const Navbar = React.memo(
  React.forwardRef<HTMLElement, NavbarProps>(
    ({ className, variant, sticky, children, ...props }, ref) => {
      return (
        <nav
          ref={ref}
          className={cn(navbarVariants({ variant, sticky, className }))}
          {...props}
        >
          <div className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
            {children}
          </div>
        </nav>
      )
    }
  )
)
Navbar.displayName = 'Navbar'

/* ============================================
   NavbarBrand Component
   - Logo/brand section (left side)
   ============================================ */

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string
}

const NavbarBrand = React.memo(
  React.forwardRef<HTMLDivElement, NavbarBrandProps>(
    ({ className, href, children, ...props }, ref) => {
      const content = (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-2 font-serif text-lg font-semibold sm:text-xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      )

      if (href) {
        return (
          <a href={href} className="transition-opacity hover:opacity-80">
            {content}
          </a>
        )
      }

      return content
    }
  )
)
NavbarBrand.displayName = 'NavbarBrand'

/* ============================================
   NavbarContent Component
   - Container for nav items
   ============================================ */

const navbarContentVariants = cva('flex items-center', {
  variants: {
    position: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    gap: {
      sm: 'gap-2 sm:gap-3',
      default: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
    },
  },
  defaultVariants: {
    position: 'end',
    gap: 'default',
  },
})

export interface NavbarContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navbarContentVariants> {
  hideOnMobile?: boolean
}

const NavbarContent = React.memo(
  React.forwardRef<HTMLDivElement, NavbarContentProps>(
    ({ className, position, gap, hideOnMobile, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            navbarContentVariants({ position, gap }),
            hideOnMobile && 'hidden sm:flex',
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }
  )
)
NavbarContent.displayName = 'NavbarContent'

/* ============================================
   Shared Link Color Compound Variants
   - Uses centralized color-variants.ts utilities
   ============================================ */

const accentColors: AccentColor[] = ['emerald', 'coral', 'lavender', 'sky']

/** Generate active compound variants for accent colors with optional glow */
const createAccentCompoundVariants = (options?: { withGlow?: boolean }) =>
  accentColors.map((color) => ({
    variant: color,
    active: true as const,
    className: options?.withGlow
      ? `${accentText[color]} ${accentActivePill[color]}`
      : `${accentText[color]} ${accentBgLight[color]}`,
  }))

/* ============================================
   NavbarLink Component
   - Individual navigation link
   ============================================ */

const navbarLinkVariants = cva(
  [
    'relative inline-flex items-center font-medium',
    'transition-all duration-200 ease-out',
    'px-2 py-1 -mx-2 rounded-md',
  ],
  {
    variants: {
      variant: {
        default: 'hover:text-neutral-900 dark:hover:text-neutral-50',
        muted: 'hover:text-foreground',
        emerald: 'hover:text-emerald',
        coral: 'hover:text-coral',
        lavender: 'hover:text-lavender',
        sky: 'hover:text-sky',
      },
      size: {
        sm: 'text-xs sm:text-sm',
        default: 'text-sm sm:text-base',
        lg: 'text-base sm:text-lg',
      },
      active: {
        true: 'font-semibold',
        false: 'text-neutral-600 dark:text-neutral-400',
      },
    },
    compoundVariants: [
      // Active states with colored highlights
      {
        variant: 'default',
        active: true,
        className: 'text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800',
      },
      {
        variant: 'muted',
        active: true,
        className: 'text-foreground bg-neutral-100 dark:bg-neutral-800',
      },
      // Accent colors with glow effect (uses color-variants.ts)
      ...createAccentCompoundVariants({ withGlow: true }),
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      // Note: active has no default - text color comes from inactiveProps/activeProps
    },
  }
)

export interface NavbarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navbarLinkVariants> {}

const NavbarLink = React.memo(
  React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
    ({ className, variant, size, active, children, ...props }, ref) => {
      return (
        <a
          ref={ref}
          className={cn(navbarLinkVariants({ variant, size, active, className }))}
          {...props}
        >
          {children}
        </a>
      )
    }
  )
)
NavbarLink.displayName = 'NavbarLink'

/* ============================================
   NavbarToggle Component
   - Hamburger menu button for mobile
   ============================================ */

export interface NavbarToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
}

const NavbarToggle = React.memo(
  React.forwardRef<HTMLButtonElement, NavbarToggleProps>(
    ({ className, isOpen = false, ...props }, ref) => {
      return (
        <button
          ref={ref}
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md sm:hidden',
            'text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            className
          )}
          {...props}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      )
    }
  )
)
NavbarToggle.displayName = 'NavbarToggle'

/* ============================================
   NavbarMenu Component
   - Mobile dropdown menu
   ============================================ */

export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const NavbarMenu = React.memo(
  React.forwardRef<HTMLDivElement, NavbarMenuProps>(
    ({ className, isOpen = false, children, ...props }, ref) => {
      if (!isOpen) return null

      return (
        <div
          ref={ref}
          className={cn(
            'absolute left-0 right-0 top-full border-b border-border bg-background px-4 py-4 sm:hidden',
            className
          )}
          {...props}
        >
          <div className="flex flex-col gap-3">{children}</div>
        </div>
      )
    }
  )
)
NavbarMenu.displayName = 'NavbarMenu'

/* ============================================
   NavbarDivider Component
   - Visual separator between nav items
   ============================================ */

const NavbarDivider = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn('h-4 w-px bg-border', className)}
          role="separator"
          {...props}
        />
      )
    }
  )
)
NavbarDivider.displayName = 'NavbarDivider'

/* ============================================
   NavbarToggleAnimated Component
   - 2-line hamburger with spring animation to X
   ============================================ */

export interface NavbarToggleAnimatedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
}

const NavbarToggleAnimated = React.memo(
  React.forwardRef<HTMLButtonElement, NavbarToggleAnimatedProps>(
    ({ className, isOpen = false, ...props }, ref) => {
      return (
        <button
          ref={ref}
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className={cn(
            'relative inline-flex h-10 w-10 items-center justify-center rounded-md sm:hidden',
            'text-foreground transition-colors hover:cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            className
          )}
          {...props}
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <motion.span
              className="h-0.5 w-full origin-center rounded-full bg-current"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 7 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            />
            <motion.span
              className="h-0.5 w-full origin-center rounded-full bg-current"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -7 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            />
          </div>
        </button>
      )
    }
  )
)
NavbarToggleAnimated.displayName = 'NavbarToggleAnimated'

/* ============================================
   NavbarSidebar Component
   - Full-height animated sidebar for mobile
   ============================================ */

const sidebarVariants = cva(
  'fixed top-0 z-[var(--z-modal)] h-full bg-background shadow-xl sm:hidden',
  {
    variants: {
      position: {
        left: 'left-0',
        right: 'right-0',
      },
      width: {
        default: 'w-72',
        sm: 'w-64',
        lg: 'w-80',
        full: 'w-full',
      },
    },
    defaultVariants: {
      position: 'right',
      width: 'default',
    },
  }
)

export interface NavbarSidebarProps
  extends VariantProps<typeof sidebarVariants> {
  isOpen?: boolean
  onClose?: () => void
  className?: string
  children?: React.ReactNode
}

const NavbarSidebar = React.memo(
  React.forwardRef<HTMLDivElement, NavbarSidebarProps>(
    (
      {
        className,
        isOpen = false,
        onClose,
        position = 'right',
        width,
        children,
      },
      ref
    ) => {
      // Determine slide direction based on position
      const slideFrom = position === 'left' ? '-100%' : '100%'

      return (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/50 backdrop-blur-sm sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                aria-hidden="true"
              />

              {/* Sidebar */}
              <motion.div
                ref={ref}
                className={cn(sidebarVariants({ position, width, className }))}
                initial={{ x: slideFrom }}
                animate={{ x: 0 }}
                exit={{ x: slideFrom }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              >
                <div className="flex h-full flex-col">{children}</div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )
    }
  )
)
NavbarSidebar.displayName = 'NavbarSidebar'

/* ============================================
   NavbarSidebarHeader Component
   - Header section for sidebar with close button
   ============================================ */

export interface NavbarSidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

const NavbarSidebarHeader = React.memo(
  React.forwardRef<HTMLDivElement, NavbarSidebarHeaderProps>(
    ({ className, onClose, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(
            'flex h-14 items-center justify-between border-b border-border px-4 sm:h-16',
            className
          )}
          {...props}
        >
          <div className="font-serif text-lg font-semibold">{children}</div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )
    }
  )
)
NavbarSidebarHeader.displayName = 'NavbarSidebarHeader'

/* ============================================
   NavbarSidebarContent Component
   - Main content area for sidebar links
   ============================================ */

const NavbarSidebarContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn('flex-1 overflow-y-auto px-4 py-6 pt-14', className)}
          {...props}
        >
          <nav className="flex flex-col gap-2">{children}</nav>
        </div>
      )
    }
  )
)
NavbarSidebarContent.displayName = 'NavbarSidebarContent'

/* ============================================
   NavbarSidebarFooter Component
   - Footer section for sidebar
   ============================================ */

const NavbarSidebarFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn('border-t border-border px-4 py-4', className)}
          {...props}
        >
          {children}
        </div>
      )
    }
  )
)
NavbarSidebarFooter.displayName = 'NavbarSidebarFooter'

/* ============================================
   NavbarSidebarLink Component
   - Animated link for sidebar navigation
   ============================================ */

const navbarSidebarLinkVariants = cva(
  [
    'relative flex items-center gap-3 rounded-lg px-3 py-3 font-medium',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        default:
          'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        emerald:
          'text-neutral-600 hover:bg-emerald/10 hover:text-emerald dark:text-neutral-400 dark:hover:bg-emerald/20',
        coral:
          'text-neutral-600 hover:bg-coral/10 hover:text-coral dark:text-neutral-400 dark:hover:bg-coral/20',
        lavender:
          'text-neutral-600 hover:bg-lavender/10 hover:text-lavender dark:text-neutral-400 dark:hover:bg-lavender/20',
        sky: 'text-neutral-600 hover:bg-sky/10 hover:text-sky dark:text-neutral-400 dark:hover:bg-sky/20',
      },
      active: {
        true: 'font-semibold',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        active: true,
        className:
          'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50',
      },
      // Accent colors without glow (uses color-variants.ts)
      ...createAccentCompoundVariants({ withGlow: false }),
    ],
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  }
)

export interface NavbarSidebarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navbarSidebarLinkVariants> {}

const NavbarSidebarLink = React.memo(
  React.forwardRef<HTMLAnchorElement, NavbarSidebarLinkProps>(
    ({ className, variant, active, children, ...props }, ref) => {
      return (
        <a
          ref={ref}
          className={cn(
            navbarSidebarLinkVariants({ variant, active, className })
          )}
          {...props}
        >
          {children}
        </a>
      )
    }
  )
)
NavbarSidebarLink.displayName = 'NavbarSidebarLink'

export {
  Navbar,
  navbarVariants,
  NavbarBrand,
  NavbarContent,
  navbarContentVariants,
  NavbarLink,
  navbarLinkVariants,
  NavbarToggle,
  NavbarMenu,
  NavbarDivider,
  NavbarToggleAnimated,
  NavbarSidebar,
  sidebarVariants,
  NavbarSidebarHeader,
  NavbarSidebarContent,
  NavbarSidebarFooter,
  NavbarSidebarLink,
  navbarSidebarLinkVariants,
}
