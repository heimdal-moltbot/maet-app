import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

// Desktop nav — hidden on mobile (md:flex), shown on tablet+
export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav aria-label="Primær navigation" className="hidden md:block border-b border-border bg-bg-surface">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="text-h3 font-bold text-primary">
          Mæt
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-body text-txt-secondary hover:text-primary transition-colors">
                Dashboard
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-body text-txt-muted hover:text-txt-secondary transition-colors">
                  Log ud
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-body text-txt-secondary hover:text-primary transition-colors">
                Log ind
              </Link>
              <Link href="/signup" className="rounded-md bg-primary px-4 py-2 text-label text-white hover:bg-primary-dark transition-colors">
                Opret konto
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
