'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data — erstattes med Supabase (uge 5-6)
const WEEK_START = new Date('2026-03-20')
const DAY_NAMES = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']
const MEAL_TYPES = [
  { key: 'morgenmad', label: 'Morgenmad', emoji: '🌅' },
  { key: 'frokost', label: 'Frokost', emoji: '🌞' },
  { key: 'aftensmad', label: 'Aftensmad', emoji: '🌙' },
]

type MealKey = 'morgenmad' | 'frokost' | 'aftensmad'

interface MealPlan {
  [dayIndex: number]: {
    [meal in MealKey]?: { title: string; emoji: string; time: number }
  }
}

const INITIAL_PLAN: MealPlan = {
  0: { aftensmad: { title: 'Pasta Bolognese', emoji: '🍝', time: 40 } },
  1: { frokost: { title: 'Cæsarsalat', emoji: '🥗', time: 15 }, aftensmad: { title: 'Frikadeller', emoji: '🍖', time: 40 } },
  3: { aftensmad: { title: 'Stegt Laks', emoji: '🐟', time: 25 } },
  4: { aftensmad: { title: 'Hjemmelavet Pizza', emoji: '🍕', time: 35 } },
  6: { aftensmad: { title: 'Kylling med Rodfrugter', emoji: '🍗', time: 75 } },
}

function formatDate(dayIndex: number): string {
  const date = new Date(WEEK_START)
  date.setDate(date.getDate() + dayIndex)
  return `${date.getDate()}. ${['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'][date.getMonth()]}`
}

function isToday(dayIndex: number): boolean {
  const date = new Date(WEEK_START)
  date.setDate(date.getDate() + dayIndex)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export default function MadplanPage() {
  const [plan, setPlan] = useState<MealPlan>(INITIAL_PLAN)

  function removeMeal(dayIndex: number, meal: MealKey) {
    setPlan(prev => {
      const next = { ...prev }
      if (next[dayIndex]) {
        const day = { ...next[dayIndex] }
        delete day[meal]
        next[dayIndex] = day
      }
      return next
    })
  }

  const plannedCount = Object.values(plan).flatMap(d => Object.values(d)).length

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-txt-primary">Ugeplan</h1>
          <p className="text-caption text-txt-muted">Uge 12 · 20–26 mar</p>
        </div>
        <button className="px-3 py-1.5 bg-primary text-white rounded-md text-label font-semibold shadow-sm">
          🔄 Generer
        </button>
      </div>

      {/* Uge-navigator */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between bg-bg-surface rounded-md border border-border px-4 py-2.5">
          <button className="text-txt-muted text-lg px-2">‹</button>
          <span className="text-body-md text-txt-primary font-semibold">Uge 12 · 20–26 mar 2026</span>
          <button className="text-txt-muted text-lg px-2">›</button>
        </div>
      </div>

      {/* Dage */}
      <div className="px-4 space-y-4">
        {DAY_NAMES.map((dayName, dayIndex) => {
          const today = isToday(dayIndex)
          const dateStr = formatDate(dayIndex)
          const dayPlan = plan[dayIndex] ?? {}

          return (
            <div key={dayIndex}>
              {/* Dag-header */}
              <div className="mb-2">
                <span className={`text-overline font-bold uppercase tracking-wider ${today ? 'text-primary' : 'text-txt-secondary'}`}>
                  {dayName} {dateStr}
                </span>
              </div>

              {/* Dag-kort */}
              <div className={`bg-bg-surface rounded-lg shadow-sm overflow-hidden ${today ? 'border-2 border-primary' : 'border border-border'}`}>
                {MEAL_TYPES.map(({ key, label, emoji }, i) => {
                  const meal = dayPlan[key as MealKey]

                  return (
                    <div key={key}>
                      {i > 0 && <div className="h-px bg-border mx-4" />}
                      <div className="flex items-center gap-3 px-4 h-14">
                        <span className="text-xl w-7 flex-shrink-0">{emoji}</span>
                        {meal ? (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-md text-txt-primary truncate">{meal.title}</p>
                              <p className="text-caption text-txt-muted">⏱ {meal.time} min</p>
                            </div>
                            <button
                              onClick={() => removeMeal(dayIndex, key as MealKey)}
                              className="text-txt-muted hover:text-error text-lg px-1 flex-shrink-0"
                              title="Fjern"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <Link
                            href="/opskrifter"
                            className="flex-1 text-body text-txt-muted"
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
      <div className="fixed bottom-14 left-0 right-0 px-4 pb-3 pt-2 bg-bg border-t border-border">
        <Link
          href="/indkoebsliste"
          className="flex items-center justify-center gap-2 w-full bg-accent text-white rounded-lg py-4 text-label-lg font-semibold shadow-md"
        >
          🛒 Genér indkøbsliste ({plannedCount} måltider)
        </Link>
      </div>
    </div>
  )
}
