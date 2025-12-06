import * as React from 'react'
import { cn } from '~/lib/utils'
import { cardVariants } from './card'
import { Heading } from './heading'
import { LinkIcons } from './icons'
import { ImageWithSkeleton } from './image-with-skeleton'
import { Tag } from './tag'
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
        'group flex h-full flex-col overflow-hidden',
        className
      )

      return (
        <article ref={ref as React.Ref<HTMLElement>} className={baseClasses} {...props}>
          {/* Media Container */}
          <div className="relative aspect-video w-full overflow-hidden">
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
              <ImageWithSkeleton
                src={mediaSrc}
                alt={mediaAlt}
                objectPosition={mediaPosition}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex grow flex-col p-4 sm:p-5">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Tag key={index} variant={tag.variant || 'default'}>
                    {tag.label}
                  </Tag>
                ))}
              </div>
            )}

            <Heading level="h3" as="h3" className="mb-2 line-clamp-2">
              {title}
            </Heading>
            <Text variant="muted" className="line-clamp-2 min-h-[2lh] leading-relaxed">
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
                      'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5',
                      'bg-neutral-100 text-sm font-medium text-foreground',
                      'transition-colors hover:bg-neutral-200',
                      'dark:bg-neutral-800 dark:hover:bg-neutral-700'
                    )}
                  >
                    <Icon size="sm" />
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