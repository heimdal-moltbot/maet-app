'use client'

import { useState } from 'react'

// Mock data — erstattes med Supabase aggregering fra ugeplan (uge 7-8)
const SHOPPING_CATEGORIES = [
  {
    key: 'grøntsager',
    label: '🥦 Grøntsager',
    items: [
      { id: '1', name: 'Gulerødder', quantity: '500', unit: 'g' },
      { id: '2', name: 'Spinat', quantity: '150', unit: 'g' },
      { id: '3', name: 'Løg', quantity: '2', unit: 'stk' },
      { id: '4', name: 'Hvidløg', quantity: '1', unit: 'hoved' },
    ],
  },
  {
    key: 'mejeri',
    label: '🧀 Mejeri',
    items: [
      { id: '5', name: 'Mælk', quantity: '1', unit: 'L' },
      { id: '6', name: 'Smør', quantity: '250', unit: 'g' },
      { id: '7', name: 'Parmesanost', quantity: '100', unit: 'g' },
    ],
  },
  {
    key: 'kød',
    label: '🥩 Kødprodukter',
    items: [
      { id: '8', name: 'Hakket oksekød', quantity: '500', unit: 'g' },
      { id: '9', name: 'Kyllingebrester', quantity: '600', unit: 'g' },
    ],
  },
  {
    key: 'tørvarer',
    label: '🌾 Tørvarer',
    items: [
      { id: '10', name: 'Spaghetti', quantity: '400', unit: 'g' },
      { id: '11', name: 'Dåsetomater', quantity: '2', unit: 'stk' },
      { id: '12', name: 'Ris', quantity: '300', unit: 'g' },
    ],
  },
]

const CATEGORY_FILTERS = ['Alle', 'Grønt', 'Mejeri', 'Kød', 'Tørvarer']

export default function IndkoebslistePage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState('Alle')

  const allItems = SHOPPING_CATEGORIES.flatMap(c => c.items)
  const totalItems = allItems.length
  const checkedCount = checked.size
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  function toggleItem(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <h1 className="text-h1 text-txt-primary">Indkøbsliste</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center text-base">📤</button>
          <button className="w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center text-base">⋮</button>
        </div>
      </div>

      {/* Progress */}
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

      {/* Uge-label */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <span className="text-body text-txt-secondary">Uge 12 · 20–26 mar</span>
        <button className="text-label text-primary font-medium">Skift ▼</button>
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
                : 'bg-bg-surface text-txt-secondary border-border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Vareliste */}
      {/* Vareliste */}
      <div className="px-4 space-y-4">
        {SHOPPING_CATEGORIES.filter(cat =>
          activeCategory === 'Alle' ||
          cat.label.toLowerCase().includes(activeCategory.toLowerCase()) ||
          (activeCategory === 'Grønt' && cat.key === 'grøntsager') ||
          (activeCategory === 'Mejeri' && cat.key === 'mejeri') ||
          (activeCategory === 'Kød' && cat.key === 'kød') ||
          (activeCategory === 'Tørvarer' && cat.key === 'tørvarer')
        ).map(category => {
          const unchecked = category.items.filter(i => !checked.has(i.id))
          const done = category.items.filter(i => checked.has(i.id))
          const allItems = [...unchecked, ...done]

          return (
            <div key={category.key}>
              {/* Kategori-header */}
              <p className="text-overline text-txt-muted font-bold uppercase tracking-wider mb-2 px-1">
                {category.label}
              </p>

              {/* Items */}
              <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                {allItems.map((item, idx) => {
                  const isDone = checked.has(item.id)
                  return (
                    <div key={item.id}>
                      {idx > 0 && <div className="h-px bg-border mx-4" />}
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-center gap-3 px-4 h-[52px] text-left hover:bg-bg-alt transition-colors"
                      >
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone
                            ? 'bg-accent border-accent'
                            : 'border-border'
                        }`}>
                          {isDone && <span className="text-white text-xs">✓</span>}
                        </div>

                        {/* Navn */}
                        <span className={`flex-1 text-body ${isDone ? 'line-through text-txt-muted' : 'text-txt-primary'}`}>
                          {item.name}
                        </span>

                        {/* Mængde */}
                        <span className={`text-body flex-shrink-0 ${isDone ? 'text-txt-muted' : 'text-txt-secondary'}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Tilføj manuelt */}
        <button className="w-full py-3.5 border-2 border-dashed border-border rounded-lg text-body text-txt-muted hover:border-primary hover:text-primary transition-colors">
          + Tilføj vare manuelt
        </button>
      </div>
    </div>
  )
}
