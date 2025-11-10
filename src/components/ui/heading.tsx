import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const headingVariants = cva('font-playfair font-semibold', {
  variants: {
    level: {
      h1: 'text-5xl md:text-[3.5rem] leading-tight',
      h2: 'text-3xl md:text-[1.875rem] leading-snug',
      h3: 'text-2xl leading-snug',
      h4: 'text-xl leading-normal',
      h5: 'text-lg leading-normal',
      h6: 'text-base leading-normal',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    level: 'h2',
    weight: 'semibold',
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const Heading = React.memo(
  React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, level, weight, as, ...props }, ref) => {
      const Component = as || level || 'h2'

      return (
        <Component
          ref={ref}
          className={cn(
            headingVariants({ level: level || (as as any), weight, className })
          )}
          {...props}
        />
      )
    }
  )
)
Heading.displayName = 'Heading'

export { Heading, headingVariants }
