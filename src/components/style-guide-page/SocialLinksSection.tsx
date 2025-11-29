import {
  Heading,
  SocialLink,
  SocialLinks,
  GithubIcon,
  LinkedinIcon,
} from '~/components/ui'

const sampleLinks = [
  { platform: 'github' as const, href: 'https://github.com/wuTims' },
  { platform: 'linkedin' as const, href: 'https://www.linkedin.com/in/timlwu' },
]

export function SocialLinksSection() {
  return (
    <section className="mb-16 sm:mb-20">
      <Heading level="h2" className="mb-6 border-b pb-3 sm:mb-8 sm:pb-4">
        Social Links
      </Heading>

      {/* Individual Icons */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Icons
        </Heading>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <GithubIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm text-neutral-500">GitHub</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkedinIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm text-neutral-500">LinkedIn</span>
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Sizes
        </Heading>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-2 text-sm text-neutral-500">Small</p>
            <SocialLink platform="github" href="#" size="sm" />
          </div>
          <div>
            <p className="mb-2 text-sm text-neutral-500">Default</p>
            <SocialLink platform="github" href="#" size="default" />
          </div>
          <div>
            <p className="mb-2 text-sm text-neutral-500">Large</p>
            <SocialLink platform="github" href="#" size="lg" />
          </div>
        </div>
      </div>

      {/* Icon Only */}
      <div className="mb-8 sm:mb-12">
        <Heading level="h3" className="mb-4 sm:mb-6">
          Icon Only
        </Heading>
        <div className="flex gap-4">
          <SocialLink platform="github" href="#" showLabel={false} />
          <SocialLink platform="linkedin" href="#" showLabel={false} />
        </div>
      </div>

      {/* SocialLinks Group - Vertical */}
      <div>
        <Heading level="h3" className="mb-4 sm:mb-6">
          Vertical Layout
        </Heading>
        <SocialLinks links={sampleLinks} layout="vertical" />
      </div>
    </section>
  )
}
