import { useEffect, useId, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const renderIdRef = useRef(0)
  // React's useId guarantees unique IDs across all component instances
  const componentId = useId()

  useEffect(() => {
    let mounted = true
    const currentRenderId = ++renderIdRef.current

    async function renderDiagram() {
      if (!containerRef.current || !mounted) return

      try {
        setIsLoading(true)
        setError(null)

        // Lazy import mermaid
        const mermaid = (await import('mermaid')).default

        // Detect current theme
        const isDark = document.documentElement.classList.contains('dark')

        // Initialize mermaid with current theme and larger sizing
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-family-sans)',
          flowchart: {
            padding: 20,
            nodeSpacing: 50,
            rankSpacing: 60,
            useMaxWidth: true,
          },
          sequence: {
            useMaxWidth: true,
            boxMargin: 10,
            messageMargin: 40,
          },
        })

        // Generate unique ID for this render using React's useId for cross-component uniqueness
        const id = `mermaid${componentId.replace(/:/g, '-')}-${currentRenderId}`

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)

        if (mounted && currentRenderId === renderIdRef.current && containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Adjust SVG sizing: make large diagrams smaller, small diagrams larger
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            const viewBox = svgElement.getAttribute('viewBox')
            if (viewBox) {
              // Parse viewBox: "x y width height"
              const [, , viewBoxWidth, viewBoxHeight] = viewBox.split(' ').map(Number)
              
              if (viewBoxWidth && viewBoxHeight) {
                const minWidth = 600 // Minimum width for small diagrams
                const maxWidth = 800 // Maximum width for large diagrams
                
                let targetWidth: number
                if (viewBoxWidth > maxWidth) {
                  // Scale large diagrams down to maxWidth
                  targetWidth = maxWidth
                } else if (viewBoxWidth < minWidth) {
                  // Scale small diagrams up to minWidth
                  targetWidth = minWidth
                } else {
                  // Keep original size for medium diagrams
                  targetWidth = viewBoxWidth
                }
                
                // Set width and let height be calculated from aspect ratio
                svgElement.setAttribute('width', `${targetWidth}`)
                svgElement.removeAttribute('height') // Let CSS maintain aspect ratio
              }
            }
          }
          
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted && currentRenderId === renderIdRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setIsLoading(false)
        }
      }
    }

    renderDiagram()

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          renderDiagram()
          break
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      mounted = false
      observer.disconnect()
    }
  }, [chart])

  if (error) {
    return (
      <div className="my-8 rounded-sm border border-coral/30 bg-coral/5 p-4">
        <p className="text-sm text-coral">Failed to render diagram: {error}</p>
        <pre className="mt-2 overflow-x-auto text-xs text-muted">
          <code>{chart}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="mermaid-container my-8 flex justify-center">
      {isLoading && (
        <div className="flex h-48 w-full items-center justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800">
          <div className="text-sm text-muted">Loading diagram...</div>
        </div>
      )}
      <div
        ref={containerRef}
        className={isLoading ? 'hidden' : ''}
      />
    </div>
  )
}
