'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Ingredient {
  name: string
  quantity: string
  unit: string
}

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
  ingredients: Ingredient[]
}

const EMOJI_MAP: Record<string, string> = {
  'pasta': '🍝', 'spaghetti': '🍝', 'lasagne': '🫕',
  'frikadeller': '🍖', 'spareribs': '🍖',
  'laks': '🐟', 'torsk': '🐟', 'fisk': '🐠',
  'kylling': '🍗', 'wok': '🍜', 'curry': '🍛',
  'suppe': '🍲', 'pizza': '🍕',
  'bøf': '🥩', 'hakket': '🥩', 'salat': '🥗',
  'æg': '🥚', 'linse': '🫘', 'bønne': '🫘', 'kikærte': '🫘',
  'burger': '🍔', 'brød': '🍞', 'grøntsag': '🥦',
}

function getEmoji(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji
  }
  return '🍽️'
}

// Eksempel fremgangsmåde — erstattes med real data fra Supabase
function getSteps(recipe: Recipe): string[] {
  return [
    `Forbered ingredienserne: ${recipe.ingredients.slice(0, 3).map(i => i.name).join(', ')} m.fl.`,
    'Varm en stor pande eller gryde op ved middel varme med lidt olie.',
    'Tilsæt de første ingredienser og lad dem stege i 3-4 minutter.',
    'Tilsæt resten af ingredienserne og rør godt rundt.',
    `Smag til og server varm. God appetit! 🍽️`,
  ]
}

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const [activeTab, setActiveTab] = useState<'ingredienser' | 'fremgangsmade'>('ingredienser')
  const [servings, setServings] = useState(recipe.servings || 4)
  const [currentStep, setCurrentStep] = useState(0)

  const emoji = getEmoji(recipe.title)
  const baseServings = recipe.servings || 4
  const servingRatio = servings / baseServings
  const steps = getSteps(recipe)

  function scaleQty(qty: string): string {
    const num = parseFloat(qty)
    if (isNaN(num) || num === 0) return qty
    const scaled = Math.round(num * servingRatio * 10) / 10
    return qty.replace(/[\d.,]+/, scaled.toString())
  }

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Hero */}
      <div className="relative">
        <div
          className="w-full flex items-center justify-center bg-gradient-to-br from-bg-alt to-bg-alt"
          style={{ height: '220px' }}
        >
          <span className="text-7xl">{emoji}</span>
        </div>
        {/* Tilbage-knap */}
        <Link
          href="/opskrifter"
          aria-label="Tilbage til opskrifter"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-txt-primary"
        >
          ←
        </Link>
        {/* Gem-knap */}
        <button aria-label="Gem opskrift" className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-primary text-lg">
          ❤
        </button>
      </div>

      <div className="px-4 pt-4">
        {/* Titel + meta */}
        <h1 className="text-h1 text-txt-primary font-bold mb-1">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-body text-txt-secondary mb-4 leading-relaxed">{recipe.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Forberedelse', value: `${recipe.prep_time_minutes || 10} min` },
            { label: 'Tilberedning', value: `${recipe.cook_time_minutes || 20} min` },
            { label: 'Sværhedsgrad', value: recipe.difficulty || 'nem' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-alt rounded-md p-3 text-center">
              <p className="text-body-md font-semibold text-txt-primary capitalize">{value}</p>
              <p className="text-micro text-txt-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags.slice(0, 4).map(tag => (
              <span key={tag} className="text-micro px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tab-bar */}
        <div className="flex border-b border-border mb-4">
          {([
            { key: 'ingredienser', label: 'Ingredienser' },
            { key: 'fremgangsmade', label: 'Fremgangsmåde' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 h-11 text-label font-semibold transition-colors relative ${
                activeTab === tab.key ? 'text-primary' : 'text-txt-secondary'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          ))}
        </div>

        {/* Ingredienser tab */}
        {activeTab === 'ingredienser' && (
          <div>
            {/* Portionskontrol */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-body text-txt-secondary">Portioner</span>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Mindsk antal portioner"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  −
                </button>
                <span aria-live="polite" aria-label={`${servings} portioner`} className="text-body-md font-semibold text-txt-primary w-6 text-center">{servings}</span>
                <button
                  aria-label="Øg antal portioner"
                  onClick={() => setServings(Math.min(12, servings + 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ingrediensliste */}
            <div className="bg-bg-surface rounded-xl border border-border shadow-sm divide-y divide-border mb-4">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-body text-txt-primary">{ing.name}</span>
                  <span className="text-body text-txt-secondary font-medium">
                    {servingRatio !== 1 ? scaleQty(ing.quantity) : ing.quantity} {ing.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Tilføj til indkøbsliste */}
            <button className="w-full bg-primary text-white py-3.5 rounded-xl text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm mb-3">
              + Tilføj til indkøbsliste
            </button>

            {/* Tilføj til ugeplan */}
            <Link
              href="/madplan"
              className="flex items-center justify-center w-full py-3.5 rounded-xl border border-accent text-accent text-label-lg font-semibold hover:bg-accent/5 transition-colors"
            >
              📅 Tilføj til ugeplan
            </Link>
          </div>
        )}

        {/* Fremgangsmåde tab */}
        {activeTab === 'fremgangsmade' && (
          <div>
            {/* Trin-counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption text-txt-muted">Trin {currentStep + 1} af {steps.length}</span>
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Gå til trin ${i + 1}`}
                    aria-current={i === currentStep ? 'step' : undefined}
                    onClick={() => setCurrentStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStep ? 'bg-primary w-4' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Aktivt trin */}
            <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-5 mb-4 min-h-[140px]">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-label font-bold mb-3">
                {currentStep + 1}
              </div>
              <p className="text-body text-txt-primary leading-relaxed">{steps[currentStep]}</p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1 py-3 rounded-xl border border-border text-body text-txt-secondary hover:bg-bg-alt transition-colors disabled:opacity-40"
              >
                ← Forrige
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex-1 py-3 rounded-xl bg-primary text-white text-body font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40"
              >
                Næste →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
