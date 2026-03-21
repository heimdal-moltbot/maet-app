import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// Mock data — erstattes med Supabase queries når credentials er tilgængelige
const THIS_WEEK = [
  { day: 'Man', date: 23, recipe: 'Pasta Bolognese', emoji: '🍝', planned: true },
  { day: 'Tir', date: 24, recipe: 'Grøntsagssuppe', emoji: '🥗', planned: true },
  { day: 'Ons', date: 25, recipe: null, emoji: null, planned: false },
  { day: 'Tor', date: 26, recipe: 'Stegt Laks', emoji: '🐟', planned: true },
  { day: 'Fre', date: 27, recipe: 'Pizza', emoji: '🍕', planned: true },
  { day: 'Lør', date: 28, recipe: null, emoji: null, planned: false },
  { day: 'Søn', date: 29, recipe: 'Spareribs', emoji: '🍖', planned: true },
]

const TODAY_RECIPE = {
  title: 'Pasta Bolognese',
  prepTime: 10,
  cookTime: 30,
  servings: 4,
  emoji: '🍝',
  difficulty: 'nem',
}

const INSPIRATION = [
  { title: 'Laks med Asparges', time: 25, emoji: '🐟' },
  { title: 'Kyllingewok', time: 20, emoji: '🍜' },
  { title: 'Kikærte Dahl', time: 30, emoji: '🫘' },
  { title: 'Fiskefileter', time: 20, emoji: '🐠' },
  { title: 'Svamperisotto', time: 35, emoji: '🍄' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'der'
  const today = new Date().getDay() // 0=søn, 1=man...
  const todayIdx = today === 0 ? 6 : today - 1

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <p className="text-caption text-txt-muted">Fredag 20. marts</p>
          <h1 className="text-h1 text-txt-primary">Hej, {firstName}! 👋</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-bg-surface shadow-sm flex items-center justify-center text-lg border border-border">
            🔔
          </button>
          <Link href="/profil" className="w-10 h-10 rounded-full bg-bg-surface shadow-sm flex items-center justify-center text-lg border border-border">
            👤
          </Link>
        </div>
      </div>

      {/* Hero: Dagens aftensmad */}
      <div className="px-4 mb-6">
        <p className="text-overline text-txt-muted mb-3">AFTENSMAD I DAG</p>
        <div className="bg-bg-surface rounded-lg shadow-md overflow-hidden border border-border">
          {/* Billedepladsholder */}
          <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-6xl">{TODAY_RECIPE.emoji}</span>
          </div>
          <div className="p-4">
            <h2 className="text-h2 text-txt-primary mb-1">{TODAY_RECIPE.title}</h2>
            <p className="text-caption text-txt-muted mb-3">
              ⏱ {TODAY_RECIPE.prepTime + TODAY_RECIPE.cookTime} min · 👥 {TODAY_RECIPE.servings} pers. · {TODAY_RECIPE.difficulty}
            </p>
            <Link
              href="/opskrifter/1"
              className="block text-center bg-primary text-white py-3 rounded-md text-label-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Start madlavning →
            </Link>
          </div>
        </div>
      </div>

      {/* Denne uge — horisontal scroll */}
      <div className="mb-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <p className="text-label-lg text-txt-primary font-semibold">Denne uge</p>
          <Link href="/madplan" className="text-label text-primary">Se alle →</Link>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
          {THIS_WEEK.map(({ day, date, recipe, emoji, planned }, i) => (
            <div
              key={day}
              className={`flex-shrink-0 w-[72px] rounded-md border p-2 text-center transition-colors ${
                i === todayIdx
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-bg-surface'
              }`}
            >
              <p className={`text-micro font-bold uppercase ${i === todayIdx ? 'text-primary' : 'text-txt-muted'}`}>
                {day}
              </p>
              <p className={`text-body-md font-semibold my-1 ${i === todayIdx ? 'text-primary' : 'text-txt-primary'}`}>
                {date}
              </p>
              {planned && emoji ? (
                <>
                  <span className="text-xl block">{emoji}</span>
                  <p className="text-micro text-txt-muted mt-0.5 truncate">{recipe}</p>
                </>
              ) : (
                <span className="text-micro text-txt-muted italic">Tom</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration — horisontal scroll */}
      <div className="mb-6">
        <div className="px-4 flex items-center justify-between mb-3">
          <p className="text-label-lg text-txt-primary font-semibold">Inspiration</p>
          <Link href="/opskrifter" className="text-label text-primary">Se alle →</Link>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
          {INSPIRATION.map(({ title, time, emoji }) => (
            <Link
              key={title}
              href="/opskrifter"
              className="flex-shrink-0 w-[120px] rounded-md border border-border bg-bg-surface shadow-sm overflow-hidden"
            >
              <div className="h-20 bg-gradient-to-br from-primary/8 to-accent/8 flex items-center justify-center">
                <span className="text-3xl">{emoji}</span>
              </div>
              <div className="p-2">
                <p className="text-micro font-semibold text-txt-primary truncate">{title}</p>
                <p className="text-micro text-txt-muted">⏱ {time} min</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <Link
          href="/indkoebsliste"
          className="flex flex-col gap-2 bg-accent text-white rounded-xl p-4 shadow-sm"
        >
          <span className="text-2xl">🛒</span>
          <p className="text-label-lg font-semibold">Indkøbsliste</p>
          <p className="text-caption opacity-80">Genér fra ugeplanen</p>
        </Link>
        <Link
          href="/madplan"
          className="flex flex-col gap-2 bg-primary text-white rounded-xl p-4 shadow-sm"
        >
          <span className="text-2xl">✨</span>
          <p className="text-label-lg font-semibold">Generer ugeplan</p>
          <p className="text-caption opacity-80">Ny uge starter mandag</p>
        </Link>
      </div>
    </div>
  )
}
