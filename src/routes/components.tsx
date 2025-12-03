import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Container, Heading, Text } from '~/components/ui'

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
const NavbarSection = lazy(() =>
  import('~/components/style-guide-page/NavbarSection').then(m => ({ default: m.NavbarSection }))
)
const ContainerSection = lazy(() =>
  import('~/components/style-guide-page/ContainerSection').then(m => ({ default: m.ContainerSection }))
)
const DarkModeToggleSection = lazy(() =>
  import('~/components/style-guide-page/DarkModeToggleSection').then(m => ({ default: m.DarkModeToggleSection }))
)
const DesignTokensSection = lazy(() =>
  import('~/components/style-guide-page/DesignTokensSection').then(m => ({ default: m.DesignTokensSection }))
)
const SocialLinksSection = lazy(() =>
  import('~/components/style-guide-page/SocialLinksSection').then(m => ({ default: m.SocialLinksSection }))
)
const BlogCardsSection = lazy(() =>
  import('~/components/style-guide-page/BlogCardsSection').then(m => ({ default: m.BlogCardsSection }))
)
const ProjectCardsSection = lazy(() =>
  import('~/components/style-guide-page/ProjectCardsSection').then(m => ({ default: m.ProjectCardsSection }))
)
const StatusIndicatorSection = lazy(() =>
  import('~/components/style-guide-page/StatusIndicatorSection').then(m => ({ default: m.StatusIndicatorSection }))
)
const PostListSection = lazy(() =>
  import('~/components/style-guide-page/PostListSection').then(m => ({ default: m.PostListSection }))
)
const ProjectListSection = lazy(() =>
  import('~/components/style-guide-page/ProjectListSection').then(m => ({ default: m.ProjectListSection }))
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
    <div className="py-8 sm:py-12">
      <Container>
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
          <DarkModeToggleSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <StatusIndicatorSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SocialLinksSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <CardsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <BlogCardsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ProjectCardsSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <PostListSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ProjectListSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <NavbarSection />
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
