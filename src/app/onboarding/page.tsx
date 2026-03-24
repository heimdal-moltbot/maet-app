'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// UX spec SCR-01 v1.3: 3-trins onboarding wizard
// Step 1: Husstandsstørrelse
// Step 2: Kostpræferencer (kostrestriktioner + madpræferencer)
// Step 3: Navn & Kontooverblik

const DIETARY_RESTRICTIONS = [
  { tag: 'vegetarisk', emoji: '🥦', label: 'Vegetarisk' },
  { tag: 'vegansk', emoji: '🌿', label: 'Vegansk' },
  { tag: 'glutenfri', emoji: '🌾', label: 'Glutenfri' },
  { tag: 'laktosefri', emoji: '🥛', label: 'Laktosefri' },
  { tag: 'ingen_svinekod', emoji: '🐷', label: 'Ingen svinekød' },
  { tag: 'ingen_skaldyr', emoji: '🦞', label: 'Ingen skaldyr' },
]

const FOOD_PREFERENCES = [
  { tag: 'varieret', emoji: '🎨', label: 'Varieret' },
  { tag: 'italiensk', emoji: '🍝', label: 'Italiensk' },
  { tag: 'mexikansk', emoji: '🌮', label: 'Mexikansk' },
  { tag: 'asiatisk', emoji: '🍜', label: 'Asiatisk' },
  { tag: 'husmandsmat', emoji: '🥘', label: 'Husmandsmat' },
  { tag: 'let_sundt', emoji: '🥗', label: 'Let & sundt' },
]

const HOUSEHOLD_EMOJI: Record<number, string> = {
  1: '🧑', 2: '👫', 3: '👨‍👩‍👦', 4: '👨‍👩‍👧‍👦', 5: '👨‍👩‍👧‍👦👶', 6: '👨‍👩‍👧‍👦👶👶',
}

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [householdSize, setHouseholdSize] = useState<number>(4)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [noPreferences, setNoPreferences] = useState(false)
  const [familyName, setFamilyName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTag(tag: string) {
    setNoPreferences(false)
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function handleNoPreferences() {
    setNoPreferences(true)
    setSelectedTags([])
  }

  async function handleComplete() {
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { router.push('/login'); return }

    // Gem familieprofil
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: profile, error: profileErr } = await db
      .from('family_members')
      .insert({ profile_id: user.id, name: familyName || 'Familie' })
      .select()
      .single()

    if (profileErr) {
      // Prøv at gemme som user metadata i stedet
      await supabase.auth.updateUser({
        data: {
          household_size: householdSize,
          dietary_tags: selectedTags,
          family_name: familyName || null,
        }
      })
    } else if (profile && selectedTags.length > 0) {
      await db.from('dietary_preferences').insert(
        selectedTags.map((tag: string) => ({
          family_member_id: profile.id,
          preference_type: 'preference',
          value: tag,
        }))
      )
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-[32px] font-bold text-primary">Mæt</h1>
        </div>

        {/* Progress (3 dots) */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`transition-all duration-300 rounded-full ${
                s === step
                  ? 'w-6 h-2.5 bg-primary'
                  : s < step
                  ? 'w-2.5 h-2.5 bg-primary/40'
                  : 'w-2.5 h-2.5 bg-border'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Husstandsstørrelse */}
        {step === 1 && (
          <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-6 animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">
                {HOUSEHOLD_EMOJI[Math.min(householdSize, 6)] ?? '👨‍👩‍👧‍👦'}
              </span>
              <h2 className="text-h2 text-txt-primary">Hvor mange er I?</h2>
              <p className="text-body text-txt-secondary mt-1">
                Vi tilpasser portionerne til jer
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setHouseholdSize(n)}
                  className={`aspect-square rounded-md text-h3 font-bold transition-all ${
                    householdSize === n
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-bg-alt text-txt-primary hover:bg-primary/10 border border-border'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHouseholdSize(6)}
              className={`w-full py-2.5 rounded-md text-body transition-all border mb-6 ${
                householdSize >= 6
                  ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                  : 'bg-bg-surface text-txt-secondary border-border hover:border-primary/30'
              }`}
            >
              6 eller flere
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-primary text-white py-3.5 rounded-md text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Fortsæt →
            </button>
          </div>
        )}

        {/* STEP 2: Kostpræferencer */}
        {step === 2 && (
          <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-6 animate-fade-in">
            <h2 className="text-h2 text-txt-primary mb-1">Kostrestriktioner & præferencer</h2>
            <p className="text-body text-txt-secondary mb-4">
              Vi tilpasser forslagene — kan ændres under Profil
            </p>

            {/* Kostrestriktioner */}
            <p className="text-overline text-txt-muted font-bold uppercase tracking-wider mb-2">Kostrestriktioner</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {DIETARY_RESTRICTIONS.map(({ tag, emoji, label }) => {
                const selected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-md border transition-all text-left ${
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-bg-surface text-txt-primary hover:border-primary/30'
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="text-label flex-1">{label}</span>
                    {selected && <span className="text-primary text-xs font-bold">✓</span>}
                  </button>
                )
              })}
            </div>

            {/* Madpræferencer */}
            <p className="text-overline text-txt-muted font-bold uppercase tracking-wider mb-2">Madpræferencer</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FOOD_PREFERENCES.map(({ tag, emoji, label }) => {
                const selected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-md border transition-all text-left ${
                      selected
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-bg-surface text-txt-primary hover:border-accent/30'
                    }`}
                  >
                    <span className="text-base">{emoji}</span>
                    <span className="text-label flex-1">{label}</span>
                    {selected && <span className="text-accent text-xs font-bold">✓</span>}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleNoPreferences}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md border transition-all mb-4 ${
                noPreferences
                  ? 'border-txt-muted bg-bg-alt text-txt-secondary'
                  : 'border-border bg-bg-surface text-txt-muted hover:border-txt-muted'
              }`}
            >
              <span className="text-base">✅</span>
              <span className="text-label">Ingen særlige ønsker</span>
              {noPreferences && <span className="text-txt-secondary text-xs font-bold ml-auto">✓</span>}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-md border border-border text-body text-txt-secondary hover:bg-bg-alt transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-[2] bg-primary text-white py-3 rounded-md text-label font-semibold hover:bg-primary-dark transition-colors"
              >
                Fortsæt →
              </button>
            </div>
            <button
              onClick={() => { setSelectedTags([]); setStep(3) }}
              className="w-full mt-2 py-2 text-caption text-txt-muted hover:text-txt-secondary transition-colors"
            >
              Spring over
            </button>
          </div>
        )}

        {/* STEP 3: Bekræftelse */}
        {step === 3 && (
          <div className="bg-bg-surface rounded-xl border border-border shadow-sm p-6 animate-fade-in">
            <h2 className="text-h2 text-txt-primary mb-1">Hvad hedder I?</h2>
            <p className="text-body text-txt-secondary mb-5">Giv jeres profil et navn — det er valgfrit</p>

            {/* Navne-felt */}
            <div className="mb-5">
              <label className="block text-label text-txt-secondary mb-1.5">
                Familienavn <span className="text-txt-muted">(valgfrit)</span>
              </label>
              <input
                type="text"
                value={familyName}
                onChange={e => setFamilyName(e.target.value)}
                placeholder="f.eks. Familie Hansen"
                className="w-full px-4 py-3 rounded-md border border-border bg-bg-surface text-body text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Sammenfatning */}
            <div className="bg-bg-alt rounded-md p-4 space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-caption text-txt-muted">Husstand</span>
                <span className="text-body-md text-txt-primary font-medium">
                  {householdSize >= 6 ? '6+' : householdSize} {householdSize === 1 ? 'person' : 'personer'}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div>
                <span className="text-caption text-txt-muted block mb-1">Præferencer</span>
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map(tag => (
                      <span key={tag} className="text-micro bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-body text-txt-muted">Ingen særlige ønsker</span>
                )}
              </div>
            </div>

            {error && (
              <p className="text-caption text-error bg-error-light rounded-md px-3 py-2 mb-4">{error}</p>
            )}

            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full bg-primary text-white py-3.5 rounded-md text-label-lg font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? 'Gemmer...' : 'Kom i gang! 🚀'}
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-2 py-2 text-caption text-txt-muted hover:text-txt-secondary transition-colors"
            >
              ← Ret præferencer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
