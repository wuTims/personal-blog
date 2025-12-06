import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const tagVariants = cva(
  'inline-block font-mono font-medium',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-foreground dark:bg-neutral-800',
        emerald: 'bg-emerald/10 text-emerald',
        coral: 'bg-coral/10 text-coral',
        lavender: 'bg-lavender/10 text-lavender',
        sky: 'bg-sky/10 text-sky',
      },
      size: {
        sm: 'text-2xs px-1.5 py-0.5 rounded-sm',
        default: 'text-xs px-2 py-0.5 rounded-sm',
        lg: 'text-sm px-2.5 py-1 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.memo(
  React.forwardRef<HTMLSpanElement, TagProps>(
    ({ className, variant, size, children, ...props }, ref) => {
      return (
        <span
          className={cn(tagVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </span>
      )
    }
  )
)
Tag.displayName = 'Tag'

export { Tag, tagVariants }
