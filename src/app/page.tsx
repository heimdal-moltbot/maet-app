import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Maet
        </h1>
        <p className="mt-2 text-xl text-brand-accent">
          Madplanlaegning for familier
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Planlaeg ugens maaltider, find inspiration til nye opskrifter og lav
          indkoebslister der passer til hele familien. Nemt, hurtigt og uden
          spild.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Kom i gang gratis</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Log ind
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">📅</div>
            <h3 className="font-semibold text-gray-900">Ugeplan</h3>
            <p className="mt-2 text-sm text-gray-600">
              Planlaeg hele ugens maaltider paa faa minutter
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">📖</div>
            <h3 className="font-semibold text-gray-900">Opskrifter</h3>
            <p className="mt-2 text-sm text-gray-600">
              Saml dine yndlingsopskrifter eet sted
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-3 text-3xl">🛒</div>
            <h3 className="font-semibold text-gray-900">Indkoebsliste</h3>
            <p className="mt-2 text-sm text-gray-600">
              Automatisk indkoebsliste baseret paa din madplan
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
