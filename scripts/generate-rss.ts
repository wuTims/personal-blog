/**
 * RSS feed generator script
 * Run with: pnpm exec tsx scripts/generate-rss.ts
 *
 * Generates feed.xml (RSS 2.0) based on content-collections data
 */

import { writeFileSync } from 'fs'
import { join } from 'path'

// Import directly from the generated content-collections
import { allPosts } from '../.content-collections/generated/index.js'

const SITE_URL = 'https://wutims.com'
const FEED_TITLE = 'wutims'
const FEED_DESCRIPTION =
  'Small blog about AI development and general thoughts about life. I also love teaching people about table tennis and talking about food.'

function getSlug(path: string) {
  return path.replace(/\.md$/, '')
}

function toRFC822Date(dateStr: string): string {
  return new Date(dateStr).toUTCString()
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRSSFeed() {
  const publishedPosts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const latestPostDate = publishedPosts[0]?.date
    ? toRFC822Date(publishedPosts[0].date)
    : toRFC822Date(new Date().toISOString())

  const items = publishedPosts.map((post) => {
    const slug = getSlug(post._meta.path)
    const postUrl = `${SITE_URL}/blog/posts/${slug}`
    const categories = post.tags
      ? post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')
      : ''

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${toRFC822Date(post.date)}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
${categories}
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${latestPostDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`

  const outputPath = join(process.cwd(), 'public', 'feed.xml')
  writeFileSync(outputPath, xml)
  console.log(`✓ Generated feed.xml with ${publishedPosts.length} posts`)
}

generateRSSFeed()