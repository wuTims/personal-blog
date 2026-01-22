import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'
import { Marked } from 'marked'
import { highlightCode } from './src/lib/shiki'

type CodeBlock = { lang: string; code: string; placeholder: string }

// Process markdown with async Shiki highlighting
// Creates a fresh marked instance per call to avoid race conditions
async function parseMarkdown(content: string): Promise<string> {
  const codeBlocks: CodeBlock[] = []

  // Create fresh marked instance with custom renderer for this document
  const markedInstance = new Marked({
    gfm: true,
    breaks: true,
  })

  const renderer = {
    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const caption = text || title
      return `<figure>
    <img src="${href}" alt="${text || ''}" loading="lazy" />
    ${caption ? `<figcaption>${caption}</figcaption>` : ''}
  </figure>`
    },
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const isExternal = href?.startsWith('http')
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`
    },
    code({ text, lang }: { text: string; lang?: string }) {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`
      codeBlocks.push({ lang: lang || 'plaintext', code: text, placeholder })
      return placeholder
    },
  }

  markedInstance.use({ renderer })

  // First pass: marked converts markdown and stores code block placeholders
  let html = await markedInstance.parse(content)

  // Second pass: replace placeholders with Shiki-highlighted code
  for (const block of codeBlocks) {
    const highlighted = await highlightCode(block.code, block.lang)
    html = html.replace(block.placeholder, highlighted)
  }

  return html
}

const about = defineCollection({
  name: 'about',
  directory: 'content/about',
  include: 'about-me.md',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc) => {
    const html = await parseMarkdown(doc.content)
    return {
      ...doc,
      html,
    }
  },
})

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverPosition: z.string().optional(), // e.g., "top", "center", "bottom", "30%"
    heroImage: z.string().optional(), // Wide banner image above article header
    heroImagePosition: z.string().optional(), // e.g., "top", "center", "bottom", "30%"
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: async (doc) => {
    const html = await parseMarkdown(doc.content)
    return {
      ...doc,
      html,
    }
  },
})

const projects = defineCollection({
  name: 'projects',
  directory: 'content/projects',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    github: z.string().optional(),
    demo: z.string().optional(),
    cover: z.string().optional(),
    coverPosition: z.string().optional(), // e.g., "top", "center", "bottom", "30%"
    heroImage: z.string().optional(), // Wide banner image above article header
    heroImagePosition: z.string().optional(), // e.g., "top", "center", "bottom", "30%"
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: async (doc) => {
    const html = await parseMarkdown(doc.content)
    return {
      ...doc,
      html,
    }
  },
})

export default defineConfig({
  collections: [about, posts, projects],
})
