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

const FILTERS = [
  { key: 'alle', label: 'Alle' },
  { key: 'hurtig', label: '⚡ ≤30 min' },
  { key: 'vegetar', label: '🥦 Vegetar' },
  { key: 'vegansk', label: '🌿 Vegansk' },
  { key: 'glutenfri', label: '🌾 Glutenfri' },
  { key: 'billig', label: '💰 Budget' },
  { key: 'klassisk', label: '🇩🇰 Dansk' },
  { key: 'suppe', label: '🍲 Suppe' },
]

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  nem: { label: 'Nem', color: 'bg-accent/10 text-accent' },
  middel: { label: 'Middel', color: 'bg-warning/15 text-warning' },
  svær: { label: 'Svær', color: 'bg-error/10 text-error' },
  mellem: { label: 'Middel', color: 'bg-warning/15 text-warning' },
}

const EMOJI_MAP: Record<string, string> = {
  'pasta': '🍝', 'frikadeller': '🍖', 'laks': '🐟', 'kylling': '🍗',
  'suppe': '🍲', 'pizza': '🍕', 'ris': '🍚', 'wok': '🍜', 'curry': '🍛',
  'bøf': '🥩', 'fisk': '🐠', 'salat': '🥗', 'sovs': '🥘', 'gryde': '🫕',
  'æg': '🥚', 'linse': '🫘', 'bønne': '🫘', 'kikærte': '🫘',
  'burger': '🍔', 'sandwich': '🥪', 'brød': '🍞',
}

function getEmoji(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji
  }
  return '🍽️'
}

export default function OpskrifterPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('alle')

  const filtered = useMemo(() => {
    return RECIPES.filter(r => {
      // Udvidet søgning: titel + beskrivelse + ingredienser
      if (search) {
        const q = search.toLowerCase()
        const inTitle = r.title.toLowerCase().includes(q)
        const inDesc = r.description?.toLowerCase().includes(q)
        const inIngredients = r.ingredients?.some(i => i.name.toLowerCase().includes(q))
        if (!inTitle && !inDesc && !inIngredients) return false
      }

      switch (activeFilter) {
        case 'alle': return true
        case 'vegetar': return r.tags.some(t => t.includes('vegetar'))
        case 'vegansk': return r.tags.some(t => t.includes('vegansk'))
        case 'glutenfri': return r.tags.includes('glutenfri')
        case 'hurtig': return (r.total_time_minutes ?? r.prep_time_minutes + r.cook_time_minutes) <= 30
        case 'billig': return r.tags.includes('billig')
        case 'klassisk': return r.tags.some(t => t.includes('dansk'))
        case 'suppe': return r.tags.includes('suppe') || r.title.toLowerCase().includes('suppe')
        default: return true
      }
    })
  }, [search, activeFilter])

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-2 flex items-center justify-between">
        <h1 className="text-h1 text-txt-primary">Opskrifter</h1>
        <button className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-lg">
          🔍
        </button>
      </div>

      {/* Søgefelt */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-3 bg-bg-surface border border-border rounded-md px-4 h-12 shadow-sm">
          <span className="text-txt-muted text-base">🔍</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søg opskrifter..."
            className="flex-1 bg-transparent outline-none text-body text-txt-primary placeholder:text-txt-muted"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-txt-muted text-lg">×</button>
          )}
        </div>
      </div>

      {/* Filterpiller */}
      <div className="flex gap-2 px-4 mb-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-full text-label border transition-colors ${
              activeFilter === f.key
                ? 'bg-primary text-white border-primary'
                : 'bg-bg-surface text-txt-secondary border-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Resultater-header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <p className="text-caption text-txt-muted">{filtered.length} opskrifter</p>
      </div>

      {/* 2-kolonne gitter */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map(recipe => {
          const diff = DIFFICULTY_LABELS[recipe.difficulty] ?? DIFFICULTY_LABELS.nem
          return (
            <Link
              key={recipe.id}
              href={`/opskrifter/${recipe.slug}`}
              className="bg-bg-surface rounded-md border border-border shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
            >
              {/* Billed-pladsholder */}
              <div className="h-24 bg-gradient-to-br from-primary/8 to-accent/8 flex items-center justify-center">
                <span className="text-4xl">{getEmoji(recipe.title)}</span>
              </div>
              <div className="p-3">
                <p className="text-body-md text-txt-primary font-semibold leading-tight mb-1.5 line-clamp-2">
                  {recipe.title}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-micro text-txt-muted">⏱ {recipe.total_time_minutes} min</span>
                  <span className="text-border">·</span>
                  <span className={`text-micro px-1.5 py-0.5 rounded-full font-medium ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="px-4 py-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-body text-txt-muted">Ingen opskrifter matcher</p>
          <button
            onClick={() => { setSearch(''); setActiveFilter('alle') }}
            className="mt-3 text-caption text-primary font-medium"
          >
            Ryd filter
          </button>
        </div>
      )}
    </div>
  )
}
