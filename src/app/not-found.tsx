import Link from 'next/link'

/**
 * Global 404-side — vises når en route ikke findes.
 * Next.js App Router: not-found.tsx i app-roden.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-[32px] font-bold text-primary mb-8">Mæt</h1>
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-8">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="text-h2 text-txt-primary mb-2">Siden findes ikke</h2>
          <p className="text-body text-txt-secondary mb-6">
            Vi kunne ikke finde det du ledte efter. Måske er linket forældet?
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold text-center hover:bg-primary-dark transition-colors shadow-sm mb-3"
          >
            Gå til dashboard
          </Link>
          <Link
            href="/opskrifter"
            className="block w-full py-3 rounded-xl border border-border text-body text-txt-secondary text-center hover:bg-bg-alt transition-colors"
          >
            Se opskrifter
          </Link>
        </div>
      </div>
    </div>
  )
}
