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
import { type AccentColor, accentActivePill, accentActiveText } from '~/lib/color-variants'

interface SiteNavbarProps {
  className?: string
}

const navLinks: { to: string; label: string; variant: AccentColor }[] = [
  { to: '/', label: 'Home', variant: 'emerald' },
  { to: '/blog', label: 'Blog', variant: 'sky' },
  { to: '/about', label: 'About', variant: 'coral' },
  { to: '/components', label: 'Library', variant: 'lavender' },
]

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
                className={`relative ${navbarLinkVariants({ variant: link.variant })} ${isActive ? accentActiveText[link.variant] : ''}`}
              >
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={accentActivePill[link.variant]}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 6,
                      zIndex: 0,
                    }}
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
