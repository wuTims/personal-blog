import { useState, useEffect } from 'react'

/**
 * Detects iOS devices (iPhone, iPad, iPod) for canvas fallback purposes.
 *
 * iOS Safari has known issues with canvas-based effects:
 * - GPU Process: Canvas Rendering causes crashes (WebKit Bug #231157)
 * - Canvas memory limits reduced from 448MB to 224MB (WebKit Bug #195325)
 * - Heavy canvas animations cause lag and crashes since iOS 14/15
 *
 * This hook is SSR-safe - returns false during SSR and detects on client.
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check for iOS devices via user agent
    const iosRegex = /iPhone|iPad|iPod/i
    const isIOSDevice = iosRegex.test(navigator.userAgent)

    // Also check for iPad on iOS 13+ which reports as Mac
    const isIPadOS = navigator.userAgent.includes('Mac') && 'ontouchend' in document

    setIsIOS(isIOSDevice || isIPadOS)
  }, [])

  return isIOS
}

/**
 * For module-level checks where hooks can't be used.
 * IMPORTANT: Only use this for non-critical UI decisions that won't cause hydration mismatches.
 * For conditional rendering, prefer useIsIOS() hook.
 */
export function getIsIOS(): boolean {
  if (typeof navigator === 'undefined') return false

  const iosRegex = /iPhone|iPad|iPod/i
  const isIOSDevice = iosRegex.test(navigator.userAgent)

  // Also check for iPad on iOS 13+ which reports as Mac
  const isIPadOS =
    typeof document !== 'undefined' &&
    navigator.userAgent.includes('Mac') &&
    'ontouchend' in document

  return isIOSDevice || isIPadOS
}
