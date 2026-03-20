import { notFound } from 'next/navigation'
import Link from 'next/link'
import recipesData from '@/lib/data/all-recipes.json'

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

const RECIPES = recipesData as Recipe[]

const TAG_LABELS: Record<string, string> = {
  vegetarisk: 'Vegetarisk', vegansk: 'Vegansk', glutenfri: 'Glutenfri',
  laktosefri: 'Laktosefri', billig: 'Budget', hurtig: 'Hurtig',
  'klassisk dansk': 'Klassisk dansk', aftensmad: 'Aftensmad',
}

function getDifficultyColor(d: string) {
  if (d === 'nem') return 'bg-accent/10 text-accent'
  if (d === 'svær') return 'bg-error/10 text-error'
  return 'bg-warning/15 text-warning'
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpskriftDetaljePage({ params }: PageProps) {
  const { slug } = await params
  const recipe = RECIPES.find(r => r.slug === slug)

  if (!recipe) notFound()

  const displayTags = recipe.tags.filter(t =>
    ['vegetarisk', 'vegansk', 'glutenfri', 'laktosefri'].includes(t)
  )

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
        <span className="text-7xl">🍽️</span>
        <Link
          href="/opskrifter"
          className="absolute top-12 left-4 w-10 h-10 bg-bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-txt-primary shadow-sm border border-border text-lg"
        >
          ←
        </Link>
      </div>

      <div className="px-4 pt-4">
        {/* Titel */}
        <h1 className="text-h1 text-txt-primary mb-1">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-body text-txt-secondary mb-4 leading-relaxed">{recipe.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Forberedelse', value: `${recipe.prep_time_minutes} min` },
            { label: 'Tilberedning', value: `${recipe.cook_time_minutes} min` },
            { label: 'Portioner', value: `${recipe.servings} pers.` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-alt rounded-md p-3 text-center">
              <p className="text-body-md text-txt-primary font-semibold">{value}</p>
              <p className="text-micro text-txt-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Sværhedsgrad + tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`text-label px-3 py-1 rounded-full font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty === 'nem' ? 'Nem' : recipe.difficulty === 'svær' ? 'Svær' : 'Middel'}
          </span>
          {displayTags.map(tag => (
            <span key={tag} className="text-label px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {TAG_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>

        {/* Ingredienser */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-txt-primary">Ingredienser</h2>
            <span className="text-caption text-txt-muted">{recipe.servings} pers.</span>
          </div>
          <div className="bg-bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            {recipe.ingredients.map((ing, i) => (
              <div key={i}>
                {i > 0 && <div className="h-px bg-border mx-4" />}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-body text-txt-primary">{ing.name}</span>
                  <span className="text-body text-txt-secondary font-medium ml-4 text-right flex-shrink-0">
                    {ing.quantity} {ing.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tilføj til madplan */}
        <Link
          href="/madplan"
          className="flex items-center justify-center gap-2 w-full bg-primary text-white py-4 rounded-xl text-label-lg font-semibold shadow-sm hover:bg-primary-dark transition-colors"
        >
          📅 Tilføj til madplan
        </Link>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return (recipesData as Recipe[]).map(r => ({ slug: r.slug }))
}
