import { PRODUCTS } from './products'
import type { CartItem, Product } from './types'

// Staples we assume are frequently repurchased. Used for the "running low" nudge.
const STAPLES = ['Milk', 'Bread', 'Eggs', 'Butter', 'Bananas', 'Coffee']

export interface Suggestions {
  lowStock: string[]
  seasonal: Product[]
  onSale: Product[]
}

function dedupeByName(products: Product[], limit: number): Product[] {
  const seen = new Set<string>()
  const out: Product[] = []
  for (const p of products) {
    if (seen.has(p.name)) continue
    seen.add(p.name)
    out.push(p)
    if (out.length >= limit) break
  }
  return out
}

/**
 * Compute smart suggestions from a mocked shopping history + the live cart.
 * - lowStock: staples not currently in the cart (simulates "you usually buy X")
 * - seasonal: in-season items not already in the cart
 * - onSale: discounted items not already in the cart
 */
export function getSuggestions(cart: CartItem[]): Suggestions {
  const inCart = new Set(cart.map((i) => i.name.toLowerCase()))

  const lowStock = STAPLES.filter((s) => !inCart.has(s.toLowerCase())).slice(0, 3)

  const seasonal = dedupeByName(
    PRODUCTS.filter((p) => p.inSeason && !p.outOfStock && !inCart.has(p.name.toLowerCase())),
    5,
  )

  const onSale = dedupeByName(
    PRODUCTS.filter((p) => p.onSale && !p.outOfStock && !inCart.has(p.name.toLowerCase())),
    5,
  )

  return { lowStock, seasonal, onSale }
}
