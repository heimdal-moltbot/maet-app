import { NextRequest, NextResponse } from 'next/server'
import { generateMealPlan, filterCompatibleRecipes, type Recipe, type FamilyProfile } from '@/lib/meal-plan/generator'
import recipesData from '@/lib/data/all-recipes.json'

// Map fra JSON-format til generator Recipe-format
function mapToGeneratorRecipe(r: Record<string, unknown>): Recipe {
  const tags = Array.isArray(r.tags) ? r.tags as string[] : []
  const ingredients = Array.isArray(r.ingredients)
    ? (r.ingredients as Array<{name?: string}>).map(i => i?.name ?? '').filter(Boolean)
    : []

  // Bestem proteinType fra tags og ingredienser
  const allText = [...tags, ...ingredients].join(' ').toLowerCase()
  const proteinType =
    tags.includes('vegansk') || tags.includes('vegan') ? 'vegansk' :
    tags.includes('vegetarisk') || tags.includes('vegetarian') ? 'vegetar' :
    allText.match(/laks|torsk|tun|fisk|makrel|ørred/) ? 'fisk' :
    allText.match(/kylling|oksekød|svinekød|hakket|bøf|frikadel|kød/) ? 'kød' :
    'blandet'

  // Map sværhedsgrad
  const rawDiff = String(r.difficulty ?? r.svaerhedsgrad ?? 'nem').toLowerCase()
  const difficulty = rawDiff === 'svær' || rawDiff === 'svær' ? 'svær'
    : rawDiff === 'middel' || rawDiff === 'medium' || rawDiff === 'mellem' ? 'middel'
    : 'nem'

  return {
    id: String(r.id ?? r.slug ?? Math.random()),
    title: String(r.title ?? r.titel ?? ''),
    prepTime: Number(r.prep_time_minutes ?? r.forberedelsestid ?? 15),
    cookTime: Number(r.cook_time_minutes ?? r.tilberedningstid ?? 20),
    servingsBase: Number(r.servings ?? r.portioner ?? 4),
    difficulty,
    tags: [...tags, ...(allText.includes('glutenfri') ? ['glutenfri'] : [])],
    proteinType: proteinType as Recipe['proteinType'],
    allergens: [],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const profile: FamilyProfile = {
      householdSize: body.householdSize ?? 4,
      dietaryPreferences: body.dietaryPreferences ?? [],
    }
    const days: number = body.days ?? 7

    // Map alle opskrifter til generator-format
    const recipes = (recipesData as Record<string, unknown>[]).map(mapToGeneratorRecipe)

    // Generer ugeplan
    const plan = generateMealPlan(recipes, profile, { days })

    // Berig output med fuld opskriftsdata
    const enrichedPlan = plan.map(day => {
      if (!day.recipe) return { dayIndex: day.dayIndex, recipe: null }

      const fullRecipe = (recipesData as Record<string, unknown>[]).find(
        r => String(r.id ?? r.slug) === day.recipe!.id ||
             String(r.slug) === day.recipe!.id
      )

      return {
        dayIndex: day.dayIndex,
        recipe: fullRecipe ?? day.recipe,
      }
    })

    // Statistik
    const compatible = filterCompatibleRecipes(recipes, profile)

    return NextResponse.json({
      ok: true,
      plan: enrichedPlan,
      meta: {
        totalRecipes: recipes.length,
        compatibleRecipes: compatible.length,
        householdSize: profile.householdSize,
        dietaryPreferences: profile.dietaryPreferences,
      },
    })
  } catch (err) {
    console.error('[API] /api/ugeplan/generer fejl:', err)
    return NextResponse.json({ ok: false, error: 'Intern fejl' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/ugeplan/generer',
    body: {
      householdSize: 'number (1-10, default 4)',
      dietaryPreferences: 'string[] (vegetarisk|vegansk|glutenfri|laktosefri|ingen_svinekod|ingen_skaldyr)',
      days: 'number (default 7)',
    },
    example: {
      householdSize: 4,
      dietaryPreferences: ['glutenfri'],
      days: 7,
    },
  })
}
