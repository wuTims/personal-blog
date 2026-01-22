import { useMemo } from 'react'
import { MermaidDiagram } from './ui/mermaid-diagram'
import { cn } from '~/lib/utils'

interface ArticleContentProps {
  html: string
  className?: string
}

type ContentSegment =
  | { type: 'html'; content: string }
  | { type: 'mermaid'; content: string }

// Parse HTML to extract mermaid blocks and split into segments
function parseContent(html: string): ContentSegment[] {
  const segments: ContentSegment[] = []
  const mermaidRegex = /<div class="mermaid-source" data-mermaid="true">([^<]*(?:<(?!\/div>)[^<]*)*)<\/div>/g

  let lastIndex = 0
  let match

  while ((match = mermaidRegex.exec(html)) !== null) {
    // Add HTML before this mermaid block
    if (match.index > lastIndex) {
      segments.push({ type: 'html', content: html.slice(lastIndex, match.index) })
    }

    // Decode HTML entities in mermaid content
    const mermaidContent = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    segments.push({ type: 'mermaid', content: mermaidContent })
    lastIndex = match.index + match[0].length
  }

  // Add remaining HTML after last mermaid block
  if (lastIndex < html.length) {
    segments.push({ type: 'html', content: html.slice(lastIndex) })
  }

  return segments
}

export function ArticleContent({ html, className = '' }: ArticleContentProps) {
  const segments = useMemo(() => parseContent(html), [html])

  return (
    <article className={cn('prose', className)}>
      {segments.map((segment, index) =>
        segment.type === 'mermaid' ? (
          <MermaidDiagram key={index} chart={segment.content} />
        ) : (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: segment.content }}
          />
        )
      )}
    </article>
  )
}
