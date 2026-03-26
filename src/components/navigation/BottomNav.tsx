'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// UX spec v1.4: 4 tabs (CEO-bekræftet 21/3) — 🏠 📅 🍽️ 🛒
const NAV_ITEMS = [
  { href: '/dashboard', label: 'Hjem', icon: '🏠' },
  { href: '/madplan', label: 'Madplan', icon: '📅' },
  { href: '/opskrifter', label: 'Opskrifter', icon: '🍽️' },
  { href: '/indkoebsliste', label: 'Indkøb', icon: '🛒' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primær navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-border pb-safe">
      <div className="flex max-w-md mx-auto h-16">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-txt-muted hover:text-txt-secondary'
              }`}
            >
              <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
              <span className={`text-micro ${active ? 'font-bold' : ''}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
