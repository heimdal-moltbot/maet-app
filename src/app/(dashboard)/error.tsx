'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Dashboard error boundary — vises når en route-komponent kaster en fejl.
 * Next.js App Router kræver 'use client' på error.tsx.
 */
export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log til console (erstattes med Sentry/logging service ved prod)
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-8">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-h2 text-txt-primary mb-2">Noget gik galt</h2>
          <p className="text-body text-txt-secondary mb-6">
            Vi kunne ikke indlæse siden. Prøv igen — det er sandsynligvis midlertidigt.
          </p>
          <button
            onClick={reset}
            className="w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Prøv igen
          </button>
          <a
            href="/dashboard"
            className="block mt-3 text-label text-txt-muted hover:text-txt-secondary transition-colors"
          >
            Gå til forsiden
          </a>
        </div>
      </div>
    </div>
  )
}
