'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const DAY_NAMES = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']
const WEEK_START_DATE = new Date('2026-03-23') // Næste mandag

const MEAL_TYPES = [
  { key: 'morgenmad', label: 'Morgenmad', emoji: '🌅' },
  { key: 'frokost', label: 'Frokost', emoji: '🌞' },
  { key: 'aftensmad', label: 'Aftensmad', emoji: '🌙' },
] as const

interface PlanRecipe {
  title: string
  slug?: string
  total_time_minutes?: number
  cook_time_minutes?: number
  prep_time_minutes?: number
  difficulty?: string
}

interface MealPlanDay {
  dayIndex: number
  recipe: PlanRecipe | null
}

// Initial mock — erstattes med Supabase persistence (uge 5-6)
const INITIAL_AFTENSMAD: (PlanRecipe | null)[] = [
  { title: 'Pasta Bolognese', slug: 'pasta-bolognese', total_time_minutes: 40 },
  { title: 'Frikadeller med kartofler', slug: 'frikadeller-med-kartofler-og-brun-sovs', total_time_minutes: 45 },
  null,
  { title: 'Stegt Laks', slug: 'stegt-laks-med-asparges', total_time_minutes: 25 },
  { title: 'Hjemmelavet Pizza', slug: 'pizza-margherita', total_time_minutes: 35 },
  null,
  { title: 'Kylling med Rodfrugter', slug: 'ovnstegt-kylling-med-rodfrugter', total_time_minutes: 70 },
]

function formatDate(dayIndex: number): string {
  const date = new Date(WEEK_START_DATE)
  date.setDate(date.getDate() + dayIndex)
  return `${date.getDate()}. ${['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'][date.getMonth()]}`
}

export default function MadplanPage() {
  const [aftensmad, setAftensmad] = useState<(PlanRecipe | null)[]>(INITIAL_AFTENSMAD)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)

  const weekLabel = weekOffset === 0 ? 'Denne uge' : weekOffset === -1 ? 'Forrige uge' : weekOffset === 1 ? 'Næste uge' : `Uge +${weekOffset}`

  function removeAftensmad(dayIndex: number) {
    setAftensmad(prev => prev.map((r, i) => i === dayIndex ? null : r))
  }

  const generatePlan = useCallback(async () => {
    setGenerating(true)
    setError(null)
    try {
      const response = await fetch('/api/ugeplan/generer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdSize: 4,
          dietaryPreferences: [],
          days: 7,
        }),
      })
      if (!response.ok) throw new Error('API fejl')
      const data = await response.json()
      if (data.ok && data.plan) {
        const newAftensmad = data.plan.map((day: MealPlanDay) => day.recipe as PlanRecipe | null)
        setAftensmad(newAftensmad)
      }
    } catch (e) {
      setError('Kunne ikke generere ugeplan — prøv igen')
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }, [])

  const plannedCount = aftensmad.filter(Boolean).length

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="px-4 pt-12 md:pt-20 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-txt-primary">Ugeplan</h1>
          <p className="text-caption text-txt-muted">Uge 13 · 23–29 mar 2026</p>
        </div>
        <button
          aria-label={generating ? 'Genererer ugeplan...' : 'Generer ny ugeplan'}
          aria-busy={generating}
          onClick={generatePlan}
          disabled={generating}
          className="px-4 py-2 bg-primary text-white rounded-md text-label font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 shadow-sm"
        >
          {generating ? '⟳ Genererer...' : '✨ Generer'}
        </button>
      </div>

      {/* Uge-navigator */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between bg-bg-surface rounded-md border border-border px-4 py-2.5">
          <button aria-label="Forrige uge" onClick={() => setWeekOffset(w => w - 1)} className="text-txt-muted text-lg px-1 hover:text-txt-secondary transition-colors">‹</button>
          <span className="text-body-md text-txt-primary font-semibold">{weekLabel}</span>
          <button aria-label="Næste uge" onClick={() => setWeekOffset(w => w + 1)} className="text-txt-muted text-lg px-1 hover:text-txt-secondary transition-colors">›</button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mb-3 px-4 py-2 bg-error/10 border border-error/20 rounded-md text-caption text-error">
          {error}
        </div>
      )}

      {/* Dage */}
      <div className="px-4 space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const dateStr = formatDate(dayIndex)
          const aftensmadRecipe = aftensmad[dayIndex]

          return (
            <div key={dayIndex}>
              <div className="mb-1.5">
                <span className="text-overline font-bold uppercase tracking-wider text-txt-secondary">
                  {dayName} {dateStr}
                </span>
              </div>

              <div className="bg-bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
                {MEAL_TYPES.map(({ key, label, emoji }, i) => {
                  const isAftensmad = key === 'aftensmad'
                  const meal = isAftensmad ? aftensmadRecipe : null

                  return (
                    <div key={key}>
                      {i > 0 && <div className="h-px bg-border mx-4" />}
                      <div className="flex items-center gap-3 px-4 h-14">
                        <span className="text-xl w-7 flex-shrink-0">{emoji}</span>
                        {meal ? (
                          <>
                            <div className="flex-1 min-w-0">
                              {meal.slug ? (
                                <Link
                                  href={`/opskrifter/${meal.slug}`}
                                  className="text-body-md text-txt-primary truncate block hover:text-primary transition-colors"
                                >
                                  {meal.title}
                                </Link>
                              ) : (
                                <p className="text-body-md text-txt-primary truncate">{meal.title}</p>
                              )}
                              {meal.total_time_minutes && (
                                <p className="text-caption text-txt-muted">⏱ {meal.total_time_minutes} min</p>
                              )}
                            </div>
                            {isAftensmad && (
                              <button
                                aria-label={`Fjern ${aftensmadRecipe?.title ?? 'ret'} fra ${dayName}`}
                                onClick={() => removeAftensmad(dayIndex)}
                                className="text-txt-muted hover:text-error text-lg px-1 flex-shrink-0 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </>
                        ) : (
                          <Link
                            href="/opskrifter"
                            className="flex-1 text-body text-txt-muted hover:text-primary transition-colors"
                          >
                            + Tilføj {label.toLowerCase()}
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky bund */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-4 pb-3 pt-2 bg-bg border-t border-border">
        <Link
          href="/indkoebsliste"
          className="flex items-center justify-center gap-2 w-full bg-accent text-white rounded-lg py-4 text-label-lg font-semibold shadow-md hover:bg-accent-dark transition-colors"
        >
          🛒 Genér indkøbsliste {plannedCount > 0 && `(${plannedCount} retter)`}
        </Link>
      </div>
    </div>
  )
}
