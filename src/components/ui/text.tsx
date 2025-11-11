import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const textVariants = cva('font-inter', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm sm:text-base',
      base: 'text-sm sm:text-base',
      lg: 'text-base sm:text-lg',
      xl: 'text-lg sm:text-xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted',
      emerald: 'text-emerald',
      coral: 'text-coral',
      lavender: 'text-lavender',
      sky: 'text-sky',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    variant: 'default',
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label'
}

const Text = React.memo(
  React.forwardRef<HTMLElement, TextProps>(
    ({ className, size, weight, variant, as = 'p', ...props }, ref) => {
      const Component = as

      return (
        <Component
          ref={ref as any}
          className={cn(textVariants({ size, weight, variant, className }))}
          {...props}
        />
      )
    }
  )
)
Text.displayName = 'Text'

export { Text, textVariants }
