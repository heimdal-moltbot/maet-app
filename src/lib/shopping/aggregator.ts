/**
 * Mæt — Indkøbsliste Aggregator
 * Aggregerer ingredienser fra en ugeplan til en kategoriseret indkøbsliste
 */

export interface RecipeIngredient {
  name: string
  quantity: string
  unit: string
  notes?: string
}

export interface ShoppingItem {
  id: string
  name: string
  displayQuantity: string
  unit: string
  category: string
  checked: boolean
  recipeCount: number  // hvor mange opskrifter bruger denne
}

export interface ShoppingCategory {
  key: string
  label: string
  emoji: string
  items: ShoppingItem[]
}

// Kategori-mapping baseret på ingrediens-navne
const CATEGORY_RULES: Array<{ key: string; label: string; emoji: string; keywords: string[] }> = [
  {
    key: 'kød_fisk',
    label: 'Kød & Fisk',
    emoji: '🥩',
    keywords: ['oksekød', 'svinekød', 'kylling', 'laks', 'torsk', 'fisk', 'frikadel',
               'hakket', 'bøf', 'koteletter', 'spareribs', 'rejer', 'bacon', 'skinke',
               'pølse', 'kalkun', 'and', 'lam', 'kalv', 'tunfisk'],
  },
  {
    key: 'grøntsager',
    label: 'Grøntsager & Frugt',
    emoji: '🥦',
    keywords: ['gulerod', 'gulerødder', 'løg', 'hvidløg', 'kartofler', 'kartoffel',
               'tomat', 'agurk', 'salat', 'spinat', 'broccoli', 'blomkål', 'squash',
               'peberfrugt', 'aubergine', 'svampe', 'champignon', 'selleri', 'pastinakker',
               'rødbeder', 'asparges', 'porre', 'grønkål', 'citron', 'lime', 'æble',
               'appelsin', 'banan', 'avocado', 'ingefær'],
  },
  {
    key: 'mejeri',
    label: 'Mejeri & Æg',
    emoji: '🧀',
    keywords: ['mælk', 'fløde', 'smør', 'ost', 'mozzarella', 'parmesan', 'cheddar',
               'brie', 'ricotta', 'mascarpone', 'creme fraiche', 'cremefraiche', 'yoghurt',
               'skyr', 'kærnemælk', 'æg', 'æggeblomme', 'æggehvide', 'flødeskum'],
  },
  {
    key: 'tørvarer',
    label: 'Tørvarer & Pasta',
    emoji: '🌾',
    keywords: ['pasta', 'spaghetti', 'tagliatelle', 'penne', 'lasagneplader', 'ris',
               'mel', 'hvedemel', 'rugmel', 'rasp', 'brødkrummer', 'havregryn', 'quinoa',
               'linser', 'kikærter', 'bønner', 'couscous', 'bulgur', 'nudler'],
  },
  {
    key: 'dåser_glas',
    label: 'Dåser & Glas',
    emoji: '🥫',
    keywords: ['dåse', 'dåsetomater', 'hakkede tomater', 'flåede tomater', 'tomatpuré',
               'kokosmælk', 'bambusskud', 'majs', 'ærter på dåse', 'tun på dåse'],
  },
  {
    key: 'krydderier',
    label: 'Krydderier & Saucer',
    emoji: '🧂',
    keywords: ['salt', 'peber', 'paprika', 'spidskommen', 'koriander', 'gurkemeje',
               'oregano', 'timian', 'basilikum', 'rosmarin', 'laurbær', 'karry',
               'garam masala', 'sojasauce', 'soja', 'worcestershire', 'tabasco',
               'ketchup', 'sennep', 'mayonnaise', 'remoulade', 'olivenolie', 'olie',
               'eddike', 'sukker', 'honning', 'farin', 'muskatnød', 'kanel', 'vanille'],
  },
  {
    key: 'brød',
    label: 'Brød & Bageri',
    emoji: '🍞',
    keywords: ['brød', 'rugbrød', 'franskbrød', 'boller', 'burgerboller', 'pitabrød',
               'tortillas', 'baguette', 'ciabatta', 'croissant'],
  },
]

function categorize(ingredientName: string): { key: string; label: string; emoji: string } {
  const lower = ingredientName.toLowerCase()
  for (const cat of CATEGORY_RULES) {
    if (cat.keywords.some(kw => lower.includes(kw))) {
      return { key: cat.key, label: cat.label, emoji: cat.emoji }
    }
  }
  return { key: 'andet', label: 'Andet', emoji: '🛒' }
}

function parseQuantity(raw: string): { amount: number; unit: string } {
  const match = raw.match(/^([\d.,]+)\s*(.*)$/)
  if (match) {
    return {
      amount: parseFloat(match[1].replace(',', '.')),
      unit: match[2].trim(),
    }
  }
  return { amount: 0, unit: raw.trim() }
}

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().trim()
  if (u === 'gram' || u === 'gr') return 'g'
  if (u === 'milliliter' || u === 'ml') return 'ml'
  if (u === 'deciliter') return 'dl'
  if (u === 'liter') return 'L'
  if (u === 'stykker' || u === 'stk.') return 'stk'
  if (u === 'spiseskefuld' || u === 'spsk.') return 'spsk'
  if (u === 'teskefuld' || u === 'tsk.') return 'tsk'
  if (u === 'fed' || u === 'fedd') return 'fed'
  return unit
}

interface MealPlanRecipe {
  ingredients?: RecipeIngredient[]
  servings?: number
  [key: string]: unknown
}

export function aggregateShoppingList(
  mealPlan: Array<{ recipe: MealPlanRecipe | null }>,
  householdSize: number = 4
): ShoppingCategory[] {
  // Akkumuler ingredienser
  const aggregated = new Map<string, {
    name: string
    totalAmount: number
    unit: string
    category: ReturnType<typeof categorize>
    recipeCount: number
    hasQuantity: boolean
  }>()

  for (const day of mealPlan) {
    if (!day.recipe?.ingredients) continue

    const servings = day.recipe.servings ?? 4

    for (const ing of day.recipe.ingredients) {
      const normalName = ing.name.toLowerCase().trim()
      const { amount, unit } = parseQuantity(ing.quantity ?? '')
      const normUnit = normalizeUnit(unit || ing.unit || '')
      const key = `${normalName}__${normUnit}`

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!
        if (amount > 0 && householdSize > 0) {
          existing.totalAmount += amount * householdSize / servings
        }
        existing.recipeCount++
      } else {
        const scaledAmount = amount > 0 ? amount * householdSize / servings : 0
        aggregated.set(key, {
          name: ing.name,
          totalAmount: scaledAmount,
          unit: normUnit,
          category: categorize(ing.name),
          recipeCount: 1,
          hasQuantity: amount > 0,
        })
      }
    }
  }

  // Byg kategori-struktur
  const categoryMap = new Map<string, ShoppingCategory>()

  let itemIndex = 0
  for (const [, item] of Array.from(aggregated)) {
    const cat = item.category
    if (!categoryMap.has(cat.key)) {
      categoryMap.set(cat.key, {
        key: cat.key,
        label: cat.label,
        emoji: cat.emoji,
        items: [],
      })
    }

    const displayQty = item.hasQuantity && item.totalAmount > 0
      ? `${Math.round(item.totalAmount * 10) / 10} ${item.unit}`.trim()
      : item.unit || ''

    categoryMap.get(cat.key)!.items.push({
      id: `item-${itemIndex++}`,
      name: item.name,
      displayQuantity: displayQty,
      unit: item.unit,
      category: cat.key,
      checked: false,
      recipeCount: item.recipeCount,
    })
  }

  // Sorter kategorier i logisk rækkefølge
  const categoryOrder = ['kød_fisk', 'grøntsager', 'mejeri', 'tørvarer', 'dåser_glas', 'krydderier', 'brød', 'andet']
  return categoryOrder
    .map(key => categoryMap.get(key))
    .filter((cat): cat is ShoppingCategory => cat !== undefined && cat.items.length > 0)
}
