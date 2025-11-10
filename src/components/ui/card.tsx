import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const cardVariants = cva(
  'bg-card-background border transition-[box-shadow,transform,border-color] duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-[#e5e5e5]',
        emphasis: 'border-border-emphasis mac-shadow-static',
        emphasisHover: 'border-border-emphasis mac-shadow',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-5',
        lg: 'p-8',
      },
      radius: {
        sm: 'rounded-[2px]',
        default: 'rounded-[6px]',
        lg: 'rounded-[8px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      radius: 'sm',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, radius, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, padding, radius, className }))}
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
        className={cn('flex flex-col space-y-1.5', className)}
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
        className={cn('text-xl font-semibold leading-none tracking-tight', className)}
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
        className={cn('flex items-center pt-0 mt-6', className)}
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
