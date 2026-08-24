import { neon } from '@neondatabase/serverless'
import { PRODUCTS } from '@/lib/products'
import type { CartItem, Product } from '@/lib/types'

export async function getBuyAgainRecommendations(
  userEmail: string,
  cart: CartItem[],
): Promise<Product[]> {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return []
  }

  const sql = neon(databaseUrl)

  const rows = await sql`
    SELECT items
    FROM orders
    WHERE LOWER(user_email) = LOWER(${userEmail})
    ORDER BY placed_at DESC
    LIMIT 10
  `

  const purchaseCounts = new Map<string, number>()
  const cartItemNames = new Set(cart.map((item) => item.name.toLowerCase()))

  for (const row of rows) {
    const items = typeof row.items === 'string'
      ? JSON.parse(row.items)
      : row.items

    for (const item of items as CartItem[]) {
      const name = item.name.toLowerCase()

      if (!cartItemNames.has(name)) {
        purchaseCounts.set(name, (purchaseCounts.get(name) ?? 0) + item.quantity)
      }
    }
  }

  return PRODUCTS
    .filter((product) => !product.outOfStock)
    .filter((product) => purchaseCounts.has(product.name.toLowerCase()))
    .sort(
      (first, second) =>
        (purchaseCounts.get(second.name.toLowerCase()) ?? 0) -
        (purchaseCounts.get(first.name.toLowerCase()) ?? 0),
    )
    .slice(0, 5)
}
