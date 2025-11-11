import { Code, Heading, Text } from '~/components/ui'

export function TypographySection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Typography
      </Heading>

      {/* Headings */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Headings
        </Heading>
        <div className="space-y-3 sm:space-y-4">
          <Heading level="h1">Heading 1 - Playfair Display</Heading>
          <Heading level="h2">Heading 2 - Playfair Display</Heading>
          <Heading level="h3">Heading 3 - Playfair Display</Heading>
          <Heading level="h4">Heading 4 - Playfair Display</Heading>
          <Heading level="h5">Heading 5 - Playfair Display</Heading>
          <Heading level="h6">Heading 6 - Playfair Display</Heading>
        </div>
      </div>

      {/* Text Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Text Variants
        </Heading>
        <div className="space-y-2 sm:space-y-3">
          <Text size="xl">Extra Large Text - Inter</Text>
          <Text size="lg">Large Text - Inter</Text>
          <Text size="base">Base Text - Inter (Default)</Text>
          <Text size="sm">Small Text - Inter</Text>
          <Text size="xs">Extra Small Text - Inter</Text>
        </div>
      </div>

      {/* Text Colors */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Text Colors
        </Heading>
        <div className="space-y-2 sm:space-y-3">
          <Text variant="default">Default text color</Text>
          <Text variant="muted">Muted text color (#737373)</Text>
          <Text variant="emerald">Emerald Green (#00855d)</Text>
          <Text variant="coral">Coral Orange (#ff6b35)</Text>
          <Text variant="lavender">Lavender Purple (#cba6f7)</Text>
          <Text variant="sky">Sky Blue (#4a81de)</Text>
        </div>
      </div>

      {/* Code */}
      <div>
        <Heading level="h3" className="mb-4 sm:mb-6">
          Code
        </Heading>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <Text variant="muted" size="sm" className="mb-2">
              Inline Code:
            </Text>
            <Text>
              Use the <Code>console.log()</Code> function to debug your code.
            </Text>
          </div>
          <div>
            <Text variant="muted" size="sm" className="mb-2">
              Code Block:
            </Text>
            <Code variant="block">{`import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})`}</Code>
          </div>
        </div>
      </div>
    </section>
  )
}
