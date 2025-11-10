import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-neutral-900 text-white hover:bg-neutral-700 border border-foreground transition-colors',
        secondary:
          'bg-white text-foreground hover:bg-neutral-100 border border-neutral-200 transition-colors dark:bg-neutral-300 dark:text-neutral-800 dark:hover:bg-neutral-200',
      },
      size: {
        default: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      radius: {
        default: 'rounded-[6px]',
        sm: 'rounded-[2px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      radius: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, radius, ...props }, ref) => {
      return (
        <button
          className={cn(buttonVariants({ variant, size, radius, className }))}
          ref={ref}
          {...props}
        />
      )
    }
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
