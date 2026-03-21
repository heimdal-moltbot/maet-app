'use client'

import { useState, useEffect, useCallback } from 'react'

// Default recipe-slugs fra den aktuelle ugeplan (mock — erstattes med Supabase)
const DEFAULT_PLAN_RECIPES = [
  'pasta-bolognese',
  'frikadeller-med-kartofler-og-brun-sovs',
  'stegt-laks-med-asparges',
  'hjemmelavet-pizza',
  'kylling-med-rodfrugter',
]

const CATEGORY_FILTERS = ['Alle', 'Kød & Fisk', 'Grøntsager', 'Mejeri', 'Tørvarer', 'Andet']

interface ShoppingItem {
  id: string
  name: string
  displayQuantity: string
  unit: string
  category: string
  checked: boolean
  recipeCount: number
}

interface ShoppingCategory {
  key: string
  label: string
  emoji: string
  items: ShoppingItem[]
}

export default function IndkoebslistePage() {
  const [categories, setCategories] = useState<ShoppingCategory[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/indkoebsliste/generer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipes: DEFAULT_PLAN_RECIPES,
          householdSize: 4,
        }),
      })
      if (!response.ok) throw new Error('API fejl')
      const data = await response.json()
      if (data.ok) {
        setCategories(data.categories ?? [])
        setChecked(new Set()) // nulstil check-status ved reload
      }
    } catch (e) {
      setError('Kunne ikke hente indkøbsliste')
      console.error(e)
      // Fallback: vis mock-data
      setCategories(MOCK_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadList() }, [loadList])

  function toggleItem(itemId: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const allItems = categories.flatMap(c => c.items)
  const totalItems = allItems.length
  const checkedCount = checked.size
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const filteredCategories = categories.filter(cat => {
    if (activeCategory === 'Alle') return true
    if (activeCategory === 'Kød & Fisk') return cat.key === 'kød_fisk'
    if (activeCategory === 'Grøntsager') return cat.key === 'grøntsager'
    if (activeCategory === 'Mejeri') return cat.key === 'mejeri'
    if (activeCategory === 'Tørvarer') return cat.key === 'tørvarer'
    if (activeCategory === 'Andet') return ['dåser_glas', 'krydderier', 'brød', 'andet'].includes(cat.key)
    return true
  })

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-txt-primary">Indkøbsliste</h1>
          <p className="text-caption text-txt-muted">
            {loading ? 'Henter...' : `${checkedCount}/${totalItems} varer`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadList}
            className="w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center text-base hover:bg-bg-alt transition-colors"
            title="Opdater"
          >
            🔄
          </button>
          <button className="w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center text-base">
            📤
          </button>
        </div>
      </div>

      {/* Progress */}
      {totalItems > 0 && (
        <div className="px-4 mb-3">
          <div className="flex justify-between text-caption text-txt-muted mb-1.5">
            <span>{checkedCount} af {totalItems} varer købt</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uge-label */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <span className="text-body text-txt-secondary">Uge 13 · 23–29 mar</span>
        <span className="text-caption text-txt-muted">{DEFAULT_PLAN_RECIPES.length} retter</span>
      </div>

      {/* Kategori-filter */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveCategory(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-label border transition-colors ${
              activeCategory === f
                ? 'bg-primary text-white border-primary'
                : 'bg-bg-surface text-txt-secondary border-border hover:border-primary/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-bg-surface rounded-lg border border-border p-4 animate-pulse">
              <div className="h-4 bg-bg-alt rounded w-1/3 mb-3" />
              {[1, 2, 3].map(j => (
                <div key={j} className="h-12 bg-bg-alt rounded mb-1" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Fejl */}
      {error && !loading && (
        <div className="mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-100 rounded-md text-caption text-error">
          {error}
        </div>
      )}

      {/* Vareliste */}
      {!loading && (
        <div className="px-4 space-y-4">
          {filteredCategories.map(category => {
            const unchecked = category.items.filter(i => !checked.has(i.id))
            const done = category.items.filter(i => checked.has(i.id))
            const sortedItems = [...unchecked, ...done]

            return (
              <div key={category.key}>
                <p className="text-overline text-txt-muted font-bold uppercase tracking-wider mb-2 px-1">
                  {category.emoji} {category.label}
                </p>
                <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                  {sortedItems.map((item, idx) => {
                    const isDone = checked.has(item.id)
                    return (
                      <div key={item.id}>
                        {idx > 0 && <div className="h-px bg-border mx-4" />}
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center gap-3 px-4 h-[52px] text-left hover:bg-bg-alt transition-colors"
                        >
                          <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isDone ? 'bg-accent border-accent' : 'border-border'
                          }`}>
                            {isDone && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className={`flex-1 text-body ${isDone ? 'line-through text-txt-muted' : 'text-txt-primary'}`}>
                            {item.name}
                          </span>
                          <span className={`text-body flex-shrink-0 ${isDone ? 'text-txt-muted' : 'text-txt-secondary'}`}>
                            {item.displayQuantity}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filteredCategories.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-3xl mb-3">🛒</p>
              <p className="text-body text-txt-muted">Ingen varer i denne kategori</p>
            </div>
          )}

          {/* Tilføj manuelt */}
          <button className="w-full py-3.5 border-2 border-dashed border-border rounded-lg text-body text-txt-muted hover:border-primary hover:text-primary transition-colors">
            + Tilføj vare manuelt
          </button>

          {/* Nulstil */}
          {checkedCount > 0 && (
            <button
              onClick={() => setChecked(new Set())}
              className="w-full py-2 text-caption text-txt-muted hover:text-txt-secondary transition-colors"
            >
              Nulstil liste ({checkedCount} afkrydset)
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Fallback mock-data hvis API fejler
const MOCK_CATEGORIES: ShoppingCategory[] = [
  {
    key: 'kød_fisk', label: 'Kød & Fisk', emoji: '🥩',
    items: [
      { id: 'm1', name: 'Hakket oksekød', displayQuantity: '500 g', unit: 'g', category: 'kød_fisk', checked: false, recipeCount: 1 },
      { id: 'm2', name: 'Kyllingebrester', displayQuantity: '600 g', unit: 'g', category: 'kød_fisk', checked: false, recipeCount: 1 },
    ],
  },
  {
    key: 'grøntsager', label: 'Grøntsager & Frugt', emoji: '🥦',
    items: [
      { id: 'm3', name: 'Løg', displayQuantity: '3 stk', unit: 'stk', category: 'grøntsager', checked: false, recipeCount: 2 },
      { id: 'm4', name: 'Hvidløg', displayQuantity: '1 hoved', unit: 'hoved', category: 'grøntsager', checked: false, recipeCount: 2 },
      { id: 'm5', name: 'Gulerødder', displayQuantity: '400 g', unit: 'g', category: 'grøntsager', checked: false, recipeCount: 1 },
    ],
  },
  {
    key: 'tørvarer', label: 'Tørvarer & Pasta', emoji: '🌾',
    items: [
      { id: 'm6', name: 'Pasta', displayQuantity: '400 g', unit: 'g', category: 'tørvarer', checked: false, recipeCount: 1 },
      { id: 'm7', name: 'Dåsetomater', displayQuantity: '2 stk', unit: 'stk', category: 'tørvarer', checked: false, recipeCount: 1 },
    ],
  },
]
