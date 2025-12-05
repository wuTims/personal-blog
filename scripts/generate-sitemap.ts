/**
 * Sitemap generator script
 * Run with: pnpm exec tsx scripts/generate-sitemap.ts
 *
 * Generates sitemap.xml based on content-collections data
 */

import { writeFileSync } from 'fs'
import { join } from 'path'

// Import directly from the generated content-collections
import { allPosts, allProjects } from '../.content-collections/generated/index.js'

const SITE_URL = 'https://wutims.com'

function getSlug(path: string) {
  return path.replace(/\.md$/, '')
}

function toISODate(dateStr: string): string {
  return new Date(dateStr).toISOString()
}

interface SitemapUrl {
  url: string
  lastmod?: string
  changefreq: string
  priority: string
}

function generateSitemap() {
  const publishedPosts = allPosts.filter((post) => post.published)
  const publishedProjects = allProjects.filter((project) => project.published)

  const staticPages: SitemapUrl[] = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/blog', changefreq: 'weekly', priority: '0.9' },
    { url: '/components', changefreq: 'monthly', priority: '0.5' },
  ]

  const postUrls: SitemapUrl[] = publishedPosts.map((post) => ({
    url: `/blog/posts/${getSlug(post._meta.path)}`,
    lastmod: toISODate(post.date),
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const projectUrls: SitemapUrl[] = publishedProjects.map((project) => ({
    url: `/blog/projects/${getSlug(project._meta.path)}`,
    lastmod: toISODate(project.date),
    changefreq: 'monthly',
    priority: '0.7',
  }))

  const allUrls = [...staticPages, ...postUrls, ...projectUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

  const outputPath = join(process.cwd(), 'public', 'sitemap.xml')
  writeFileSync(outputPath, xml)
  console.log(`✓ Generated sitemap.xml with ${allUrls.length} URLs`)
  console.log(`  - ${staticPages.length} static pages`)
  console.log(`  - ${postUrls.length} blog posts`)
  console.log(`  - ${projectUrls.length} projects`)
}

generateSitemap()
