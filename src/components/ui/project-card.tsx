import * as React from 'react'
import { cn } from '~/lib/utils'
import { cardVariants } from './card'
import { Heading } from './heading'
import { Text } from './text'

/** Tag configuration for project qualities */
export interface ProjectTag {
  label: string
  /** Accent color for the tag */
  variant?: 'default' | 'emerald' | 'coral' | 'lavender' | 'sky'
}

/** Link configuration for project resources */
export interface ProjectLink {
  label: string
  href: string
  /** Icon type - determines which icon to show */
  icon?: 'github' | 'demo' | 'article' | 'video' | 'external'
}

export interface ProjectCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Use static variant to disable hover effects */
  variant?: 'default' | 'static'
  /** Media source URL (image or video) */
  mediaSrc: string
  /** Alt text for the media */
  mediaAlt: string
  /** Media position for object-fit (e.g., "top", "center", "bottom", "30%") */
  mediaPosition?: string
  /** Media type - defaults to 'image' */
  mediaType?: 'image' | 'video'
  /** Poster image for video (shown while loading or if video fails) */
  videoPoster?: string
  /** Project title */
  title: string
  /** Project description */
  description: string
  /** Tags for tech stack, achievements, etc. */
  tags?: ProjectTag[]
  /** GitHub repository URL (shown by default if provided) */
  repoUrl?: string
  /** Additional links (demo, article, video, etc.) */
  links?: ProjectLink[]
  /** Optional accent color for hover effect */
  accentColor?: 'emerald' | 'coral' | 'lavender' | 'sky'
}

/** Icon components for project links */
const LinkIcons = {
  github: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  demo: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  article: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  video: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,3 19,12 5,21" fill="currentColor" />
    </svg>
  ),
  external: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
}

/** Tag color variants */
const tagVariants = {
  default: 'bg-neutral-100 text-foreground dark:bg-neutral-800',
  emerald: 'bg-emerald/10 text-emerald',
  coral: 'bg-coral/10 text-coral',
  lavender: 'bg-lavender/10 text-lavender',
  sky: 'bg-sky/10 text-sky',
}

const ProjectCard = React.memo(
  React.forwardRef<HTMLElement, ProjectCardProps>(
    (
      {
        className,
        variant = 'default',
        mediaSrc,
        mediaAlt,
        mediaPosition,
        mediaType = 'image',
        videoPoster,
        title,
        description,
        tags,
        repoUrl,
        links = [],
        accentColor,
        ...props
      },
      ref
    ) => {
      // Combine repo link with additional links
      const allLinks: ProjectLink[] = [
        ...(repoUrl ? [{ label: 'GitHub', href: repoUrl, icon: 'github' as const }] : []),
        ...links,
      ]

      // Map ProjectCard variants to Card variants (same as BlogCard)
      const cardVariant = variant === 'static' ? 'emphasis' : 'emphasisHover'

      const baseClasses = cn(
        cardVariants({
          variant: cardVariant,
          padding: 'none',
          radius: 'sm',
          accent: accentColor,
        }),
        'group overflow-hidden',
        className
      )

      return (
        <article ref={ref as React.Ref<HTMLElement>} className={baseClasses} {...props}>
          {/* Media Container */}
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {mediaType === 'video' ? (
              <video
                src={mediaSrc}
                poster={videoPoster}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                {/* Fallback for browsers that don't support video */}
                {videoPoster && <img src={videoPoster} alt={mediaAlt} className="h-full w-full object-cover" />}
              </video>
            ) : (
              <img
                src={mediaSrc}
                alt={mediaAlt}
                className="h-full w-full object-cover"
                style={mediaPosition ? { objectPosition: `center ${mediaPosition}` } : undefined}
              />
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      'inline-block rounded-[4px] px-2 py-0.5 font-ibm-mono text-xs font-medium',
                      tagVariants[tag.variant || 'default']
                    )}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            <Heading level="h3" as="h3" className="mb-2">
              {title}
            </Heading>
            <Text variant="muted" className="leading-relaxed">
              {description}
            </Text>
          </div>

          {/* Links Footer */}
          {allLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 sm:px-5">
              {allLinks.map((link, index) => {
                const Icon = LinkIcons[link.icon || 'external']
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5',
                      'bg-neutral-100 text-sm font-medium text-foreground',
                      'transition-colors hover:bg-neutral-200',
                      'dark:bg-neutral-800 dark:hover:bg-neutral-700'
                    )}
                  >
                    <Icon />
                    {link.label}
                  </a>
                )
              })}
            </div>
          )}
        </article>
      )
    }
  )
)
ProjectCard.displayName = 'ProjectCard'

export { ProjectCard }