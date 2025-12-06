import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type SubscribeResult = {
  success: boolean
  message: string
}

/** beehiiv API error response format */
type BeehiivErrorResponse = {
  status?: number
  statusText?: string
  errors?: Array<{ message: string; code?: string }>
}

/**
 * Server function to subscribe a user to the beehiiv newsletter.
 * This keeps the API key secure on the server side.
 */
export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .inputValidator(subscribeSchema)
  .handler(async ({ data }): Promise<SubscribeResult> => {
    const apiKey = process.env.BEEHIIV_API_KEY
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID

    if (!apiKey || !publicationId) {
      console.error('Missing beehiiv configuration')
      return {
        success: false,
        message: 'Newsletter subscription is not configured',
      }
    }

    try {
      const response = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            email: data.email,
            reactivate_existing: true,
            send_welcome_email: true,
            utm_source: 'wutims.com',
            utm_medium: 'website',
            referring_site: 'https://wutims.com',
          }),
        }
      )

      if (response.ok) {
        return {
          success: true,
          message: 'Thanks for subscribing!',
        }
      }

      // Handle rate limiting (429)
      if (response.status === 429) {
        console.warn('beehiiv rate limit exceeded')
        return {
          success: false,
          message: 'Too many requests. Please try again in a minute.',
        }
      }

      // Handle bad request errors (400)
      if (response.status === 400) {
        const errorData: BeehiivErrorResponse = await response
          .json()
          .catch(() => ({}))
        const errorMessage =
          errorData?.errors?.[0]?.message?.toLowerCase() || ''

        // Treat "already subscribed" as success
        if (
          errorMessage.includes('already subscribed') ||
          errorMessage.includes('already exists')
        ) {
          return {
            success: true,
            message: "You're already subscribed!",
          }
        }

        // Invalid email format
        if (errorMessage.includes('invalid') && errorMessage.includes('email')) {
          return {
            success: false,
            message: 'Please enter a valid email address.',
          }
        }
      }

      // Log unexpected errors for debugging
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('beehiiv API error:', response.status, errorText)
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      }
    }
  })
