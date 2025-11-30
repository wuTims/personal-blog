import { Heading, ProjectCard, Text } from '~/components/ui'

export function ProjectCardsSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Project Cards
      </Heading>

      {/* Overview */}
      <div className="mb-8 sm:mb-12">
        <Text className="mb-6">
          Project cards display a media preview (image or video), title,
          description, tags, and action links. Ideal for showcasing portfolio
          projects with links to repositories, demos, and articles.
        </Text>

        {/* Basic Example */}
        <Heading level="h3" className="mb-4 sm:mb-6">
          Basic Usage
        </Heading>
        <div className="max-w-md">
          <ProjectCard
            mediaSrc="https://www.gitkraken.com/wp-content/uploads/2022/02/CLI-stands-forHero.png"
            mediaAlt="CLI terminal illustration"
            title="CLI Task Manager"
            description="A fast, keyboard-driven task manager built with Rust and SQLite for local-first productivity."
            repoUrl="https://github.com/example/cli-task-manager"
          />
        </div>
      </div>

      {/* With Tags and Links*/}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          With Tags
        </Heading>
        <Text className="mb-4">
          Add tags to highlight tech stack, achievements, or project status.
          Tags support accent colors: emerald, coral, lavender, sky.
        </Text>
        <div className="max-w-md">
          <ProjectCard
            mediaSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
            mediaAlt="Data visualization dashboard"
            title="Analytics Dashboard"
            description="Real-time analytics platform with customizable widgets and data export."
            tags={[
              { label: 'React', variant: 'sky' },
              { label: 'TypeScript', variant: 'lavender' },
              { label: 'Hackathon Winner', variant: 'coral' },
            ]}
            repoUrl="https://github.com/example/analytics-dashboard"
            links={[{ label: 'Live Demo', href: '#', icon: 'demo' }, { label: 'Article', href: '#', icon: 'article' }]}
          />
        </div>
      </div>

      {/* Video Media */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Video Preview
        </Heading>
        <Text className="mb-4">
          Use mediaType="video" for auto-playing, looped video previews. Videos
          play muted and loop continuously like a GIF but with better
          compression.
        </Text>
        <div className="max-w-md">
          <ProjectCard
            mediaSrc="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
            mediaAlt="Interactive animation demo"
            mediaType="video"
            videoPoster="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop"
            title="Motion Graphics Editor"
            description="Browser-based motion graphics tool with timeline editing and real-time preview."
            tags={[
              { label: 'Canvas API', variant: 'lavender' },
              { label: 'WebGL', variant: 'coral' },
            ]}
            repoUrl="https://github.com/example/motion-editor"
          />
        </div>
      </div>

    </section>
  )
}