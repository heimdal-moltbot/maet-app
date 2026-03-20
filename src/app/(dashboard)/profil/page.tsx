import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

const DIETARY_LABELS: Record<string, string> = {
  vegetarisk: '🥦 Vegetarisk',
  vegansk: '🌿 Vegansk',
  glutenfri: '🌾 Glutenfri',
  laktosefri: '🥛 Laktosefri',
  ingen_svinekod: '🐷 Ingen svinekød',
  ingen_skaldyr: '🦞 Ingen skaldyr',
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const householdSize = user?.user_metadata?.household_size ?? 4
  const dietaryTags: string[] = user?.user_metadata?.dietary_tags ?? []
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Dig'

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h1 className="text-h2 text-txt-primary font-bold capitalize">{displayName}</h1>
            <p className="text-caption text-txt-muted">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Husstand */}
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body-md text-txt-primary font-semibold">Husstand</h2>
            <a href="/onboarding" className="text-caption text-primary font-medium">Rediger</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span className="text-body text-txt-primary">
              {householdSize >= 6 ? '6+' : householdSize} {householdSize === 1 ? 'person' : 'personer'}
            </span>
          </div>
        </div>

        {/* Kostpræferencer */}
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body-md text-txt-primary font-semibold">Kostpræferencer</h2>
            <a href="/onboarding" className="text-caption text-primary font-medium">Rediger</a>
          </div>
          {dietaryTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dietaryTags.map(tag => (
                <span
                  key={tag}
                  className="text-label px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {DIETARY_LABELS[tag] ?? tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-body text-txt-muted">Ingen særlige ønsker angivet</p>
          )}
        </div>

        {/* Konto */}
        <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-4">
          <h2 className="text-body-md text-txt-primary font-semibold mb-3">Konto</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-caption text-txt-muted">E-mail</span>
              <span className="text-body text-txt-primary">{user?.email}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-caption text-txt-muted">Oprettet</span>
              <span className="text-caption text-txt-secondary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('da-DK') : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Log ud */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl border border-error/30 text-error text-label font-medium hover:bg-error/5 transition-colors"
          >
            Log ud
          </button>
        </form>

        <p className="text-center text-micro text-txt-muted pb-2">
          Mæt MVP · v0.1.0
        </p>
      </div>
    </div>
  )
}
