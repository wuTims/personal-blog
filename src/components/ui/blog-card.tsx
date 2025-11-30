import * as React from 'react'
import { cn } from '~/lib/utils'
import { cardVariants } from './card'
import { Heading } from './heading'
import { Text } from './text'

export interface BlogCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Use static variant when card contains interactive elements */
  variant?: 'default' | 'static'
  /** The image source URL */
  imageSrc: string
  /** Alt text for the image */
  imageAlt: string
  /** The blog post title */
  title: string
  /** The blog post description/excerpt */
  description: string
  /** Optional link to wrap the card */
  href?: string
  /** Optional accent color for hover effect */
  accentColor?: 'emerald' | 'coral' | 'lavender' | 'sky'
}

const BlogCard = React.memo(
  React.forwardRef<HTMLElement, BlogCardProps>(
    (
      {
        className,
        variant = 'default',
        imageSrc,
        imageAlt,
        title,
        description,
        href,
        accentColor,
        ...props
      },
      ref
    ) => {
      // Map BlogCard variants to Card variants
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

      const content = (
        <>
          {/* Image Container */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <Heading level="h3" as="h3" className="mb-2">
              {title}
            </Heading>
            <Text variant="muted" className="leading-relaxed">
              {description}
            </Text>
          </div>
        </>
      )

      if (href) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={cn(baseClasses, 'block cursor-pointer')}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        )
      }

      return (
        <article
          ref={ref as React.Ref<HTMLElement>}
          className={baseClasses}
          {...props}
        >
          {content}
        </article>
      )
    }
  )
)
BlogCard.displayName = 'BlogCard'

export { BlogCard }