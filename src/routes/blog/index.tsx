import { createFileRoute, Link } from '@tanstack/react-router'
import { allPosts, allProjects } from 'content-collections'
import { motion } from 'framer-motion'
import { Container, Heading, Text, BlogCard, ProjectCard } from '~/components/ui'
import { seoConfig, createPageMeta } from '~/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: createPageMeta({
      title: 'Blog',
      description:
        'Posts and projects about AI development, software engineering, and life.',
      url: `${seoConfig.siteUrl}/blog`,
    }),
    links: [{ rel: 'canonical', href: `${seoConfig.siteUrl}/blog` }],
  }),
  component: BlogIndexPage,
})

// Get slug from file path
function getSlug(path: string) {
  return path.replace(/\.md$/, '')
}

// Default placeholder image
const defaultPostImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop'
const defaultProjectImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
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

function BlogIndexPage() {
  // Get published posts and projects sorted by date
  const publishedPosts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const publishedProjects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
              Blog
            </Heading>
            <Text variant="muted" size="lg">
              My attempt at self expression
            </Text>
          </div>
        </motion.div>

        {/* Posts Section */}
        {publishedPosts.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
                Posts
              </Heading>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {publishedPosts.map((post) => (
                <motion.div key={post._meta.path} variants={itemVariants}>
                  <Link
                    to="/blog/posts/$slug"
                    params={{ slug: getSlug(post._meta.path) }}
                    className="block"
                  >
                    <BlogCard
                      imageSrc={post.cover || defaultPostImage}
                      imageAlt={post.title}
                      imagePosition={post.coverPosition}
                      title={post.title}
                      description={post.summary}
                      accentColor="sky"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Projects Section */}
        {publishedProjects.length > 0 && (
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: publishedPosts.length * 0.1 }}
            >
              <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
                Projects
              </Heading>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: publishedPosts.length * 0.1 }}
            >
              {publishedProjects.map((project) => (
                <motion.div key={project._meta.path} variants={itemVariants}>
                  <Link
                    to="/blog/projects/$slug"
                    params={{ slug: getSlug(project._meta.path) }}
                    className="block"
                  >
                    <ProjectCard
                      mediaSrc={project.cover || defaultProjectImage}
                      mediaAlt={project.title}
                      mediaPosition={project.coverPosition}
                      title={project.title}
                      description={project.summary}
                      tags={project.tags?.map((tag) => ({ label: tag, variant: 'lavender' as const }))}
                      accentColor="lavender"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </Container>
    </div>
  )
}
