import { createFileRoute } from '@tanstack/react-router'
import { WipPlaceholder } from '~/components/WipPlaceholder'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <WipPlaceholder
      title="Projects"
      description=""
      accentColor="lavender"
    />
  )
}
