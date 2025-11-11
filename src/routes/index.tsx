import { createFileRoute } from '@tanstack/react-router'
import { DarkModeToggle } from '~/components/ui'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <DarkModeToggle />
      </div>
      <h1 className="text-center text-3xl font-bold sm:text-4xl md:text-5xl">Welcome to Tim's Blog</h1>
      <p className="mt-4 text-center text-muted">
        Work in progress...
      </p>
      <p className="mt-4 text-center text-muted">
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
        className="mt-8 rounded-md bg-foreground px-6 py-3 text-center text-background transition-opacity hover:opacity-90"
      >
        View Components
      </a>
    </div>
  )
}
