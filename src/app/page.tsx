import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Logo */}
        <h1 className="text-[48px] font-bold text-primary leading-none mb-2">Mæt</h1>
        <p className="text-body-lg text-accent font-medium mb-4">Din families madplan</p>
        <p className="text-body text-txt-secondary leading-relaxed mb-10">
          Planlæg ugens måltider, find opskrifter og lav indkøbslister der passer til hele familien.
          Nemt, hurtigt og uden spild.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { emoji: '🍽️', label: '100+ opskrifter' },
            { emoji: '📅', label: 'Smart ugeplan' },
            { emoji: '🛒', label: 'Auto indkøbsliste' },
          ].map(({ emoji, label }) => (
            <div key={label} className="bg-bg-surface rounded-xl border border-border p-3 text-center">
              <span className="text-2xl block mb-1">{emoji}</span>
              <span className="text-micro text-txt-secondary">{label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="w-full bg-primary text-white py-4 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm text-center"
          >
            Kom i gang — gratis →
          </Link>
          <Link
            href="/login"
            className="w-full py-4 rounded-xl border border-border text-label text-txt-secondary hover:bg-bg-alt transition-colors text-center"
          >
            Log ind
          </Link>
        </div>

        <p className="mt-6 text-micro text-txt-muted">
          Ingen kreditkort · Gratis under beta
        </p>
      </div>
    </main>
  )
}
