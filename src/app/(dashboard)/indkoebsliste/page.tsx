'use client'

import { useState, useCallback, useEffect } from 'react'
import { ShoppingCategorySkeleton } from '@/components/ui/Skeleton'

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

// Mock ugeplan-slugs — i uge 7-8 trækkes dette fra Supabase/madplan-state
const CURRENT_WEEK_RECIPES = [
  'pasta-bolognese',
  'frikadeller-med-kartofler-og-brun-sovs',
  'stegt-laks-med-asparges',
  'hjemmelavet-pizza-margherita',
  'kyllingewok-med-groentsager-og-ris',
]

const CATEGORY_FILTERS = ['Alle', 'Kød & Fisk', 'Grøntsager', 'Mejeri', 'Tørvarer', 'Andet']

export default function IndkoebslistePage() {
  const [categories, setCategories] = useState<ShoppingCategory[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState('Alle')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weekRecipes] = useState(CURRENT_WEEK_RECIPES)

  const loadList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/indkoebsliste/generer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipes: weekRecipes, householdSize: 4 }),
      })
      if (!response.ok) throw new Error('API fejl')
      const data = await response.json()
      if (data.ok) {
        setCategories(data.categories)
      }
    } catch {
      setError('Kunne ikke hente indkøbsliste')
    } finally {
      setLoading(false)
    }
  }, [weekRecipes])

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
    if (activeFilter === 'Alle') return true
    if (activeFilter === 'Kød & Fisk') return cat.key === 'kød_fisk'
    if (activeFilter === 'Grøntsager') return cat.key === 'grøntsager'
    if (activeFilter === 'Mejeri') return cat.key === 'mejeri'
    if (activeFilter === 'Tørvarer') return cat.key === 'tørvarer'
    return !['kød_fisk', 'grøntsager', 'mejeri', 'tørvarer'].includes(cat.key)
  })

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 md:pt-20 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-txt-primary">Indkøbsliste</h1>
          <p className="text-caption text-txt-muted">
            Uge 13 · {weekRecipes.length} opskrifter
          </p>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Opdater indkøbsliste"
            onClick={loadList}
            disabled={loading}
            className="w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center text-base hover:bg-bg-alt transition-colors disabled:opacity-40"
          >
            🔄
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
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uge-label */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <span className="text-body text-txt-secondary">Uge 13 · 23–29 mar</span>
        <button aria-label="Skift uge" className="text-label text-primary font-medium">Skift ▼</button>
      </div>

      {/* Kategori-filter */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-label border transition-colors ${
              activeFilter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-bg-surface text-txt-secondary border-border hover:border-primary/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading && (
        <div role="status" aria-label="Indlæser indkøbsliste" className="px-4 space-y-4">
          <ShoppingCategorySkeleton />
          <ShoppingCategorySkeleton />
          <ShoppingCategorySkeleton />
        </div>
      )}

      {/* Fejl */}
      {error && !loading && (
        <div className="mx-4 px-4 py-3 bg-error/10 border border-error/20 rounded-md text-caption text-error">
          {error} — <button onClick={loadList} className="underline">Prøv igen</button>
        </div>
      )}

      {/* Vareliste */}
      {!loading && !error && (
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
                          aria-label={`${isDone ? 'Fjern afkrydsning af' : 'Afkryds'} ${item.name}`}
                          aria-pressed={isDone}
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center gap-3 px-4 h-[52px] text-left hover:bg-bg-alt transition-colors"
                        >
                          <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isDone ? 'bg-accent border-accent' : 'border-border'
                          }`}>
                            {isDone && <span className="text-white text-xs leading-none">✓</span>}
                          </div>
                          <span className={`flex-1 text-body ${isDone ? 'line-through text-txt-muted' : 'text-txt-primary'}`}>
                            {item.name}
                            {item.recipeCount > 1 && (
                              <span className="text-micro text-txt-muted ml-1">({item.recipeCount} retter)</span>
                            )}
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
            <div className="text-center py-8">
              <p className="text-4xl mb-2">🛒</p>
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
              className="w-full py-3 text-caption text-txt-muted hover:text-txt-secondary transition-colors"
            >
              Nulstil afkrydsede ({checkedCount})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
