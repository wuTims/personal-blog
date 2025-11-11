import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Container, DarkModeToggle, Heading, Text } from '~/components/ui'

// Lazy load sections for better code splitting and performance
const TypographySection = lazy(() =>
  import('~/components/style-guide-page/TypographySection').then(m => ({ default: m.TypographySection }))
)
const ButtonsSection = lazy(() =>
  import('~/components/style-guide-page/ButtonsSection').then(m => ({ default: m.ButtonsSection }))
)
const CardsSection = lazy(() =>
  import('~/components/style-guide-page/CardsSection').then(m => ({ default: m.CardsSection }))
)
const ContainerSection = lazy(() =>
  import('~/components/style-guide-page/ContainerSection').then(m => ({ default: m.ContainerSection }))
)
const DesignTokensSection = lazy(() =>
  import('~/components/style-guide-page/DesignTokensSection').then(m => ({ default: m.DesignTokensSection }))
)

export const Route = createFileRoute('/components')({
  component: ComponentsShowcase,
})

// Minimal loading fallback
function SectionFallback() {
  return <div className="mb-20 min-h-[200px] animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
}

function ComponentsShowcase() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <Container>
        <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
          <DarkModeToggle />
        </div>
        {/* Header */}
        <div className="mb-12 mt-8 sm:mb-16 sm:mt-0">
          <div className="text-center">
            <Heading level="h1" className="mb-3 sm:mb-4">
              Component Library
            </Heading>
            <Text variant="muted" size="lg">
              Shared components built with the ChromaDB design system
            </Text>
          </div>
        </div>

        {/* Lazy-loaded sections */}
        <Suspense fallback={<SectionFallback />}>
          <TypographySection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ButtonsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <CardsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ContainerSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <DesignTokensSection />
        </Suspense>

        {/* Footer */}
        <section className="flex flex-col items-center border-t pt-8 sm:pt-12">
          <Text variant="muted" className="text-center">
            Component library built with TanStack Start, Tailwind CSS, and CVA
          </Text>
          <Text variant="muted" size="sm" className="mt-2 text-center">
            Following the ChromaDB design system principles
          </Text>
          <a
            href="/"
            className="mt-6 rounded-md bg-foreground px-6 py-3 text-center text-background transition-opacity hover:opacity-90 sm:mt-8"
          >
            Back to Home
          </a>
        </section>
      </Container>
    </div>
  )
}
