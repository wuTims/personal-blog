import { createFileRoute } from '@tanstack/react-router'
import { DarkModeToggle } from '~/components/ui'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="absolute right-8 top-8">
        <DarkModeToggle />
      </div>
      <h1 className="text-5xl font-bold">Welcome to Tim's Blog</h1>
      <p className="mt-4 text-muted">
        Work in progress...
      </p>
      <p className="mt-4 text-muted">
        Generated style guide components based on <a
          href="https://www.trychroma.com/"
          target="_blank"
          className="text-sky"
        >
          ChromaDB
        </a>
      </p>
      <a
        href="/components"
        className="mt-8 rounded-md bg-foreground px-6 py-3 text-background transition-opacity hover:opacity-90"
      >
        View Components
      </a>
    </div>
  )
}
