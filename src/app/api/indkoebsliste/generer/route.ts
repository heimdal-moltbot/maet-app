import { NextRequest, NextResponse } from 'next/server'
import { aggregateShoppingList } from '@/lib/shopping/aggregator'
import recipesData from '@/lib/data/all-recipes.json'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Input: array af recipe-slugs/ids fra ugeplanen
    const recipeRefs: string[] = body.recipes ?? []
    const householdSize: number = body.householdSize ?? 4

    if (recipeRefs.length === 0) {
      return NextResponse.json({
        ok: true,
        categories: [],
        meta: { totalItems: 0, recipes: 0 },
      })
    }

    // Find opskrifter fra data
    const allRecipes = recipesData as Record<string, unknown>[]
    const matchedRecipes = recipeRefs.map(ref => {
      return allRecipes.find(r =>
        String(r.id) === ref ||
        String(r.slug) === ref ||
        String(r.title).toLowerCase() === ref.toLowerCase()
      ) ?? null
    }).filter((r): r is Record<string, unknown> => r !== null)

    // Aggreger indkøbsliste
    const mealPlan = matchedRecipes.map(recipe => ({ recipe: recipe as Parameters<typeof aggregateShoppingList>[0][0]['recipe'] }))
    const categories = aggregateShoppingList(mealPlan, householdSize)

    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)

    return NextResponse.json({
      ok: true,
      categories,
      meta: {
        totalItems,
        recipes: matchedRecipes.length,
        householdSize,
      },
    })
  } catch (err) {
    console.error('[API] /api/indkoebsliste/generer fejl:', err)
    return NextResponse.json({ ok: false, error: 'Intern fejl' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/indkoebsliste/generer',
    body: {
      recipes: 'string[] — recipe slugs or ids from meal plan',
      householdSize: 'number (default 4)',
    },
    example: {
      recipes: ['pasta-bolognese', 'frikadeller-med-kartofler-og-brun-sovs'],
      householdSize: 4,
    },
  })
}
