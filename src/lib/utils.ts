import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names with Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a full URL for a media asset stored in R2
 */
export function getMediaUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.VITE_MEDIA_BASE_URL}/${cleanPath}`
}
