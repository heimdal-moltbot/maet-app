import { notFound } from 'next/navigation'
import recipesData from '@/lib/data/all-recipes.json'
import RecipeDetailClient from './RecipeDetailClient'

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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return RECIPES.map(r => ({ slug: r.slug }))
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const recipe = RECIPES.find(r => r.slug === slug)

  if (!recipe) notFound()

  return <RecipeDetailClient recipe={recipe} />
}
