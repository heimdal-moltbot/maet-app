'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import recipesData from '@/lib/data/all-recipes.json'

interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  prep_time_minutes: number
  cook_time_minutes: number
  total_time_minutes: number
  servings: number
  difficulty: string
  tags: string[]
  image_url: string | null
  ingredients: Array<{ name: string; quantity: string; unit: string }>
}

const RECIPES = recipesData as Recipe[]

// SCR-08 v1.4 filter pills
const FILTERS = [
  { key: 'alle', label: 'Alle' },
  { key: 'hurtig', label: 'Hurtigt' },
  { key: 'vegetar', label: 'Vegetar' },
  { key: 'budget', label: 'Budget' },
  { key: 'familie', label: 'Familie' },
]

const EMOJI_MAP: Record<string, string> = {
  'pasta': '🍝', 'spaghetti': '🍝', 'lasagne': '🫕',
  'frikadeller': '🍖', 'spareribs': '🍖',
  'laks': '🐟', 'torsk': '🐟', 'fisk': '🐠',
  'kylling': '🍗', 'wok': '🍜', 'curry': '🍛',
  'suppe': '🍲', 'pizza': '🍕', 'ris': '🍚',
  'bøf': '🥩', 'hakket': '🥩', 'salat': '🥗',
  'æg': '🥚', 'linse': '🫘', 'bønne': '🫘', 'kikærte': '🫘',
  'burger': '🍔', 'sandwich': '🥪', 'brød': '🍞',
  'grøntsag': '🥦', 'blomkål': '🥦',
}

function getEmoji(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji
  }
  return '🍽️'
}

function matchesFilter(recipe: Recipe, filterKey: string): boolean {
  if (filterKey === 'alle') return true
  const tags = recipe.tags.map(t => t.toLowerCase())
  switch (filterKey) {
    case 'hurtig': return recipe.total_time_minutes <= 30 || tags.includes('hurtig') || tags.includes('quick')
    case 'vegetar': return tags.some(t => t.includes('vegetar') || t.includes('vegan'))
    case 'budget': return tags.includes('billig') || tags.includes('budget')
    case 'familie': return tags.includes('familie') || tags.includes('family') || tags.includes('kids') || recipe.servings >= 4
    default: return true
  }
}

export default function OpskrifterPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('alle')

  const filtered = useMemo(() => {
    return RECIPES.filter(r => {
      const matchSearch = !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      return matchSearch && matchesFilter(r, activeFilter)
    })
  }, [search, activeFilter])

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header — 56px, bg-bg, Inter 20px Bold */}
      <div className="px-4 pt-12 pb-3">
        <h1 className="text-h2 text-txt-primary font-bold">Opskrifter</h1>
      </div>

      {/* Søgefelt — 44px, r=12, bg #F0ECD8 */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-xl px-4 h-11" style={{ background: '#F0ECD8' }}>
          <span className="text-txt-muted text-sm">🔍</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søg opskrifter..."
            className="flex-1 bg-transparent outline-none text-body text-txt-primary placeholder:text-txt-muted"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-txt-muted">×</button>
          )}
        </div>
      </div>

      {/* Filter pills — h=40, active: accent, inactive: #F0ECD8 */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex-shrink-0 h-10 px-4 rounded-full text-label font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-accent text-white'
                : 'text-txt-secondary'
            }`}
            style={activeFilter !== f.key ? { background: '#F0ECD8' } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 2-kolonne grid — 173px kort, 4:3 ratio */}
      <div className="px-4 grid grid-cols-2 gap-3 pb-4">
        {filtered.map(recipe => {
          const emoji = getEmoji(recipe.title)
          const timeMin = recipe.total_time_minutes || (recipe.prep_time_minutes + recipe.cook_time_minutes)

          return (
            <Link
              key={recipe.id}
              href={`/opskrifter/${recipe.slug}`}
              className="block bg-bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-colors"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {/* Billede 4:3 aspect ratio */}
              <div className="relative" style={{ paddingBottom: '75%' }}>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F5F0E8, #EDE8DC)' }}
                >
                  <span className="text-4xl">{emoji}</span>
                </div>
                {/* Favorit-knap */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation() }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-base shadow-sm"
                >
                  ♡
                </button>
              </div>

              {/* Kortindhold */}
              <div className="p-3">
                <h3 className="text-label font-semibold text-txt-primary leading-snug mb-1.5 line-clamp-2">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-2 text-micro text-txt-muted">
                  {timeMin > 0 && <span>⏱ {timeMin}m</span>}
                  {recipe.servings > 0 && <span>👤{recipe.servings}</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-body text-txt-muted">Ingen opskrifter matcher din søgning</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="px-4 pb-4">
          <button className="w-full py-3 text-accent text-label font-medium border border-accent/30 rounded-xl hover:bg-accent/5 transition-colors">
            Indlæs flere
          </button>
        </div>
      )}
    </div>
  )
}
