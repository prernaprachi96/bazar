import type { Category, Product } from './types'

/**
 * The product catalog is generated programmatically (rather than hand-written)
 * so we get a realistic dataset of 200 items with consistent shape. Each base
 * product is expanded across a set of brands to reach 200 SKUs.
 */

interface Seed {
  name: string
  category: Category
  unit: string
  basePrice: number
  inSeason: boolean
  tags: string[]
}

// Base grocery items grouped by category. ~50 seeds x multiple brands = 200 SKUs.
const SEEDS: Seed[] = [
  // Dairy
  { name: 'Milk', category: 'Dairy', unit: 'gallon', basePrice: 3.49, inSeason: true, tags: ['milk', 'dairy', 'breakfast'] },
  { name: 'Almond Milk', category: 'Dairy', unit: 'carton', basePrice: 3.99, inSeason: true, tags: ['milk', 'substitute', 'vegan', 'nut'] },
  { name: 'Oat Milk', category: 'Dairy', unit: 'carton', basePrice: 4.29, inSeason: true, tags: ['milk', 'substitute', 'vegan'] },
  { name: 'Soy Milk', category: 'Dairy', unit: 'carton', basePrice: 3.79, inSeason: true, tags: ['milk', 'substitute', 'vegan'] },
  { name: 'Butter', category: 'Dairy', unit: 'stick', basePrice: 4.19, inSeason: true, tags: ['dairy', 'baking'] },
  { name: 'Cheddar Cheese', category: 'Dairy', unit: 'block', basePrice: 5.49, inSeason: true, tags: ['cheese', 'dairy'] },
  { name: 'Greek Yogurt', category: 'Dairy', unit: 'tub', basePrice: 4.99, inSeason: true, tags: ['yogurt', 'dairy', 'breakfast'] },
  { name: 'Eggs', category: 'Dairy', unit: 'dozen', basePrice: 3.29, inSeason: true, tags: ['eggs', 'breakfast', 'protein'] },

  // Produce
  { name: 'Apples', category: 'Produce', unit: 'lb', basePrice: 1.99, inSeason: true, tags: ['fruit', 'organic', 'snack'] },
  { name: 'Bananas', category: 'Produce', unit: 'bunch', basePrice: 1.29, inSeason: true, tags: ['fruit', 'snack'] },
  { name: 'Oranges', category: 'Produce', unit: 'lb', basePrice: 2.49, inSeason: true, tags: ['fruit', 'citrus'] },
  { name: 'Strawberries', category: 'Produce', unit: 'box', basePrice: 3.99, inSeason: true, tags: ['fruit', 'berry'] },
  { name: 'Spinach', category: 'Produce', unit: 'bag', basePrice: 2.79, inSeason: true, tags: ['vegetable', 'greens', 'organic'] },
  { name: 'Tomatoes', category: 'Produce', unit: 'lb', basePrice: 2.19, inSeason: false, tags: ['vegetable'] },
  { name: 'Carrots', category: 'Produce', unit: 'bag', basePrice: 1.79, inSeason: true, tags: ['vegetable'] },
  { name: 'Avocado', category: 'Produce', unit: 'each', basePrice: 1.49, inSeason: false, tags: ['fruit', 'vegetable'] },

  // Bakery
  { name: 'Bread', category: 'Bakery', unit: 'loaf', basePrice: 2.99, inSeason: true, tags: ['bread', 'bakery', 'breakfast'] },
  { name: 'Bagels', category: 'Bakery', unit: 'pack', basePrice: 3.49, inSeason: true, tags: ['bread', 'bakery', 'breakfast'] },
  { name: 'Croissant', category: 'Bakery', unit: 'each', basePrice: 1.99, inSeason: true, tags: ['bakery', 'breakfast'] },
  { name: 'Tortillas', category: 'Bakery', unit: 'pack', basePrice: 2.49, inSeason: true, tags: ['bread', 'bakery'] },
  { name: 'Muffins', category: 'Bakery', unit: 'pack', basePrice: 4.29, inSeason: false, tags: ['bakery', 'snack'] },

  // Beverages
  { name: 'Water', category: 'Beverages', unit: 'bottle', basePrice: 0.99, inSeason: true, tags: ['water', 'drink'] },
  { name: 'Orange Juice', category: 'Beverages', unit: 'carton', basePrice: 3.49, inSeason: true, tags: ['juice', 'drink', 'breakfast'] },
  { name: 'Coffee', category: 'Beverages', unit: 'bag', basePrice: 7.99, inSeason: true, tags: ['coffee', 'drink', 'breakfast'] },
  { name: 'Tea', category: 'Beverages', unit: 'box', basePrice: 4.49, inSeason: true, tags: ['tea', 'drink'] },
  { name: 'Cola', category: 'Beverages', unit: 'pack', basePrice: 5.99, inSeason: false, tags: ['soda', 'drink'] },
  { name: 'Sparkling Water', category: 'Beverages', unit: 'pack', basePrice: 4.99, inSeason: true, tags: ['water', 'drink'] },

  // Snacks
  { name: 'Potato Chips', category: 'Snacks', unit: 'bag', basePrice: 3.29, inSeason: false, tags: ['snack', 'chips'] },
  { name: 'Chocolate', category: 'Snacks', unit: 'bar', basePrice: 2.49, inSeason: false, tags: ['snack', 'sweet', 'candy'] },
  { name: 'Cookies', category: 'Snacks', unit: 'pack', basePrice: 3.99, inSeason: false, tags: ['snack', 'sweet'] },
  { name: 'Popcorn', category: 'Snacks', unit: 'box', basePrice: 3.49, inSeason: false, tags: ['snack'] },
  { name: 'Granola Bars', category: 'Snacks', unit: 'box', basePrice: 4.49, inSeason: true, tags: ['snack', 'breakfast', 'healthy'] },
  { name: 'Nuts', category: 'Snacks', unit: 'bag', basePrice: 6.99, inSeason: true, tags: ['snack', 'nut', 'healthy'] },

  // Household
  { name: 'Paper Towels', category: 'Household', unit: 'pack', basePrice: 6.49, inSeason: true, tags: ['household', 'cleaning'] },
  { name: 'Toilet Paper', category: 'Household', unit: 'pack', basePrice: 8.99, inSeason: true, tags: ['household'] },
  { name: 'Dish Soap', category: 'Household', unit: 'bottle', basePrice: 3.49, inSeason: true, tags: ['household', 'cleaning'] },
  { name: 'Laundry Detergent', category: 'Household', unit: 'bottle', basePrice: 11.99, inSeason: true, tags: ['household', 'cleaning'] },
  { name: 'Trash Bags', category: 'Household', unit: 'box', basePrice: 7.49, inSeason: true, tags: ['household'] },

  // Meat & Seafood
  { name: 'Chicken Breast', category: 'Meat & Seafood', unit: 'lb', basePrice: 5.99, inSeason: true, tags: ['meat', 'protein', 'chicken'] },
  { name: 'Ground Beef', category: 'Meat & Seafood', unit: 'lb', basePrice: 6.49, inSeason: true, tags: ['meat', 'protein', 'beef'] },
  { name: 'Salmon', category: 'Meat & Seafood', unit: 'lb', basePrice: 10.99, inSeason: false, tags: ['seafood', 'protein', 'fish'] },
  { name: 'Bacon', category: 'Meat & Seafood', unit: 'pack', basePrice: 6.99, inSeason: true, tags: ['meat', 'breakfast', 'pork'] },
  { name: 'Tofu', category: 'Meat & Seafood', unit: 'block', basePrice: 2.99, inSeason: true, tags: ['protein', 'vegan', 'substitute'] },

  // Frozen
  { name: 'Frozen Pizza', category: 'Frozen', unit: 'each', basePrice: 5.49, inSeason: false, tags: ['frozen', 'dinner'] },
  { name: 'Ice Cream', category: 'Frozen', unit: 'tub', basePrice: 4.99, inSeason: true, tags: ['frozen', 'sweet', 'dessert'] },
  { name: 'Frozen Peas', category: 'Frozen', unit: 'bag', basePrice: 2.29, inSeason: true, tags: ['frozen', 'vegetable'] },
  { name: 'Frozen Berries', category: 'Frozen', unit: 'bag', basePrice: 4.49, inSeason: true, tags: ['frozen', 'fruit', 'berry'] },

  // Pantry
  { name: 'Rice', category: 'Pantry', unit: 'bag', basePrice: 4.99, inSeason: true, tags: ['pantry', 'grain'] },
  { name: 'Pasta', category: 'Pantry', unit: 'box', basePrice: 1.99, inSeason: true, tags: ['pantry', 'dinner'] },
  { name: 'Olive Oil', category: 'Pantry', unit: 'bottle', basePrice: 8.49, inSeason: true, tags: ['pantry', 'oil', 'cooking'] },
  { name: 'Cereal', category: 'Pantry', unit: 'box', basePrice: 4.29, inSeason: true, tags: ['pantry', 'breakfast'] },
  { name: 'Peanut Butter', category: 'Pantry', unit: 'jar', basePrice: 3.99, inSeason: true, tags: ['pantry', 'spread', 'nut'] },
  { name: 'Flour', category: 'Pantry', unit: 'bag', basePrice: 3.49, inSeason: true, tags: ['pantry', 'baking'] },
  { name: 'Sugar', category: 'Pantry', unit: 'bag', basePrice: 2.99, inSeason: true, tags: ['pantry', 'baking'] },

  // Personal Care
  { name: 'Toothpaste', category: 'Personal Care', unit: 'tube', basePrice: 3.49, inSeason: true, tags: ['personal care', 'hygiene'] },
  { name: 'Shampoo', category: 'Personal Care', unit: 'bottle', basePrice: 5.99, inSeason: true, tags: ['personal care', 'hygiene'] },
  { name: 'Soap', category: 'Personal Care', unit: 'bar', basePrice: 2.49, inSeason: true, tags: ['personal care', 'hygiene'] },
  { name: 'Deodorant', category: 'Personal Care', unit: 'each', basePrice: 4.29, inSeason: true, tags: ['personal care', 'hygiene'] },
]

const BRANDS = ['Fresh Farms', 'GreenLeaf', "Nature's Best", 'ValueMart', 'Organic Valley', 'Golden Harvest']

// A small deterministic out-of-stock set to demo substitutes.
const OUT_OF_STOCK_NAMES = new Set(['Milk', 'Strawberries', 'Salmon'])

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function makeSku(seed: Seed, seedIndex: number, brandOffset: number, id: number): Product {
  const brand = BRANDS[(seedIndex + brandOffset) % BRANDS.length]
  // vary price a little per brand so ranges feel realistic
  const priceJitter = (brandOffset - 1.5) * 0.4
  const price = Math.max(0.49, +(seed.basePrice + priceJitter).toFixed(2))
  return {
    id: `${slug(seed.name)}-${slug(brand)}-${id}`,
    name: seed.name,
    category: seed.category,
    brand,
    price,
    unit: seed.unit,
    inSeason: seed.inSeason,
    onSale: (seedIndex + brandOffset) % 5 === 0,
    outOfStock: OUT_OF_STOCK_NAMES.has(seed.name) && brandOffset === 0,
    tags: seed.tags,
  }
}

function buildCatalog(): Product[] {
  const items: Product[] = []
  // First pass: guarantee every seed gets a base set of brands so the whole
  // catalog (including the last categories) is always represented.
  const BASE_BRANDS = 3
  SEEDS.forEach((seed, i) => {
    for (let b = 0; b < BASE_BRANDS; b++) {
      items.push(makeSku(seed, i, b, items.length))
    }
  })
  // Second pass: top up with additional brand variants until we reach 200 SKUs.
  let extra = BASE_BRANDS
  while (items.length < 200) {
    const seedIndex = (items.length - SEEDS.length * BASE_BRANDS) % SEEDS.length
    const seed = SEEDS[seedIndex]
    items.push(makeSku(seed, seedIndex, extra + Math.floor(items.length / SEEDS.length), items.length))
    if (seedIndex === SEEDS.length - 1) extra += 1
  }
  return items.slice(0, 200)
}

export const PRODUCTS: Product[] = buildCatalog()

export const CATEGORIES: Category[] = [
  'Dairy',
  'Produce',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household',
  'Meat & Seafood',
  'Frozen',
  'Pantry',
  'Personal Care',
]

/** Category color accents used in the UI (chart tokens). */
export const CATEGORY_COLOR: Record<Category, string> = {
  Dairy: 'var(--chart-1)',
  Produce: 'var(--chart-5)',
  Bakery: 'var(--chart-3)',
  Beverages: 'var(--chart-4)',
  Snacks: 'var(--chart-2)',
  Household: 'var(--chart-1)',
  'Meat & Seafood': 'var(--chart-2)',
  Frozen: 'var(--chart-4)',
  Pantry: 'var(--chart-3)',
  'Personal Care': 'var(--chart-5)',
}

/** Find the cheapest in-stock product matching a free-text name. */
export function findProductByName(name: string): Product | undefined {
  const q = name.trim().toLowerCase()
  if (!q) return undefined
  const matches = PRODUCTS.filter(
    (p) => p.name.toLowerCase() === q || p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()),
  )
  if (matches.length === 0) return undefined
  const inStock = matches.filter((m) => !m.outOfStock)
  const pool = inStock.length > 0 ? inStock : matches
  return pool.sort((a, b) => a.price - b.price)[0]
}

/** Look up the category for a free-text item name. */
export function categoryForName(name: string): Category {
  const p = findProductByName(name)
  return p?.category ?? 'Pantry'
}

/** Suggest substitutes: same-category or shared-tag items, excluding the query itself. */
export function findSubstitutes(name: string, limit = 3): Product[] {
  const base = findProductByName(name)
  if (!base) return []
  const seen = new Set<string>()
  const subs: Product[] = []
  for (const p of PRODUCTS) {
    if (p.outOfStock) continue
    if (p.name.toLowerCase() === base.name.toLowerCase()) continue
    const sharesTag = p.tags.some((t) => base.tags.includes(t))
    const sameCat = p.category === base.category
    if ((sharesTag || sameCat) && !seen.has(p.name)) {
      seen.add(p.name)
      subs.push(p)
    }
    if (subs.length >= limit) break
  }
  return subs
}
