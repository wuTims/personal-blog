import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

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
        glass: 'bg-white/50 dark:bg-neutral-950/60 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 dark:border-white/10 shadow-sm shadow-black/5 dark:shadow-black/20',
        elevated: 'bg-card border-b border-border shadow-sm',
      },
      sticky: {
        true: 'sticky top-0 z-50',
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
        default:
          'hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800',
        muted:
          'hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800',
        emerald:
          'hover:text-emerald hover:bg-emerald/10 dark:hover:bg-emerald/20 hover:shadow-sm dark:hover:glow-emerald',
        coral:
          'hover:text-coral hover:bg-coral/10 dark:hover:bg-coral/20 hover:shadow-sm dark:hover:glow-coral',
        lavender:
          'hover:text-lavender hover:bg-lavender/10 dark:hover:bg-lavender/20 hover:shadow-sm dark:hover:glow-lavender',
        sky:
          'hover:text-sky hover:bg-sky/10 dark:hover:bg-sky/20 hover:shadow-sm dark:hover:glow-sky',
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
      {
        variant: 'emerald',
        active: true,
        className: 'text-emerald bg-emerald/10 dark:bg-emerald/20 shadow-sm dark:glow-emerald',
      },
      {
        variant: 'coral',
        active: true,
        className: 'text-coral bg-coral/10 dark:bg-coral/20 shadow-sm dark:glow-coral',
      },
      {
        variant: 'lavender',
        active: true,
        className: 'text-lavender bg-lavender/10 dark:bg-lavender/20 shadow-sm dark:glow-lavender',
      },
      {
        variant: 'sky',
        active: true,
        className: 'text-sky bg-sky/10 dark:bg-sky/20 shadow-sm dark:glow-sky',
      },
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
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
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
}
