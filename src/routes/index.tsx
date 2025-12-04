import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { allPosts, allProjects } from 'content-collections'
import {
  GithubIcon,
  LinkedinIcon,
  ArticleIcon,
} from '~/components/ui/social-links'
import { Badge } from '~/components/ui'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const wordVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      bounce: 0.35,
      duration: 0.8,
    },
  },
}

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

function AnimatedWords({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const words = text.split(' ')

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Format date for display
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Get slug from file path
function getSlug(path: string) {
  return path.replace(/\.md$/, '')
}

const socialLinks = [
  { platform: 'GitHub', href: 'https://github.com/wuTims', Icon: GithubIcon },
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/in/timlwu',
    Icon: LinkedinIcon,
  },
  {
    platform: 'Resume',
    href: 'https://media.wutims.com/2025_wutims_resume.pdf',
    Icon: ArticleIcon,
  },
]

// Project type colors
type AccentColor = 'emerald' | 'coral' | 'lavender' | 'sky'

const accentBg: Record<AccentColor, string> = {
  emerald: 'bg-emerald',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  sky: 'bg-sky',
}

// Accent underline component
function AccentUnderline({ accent }: { accent: AccentColor }) {
  return (
    <span
      className={cn(
        'absolute right-0 -bottom-0.5 left-0 h-0.5 rounded-full transition-all duration-200 group-hover:h-[3px]',
        accentBg[accent]
      )}
    />
  )
}

// Detect if device supports hover (e.g., has a mouse/trackpad)
function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)')
    setSupportsHover(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setSupportsHover(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return supportsHover
}


function HomeComponent() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null
  )
  const supportsHover = useSupportsHover()

  // Get published posts and projects sorted by date
  const publishedPosts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const publishedProjects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-neutral-50 to-transparent dark:from-neutral-900/50" />

      <div className="flex flex-1 flex-col items-center py-20 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
            <AnimatedWords text="Hi, I'm Tim" />
          </h1>

          <motion.p
            className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-400"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Developer, table tennis mentor, home cook.
          </motion.p>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-500 dark:text-neutral-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.3,
              duration: 0.8,
              delay: 0.55,
            }}
          >
            Actively exploring applications of AI and the evolution of software
            development.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.3,
              duration: 0.8,
              delay: 0.7,
            }}
          >
            <Link
              to="/blog"
              className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Read the Blog
            </Link>
            <Link
              to="/components"
              className="text-sm leading-6 font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
            >
              Component Library <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Social Links - Below CTAs */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.3,
              duration: 0.8,
              delay: 0.85,
            }}
          >
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Connect with me
            </span>
            <div className="flex items-center gap-4">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  aria-label={link.platform}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.1, duration: 0.5 }}
                >
                  <link.Icon className="size-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Content sections */}
        <motion.div
          className="mt-24 w-full max-w-2xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {/* Recent Posts Section */}
          {publishedPosts.length > 0 && (
            <div className="mb-12">
              <p className="mb-4 text-xs font-medium tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                Recent posts
              </p>
              <div className="divide-border space-y-0 divide-y">
                {publishedPosts.map((post) => (
                  <Link
                    key={post._meta.path}
                    to="/blog/posts/$slug"
                    params={{ slug: getSlug(post._meta.path) }}
                    className="group block py-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground group-hover:text-foreground/80 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-muted text-sm">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    {/* Description reveals on hover */}
                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="text-muted pt-2 text-sm">
                          {post.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {publishedProjects.length > 0 && (
            <div>
              <p className="mb-4 text-xs font-medium tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                Projects
              </p>
              <div className="divide-border space-y-0 divide-y">
                {publishedProjects.map((project) => {
                  const accent: AccentColor = 'lavender'
                  const isExpanded = expandedProjectId === project._meta.path

                  return (
                    <div key={project._meta.path} className="group">
                      <Link
                        to="/blog/projects/$slug"
                        params={{ slug: getSlug(project._meta.path) }}
                        className="block py-5"
                        onClick={(e) => {
                          // On touch devices: first tap expands, second tap navigates
                          if (!supportsHover && !isExpanded) {
                            e.preventDefault()
                            setExpandedProjectId(project._meta.path)
                          }
                        }}
                      >
                        {/* Main row */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Title with accent underline */}
                                <span className="relative">
                                  <h3 className="text-foreground text-xl font-medium">
                                    {project.title}
                                  </h3>
                                  <AccentUnderline accent={accent} />
                                </span>

                                {/* Badge */}
                                {project.featured && (
                                  <Badge variant="featured">Featured</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-4">
                            <span className="text-muted hidden font-mono text-xs sm:block">
                              {project.tags?.slice(0, 2).join(' · ')}
                            </span>
                            <span className="text-muted text-sm">
                              {formatDate(project.date)}
                            </span>
                            {!supportsHover && (
                              <span
                                className={cn(
                                  'text-muted transition-transform duration-200',
                                  isExpanded && 'rotate-90'
                                )}
                              >
                                →
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expand section */}
                        <div
                          className={cn(
                            'grid overflow-hidden transition-[grid-template-rows] duration-300',
                            supportsHover
                              ? 'grid-rows-[0fr] group-hover:grid-rows-[1fr]'
                              : isExpanded
                                ? 'grid-rows-[1fr]'
                                : 'grid-rows-[0fr]'
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="pt-4">
                              <p className="text-muted line-clamp-2 text-sm">
                                {project.summary}
                              </p>
                              <span className="text-foreground/60 group-hover:text-foreground mt-2 inline-block text-sm transition-colors">
                                View project →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Minimal copyright */}
      <motion.footer
        className="py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          &copy; {new Date().getFullYear()} wutims
        </p>
      </motion.footer>
    </div>
  )
}
