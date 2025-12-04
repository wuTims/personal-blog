import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allProjects } from 'content-collections'
import { Container, Heading, Text } from '~/components/ui'
import { buttonVariants } from '~/components/ui/button'

export const Route = createFileRoute('/blog/projects/$slug')({
  loader: ({ params }) => {
    const project = allProjects.find(
      (p) => p._meta.path.replace(/\.md$/, '') === params.slug
    )
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  component: ProjectPage,
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) // 200 words per minute
}

function ProjectPage() {
  const { project } = Route.useLoaderData()

  return (
    <div className="py-8 sm:py-12">
      <Container size="prose">
        {/* Back link */}
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to Blog</span>
        </Link>

        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <Heading level="h1" className="mb-4">
            {project.title}
          </Heading>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            <span className="text-border">·</span>
            <span>{getReadingTime(project.html)} min read</span>
            {project.tags && project.tags.length > 0 && (
              <>
                <span className="text-border">·</span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-lavender/10 px-2 py-0.5 text-xs font-medium text-lavender"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <Text variant="muted" size="lg" className="mt-6">
            {project.summary}
          </Text>

          {/* Project links */}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'secondary' })}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'primary' })}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="border-t border-border pt-8">
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: project.html }}
          />
        </div>
      </Container>
    </div>
  )
}
