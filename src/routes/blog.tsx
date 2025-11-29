import { createFileRoute } from '@tanstack/react-router'
import { WipPlaceholder } from '~/components/WipPlaceholder'

export const Route = createFileRoute('/blog')({
    component: BlogPage,
})

function BlogPage() {
    return (
        <WipPlaceholder
            title="Blog"
            description=""
            accentColor="sky"
        />
    )
}
