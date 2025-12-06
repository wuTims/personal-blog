import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'

const codeVariants = cva('font-ibm-mono', {
  variants: {
    variant: {
      inline:
        'bg-code-bg text-code-fg px-1.5 py-0.5 rounded-sm text-sm',
      block:
        'bg-code-bg text-code-fg p-4 rounded-sm text-sm overflow-x-auto block',
    },
  },
  defaultVariants: {
    variant: 'inline',
  },
})

export interface CodeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof codeVariants> {
  language?: string
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, language, children, ...props }, ref) => {
    if (variant === 'block') {
      return (
        <pre ref={ref as any} className={cn(codeVariants({ variant }))}>
          <code className={cn('font-ibm-mono', className)} {...props}>
            {children}
          </code>
        </pre>
      )
    }

    return (
      <code
        ref={ref}
        className={cn(codeVariants({ variant, className }))}
        {...props}
      >
        {children}
      </code>
    )
  }
)
Code.displayName = 'Code'

export { Code, codeVariants }
