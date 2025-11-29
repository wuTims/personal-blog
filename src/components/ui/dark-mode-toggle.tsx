import { cva, type VariantProps } from 'class-variance-authority'
import { Moon, Sun } from 'lucide-react'
import * as React from 'react'
import { flushSync } from 'react-dom'
import { cn } from '~/lib/utils'
import { useDarkMode } from '../useDarkMode'

/* ============================================
   DarkModeToggle Component
   - Uses View Transitions API for radial clip-path animation
   - Falls back gracefully when not supported
   ============================================ */

const darkModeToggleVariants = cva(
  [
    'group relative inline-flex items-center justify-center',
    'rounded-full transition-colors cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
    'dark:focus:ring-offset-neutral-900',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        ghost:
          'bg-transparent text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800',
        outline:
          'bg-transparent text-neutral-900 border border-neutral-300 hover:bg-neutral-100 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800',
      },
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface DarkModeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof darkModeToggleVariants> {}

const DarkModeToggle = React.memo(
  React.forwardRef<HTMLButtonElement, DarkModeToggleProps>(
    ({ className, variant, size, ...props }, ref) => {
      const { resolvedTheme, setTheme } = useDarkMode()
      const isDark = resolvedTheme === 'dark'

      const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = isDark ? 'light' : 'dark'

        // Check if View Transitions API is supported
        if (
          !document.startViewTransition ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          await setTheme(newTheme)
          return
        }

        // Get click coordinates for radial animation origin
        const x = e.clientX
        const y = e.clientY

        // Calculate the radius needed to cover the entire screen
        const endRadius = Math.hypot(
          Math.max(x, innerWidth - x),
          Math.max(y, innerHeight - y)
        )

        // Start view transition with radial clip-path animation
        const transition = document.startViewTransition(async () => {
          flushSync(() => {
            setTheme(newTheme)
          })
        })

        transition.ready.then(() => {
          // Always animate the new view expanding from click point
          // The new view sits on top, so we reveal it with an expanding circle
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
      }

      return (
        <button
          ref={ref}
          onClick={toggleTheme}
          className={cn(darkModeToggleVariants({ variant, size, className }))}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          type="button"
          {...props}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      )
    }
  )
)
DarkModeToggle.displayName = 'DarkModeToggle'

export { DarkModeToggle, darkModeToggleVariants }
