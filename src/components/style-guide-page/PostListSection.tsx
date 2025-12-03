import { Link } from '@tanstack/react-router'
import { Heading, Text } from '~/components/ui'

const samplePosts = [
  {
    title: 'Building with Claude Code',
    description: 'How AI-assisted development is changing my workflow',
    date: 'Dec 2024',
    href: '#',
  },
  {
    title: 'Why I rebuilt my site',
    description: 'A fresh start with modern tooling',
    date: 'Nov 2024',
    href: '#',
  },
  {
    title: 'Modern CSS tricks worth knowing',
    description: 'Container queries, cascade layers, and more',
    date: 'Oct 2024',
    href: '#',
  },
]

export function PostListSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Post Lists
      </Heading>

      {/* Overview */}
      <div className="mb-8 sm:mb-12">
        <Text className="mb-6">
          Post lists display blog entries in a compact format with
          tap-to-expand on mobile and hover-to-reveal on desktop. The
          description expands smoothly using CSS grid transitions.
        </Text>

        {/* Example */}
        <Heading level="h3" className="mb-4 sm:mb-6">
          Basic Usage
        </Heading>
        <div className="space-y-0 divide-y divide-border">
          {samplePosts.map((post) => (
            <Link
              key={post.href}
              to={post.href}
              className="group block py-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground transition-colors group-hover:text-foreground/80">
                  {post.title}
                </span>
                <span className="text-sm text-muted">{post.date}</span>
              </div>
              {/* Description reveals on hover */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-2 text-sm text-muted">
                    {post.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
