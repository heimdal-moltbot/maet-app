// Sidebar — bruges kun på desktop (md+), skjult på mobil
// App bruger BottomNav på mobil
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Hjem', emoji: '🏠' },
  { href: '/madplan', label: 'Madplan', emoji: '📅' },
  { href: '/opskrifter', label: 'Opskrifter', emoji: '🔍' },
  { href: '/indkoebsliste', label: 'Indkøbsliste', emoji: '🛒' },
  { href: '/profil', label: 'Profil', emoji: '👤' },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-bg-surface">
      <div className="px-4 py-6">
        <Link href="/" className="text-h3 font-bold text-primary">Mæt</Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-body text-txt-secondary hover:bg-bg-alt hover:text-txt-primary transition-colors"
          >
            <span className="text-base">{emoji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
