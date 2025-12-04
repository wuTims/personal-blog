import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm',
  {
    variants: {
      variant: {
        featured:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        new: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        default:
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.memo(
  React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, children, ...props }, ref) => {

      return (
        <span
          className={cn(badgeVariants({ variant, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </span>
      )
    }
  )
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
