'use client'

import { Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORY_COLOR } from '@/lib/products'
import type { CartItem, Category } from '@/lib/types'
import { localizeCategory, localizeProductName } from '@/lib/product-translations'
import type { CartItem, Category, Language } from '@/lib/types'

interface ShoppingListProps {
  cart: CartItem[]
  total: number
  hydrated: boolean
  language: Language
  onIncrement: (id: string, qty: number) => void
  onRemove: (name: string) => void
  onClear: () => void
}

const USD_TO_INR = 83

function toRupees(usd: number) {
  return `₹${(usd * USD_TO_INR).toFixed(0)}`
}

// Curated product images matched by product name.
const PRODUCT_IMAGES: Record<string, string> = {
  Milk: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=72&h=72&fit=crop&auto=format',
  'Almond Milk': 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=72&h=72&fit=crop&auto=format',
  'Oat Milk': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=72&h=72&fit=crop&auto=format',
  'Soy Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=72&h=72&fit=crop&auto=format',
  Butter: 'https://images.unsplash.com/photo-1589985270958-bf087b1b7a65?w=72&h=72&fit=crop&auto=format',
  'Cheddar Cheese': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=72&h=72&fit=crop&auto=format',
  'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=72&h=72&fit=crop&auto=format',
  Eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=72&h=72&fit=crop&auto=format',
  Apples: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=72&h=72&fit=crop&auto=format',
  Bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=72&h=72&fit=crop&auto=format',
  Oranges: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=72&h=72&fit=crop&auto=format',
  Strawberries: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=72&h=72&fit=crop&auto=format',
  Spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=72&h=72&fit=crop&auto=format',
  Tomatoes: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=72&h=72&fit=crop&auto=format',
  Carrots: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=72&h=72&fit=crop&auto=format',
  Avocado: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=72&h=72&fit=crop&auto=format',
  Bread: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=72&h=72&fit=crop&auto=format',
  Bagels: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=72&h=72&fit=crop&auto=format',
  Croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=72&h=72&fit=crop&auto=format',
  Tortillas: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=72&h=72&fit=crop&auto=format',
  Muffins: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=72&h=72&fit=crop&auto=format',
  Water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=72&h=72&fit=crop&auto=format',
  'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=72&h=72&fit=crop&auto=format',
  Coffee: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=72&h=72&fit=crop&auto=format',
  Tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=72&h=72&fit=crop&auto=format',
  Cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=72&h=72&fit=crop&auto=format',
  'Sparkling Water': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=72&h=72&fit=crop&auto=format',
  'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=72&h=72&fit=crop&auto=format',
  Chocolate: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=72&h=72&fit=crop&auto=format',
  Cookies: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=72&h=72&fit=crop&auto=format',
  Popcorn: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=72&h=72&fit=crop&auto=format',
  'Granola Bars': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=72&h=72&fit=crop&auto=format',
  Nuts: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=72&h=72&fit=crop&auto=format',
  'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=72&h=72&fit=crop&auto=format',
  'Ground Beef': 'https://images.unsplash.com/photo-1588347818036-c7a4a1d87d0e?w=72&h=72&fit=crop&auto=format',
  Salmon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=72&h=72&fit=crop&auto=format',
  Bacon: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=72&h=72&fit=crop&auto=format',
  Tofu: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=72&h=72&fit=crop&auto=format',
  'Frozen Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=72&h=72&fit=crop&auto=format',
  'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=72&h=72&fit=crop&auto=format',
  'Frozen Peas': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=72&h=72&fit=crop&auto=format',
  'Frozen Berries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=72&h=72&fit=crop&auto=format',
  Rice: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9fc99?w=72&h=72&fit=crop&auto=format',
  Pasta: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=72&h=72&fit=crop&auto=format',
  'Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=72&h=72&fit=crop&auto=format',
  Cereal: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=72&h=72&fit=crop&auto=format',
  'Peanut Butter': 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=72&h=72&fit=crop&auto=format',
  Flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=72&h=72&fit=crop&auto=format',
  Sugar: 'https://images.unsplash.com/photo-1581444093073-37c2d5b6fa79?w=72&h=72&fit=crop&auto=format',
  Toothpaste: 'https://images.unsplash.com/photo-1609275803894-b14ec6b82a35?w=72&h=72&fit=crop&auto=format',
  Shampoo: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=72&h=72&fit=crop&auto=format',
  Soap: 'https://images.unsplash.com/photo-1584473457493-17c4c24290a5?w=72&h=72&fit=crop&auto=format',
  Deodorant: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=72&h=72&fit=crop&auto=format',
  'Paper Towels': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=72&h=72&fit=crop&auto=format',
  'Toilet Paper': 'https://images.unsplash.com/photo-1583947582886-f1ec78b7e3f7?w=72&h=72&fit=crop&auto=format',
  'Dish Soap': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=72&h=72&fit=crop&auto=format',
  'Laundry Detergent': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=72&h=72&fit=crop&auto=format',
  'Trash Bags': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=72&h=72&fit=crop&auto=format',
}

function getImageUrl(name: string) {
  return (
    PRODUCT_IMAGES[name] ??
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=72&h=72&fit=crop&auto=format'
  )
}

export function ShoppingList({
  cart,
  total,
  hydrated,
  language,
  onIncrement,
  onRemove,
  onClear,
}: ShoppingListProps) {
  const grouped = useMemo(() => {
    const map = new Map<Category, CartItem[]>()

    for (const item of cart) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }

    return Array.from(map.entries())
  }, [cart])

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <section
      aria-label="Shopping list"
      className="flex flex-col rounded-3xl border border-border bg-card p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ShoppingBasket className="size-4" aria-hidden="true" />
          </span>

          <div>
            <h2 className="font-display text-sm font-bold text-card-foreground">My List</h2>
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center">
          <ShoppingBasket className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-semibold text-card-foreground">Your list is empty</p>
          <p className="max-w-[15rem] text-xs text-muted-foreground">
            Try saying &quot;Add milk&quot; or tap a suggestion below to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([category, items]) => (
            <div key={localizeCategory(category, language)}>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLOR[category] }}
                  aria-hidden="true"
                />
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {localizeCategory(category, language)}
                </h3>
              </div>

              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 p-2.5"
                  >
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
                      <img
                        src={getImageUrl(item.name)}
                        alt={localizeProductName(item.name, language)}
                        width={36}
                        height={36}
                        className="size-9 object-cover"
                        onError={(event) => {
                          const image = event.currentTarget
                          image.style.display = 'none'
                          image.nextElementSibling?.classList.remove('hidden')
                          image.nextElementSibling?.classList.add('flex')
                        }}
                      />

                      <span
                        className="absolute inset-0 hidden size-9 items-center justify-center text-xs font-bold text-primary-foreground"
                        style={{ backgroundColor: CATEGORY_COLOR[item.category] }}
                        aria-hidden="true"
                      >
                        {item.name.charAt(0)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-card-foreground">{localizeProductName(item.name, language)}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.price > 0
                          ? `${toRupees(item.price)} / ${item.unit}`
                          : `per ${item.unit}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
                      <button
                        type="button"
                        onClick={() => onIncrement(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${localizeProductName(item.name, language)}`}
                        className="flex size-6 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-card"
                      >
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>

                      <span className="w-5 text-center text-sm font-bold text-card-foreground">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onIncrement(item.id, item.quantity + 1)}
                        aria-label={`Increase ${localizeProductName(item.name, language)}`}
                        className="flex size-6 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-card"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.name)}
ari                   aria-label={`Remove ${item.name}`}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-muted-foreground">Estimated total</span>
            <span className="font-display text-lg font-bold text-card-foreground">
              {toRupees(total)}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
