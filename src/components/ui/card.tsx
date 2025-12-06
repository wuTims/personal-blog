import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const cardVariants = cva(
  'bg-card border transition-[box-shadow,transform,border-color] duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-border',
        emphasis: 'border-neutral-300 dark:border-neutral-700 mac-shadow-static',
        emphasisHover: 'border-neutral-300 dark:border-neutral-700 mac-shadow',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2 sm:p-3',
        default: 'p-4 sm:p-5',
        lg: 'p-6 sm:p-8',
      },
      radius: {
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
      },
      accent: {
        none: '',
        emerald: 'hover:border-emerald',
        coral: 'hover:border-coral',
        lavender: 'hover:border-lavender',
        sky: 'hover:border-sky',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      radius: 'sm',
      accent: 'none',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, radius, accent, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, padding, radius, accent, className }))}
          {...props}
        />
      )
    }
  )
)
Card.displayName = 'Card'

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1 sm:space-y-1.5', className)}
        {...props}
      />
    )
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.memo(
  React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight sm:text-xl', className)}
        {...props}
      />
    )
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.memo(
  React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p ref={ref} className={cn('text-sm text-muted', className)} {...props} />
    )
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn('pt-0', className)} {...props} />
    )
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex items-center pt-0 mt-4 sm:mt-6', className)}
        {...props}
      />
    )
  )
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
}
