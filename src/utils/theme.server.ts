import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

export type Theme = 'light' | 'dark'

// Server function to get theme from cookie
export const getThemeServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const theme = getCookie('theme') as Theme | undefined

  // If no cookie, detect from system preference would require client-side logic
  // So we default to 'light' on server
  return theme || 'light'
})

// Server function to set theme cookie
const themeSchema = z.object({ theme: z.enum(['light', 'dark']) })

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(themeSchema)
  .handler(async ({ data }) => {
    setCookie('theme', data.theme, {
      path: '/',
      maxAge: 31536000, // 1 year
      httpOnly: false, // Allow JS access for client-side updates
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return { success: true }
  })
