import { DarkModeToggle, Heading, Text } from '~/components/ui'

export function DarkModeToggleSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Dark Mode Toggle
      </Heading>

      {/* Animation Demo */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          View Transition Animation
        </Heading>
        <Text variant="muted" size="sm" className="mb-4">
          Click to see the radial clip-path animation expand from the button
        </Text>
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6">
          <DarkModeToggle size="lg" />
          <div>
            <Text className="font-medium">Toggle Theme</Text>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Variants
        </Heading>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle variant="default" />
            <Text variant="muted" size="sm">Default</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle variant="ghost" />
            <Text variant="muted" size="sm">Ghost</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle variant="outline" />
            <Text variant="muted" size="sm">Outline</Text>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Sizes
        </Heading>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle size="sm" />
            <Text variant="muted" size="sm">Small</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle size="default" />
            <Text variant="muted" size="sm">Default</Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DarkModeToggle size="lg" />
            <Text variant="muted" size="sm">Large</Text>
          </div>
        </div>
      </div>
    </section>
  )
}
