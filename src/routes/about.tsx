import { createFileRoute } from '@tanstack/react-router'
import { WipPlaceholder } from '~/components/WipPlaceholder'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <WipPlaceholder
      title="About"
      description=""
      accentColor="coral"
    />
  )
}
