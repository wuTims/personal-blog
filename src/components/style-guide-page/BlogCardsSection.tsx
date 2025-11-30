import { BlogCard, Heading, Text } from '~/components/ui'

export function BlogCardsSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Blog Cards
      </Heading>

      {/* Overview */}
      <div className="mb-8 sm:mb-12">
        <Text className="mb-6">
          Blog cards display a featured image, title, and description. They
          follow the neobrutalist design with Mac-style shadows and optional
          accent colors on hover.
        </Text>

        {/* Basic Example */}
        <Heading level="h3" className="mb-4 sm:mb-6">
          Basic Usage
        </Heading>
        <div className="max-w-md">
          <BlogCard
            imageSrc="https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fh2whlduzy9l7twsy80zc.png"
            imageAlt="TanStack Router logo and code"
            title="Getting Started with TanStack Router"
            description="Learn how to build modern React applications with type-safe routing and nested layouts."
            accentColor="emerald"
          />
        </div>
      </div>

    </section>
  )
}