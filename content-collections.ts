import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'
import { marked } from 'marked'

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
})

// Custom renderer to wrap images in figure with figcaption
const renderer = new marked.Renderer()
renderer.image = ({ href, title, text }) => {
  const caption = text || title
  return `<figure>
    <img src="${href}" alt="${text || ''}" loading="lazy" />
    ${caption ? `<figcaption>${caption}</figcaption>` : ''}
  </figure>`
}

renderer.link = ({ href, title, text }) => {
  const isExternal = href?.startsWith('http')
  const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
  const titleAttr = title ? ` title="${title}"` : ''
  return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`
}
marked.use({ renderer })

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
    const html = await marked.parse(doc.content)
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
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: async (doc) => {
    const html = await marked.parse(doc.content)
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
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: async (doc) => {
    const html = await marked.parse(doc.content)
    return {
      ...doc,
      html,
    }
  },
})

export default defineConfig({
  collections: [about, posts, projects],
})
