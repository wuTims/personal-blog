import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl">
          Welcome to <span className="text-neutral-500 dark:text-neutral-400">Tim's Blog</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          A personal space for sharing thoughts and projects. <br></br>A playground for modern web development using AI.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/blog"
            className="rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Read the Blog
          </a>
          <a
            href="/components"
            className="text-sm font-semibold leading-6 text-neutral-900 dark:text-neutral-100"
          >
            View Style Guide <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
