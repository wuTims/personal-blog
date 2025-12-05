// Centralized SEO configuration and utilities

export const seoConfig = {
  siteUrl: 'https://wutims.com',
  siteName: 'wutims',
  defaultImage: 'https://media.wutims.com/wutims_og_1200px.png',
  defaultImageWidth: 1200,
  defaultImageHeight: 630,
  authorName: 'Tim Wu',
  twitterHandle: '@wutims',
  twitterCard: 'summary_large_image' as const,
  locale: 'en_US',
  language: 'en-US',
}

// Helper to convert date string to ISO format
export function toISODate(dateStr: string): string {
  return new Date(dateStr).toISOString()
}

// Common meta tags for articles (posts/projects)
export function createArticleMeta({
  title,
  description,
  url,
  image,
  imageWidth = seoConfig.defaultImageWidth,
  imageHeight = seoConfig.defaultImageHeight,
  publishedTime,
  authorName = seoConfig.authorName,
}: {
  title: string
  description: string
  url: string
  image: string
  imageWidth?: number
  imageHeight?: number
  publishedTime: string
  authorName?: string
}) {
  return [
    { title: `${title} | ${seoConfig.siteName}` },
    { name: 'description', content: description },
    // Open Graph
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(imageWidth) },
    { property: 'og:image:height', content: String(imageHeight) },
    { property: 'og:image:alt', content: title },
    { property: 'article:published_time', content: publishedTime },
    { property: 'article:author', content: authorName },
    // Twitter
    { name: 'twitter:card', content: seoConfig.twitterCard },
    { name: 'twitter:site', content: seoConfig.twitterHandle },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
}

// Common meta tags for generic pages
export function createPageMeta({
  title,
  description,
  url,
  image = seoConfig.defaultImage,
}: {
  title: string
  description: string
  url: string
  image?: string
}) {
  return [
    { title: `${title} | ${seoConfig.siteName}` },
    { name: 'description', content: description },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(seoConfig.defaultImageWidth) },
    { property: 'og:image:height', content: String(seoConfig.defaultImageHeight) },
    { property: 'og:image:alt', content: title },
    // Twitter
    { name: 'twitter:card', content: seoConfig.twitterCard },
    { name: 'twitter:site', content: seoConfig.twitterHandle },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
}

// BlogPosting schema for blog posts
export function createBlogPostingSchema({
  title,
  description,
  url,
  image,
  publishedDate,
  tags,
}: {
  title: string
  description: string
  url: string
  image: string
  publishedDate: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: title,
    description,
    image,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: { '@id': `${seoConfig.siteUrl}/#person` },
    publisher: { '@id': `${seoConfig.siteUrl}/#person` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': `${seoConfig.siteUrl}/#website` },
    inLanguage: seoConfig.language,
    ...(tags?.length && { keywords: tags.join(', ') }),
  }
}

// SoftwareSourceCode schema for projects
export function createSoftwareSchema({
  title,
  description,
  url,
  image,
  publishedDate,
  tags,
  github,
  demo,
}: {
  title: string
  description: string
  url: string
  image: string
  publishedDate: string
  tags?: string[]
  github?: string
  demo?: string
}) {
  const programmingLanguages = tags?.filter((t) =>
    ['typescript', 'javascript', 'python', 'react', 'java'].includes(
      t.toLowerCase()
    )
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    '@id': `${url}#software`,
    name: title,
    description,
    image,
    datePublished: publishedDate,
    author: { '@id': `${seoConfig.siteUrl}/#person` },
    ...(github && { codeRepository: github }),
    ...(demo && { url: demo }),
    ...(tags?.length && { keywords: tags.join(', ') }),
    ...(programmingLanguages?.length && { programmingLanguage: programmingLanguages }),
  }
}
