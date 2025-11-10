import { Card, CardContent, Code, Heading, Text } from '~/components/ui'

export function ContainerSection() {
  return (
    <section className="mb-20">
      <Heading level="h2" className="mb-8 border-b pb-4">
        Containers
      </Heading>

      <div className="space-y-6">
        <div>
          <Text variant="muted" size="sm" className="mb-3">
            Container sizes control max-width and responsive padding:
          </Text>
          <Code variant="block">{`<Container size="sm">Small (640px)</Container>
<Container size="md">Medium (768px)</Container>
<Container size="lg">Large (1024px)</Container>
<Container size="xl">Extra Large (1280px)</Container>
<Container size="2xl">2XL (1536px)</Container>
<Container size="full">Full Width</Container>`}</Code>
        </div>

        <Card variant="default">
          <CardContent className="space-y-2 py-4">
            <Text weight="semibold">Current page container:</Text>
            <Code>{'<Container size="xl" padding="default">'}</Code>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
