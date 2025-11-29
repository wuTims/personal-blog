import { useState } from 'react'
import { Heading, Text } from '~/components/ui'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  NavbarToggleAnimated,
  NavbarSidebar,
  NavbarSidebarContent,
  NavbarSidebarLink,
} from '~/components/ui/navbar'

export function NavbarSection() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [toggleDemo, setToggleDemo] = useState(false)

  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Navbar
      </Heading>

      {/* Navbar Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Variants
        </Heading>
        <div className="flex flex-col gap-6">
          {/* Default Navbar */}
          <div className="overflow-hidden rounded-md border border-border">
            <Text variant="muted" size="sm" className="bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
              Default
            </Text>
            <Navbar variant="default">
              <NavbarBrand href="#">tim</NavbarBrand>
              <NavbarContent hideOnMobile>
                <NavbarLink href="#">Home</NavbarLink>
                <NavbarLink href="#">About</NavbarLink>
                <NavbarLink href="#">Projects</NavbarLink>
                <NavbarLink href="#">Blog</NavbarLink>
              </NavbarContent>
            </Navbar>
          </div>

          {/* Glass Navbar */}
          <div className="overflow-hidden rounded-md border border-border">
            <Text variant="muted" size="sm" className="bg-neutral-100 px-3 py-2 dark:bg-neutral-800">
              Glass (backdrop-blur)
            </Text>
            <div className="relative">
              {/* Background content to demonstrate blur */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 p-4">
                <div className="h-8 w-8 rounded-full bg-emerald" />
                <div className="h-8 w-8 rounded-full bg-coral" />
                <div className="h-8 w-8 rounded-full bg-lavender" />
                <div className="h-8 w-8 rounded-full bg-sky" />
              </div>
              <Navbar variant="glass" className="relative">
                <NavbarBrand href="#">tim</NavbarBrand>
                <NavbarContent hideOnMobile>
                  <NavbarLink href="#">Home</NavbarLink>
                  <NavbarLink href="#">About</NavbarLink>
                  <NavbarLink href="#">Projects</NavbarLink>
                  <NavbarLink href="#">Blog</NavbarLink>
                </NavbarContent>
              </Navbar>
            </div>
          </div>
        </div>
      </div>

      {/* Link Color Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Link Color Variants
        </Heading>
        <Text variant="muted" size="sm" className="mb-4">
          Hover over links to see colored highlights with subtle shadow
        </Text>
        <div className="overflow-hidden rounded-md border border-border">
          <Navbar variant="default">
            <NavbarBrand href="#">tim</NavbarBrand>
            <NavbarContent hideOnMobile gap="lg">
              <NavbarLink href="#" variant="emerald">Home</NavbarLink>
              <NavbarLink href="#" variant="coral">About</NavbarLink>
              <NavbarLink href="#" variant="lavender">Projects</NavbarLink>
              <NavbarLink href="#" variant="sky">Blog</NavbarLink>
            </NavbarContent>
          </Navbar>
        </div>
      </div>

      {/* Animated Toggle Demo */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Animated Toggle (2-line)
        </Heading>
        <Text variant="muted" size="sm" className="mb-4">
          Spring-animated hamburger with 2 lines that morphs into an X. Click to toggle.
        </Text>
        <div className="flex items-center gap-6">
          <div className="overflow-hidden rounded-md border border-border p-4">
            <NavbarToggleAnimated
              isOpen={toggleDemo}
              onClick={() => setToggleDemo(!toggleDemo)}
              className="!flex"
            />
          </div>
          <Text variant="muted" size="sm">
            State: {toggleDemo ? 'Open (x)' : 'Closed (=)'}
          </Text>
        </div>
      </div>

      {/* Animated Sidebar Example */}
      <div>
        <Heading level="h3" className="mb-4 sm:mb-6">
          Animated Sidebar
        </Heading>
        <Text variant="muted" size="sm" className="mb-4">
          Full-height sidebar with spring animation. Click the button to open.
        </Text>
        <div className="relative overflow-hidden rounded-md border border-border">
          <Navbar variant="glass" className="relative">
            <NavbarBrand href="#">tim</NavbarBrand>
            <NavbarContent hideOnMobile gap="lg">
              <NavbarLink href="#" variant="emerald" active>Home</NavbarLink>
              <NavbarLink href="#" variant="coral">About</NavbarLink>
              <NavbarLink href="#" variant="lavender">Projects</NavbarLink>
              <NavbarLink href="#" variant="sky">Blog</NavbarLink>
            </NavbarContent>
            <NavbarToggleAnimated
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </Navbar>
        </div>
        <NavbarSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          position="right"
        >
          <NavbarSidebarContent>
            <NavbarSidebarLink href="#" variant="emerald" active>
              Home
            </NavbarSidebarLink>
            <NavbarSidebarLink href="#" variant="coral">
              About
            </NavbarSidebarLink>
            <NavbarSidebarLink href="#" variant="lavender">
              Projects
            </NavbarSidebarLink>
            <NavbarSidebarLink href="#" variant="sky">
              Blog
            </NavbarSidebarLink>
          </NavbarSidebarContent>
        </NavbarSidebar>
      </div>
    </section>
  )
}
