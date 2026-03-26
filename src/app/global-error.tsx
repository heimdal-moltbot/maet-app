'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary — fanger fejl i root layout (inkl. Navbar).
 * Erstatter hele siden inkl. HTML/body.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html lang="da">
      <body className="min-h-screen bg-[#FEFAE0] flex items-center justify-center px-4 font-sans">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-[32px] font-bold text-[#E8734A] mb-6">Mæt</h1>
          <div className="bg-white rounded-xl border border-[#E8E8D8] shadow-sm p-8">
            <span className="text-5xl block mb-4">🔧</span>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Uventet fejl</h2>
            <p className="text-[15px] text-[#6B6B5A] mb-6">
              Noget gik galt på vores side. Vi arbejder på det.
            </p>
            <button
              onClick={reset}
              className="w-full bg-[#E8734A] text-white py-3.5 rounded-xl text-[14px] font-semibold hover:bg-[#C4572A] transition-colors"
            >
              Prøv igen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
