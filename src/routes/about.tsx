import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { allAbouts } from 'content-collections'
import { Container } from '~/components/ui'
import { useState, useEffect } from 'react'
import { seoConfig, createPageMeta } from '~/lib/seo'

export const Route = createFileRoute('/about')({
  loader: () => {
    const aboutData = allAbouts[0]
    if (!aboutData) {
      throw new Error('About content not found')
    }
    return { about: aboutData }
  },
  head: () => ({
    meta: createPageMeta({
      title: 'About',
      description: 'About me - I write about AI development and life. I also teach table tennis and talk about food.',
      url: `${seoConfig.siteUrl}/about`,
    }),
    links: [{ rel: 'canonical', href: `${seoConfig.siteUrl}/about` }],
  }),
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
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true))
  }, [])

  const animateState = fontsReady ? 'visible' : 'hidden'

  return (
    <Container size="md" className="py-12 lg:py-20">
      {/* Header */}
      <motion.header
        className="mb-12 text-center"
        variants={fadeUpVariants}
        initial="hidden"
        animate={animateState}
      >
        <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">
          {about.title}
        </h1>
        {about.subtitle && (
          <motion.p
            className="mt-4 text-xl text-neutral-600 dark:text-neutral-400"
            variants={fadeUpVariants}
            initial="hidden"
            animate={animateState}
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
        animate={fontsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        dangerouslySetInnerHTML={{ __html: about.html }}
      />
    </Container>
  )
}
