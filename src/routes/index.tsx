import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { GithubIcon, LinkedinIcon } from '~/components/ui/social-links'

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
          className="inline-block mr-[0.25em]"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

const featuredPosts = [
  { title: 'Building with Claude Code', slug: '/blog/claude-code' },
  { title: 'Why I rebuilt my site', slug: '/blog/rebuild' },
]

const socialLinks = [
  { platform: 'GitHub', href: 'https://github.com/wuTims', Icon: GithubIcon },
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/in/timlwu',
    Icon: LinkedinIcon,
  },
]

function HomeComponent() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-neutral-50 to-transparent dark:from-neutral-900/50" />

      <div className="flex flex-1 flex-col items-center justify-center py-20 sm:py-32">
        <div className="text-center max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl">
            <AnimatedWords text="Hi, I'm Tim" />
          </h1>

          <motion.p
            className="mt-6 text-xl leading-8 text-neutral-600 dark:text-neutral-400"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Developer, tinkerer, occasional writer.
          </motion.p>

          <motion.p
            className="mt-4 text-base leading-7 text-neutral-500 dark:text-neutral-500 max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              bounce: 0.3,
              duration: 0.8,
              delay: 0.55,
            }}
          >
            Building things with modern web tech and exploring what's possible
            when AI meets craftsmanship.
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
              className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
            >
              Read the Blog
            </Link>
            <Link
              to="/projects"
              className="text-sm font-semibold leading-6 text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              See Projects <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Featured content preview */}
        <motion.div
          className="mt-16 w-full max-w-md px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="rounded-xl border border-neutral-200/60 bg-white/50 p-5 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-900/50">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Recent writing
            </p>
            <ul className="mt-3 space-y-2">
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={post.slug}
                    className="group flex items-center justify-between text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
                  >
                    <span>{post.title}</span>
                    <span className="text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div className="flex gap-2">
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label={link.platform}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              >
                <link.Icon className="size-5" />
              </motion.a>
            ))}
          </div>
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
