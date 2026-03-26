'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Auth Error]', error)
  }, [error])

  return (
    <div className="w-full max-w-sm text-center">
      <h1 className="text-[32px] font-bold text-primary mb-6">Mæt</h1>
      <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-8">
        <span className="text-5xl block mb-4">🔐</span>
        <h2 className="text-h2 text-txt-primary mb-2">Login fejlede</h2>
        <p className="text-body text-txt-secondary mb-6">
          Der opstod en fejl under login. Prøv igen eller opret en ny konto.
        </p>
        <button
          onClick={reset}
          className="w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm mb-3"
        >
          Prøv igen
        </button>
        <Link
          href="/signup"
          className="block text-label text-txt-muted hover:text-txt-secondary transition-colors"
        >
          Opret ny konto
        </Link>
      </div>
    </div>
  )
}
