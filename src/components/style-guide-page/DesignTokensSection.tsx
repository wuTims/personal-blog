import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Code,
  Heading,
  Text,
} from '~/components/ui'

export function DesignTokensSection() {
  return (
    <section className="mb-20">
      <Heading level="h2" className="mb-8 border-b pb-4">
        Design Tokens
      </Heading>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Colors */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Text size="sm" weight="semibold">
                Primary Palette
              </Text>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-[#fafafa]"></div>
                  <Code>--background: #fafafa</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-[#fff]"></div>
                  <Code>--card-background: #fff</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-[#0a0a0a]"></div>
                  <Code>--foreground: #0a0a0a</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-[#737373]"></div>
                  <Code>--muted: #737373</Code>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Text size="sm" weight="semibold">
                Accent Colors
              </Text>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-emerald"></div>
                  <Code>--color-emerald: #00855d</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-coral"></div>
                  <Code>--color-coral: #ff6b35</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-lavender"></div>
                  <Code>--color-lavender: #cba6f7</Code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded border bg-sky"></div>
                  <Code>--color-sky: #4a81de</Code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Text size="sm" weight="semibold">
                Font Families
              </Text>
              <div className="space-y-2">
                <div>
                  <Text className="font-playfair text-lg">
                    Playfair Display
                  </Text>
                  <Text size="xs" variant="muted">
                    Headings & Display
                  </Text>
                </div>
                <div>
                  <Text className="font-inter text-lg">Inter</Text>
                  <Text size="xs" variant="muted">
                    Body Text
                  </Text>
                </div>
                <div>
                  <Text className="font-ibm-mono text-lg">IBM Plex Mono</Text>
                  <Text size="xs" variant="muted">
                    Code & Technical
                  </Text>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Text size="sm" weight="semibold">
                Spacing
              </Text>
              <Code>--spacing: 0.25rem (4px base)</Code>
            </div>

            <div className="space-y-2">
              <Text size="sm" weight="semibold">
                Border Radius
              </Text>
              <div className="space-y-1">
                <Code>--radius-sm: 2px (cards)</Code>
                <Code>--radius-md: 6px (buttons)</Code>
                <Code>--radius-lg: 8px (images)</Code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
