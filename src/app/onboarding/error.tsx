'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function OnboardingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Onboarding Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-[32px] font-bold text-primary mb-6">Mæt</h1>
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-8">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-h2 text-txt-primary mb-2">Opsætning mislykkedes</h2>
          <p className="text-body text-txt-secondary mb-6">
            Vi kunne ikke gemme din profil. Dine valg er ikke tabt — prøv igen.
          </p>
          <button
            onClick={reset}
            className="w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Prøv igen
          </button>
        </div>
      </div>
    </div>
  )
}
