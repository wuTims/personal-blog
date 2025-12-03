import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  DarkModeToggle,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarToggleAnimated,
  NavbarSidebar,
  NavbarSidebarContent,
  navbarLinkVariants,
  navbarSidebarLinkVariants,
} from '~/components/ui'

interface SiteNavbarProps {
  className?: string
}

type LinkVariant = 'emerald' | 'coral' | 'lavender' | 'sky'

const navLinks: { to: string; label: string; variant: LinkVariant }[] = [
  { to: '/', label: 'Home', variant: 'emerald' },
  { to: '/about', label: 'About', variant: 'coral' },
  { to: '/projects', label: 'Projects', variant: 'lavender' },
  { to: '/blog', label: 'Blog', variant: 'sky' },
]

// Pill backgrounds (matches navbarLinkVariants active bg)
const pillBg: Record<LinkVariant, string> = {
  emerald: 'bg-emerald/10 dark:bg-emerald/20 shadow-sm dark:glow-emerald',
  coral: 'bg-coral/10 dark:bg-coral/20 shadow-sm dark:glow-coral',
  lavender: 'bg-lavender/10 dark:bg-lavender/20 shadow-sm dark:glow-lavender',
  sky: 'bg-sky/10 dark:bg-sky/20 shadow-sm dark:glow-sky',
}

// Active text colors (without background - pill handles that)
const activeText: Record<LinkVariant, string> = {
  emerald: 'text-emerald font-semibold',
  coral: 'text-coral font-semibold',
  lavender: 'text-lavender font-semibold',
  sky: 'text-sky font-semibold',
}

export function SiteNavbar({ className }: SiteNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Determine active link - exact match for home, startsWith for others
  const activeLink = navLinks.find((link) =>
    link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
  )

  return (
    <>
      <Navbar variant="glass" sticky className={className}>
        <NavbarBrand href="/">tim</NavbarBrand>

        {/* Desktop Menu */}
        <NavbarContent hideOnMobile gap="default">
          {navLinks.map((link) => {
            const isActive = activeLink?.to === link.to

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative ${navbarLinkVariants({ variant: link.variant })} ${isActive ? activeText[link.variant] : ''}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className={pillBg[link.variant]}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 6,
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
          <DarkModeToggle size="sm" variant="ghost" />
        </NavbarContent>

        {/* Mobile Controls - Toggle stays in navbar for seamless animation */}
        <div className="flex items-center gap-2 sm:hidden">
          <DarkModeToggle size="sm" variant="ghost" />
          <NavbarToggleAnimated
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </Navbar>

      {/* Mobile Sidebar - Slides in from right */}
      <NavbarSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
      >
        <NavbarSidebarContent>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={navbarSidebarLinkVariants({ variant: link.variant })}
              inactiveProps={{
                className: navbarSidebarLinkVariants({ variant: link.variant, active: false }),
              }}
              activeProps={{
                className: navbarSidebarLinkVariants({ variant: link.variant, active: true }),
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </NavbarSidebarContent>
      </NavbarSidebar>
    </>
  )
}
