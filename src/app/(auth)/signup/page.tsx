import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-primary leading-none">Mæt</h1>
          <p className="text-caption text-txt-muted mt-1">din families madplan</p>
        </div>

        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-h2 text-txt-primary mb-1">Opret konto</h2>
          <p className="text-body text-txt-secondary mb-6">
            Kom i gang med din families madplan
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-4 py-3 text-caption text-error">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-label text-txt-secondary mb-1.5">
                Dit navn <span className="text-txt-muted">(valgfrit)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Mette Hansen"
                className="w-full px-4 py-3 rounded-md border border-border bg-bg-surface text-body text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-label text-txt-secondary mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="din@email.dk"
                required
                className="w-full px-4 py-3 rounded-md border border-border bg-bg-surface text-body text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-label text-txt-secondary mb-1.5">
                Adgangskode
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mindst 8 tegn"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-md border border-border bg-bg-surface text-body text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-md text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Opret konto →
            </button>
          </form>

          <p className="mt-5 text-center text-caption text-txt-secondary">
            Har du allerede en konto?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log ind her
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
