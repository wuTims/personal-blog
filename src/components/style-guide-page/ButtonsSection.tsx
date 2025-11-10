import { Button, Heading } from '~/components/ui'

export function ButtonsSection() {
  return (
    <section className="mb-20">
      <Heading level="h2" className="mb-8 border-b pb-4">
        Buttons
      </Heading>

      {/* Button Variants */}
      <div className="mb-12">
        <Heading level="h3" className="mb-6">
          Variants
        </Heading>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </div>

      {/* Button Sizes */}
      <div className="mb-12">
        <Heading level="h3" className="mb-6">
          Sizes
        </Heading>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="default">Default Size</Button>
          <Button size="lg">Large Size</Button>
        </div>
      </div>

      {/* Button States */}
      <div>
        <Heading level="h3" className="mb-6">
          States
        </Heading>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </section>
  )
}
