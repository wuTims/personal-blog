import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  DarkModeToggle,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarToggle,
  NavbarMenu,
  navbarLinkVariants,
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

export function SiteNavbar({ className }: SiteNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Navbar variant="glass" sticky className={className}>
      <NavbarBrand href="/">tim</NavbarBrand>

      {/* Desktop Menu */}
      <NavbarContent hideOnMobile gap="default">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={navbarLinkVariants({ variant: link.variant })}
            inactiveProps={{
              className: navbarLinkVariants({ variant: link.variant, active: false }),
            }}
            activeProps={{
              className: navbarLinkVariants({ variant: link.variant, active: true }),
            }}
          >
            {link.label}
          </Link>
        ))}
        <DarkModeToggle size="sm" variant="ghost" />
      </NavbarContent>

      {/* Mobile Controls */}
      <div className="flex items-center gap-2 sm:hidden">
        <DarkModeToggle size="sm" variant="ghost" />
        <NavbarToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Mobile Menu */}
      <NavbarMenu isOpen={isOpen}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={navbarLinkVariants({ variant: link.variant, size: 'lg' })}
            inactiveProps={{
              className: navbarLinkVariants({ variant: link.variant, size: 'lg', active: false }),
            }}
            activeProps={{
              className: navbarLinkVariants({ variant: link.variant, size: 'lg', active: true }),
            }}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
