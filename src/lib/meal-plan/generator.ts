/**
 * Mæt — Meal Plan Generator (Rule-based, MVP)
 *
 * Strategi: Enkel rule-based algoritme. Ingen AI til MVP.
 * Input:  - Tilgængelige opskrifter (med tags og allergen-info)
 *         - Familieprofil (husstandsstørrelse + kostpræferencer)
 *         - Antal dage der skal planlægges (default: 7)
 * Output: Array af opskrifter, én pr. dag (aftensmad fokus til MVP)
 *
 * Regler (prioriteret):
 * 1. Filtrer opskrifter der matcher familieprofil (allergi/kost-tags)
 * 2. Ingen gentagelser inden for én uge
 * 3. Variér protein-typer (kød, fisk, vegetar) — maks 2 af samme type i træk
 * 4. Variér sværhedsgrad — hverdag: nem/middel, weekend: alle
 * 5. Fyld tomme dage med tilfældig gyldig opskrift
 */

export type DietaryTag =
  | 'vegetarisk'
  | 'vegansk'
  | 'glutenfri'
  | 'laktosefri'
  | 'ingen_svinekod'
  | 'ingen_skaldyr'

export type Difficulty = 'nem' | 'middel' | 'svær'

export type ProteinType = 'kød' | 'fisk' | 'vegetar' | 'vegansk' | 'blandet'

export interface Recipe {
  id: string
  title: string
  prepTime: number       // minutter
  cookTime: number       // minutter
  servingsBase: number
  difficulty: Difficulty
  tags: string[]         // kostpræference-tags
  proteinType: ProteinType
  allergens: string[]    // allergen-navne (EU-standard)
}

export interface FamilyProfile {
  householdSize: number
  dietaryPreferences: DietaryTag[]  // fra dietary_preferences tabel
}

export interface MealPlanDay {
  dayIndex: number       // 0=mandag, 6=søndag
  recipe: Recipe | null
}

export interface GeneratorOptions {
  days?: number          // default 7
  weekdayMaxDifficulty?: Difficulty  // default 'middel'
  weekendMaxDifficulty?: Difficulty  // default 'svær' — falder tilbage til 'middel' hvis ingen svær-retter
}

// Allergen → tag mapping (hvilke tags udelukker hvilke allergener)
// Mapping: præference → forbudte allergen-navne OG proteinType-værdier
const TAG_ALLERGEN_MAP: Record<DietaryTag, string[]> = {
  vegetarisk: ['kød', 'fisk'],      // matcher proteinType direkte
  vegansk: ['kød', 'fisk', 'mælk', 'æg'],
  glutenfri: ['gluten'],
  laktosefri: ['mælk'],
  ingen_svinekod: ['svinekød'],
  ingen_skaldyr: ['krebsdyr', 'bløddyr'],
}

const DIFFICULTY_RANK: Record<Difficulty, number> = { nem: 1, middel: 2, svær: 3 }

const WEEKEND_DAYS = new Set([5, 6]) // lørdag + søndag (0-indexed fra mandag)

/**
 * Filtrer opskrifter der er kompatible med familieprofilen
 */
export function filterCompatibleRecipes(
  recipes: Recipe[],
  profile: FamilyProfile
): Recipe[] {
  if (profile.dietaryPreferences.length === 0) return recipes

  return recipes.filter(recipe => {
    for (const pref of profile.dietaryPreferences) {
      const forbiddenAllergens = TAG_ALLERGEN_MAP[pref] ?? []
      const hasConflict = forbiddenAllergens.some(allergen =>
        recipe.allergens.includes(allergen) ||
        recipe.tags.includes(allergen) ||
        recipe.proteinType === allergen  // tjek også proteinType direkte
      )
      if (hasConflict) return false
    }
    return true
  })
}

/**
 * Generer ugeplan
 */
export function generateMealPlan(
  allRecipes: Recipe[],
  profile: FamilyProfile,
  options: GeneratorOptions = {}
): MealPlanDay[] {
  const { days = 7, weekdayMaxDifficulty = 'middel', weekendMaxDifficulty = 'svær' } = options

  const compatible = filterCompatibleRecipes(allRecipes, profile)

  if (compatible.length === 0) {
    return Array.from({ length: days }, (_, i) => ({ dayIndex: i, recipe: null }))
  }

  // Bestem faktisk max-sværhedsgrad baseret på tilgængelige opskrifter
  const hasHard = compatible.some(r => r.difficulty === 'svær')
  const hasMedium = compatible.some(r => r.difficulty === 'middel')
  const effectiveWeekendMax: Difficulty = hasHard ? weekendMaxDifficulty
    : hasMedium ? 'middel' : 'nem'

  const plan: MealPlanDay[] = []
  const usedIds = new Set<string>()
  let lastProteinType: ProteinType | null = null
  let sameProteinCount = 0

  for (let day = 0; day < days; day++) {
    const isWeekend = WEEKEND_DAYS.has(day)
    const maxDifficulty = isWeekend ? effectiveWeekendMax : weekdayMaxDifficulty
    const maxRank = DIFFICULTY_RANK[maxDifficulty]

    // Filtrer: ikke brugt, ikke for svær, variér protein
    let candidates = compatible.filter(r => {
      if (usedIds.has(r.id)) return false
      if (DIFFICULTY_RANK[r.difficulty] > maxRank) return false
      // Begræns 2 dage i træk med samme protein
      if (sameProteinCount >= 2 && r.proteinType === lastProteinType) return false
      return true
    })

    // Fallback: drop protein-variationsreglen hvis ingen kandidater
    if (candidates.length === 0) {
      candidates = compatible.filter(r =>
        !usedIds.has(r.id) && DIFFICULTY_RANK[r.difficulty] <= maxRank
      )
    }

    // Fallback 2: tillad gentagelse (kort opskriftsliste)
    if (candidates.length === 0) {
      candidates = compatible.filter(r => DIFFICULTY_RANK[r.difficulty] <= maxRank)
    }

    if (candidates.length === 0) {
      plan.push({ dayIndex: day, recipe: null })
      continue
    }

    // Vælg tilfældig kandidat
    const recipe = candidates[Math.floor(Math.random() * candidates.length)]
    usedIds.add(recipe.id)

    // Opdater protein-tracking
    if (recipe.proteinType === lastProteinType) {
      sameProteinCount++
    } else {
      lastProteinType = recipe.proteinType
      sameProteinCount = 1
    }

    plan.push({ dayIndex: day, recipe })
  }

  return plan
}

/**
 * Skaler portioner til husstandsstørrelse
 */
export function scaleServings(
  quantity: number,
  recipeServings: number,
  householdSize: number
): number {
  const factor = householdSize / recipeServings
  return Math.round(quantity * factor * 10) / 10  // rund til 1 decimal
}

/**
 * Aggreger ingredienser fra ugeplan til indkøbsliste
 * Grupperer ens ingredienser og summer mængder
 */
export interface ShoppingItem {
  ingredientId: string
  name: string
  totalQuantity: number
  unit: string
  category: string
}

export interface RecipeIngredient {
  ingredientId: string
  name: string
  quantity: number
  unit: string
  category: string
}

export function aggregateShoppingList(
  mealPlan: MealPlanDay[],
  recipeIngredients: Map<string, RecipeIngredient[]>,
  householdSize: number,
  recipeServingsMap: Map<string, number>
): ShoppingItem[] {
  const aggregated = new Map<string, ShoppingItem>()

  for (const day of mealPlan) {
    if (!day.recipe) continue

    const ingredients = recipeIngredients.get(day.recipe.id) ?? []
    const baseServings = recipeServingsMap.get(day.recipe.id) ?? 4

    for (const ing of ingredients) {
      const scaledQty = scaleServings(ing.quantity, baseServings, householdSize)
      const key = `${ing.ingredientId}__${ing.unit}` // gruppér på ingredient+unit

      if (aggregated.has(key)) {
        aggregated.get(key)!.totalQuantity += scaledQty
      } else {
        aggregated.set(key, {
          ingredientId: ing.ingredientId,
          name: ing.name,
          totalQuantity: scaledQty,
          unit: ing.unit,
          category: ing.category,
        })
      }
    }
  }

  // Sorter pr. kategori
  return Array.from(aggregated.values()).sort((a, b) =>
    a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  )
}
