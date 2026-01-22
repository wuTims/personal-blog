import { createHighlighter, type Highlighter } from 'shiki'

// Singleton highlighter instance
let highlighter: Highlighter | null = null

const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'bash',
  'shell',
  'json',
  'xml',
  'html',
  'css',
  'yaml',
  'markdown',
  'tsx',
  'jsx',
  'sql',
  'go',
  'rust',
  'dockerfile',
  'plaintext',
] as const

// Map common aliases to supported languages
const LANGUAGE_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  text: 'plaintext',
  txt: 'plaintext',
}

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['catppuccin-mocha', 'catppuccin-latte'],
      langs: [...SUPPORTED_LANGUAGES],
    })
  }
  return highlighter
}

export async function highlightCode(
  code: string,
  lang: string
): Promise<string> {
  // Handle mermaid blocks specially - return marked div for client-side rendering
  if (lang === 'mermaid') {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<div class="mermaid-source" data-mermaid="true">${escapedCode}</div>`
  }

  const hl = await getHighlighter()

  // Normalize language
  const normalizedLang = LANGUAGE_ALIASES[lang] || lang
  const supportedLang = SUPPORTED_LANGUAGES.includes(
    normalizedLang as (typeof SUPPORTED_LANGUAGES)[number]
  )
    ? normalizedLang
    : 'plaintext'

  // Generate HTML with dual themes using CSS variables
  const html = hl.codeToHtml(code, {
    lang: supportedLang,
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
    defaultColor: false, // Use CSS variables for theme switching
  })

  return html
}
