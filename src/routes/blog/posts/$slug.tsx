import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import { Container, Heading, Text, NewsletterSubscribe, HeroImage } from '~/components/ui'
import { ArticleContent } from '~/components/article-content'
import {
  seoConfig,
  toISODate,
  createArticleMeta,
  createBlogPostingSchema,
} from '~/lib/seo'

export const Route = createFileRoute('/blog/posts/$slug')({
  loader: ({ params }) => {
    const post = allPosts.find(
      (p) => p._meta.path.replace(/\.md$/, '') === params.slug
    )
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { post } = loaderData
    const slug = post._meta.path.replace(/\.md$/, '')
    const postUrl = `${seoConfig.siteUrl}/blog/posts/${slug}`
    const postImage = post.cover || seoConfig.defaultImage
    const publishedDate = toISODate(post.date)

    return {
      meta: createArticleMeta({
        title: post.title,
        description: post.summary,
        url: postUrl,
        image: postImage,
        publishedTime: publishedDate,
      }),
      links: [{ rel: 'canonical', href: postUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            createBlogPostingSchema({
              title: post.title,
              description: post.summary,
              url: postUrl,
              image: postImage,
              publishedDate,
              tags: post.tags,
            })
          ),
        },
      ],
    }
  },
  component: PostPage,
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) // 200 words per minute
}

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    <div className="py-8 sm:py-12">
      <Container size="prose">
        {/* Back link */}
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to Blog</span>
        </Link>

        {/* Hero image */}
        {post.heroImage && (
          <HeroImage
            src={post.heroImage}
            alt={post.title}
            position={post.heroImagePosition}
          />
        )}

        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <Heading level="h1" className="mb-4">
            {post.title}
          </Heading>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="text-border">·</span>
            <span>{getReadingTime(post.html)} min read</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-border">·</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-neutral-100 px-2 py-0.5 text-xs font-medium dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          <Text variant="muted" size="lg" className="mt-6">
            {post.summary}
          </Text>
        </header>

        {/* Content */}
        <div className="border-t border-border pt-8">
          <ArticleContent html={post.html} />
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 border-t border-border pt-12">
          <NewsletterSubscribe
            variant="card"
            accentColor="coral"
            heading="Get posts like this in your inbox"
            subheading="Subscribe for AI tips and blog updates."
          />
        </div>
      </Container>
    </div>
  )
}
