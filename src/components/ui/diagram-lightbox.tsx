'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '~/lib/utils'

// Type for svg-pan-zoom instance
type SvgPanZoomInstance = {
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  center: () => void
  destroy: () => void
}

interface DiagramLightboxProps {
  isOpen: boolean
  onClose: () => void
  svgContent: string
  className?: string
}

// Expand/fullscreen icon
function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

// Close X icon
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// Zoom in icon
function ZoomInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

// Zoom out icon
function ZoomOutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

// Reset icon
function ResetIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export function DiagramLightbox({
  isOpen,
  onClose,
  svgContent,
  className,
}: DiagramLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panZoomRef = useRef<SvgPanZoomInstance | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Track client-side mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // Initialize svg-pan-zoom when content is rendered (dynamic import for SSR)
  useEffect(() => {
    if (!isOpen || !containerRef.current || !svgContent) return

    let destroyed = false

    // Small delay to ensure SVG is in DOM, then dynamically import
    const timer = setTimeout(async () => {
      const svgElement = containerRef.current?.querySelector('svg')
      if (!svgElement || destroyed) return

      // Remove mermaid's inline max-width constraint
      svgElement.style.maxWidth = 'none'
      svgElement.style.width = '100%'
      svgElement.style.height = '100%'

      // Only load svg-pan-zoom on the client (check for window)
      if (typeof window === 'undefined') return

      // Dynamically import svg-pan-zoom using Function constructor to avoid static analysis
      try {
        // Use indirect eval to prevent bundler from analyzing the import
        const dynamicImport = new Function('specifier', 'return import(specifier)')
        const module = await dynamicImport('svg-pan-zoom')
        const svgPanZoom = module.default
        if (destroyed) return

        panZoomRef.current = svgPanZoom(svgElement, {
          zoomEnabled: true,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          minZoom: 0.1,
          maxZoom: 10,
          zoomScaleSensitivity: 0.3,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
          preventMouseEventsDefault: true,
        })
      } catch (e) {
        console.error('Failed to initialize svg-pan-zoom:', e)
      }
    }, 50)

    return () => {
      destroyed = true
      clearTimeout(timer)
      if (panZoomRef.current) {
        panZoomRef.current.destroy()
        panZoomRef.current = null
      }
    }
  }, [isOpen, svgContent])

  // Set up keyboard listener and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, handleKeyDown])

  // Zoom controls
  const handleZoomIn = () => panZoomRef.current?.zoomIn()
  const handleZoomOut = () => panZoomRef.current?.zoomOut()
  const handleReset = () => {
    panZoomRef.current?.resetZoom()
    panZoomRef.current?.center()
  }

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Don't render on server or before mount
  if (!isMounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged diagram view with pan and zoom"
            className={cn(
              'fixed inset-0 z-[var(--z-modal)] flex flex-col',
              className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top controls bar */}
            <div className="flex items-center justify-between p-4">
              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomIn}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Zoom in"
                >
                  <ZoomInIcon />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Zoom out"
                >
                  <ZoomOutIcon />
                </button>
                <button
                  onClick={handleReset}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Reset zoom"
                >
                  <ResetIcon />
                </button>
              </div>

              {/* Close button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* SVG container - takes remaining space */}
            <div
              ref={containerRef}
              className="diagram-lightbox-svg flex-1 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgContent }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Screen reader instructions */}
            <div className="sr-only">
              Use scroll wheel or pinch to zoom. Click and drag to pan. Press
              Escape to close.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Export the expand icon for use in mermaid-diagram
export { ExpandIcon }
