import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Code,
  Heading,
  Text,
} from '~/components/ui'

export function CardsSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Cards
      </Heading>

      {/* Card Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Variants
        </Heading>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                Standard card with subtle border
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                This is a default card with a subtle border (#e5e5e5). Perfect
                for content sections.
              </Text>
            </CardContent>
          </Card>

          <Card variant="emphasisHover">
            <CardHeader>
              <CardTitle>Emphasis Card</CardTitle>
              <CardDescription>
                Mac-style card with shadow effect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                This card features the signature Mac-style offset shadow and
                black border for emphasis.
              </Text>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Card with All Parts */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Complete Card Example
        </Heading>
        <Card variant="emphasis" className="max-w-2xl">
          <CardHeader>
            <CardTitle>Feature Card</CardTitle>
            <CardDescription>
              A complete example with header, content, and footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="mb-4">
              This card demonstrates all available card components working
              together with the ChromaDB design system.
            </Text>
            <Code variant="block">{`<Card variant="emphasis">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>`}</Code>
          </CardContent>
          <CardFooter className="gap-4">
            <Button size="default">Action</Button>
            <Button variant="secondary">Cancel</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Card Grid */}
      <div>
        <Heading level="h3" className="mb-4 sm:mb-6">
          Card Grid
        </Heading>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="emphasisHover" className="hover:border-emerald">
            <CardHeader>
              <Text
                variant="emerald"
                weight="semibold"
                className="mb-2 font-ibm-mono text-xs uppercase tracking-wide"
              >
                Emerald
              </Text>
              <CardTitle>Feature One</CardTitle>
            </CardHeader>
            <CardContent>
              <Text size="sm">
                Mac-style card with emerald green accent on hover.
              </Text>
            </CardContent>
          </Card>

          <Card variant="emphasisHover" className="hover:border-coral">
            <CardHeader>
              <Text
                variant="coral"
                weight="semibold"
                className="mb-2 font-ibm-mono text-xs uppercase tracking-wide"
              >
                Coral
              </Text>
              <CardTitle>Feature Two</CardTitle>
            </CardHeader>
            <CardContent>
              <Text size="sm">
                Mac-style card with coral orange accent on hover.
              </Text>
            </CardContent>
          </Card>

          <Card variant="emphasisHover" className="hover:border-lavender">
            <CardHeader>
              <Text
                variant="lavender"
                weight="semibold"
                className="mb-2 font-ibm-mono text-xs uppercase tracking-wide"
              >
                Lavender
              </Text>
              <CardTitle>Feature Three</CardTitle>
            </CardHeader>
            <CardContent>
              <Text size="sm">
                Mac-style card with lavender purple accent on hover.
              </Text>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
