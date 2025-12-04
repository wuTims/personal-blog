import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Container, Heading, Text } from '~/components/ui'

// Static imports - all sections are needed for this page, so no code splitting benefit
import { TypographySection } from '~/components/style-guide-page/TypographySection'
import { ButtonsSection } from '~/components/style-guide-page/ButtonsSection'
import { CardsSection } from '~/components/style-guide-page/CardsSection'
import { NavbarSection } from '~/components/style-guide-page/NavbarSection'
import { ContainerSection } from '~/components/style-guide-page/ContainerSection'
import { DarkModeToggleSection } from '~/components/style-guide-page/DarkModeToggleSection'
import { DesignTokensSection } from '~/components/style-guide-page/DesignTokensSection'
import { SocialLinksSection } from '~/components/style-guide-page/SocialLinksSection'
import { BlogCardsSection } from '~/components/style-guide-page/BlogCardsSection'
import { ProjectCardsSection } from '~/components/style-guide-page/ProjectCardsSection'
import { StatusIndicatorSection } from '~/components/style-guide-page/StatusIndicatorSection'
import { PostListSection } from '~/components/style-guide-page/PostListSection'
import { ProjectListSection } from '~/components/style-guide-page/ProjectListSection'

export const Route = createFileRoute('/components')({
  component: ComponentsShowcase,
})

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
}

function ComponentsShowcase() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Header */}
        <motion.div
          className="mb-12 mt-8 sm:mb-16 sm:mt-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <Heading level="h1" className="mb-3 sm:mb-4">
              Component Library
            </Heading>
            <Text variant="muted" size="lg">
              Shared components built with the ChromaDB design system
            </Text>
          </div>
        </motion.div>

        {/* All sections loaded synchronously - animations run smoothly */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={sectionVariants}>
            <TypographySection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ButtonsSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <DarkModeToggleSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <StatusIndicatorSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <SocialLinksSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <CardsSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <BlogCardsSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ProjectCardsSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <PostListSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ProjectListSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <NavbarSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ContainerSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <DesignTokensSection />
          </motion.div>

          {/* Footer */}
          <motion.section
            variants={sectionVariants}
            className="flex flex-col items-center border-t pt-8 sm:pt-12"
          >
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
          </motion.section>
        </motion.div>
      </Container>
    </div>
  )
}
