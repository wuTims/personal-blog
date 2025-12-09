/**
 * Newsletter card generator script
 * Run with: pnpm exec tsx scripts/generate-newsletter-cards.ts --slug=post-name
 * Or: pnpm exec tsx scripts/generate-newsletter-cards.ts --days=7
 *
 * Generates email-safe HTML cards and screenshots for beehiiv newsletters
 * Output: dist/newsletter-cards/{slug}/card.html and card.png
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { chromium } from 'playwright'

// Import directly from the generated content-collections
import { allPosts } from '../.content-collections/generated/index.js'

const SITE_URL = 'https://wutims.com'
const MEDIA_URL = 'https://media.wutims.com'
const OUTPUT_DIR = join(process.cwd(), 'dist', 'newsletter-cards')

// Screenshot settings
const SCREENSHOT_WIDTH = 550
const SCREENSHOT_HEIGHT = 515

// Design tokens for email-safe inline styles
const styles = {
  // Colors
  bgWhite: '#ffffff',
  bgGray: '#f0f0f0',
  textPrimary: '#0a0a0a',
  textMuted: '#737373',
  borderColor: '#0a0a0a',

  // Fonts (web-safe fallbacks for email)
  fontSerif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontSans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  // Spacing
  cardPadding: '24px',
  cardBorderRadius: '2px',
  buttonBorderRadius: '6px',
}

function getSlug(path: string) {
  return path.replace(/\.md$/, '')
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface Post {
  title: string
  summary: string
  date: string
  cover?: string
  tags?: string[]
  _meta: { path: string }
}

function generateCardHtml(post: Post): string {
  const slug = getSlug(post._meta.path)
  const postUrl = `${SITE_URL}/blog/posts/${slug}`
  // Handle cover URLs that are already absolute or need the media prefix
  const coverUrl = post.cover
    ? post.cover.startsWith('http')
      ? post.cover
      : `${MEDIA_URL}/${post.cover}`
    : null

  // Email-safe table-based layout with inline styles
  // Using border-bottom and border-right for mac-style shadow effect
  return `<!--
  Newsletter Card for: ${post.title}
  Generated: ${new Date().toISOString()}
  Post URL: ${postUrl}
-->
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="padding: 0 0 6px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="
        background-color: ${styles.bgWhite};
        border: 2px solid ${styles.borderColor};
        border-radius: ${styles.cardBorderRadius};
        box-shadow: 6px 6px 0 0 ${styles.bgGray};
      ">
        ${
          coverUrl
            ? `
        <!-- Cover Image -->
        <tr>
          <td style="padding: 0;">
            <a href="${postUrl}" style="display: block; text-decoration: none;">
              <img
                src="${coverUrl}"
                alt="${escapeHtml(post.title)}"
                width="100%"
                style="
                  display: block;
                  width: 100%;
                  height: auto;
                  max-height: 280px;
                  object-fit: cover;
                  border-radius: ${styles.cardBorderRadius} ${styles.cardBorderRadius} 0 0;
                "
              />
            </a>
          </td>
        </tr>
        `
            : ''
        }
        <!-- Content -->
        <tr>
          <td style="padding: ${styles.cardPadding};">
            <!-- Date -->
            <p style="
              margin: 0 0 8px 0;
              font-family: ${styles.fontSans};
              font-size: 13px;
              color: ${styles.textMuted};
              line-height: 1.4;
            ">
              ${formatDate(post.date)}
            </p>

            <!-- Title -->
            <h2 style="
              margin: 0 0 12px 0;
              font-family: ${styles.fontSerif};
              font-size: 24px;
              font-weight: 600;
              color: ${styles.textPrimary};
              line-height: 1.3;
            ">
              <a href="${postUrl}" style="color: ${styles.textPrimary}; text-decoration: none;">
                ${escapeHtml(post.title)}
              </a>
            </h2>

            <!-- Summary -->
            <p style="
              margin: 0 0 20px 0;
              font-family: ${styles.fontSans};
              font-size: 16px;
              color: ${styles.textPrimary};
              line-height: 1.6;
            ">
              ${escapeHtml(post.summary)}
            </p>

            <!-- Read More Button -->
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="
                  background-color: ${styles.textPrimary};
                  border-radius: ${styles.buttonBorderRadius};
                ">
                  <a href="${postUrl}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    font-family: ${styles.fontSans};
                    font-size: 14px;
                    font-weight: 500;
                    color: ${styles.bgWhite};
                    text-decoration: none;
                    text-align: center;
                  ">
                    Read More &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}

async function takeScreenshot(htmlPath: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT },
    deviceScaleFactor: 2, // 2x for higher quality
  })
  const page = await context.newPage()

  await page.goto(`file://${htmlPath}`)
  await page.screenshot({
    path: outputPath,
    type: 'png',
  })

  await browser.close()
}

function parseArgs(): { slug?: string; days?: number; skipScreenshot?: boolean } {
  const args = process.argv.slice(2)
  const result: { slug?: string; days?: number; skipScreenshot?: boolean } = {}

  for (const arg of args) {
    if (arg.startsWith('--slug=')) {
      result.slug = arg.replace('--slug=', '')
    } else if (arg.startsWith('--days=')) {
      result.days = parseInt(arg.replace('--days=', ''), 10)
    } else if (arg === '--no-screenshot') {
      result.skipScreenshot = true
    }
  }

  return result
}

async function generateNewsletterCards() {
  const { slug, days, skipScreenshot } = parseArgs()

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let postsToProcess: Post[] = []

  if (slug) {
    // Find specific post by slug
    const foundPost = allPosts.find((p) => getSlug(p._meta.path) === slug && p.published)
    if (!foundPost) {
      console.error(`Error: Post with slug "${slug}" not found or not published`)
      process.exit(1)
    }
    postsToProcess = [foundPost]
  } else if (days) {
    // Find posts from the last N days
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    postsToProcess = allPosts
      .filter((p) => p.published && new Date(p.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (postsToProcess.length === 0) {
      console.log(`No published posts found in the last ${days} days`)
      process.exit(0)
    }
  } else {
    console.error('Usage: pnpm newsletter:card --slug=<post-slug>')
    console.error('       pnpm newsletter:card --days=<number>')
    console.error('')
    console.error('Options:')
    console.error('  --no-screenshot  Skip screenshot generation')
    console.error('')
    console.error('Examples:')
    console.error('  pnpm newsletter:card --slug=my-first-post')
    console.error('  pnpm newsletter:card --days=7')
    console.error('  pnpm newsletter:card --slug=my-post --no-screenshot')
    process.exit(1)
  }

  // Generate cards for each post
  for (const post of postsToProcess) {
    const postSlug = getSlug(post._meta.path)
    const postDir = join(OUTPUT_DIR, postSlug)

    // Create post-specific directory
    if (!existsSync(postDir)) {
      mkdirSync(postDir, { recursive: true })
    }

    const html = generateCardHtml(post)
    const htmlPath = join(postDir, 'card.html')
    const pngPath = join(postDir, 'card.png')

    // Write HTML
    writeFileSync(htmlPath, html)
    console.log(`✓ Generated: dist/newsletter-cards/${postSlug}/card.html`)

    // Take screenshot
    if (!skipScreenshot) {
      try {
        await takeScreenshot(htmlPath, pngPath)
        console.log(`✓ Screenshot: dist/newsletter-cards/${postSlug}/card.png`)
      } catch (error) {
        console.error(`✗ Screenshot failed for ${postSlug}:`, error)
      }
    }
  }

  console.log('')
  console.log(`Generated ${postsToProcess.length} newsletter card(s)`)
  console.log(`Output directory: ${OUTPUT_DIR}`)
}

generateNewsletterCards()
