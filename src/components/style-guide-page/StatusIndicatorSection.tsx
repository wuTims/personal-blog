import { Heading, StatusIndicator, GlowingDot } from '~/components/ui'

const sampleTopics = [
  'AI-assisted development',
  'React Server Components',
  'Edge computing',
  'Design systems',
  'TypeScript patterns',
]

export function StatusIndicatorSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Status Indicator
      </Heading>

      {/* Glowing Dot */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Glowing Dot
        </Heading>
        <p className="mb-4 text-sm text-neutral-500">
          A minimal pulsing dot with a liquid glass glow effect. Useful for
          indicating active status or drawing subtle attention.
        </p>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <GlowingDot />
            <span className="text-sm text-neutral-500">Default (4s)</span>
          </div>
          <div className="flex items-center gap-3">
            <GlowingDot duration={2} />
            <span className="text-sm text-neutral-500">Fast (2s)</span>
          </div>
          <div className="flex items-center gap-3">
            <GlowingDot duration={6} />
            <span className="text-sm text-neutral-500">Slow (6s)</span>
          </div>
        </div>
      </div>

      {/* Full Status Indicator */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Status Indicator with Rotating Topics
        </Heading>
        <p className="mb-4 text-sm text-neutral-500">
          Combines the glowing dot with a rotating text animation. Topics cycle
          through with a vertical scroll effect.
        </p>
        <div className="space-y-4">
          <StatusIndicator topics={sampleTopics} />
        </div>
      </div>
    </section>
  )
}