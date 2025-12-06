'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import { Button } from './button'
import type { AccentColor } from '~/lib/color-variants'
import { subscribeToNewsletter } from '~/utils/newsletter.server'

const newsletterVariants = cva('', {
  variants: {
    variant: {
      card: '',
      inline: '',
      minimal: '',
    },
  },
  defaultVariants: {
    variant: 'card',
  },
})

export interface NewsletterSubscribeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newsletterVariants> {
  /** Heading text for card variant */
  heading?: string
  /** Subheading text for card variant */
  subheading?: string
  /** Accent color for card border on hover */
  accentColor?: AccentColor
}

type SubscribeState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Newsletter subscribe form component using beehiiv API.
 *
 * Variants:
 * - `card`: Full card with heading, mac-shadow styling (for prominent CTAs)
 * - `inline`: Compact form for footer integration
 * - `minimal`: Just the form, no container
 */
const NewsletterSubscribe = React.memo(
  React.forwardRef<HTMLDivElement, NewsletterSubscribeProps>(
    (
      {
        className,
        variant = 'card',
        heading = 'Subscribe to the newsletter',
        subheading = 'Get AI tips and blog updates in your inbox.',
        accentColor = 'coral',
        ...props
      },
      ref
    ) => {
      const [email, setEmail] = React.useState('')
      const [state, setState] = React.useState<SubscribeState>('idle')
      const [message, setMessage] = React.useState('')

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || state === 'loading') return

        setState('loading')
        setMessage('')

        try {
          const result = await subscribeToNewsletter({ data: { email } })
          if (result.success) {
            setState('success')
            setMessage(result.message)
            setEmail('')
          } else {
            setState('error')
            setMessage(result.message)
          }
        } catch {
          setState('error')
          setMessage('Something went wrong. Please try again.')
        }
      }

      const form = (
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={cn(
              'flex gap-2',
              variant === 'card' ? 'flex-col sm:flex-row' : 'flex-row'
            )}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={state === 'loading'}
              className={cn(
                'flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm',
                'placeholder:text-muted',
                'focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'dark:border-neutral-700 dark:bg-neutral-900',
                'transition-colors'
              )}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={state === 'loading'}
              className={cn(
                variant === 'inline' && 'px-4',
                state === 'loading' && 'cursor-wait'
              )}
            >
              {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          {message && (
            <p
              className={cn(
                'mt-2 text-sm',
                state === 'success' && 'text-emerald',
                state === 'error' && 'text-coral'
              )}
            >
              {message}
            </p>
          )}
        </form>
      )

      if (variant === 'minimal') {
        return (
          <div ref={ref} className={cn('w-full', className)} {...props}>
            {form}
          </div>
        )
      }

      if (variant === 'inline') {
        return (
          <div ref={ref} className={cn('w-full space-y-2', className)} {...props}>
            <p className="text-sm text-muted">{subheading}</p>
            {form}
          </div>
        )
      }

      // Card variant (default)
      return (
        <Card
          ref={ref}
          variant="emphasis"
          padding="lg"
          accent="none"
          className={cn(className)}
          {...props}
        >
          <CardHeader>
            <CardTitle className="font-playfair text-xl sm:text-2xl">
              {heading}
            </CardTitle>
            <CardDescription className="text-base">{subheading}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">{form}</CardContent>
        </Card>
      )
    }
  )
)
NewsletterSubscribe.displayName = 'NewsletterSubscribe'

export { NewsletterSubscribe, newsletterVariants }
