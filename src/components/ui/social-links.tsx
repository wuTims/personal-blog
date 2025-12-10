import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import { GithubIcon, LinkedinIcon, ArticleIcon } from './icons'

const socialLinkVariants = cva(
  'inline-flex w-fit items-center gap-2 transition-colors',
  {
    variants: {
      variant: {
        default:
          'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50',
        muted:
          'text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300',
      },
      size: {
        sm: '[&_svg]:size-4',
        default: '[&_svg]:size-5',
        lg: '[&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface SocialLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof socialLinkVariants> {
  showLabel?: boolean
}

export type SocialPlatform = 'github' | 'linkedin'

const socialIcons: Record<SocialPlatform, React.FC<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

const socialLabels: Record<SocialPlatform, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
}

export interface SocialLinkItemProps extends SocialLinkProps {
  platform: SocialPlatform
  href: string
}

export function SocialLink({
  platform,
  href,
  variant,
  size,
  showLabel = true,
  className,
  ...props
}: SocialLinkItemProps) {
  const Icon = socialIcons[platform]
  const label = socialLabels[platform]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(socialLinkVariants({ variant, size }), className)}
      aria-label={!showLabel ? label : undefined}
      {...props}
    >
      <Icon />
      {showLabel && <span>{label}</span>}
    </a>
  )
}

export interface SocialLinksProps {
  links: Array<{ platform: SocialPlatform; href: string }>
  variant?: SocialLinkProps['variant']
  size?: SocialLinkProps['size']
  showLabels?: boolean
  className?: string
  itemClassName?: string
  layout?: 'horizontal' | 'vertical'
}

export function SocialLinks({
  links,
  variant,
  size,
  showLabels = true,
  className,
  itemClassName,
  layout = 'horizontal',
}: SocialLinksProps) {
  return (
    <div
      className={cn(
        'flex',
        layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-3',
        className
      )}
    >
      {links.map(link => (
        <SocialLink
          key={link.platform}
          platform={link.platform}
          href={link.href}
          variant={variant}
          size={size}
          showLabel={showLabels}
          className={itemClassName}
        />
      ))}
    </div>
  )
}

export { GithubIcon, LinkedinIcon, ArticleIcon }