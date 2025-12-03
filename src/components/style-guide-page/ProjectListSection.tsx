import { useState } from 'react'
import { cn } from '~/lib/utils'
import { Badge, Heading, Text } from '~/components/ui'

// Project types for indicators
type ProjectType = 'cli' | 'web' | 'design' | 'tool'

const projectTypeLabels: Record<ProjectType, string> = {
  cli: 'CLI',
  web: 'Web',
  design: 'Design',
  tool: 'Tool',
}

type AccentColor = 'emerald' | 'coral' | 'lavender' | 'sky'

const accentBg: Record<AccentColor, string> = {
  emerald: 'bg-emerald',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  sky: 'bg-sky',
}

const accentBorder: Record<AccentColor, string> = {
  emerald: 'border-emerald',
  coral: 'border-coral',
  lavender: 'border-lavender',
  sky: 'border-sky',
}

const accentText: Record<AccentColor, string> = {
  emerald: 'text-emerald',
  coral: 'text-coral',
  lavender: 'text-lavender',
  sky: 'text-sky',
}

const sampleProjects = [
  {
    id: 1,
    title: 'CLI Task Manager',
    type: 'cli' as ProjectType,
    badge: 'featured' as const,
    accent: 'emerald' as AccentColor,
    tech: ['Rust', 'SQLite'],
    year: '2024',
    description:
      'Fast, keyboard-driven productivity tool for developers who live in the terminal',
    image:
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
    href: '#',
  },
  {
    id: 2,
    title: 'Analytics Dashboard',
    type: 'web' as ProjectType,
    badge: 'new' as const,
    accent: 'coral' as AccentColor,
    tech: ['React', 'TypeScript'],
    year: '2024',
    description:
      'Real-time metrics visualization with customizable widgets and dark mode',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    href: '#',
  },
  {
    id: 3,
    title: 'Motion Editor',
    type: 'tool' as ProjectType,
    badge: null,
    accent: 'lavender' as AccentColor,
    tech: ['Canvas', 'WebGL'],
    year: '2023',
    description:
      'Browser-based animation tool with timeline editing and real-time preview',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
    href: '#',
  },
  {
    id: 4,
    title: 'Design System',
    type: 'design' as ProjectType,
    badge: null,
    accent: 'sky' as AccentColor,
    tech: ['React', 'Tailwind'],
    year: '2023',
    description:
      'Component library with accessibility-first approach and theme customization',
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
    href: '#',
  },
]

// Internal component for accent underline
function AccentUnderline({ accent }: { accent: AccentColor }) {
  return (
    <span
      className={cn(
        'absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full transition-all duration-200 group-hover:h-[3px]',
        accentBg[accent]
      )}
    />
  )
}

// Internal component for type indicator
function TypeIndicator({
  type,
  accent,
}: {
  type: ProjectType
  accent: AccentColor
}) {
  return (
    <span
      className={cn(
        'text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border',
        accentBorder[accent],
        accentText[accent]
      )}
    >
      {projectTypeLabels[type]}
    </span>
  )
}

export function ProjectListSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Project Lists
      </Heading>

      {/* Overview */}
      <div className="mb-8 sm:mb-12">
        <Text className="mb-6">
          Project lists showcase work with accent-colored underlines, type
          indicators, and badges. Features 40x40 thumbnails on mobile with
          tap-to-expand, and hover-to-reveal on desktop with full image and
          description.
        </Text>

        {/* Example */}
        <Heading level="h3" className="mb-4 sm:mb-6">
          Basic Usage
        </Heading>
        <div className="space-y-0 divide-y divide-border">
          {sampleProjects.map((project) => (
            <div key={project.id} className="group">
              <a
                href={project.href}
                className="block py-5"
                onClick={(e) => {
                  if (window.innerWidth < 768) {
                    e.preventDefault()
                    setExpandedId(
                      expandedId === project.id ? null : project.id
                    )
                  }
                }}
              >
                {/* Main row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile thumbnail */}
                    <div className="md:hidden shrink-0 w-10 h-10 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Title with accent underline */}
                        <span className="relative">
                          <h3 className="text-xl font-medium text-foreground">
                            {project.title}
                          </h3>
                          {/* Accent underline - always visible, thickens on hover */}
                          <AccentUnderline accent={project.accent} />
                        </span>

                        {/* Project type indicator */}
                        <TypeIndicator
                          type={project.type}
                          accent={project.accent}
                        />

                        {/* Badge */}
                        {project.badge && (
                          <Badge variant={project.badge}>
                            {project.badge === 'featured' ? 'Featured' : 'New'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-muted hidden sm:block">
                      {project.tech.slice(0, 2).join(' · ')}
                    </span>
                    <span className="text-sm text-muted">{project.year}</span>
                    <span
                      className={cn(
                        'md:hidden text-muted transition-transform duration-200',
                        expandedId === project.id && 'rotate-90'
                      )}
                    >
                      →
                    </span>
                  </div>
                </div>

                {/* Expand section */}
                <div
                  className={cn(
                    'overflow-hidden transition-[grid-template-rows] duration-300 grid',
                    expandedId === project.id
                      ? 'grid-rows-[1fr]'
                      : 'grid-rows-[0fr]',
                    'md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4 flex gap-4">
                      <div className="w-48 h-32 shrink-0 rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm text-muted line-clamp-2">
                          {project.description}
                        </p>
                        <span className="mt-2 text-sm text-foreground/60 group-hover:text-foreground transition-colors">
                          View project →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
