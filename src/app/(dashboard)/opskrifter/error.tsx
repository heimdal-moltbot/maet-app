'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function OpskrifterError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Opskrifter Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <span className="text-5xl block mb-4">🍽️</span>
        <h2 className="text-h2 text-txt-primary mb-2">Opskrifter ikke tilgængelige</h2>
        <p className="text-body text-txt-secondary mb-6">
          Vi kunne ikke hente opskrifterne. Tjek din forbindelse og prøv igen.
        </p>
        <button
          onClick={reset}
          className="w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm mb-3"
        >
          Prøv igen
        </button>
        <Link href="/dashboard" className="block text-label text-txt-muted hover:text-txt-secondary transition-colors">
          Tilbage til dashboard
        </Link>
      </div>
    </div>
  )
}
