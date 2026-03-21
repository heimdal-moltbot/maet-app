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

// SCR-05 v1.0 filter chips
const FILTERS = [
  { key: 'alle', label: 'Alle' },
  { key: 'aftensmad', label: 'Aftensmad' },
  { key: 'hurtig', label: '⚡ Hurtig' },
  { key: 'vegetar', label: '🥦 Vegetar' },
  { key: 'vegansk', label: '🌿 Vegansk' },
  { key: 'glutenfri', label: '🌾 Glutenfri' },
  { key: 'billig', label: '💰 Budget' },
  { key: 'familie', label: '👨‍👩‍👧 Familie' },
  { key: 'klassisk', label: '🇩🇰 Dansk' },
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

function getCategoryBadge(tags: string[]): string | null {
  if (tags.includes('vegansk') || tags.includes('vegan')) return 'Vegansk'
  if (tags.includes('vegetarisk') || tags.includes('vegetar') || tags.includes('vegetarian')) return 'Vegetar'
  if (tags.includes('glutenfri') || tags.includes('gluten-free')) return 'Glutenfri'
  if (tags.includes('hurtig') || tags.includes('quick')) return 'Hurtig'
  if (tags.includes('klassisk dansk') || tags.includes('danish')) return 'Dansk'
  return null
}

function matchesFilter(recipe: Recipe, filterKey: string): boolean {
  if (filterKey === 'alle') return true
  const tags = recipe.tags.map(t => t.toLowerCase())
  const title = recipe.title.toLowerCase()
  switch (filterKey) {
    case 'aftensmad': return tags.includes('aftensmad')
    case 'hurtig': return recipe.total_time_minutes <= 30 || tags.includes('hurtig') || tags.includes('quick')
    case 'vegetar': return tags.some(t => t.includes('vegetar'))
    case 'vegansk': return tags.some(t => t.includes('vegan'))
    case 'glutenfri': return tags.some(t => t.includes('gluten'))
    case 'billig': return tags.includes('billig') || tags.includes('budget')
    case 'familie': return tags.includes('familie') || tags.includes('family') || tags.includes('kids') || recipe.servings >= 4
    case 'klassisk': return tags.some(t => t.includes('dansk') || t.includes('danish')) || title.includes('klassisk')
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
      {/* Header — SCR-05: 56px, white, shadow */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="text-h3 text-txt-primary font-semibold flex-1 text-center">Opskrifter</h1>
        <button className="absolute right-4 text-txt-secondary">🔍</button>
      </div>

      {/* Søgefelt */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-bg-alt rounded-md px-4 h-11">
          <span className="text-txt-muted text-sm">🔍</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søg i opskrifter..."
            className="flex-1 bg-transparent outline-none text-body text-txt-primary placeholder:text-txt-muted"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-txt-muted text-sm">×</button>
          )}
        </div>
      </div>

      {/* Filter chips — horisontal scroll, radio-adfærd */}
      <div className="flex gap-2 px-4 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex-shrink-0 h-8 px-3 rounded-full text-label border transition-colors ${
              activeFilter === f.key
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-surface text-txt-secondary border-border hover:border-accent/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sorteringsbar */}
      <div className="flex items-center justify-between px-4 h-10 mb-1">
        <button className="text-caption text-txt-secondary flex items-center gap-1">
          Sorter: Populær <span className="text-txt-muted">▾</span>
        </button>
        <span className="text-caption text-txt-muted">{filtered.length} opskrifter</span>
      </div>

      {/* Opskriftskort — enkelt-kolonne, 16:9 billede */}
      <div className="px-4 space-y-4 pb-4">
        {filtered.map(recipe => {
          const emoji = getEmoji(recipe.title)
          const badge = getCategoryBadge(recipe.tags)
          const timeMin = recipe.total_time_minutes || (recipe.prep_time_minutes + recipe.cook_time_minutes)

          return (
            <Link
              key={recipe.id}
              href={`/opskrifter/${recipe.slug}`}
              className="block bg-bg-surface rounded-xl overflow-hidden shadow-sm border border-border hover:border-primary/20 transition-colors"
            >
              {/* Billede 16:9 */}
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8] to-[#EDE8DC] flex items-center justify-center">
                  <span className="text-5xl">{emoji}</span>
                </div>
                {/* Category badge overlay */}
                {badge && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-micro font-semibold text-white"
                    style={{ background: 'rgba(61,107,79,0.85)' }}>
                    {badge}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-4">
                {/* Meta line */}
                <div className="flex items-center gap-3 text-caption text-txt-secondary mb-2">
                  {timeMin > 0 && <span>⏱ {timeMin} min</span>}
                  {recipe.servings > 0 && <span>👥 {recipe.servings} pers</span>}
                  {recipe.tags.includes('vegansk') || recipe.tags.includes('vegan') ? (
                    <span>🌿</span>
                  ) : recipe.tags.includes('vegetarisk') || recipe.tags.includes('vegetar') ? (
                    <span>🥦</span>
                  ) : (
                    <span>🥩</span>
                  )}
                </div>

                {/* Titel */}
                <h3 className="text-body-md text-txt-primary font-semibold leading-snug mb-1">
                  {recipe.title}
                </h3>

                {/* Beskrivelse */}
                {recipe.description && (
                  <p className="text-caption text-txt-secondary line-clamp-2 mb-3">
                    {recipe.description}
                  </p>
                )}

                {/* Gem-knap */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {recipe.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-micro px-2 py-0.5 rounded-full bg-bg-alt text-txt-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation() }}
                    className="flex items-center gap-1 text-accent text-caption font-medium hover:opacity-70 transition-opacity"
                  >
                    ❤ Gem
                  </button>
                </div>
              </div>
            </Link>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-body text-txt-muted">Ingen opskrifter matcher din søgning</p>
          </div>
        )}

        {filtered.length > 0 && (
          <button className="w-full py-3 text-accent text-label font-medium border border-accent/30 rounded-md hover:bg-accent/5 transition-colors">
            Indlæs flere...
          </button>
        )}
      </div>
    </div>
  )
}
