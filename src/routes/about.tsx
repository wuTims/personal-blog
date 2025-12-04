import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { allAbouts } from 'content-collections'
import { Container } from '~/components/ui'

export const Route = createFileRoute('/about')({
  loader: () => {
    const aboutData = allAbouts[0]
    if (!aboutData) {
      throw new Error('About content not found')
    }
    return { about: aboutData }
  },
  component: AboutPage,
})

const fadeUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      bounce: 0.3,
      duration: 0.8,
    },
  },
}

function AboutPage() {
  const { about } = Route.useLoaderData()

  return (
    <Container size="md" className="py-12 lg:py-20">
      {/* Header */}
      <motion.header
        className="mb-12 text-center"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">
          {about.title}
        </h1>
        {about.subtitle && (
          <motion.p
            className="mt-4 text-xl text-neutral-600 dark:text-neutral-400"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            {about.subtitle}
          </motion.p>
        )}
      </motion.header>

      {/* Content */}
      <motion.article
        className="prose"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        dangerouslySetInnerHTML={{ __html: about.html }}
      />
    </Container>
  )
}
