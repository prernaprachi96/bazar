'use client'

import { Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { CATEGORY_COLOR } from '@/lib/products'
import type { CartItem, Category } from '@/lib/types'

interface ShoppingListProps {
  cart: CartItem[]
  total: number
  hydrated: boolean
  onIncrement: (id: string, qty: number) => void
  onRemove: (name: string) => void
  onClear: () => void
}

// CHANGED: ₹ symbol + 83x conversion rate (1 USD ≈ 83 INR)
const USD_TO_INR = 83
function toRupees(usd: number) {
  return `₹${(usd * USD_TO_INR).toFixed(0)}`
}

// CHANGED: Unsplash image per item name
function getImageUrl(name: string) {
  return `https://source.unsplash.com/40x40/?${encodeURIComponent(name.toLowerCase())},food,grocery`
}

export function ShoppingList({ cart, total, hydrated, onIncrement, onRemove, onClear }: ShoppingListProps) {
  const grouped = useMemo(() => {
    const map = new Map<Category, CartItem[]>()
    for (const item of cart) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    return Array.from(map.entries())
  }, [cart])

  const itemCount = cart.reduce((n, i) => n + i.quantity, 0)

  return (
    <section aria-label="Shopping list" className="flex flex-col rounded-3xl border border-border bg-card p-4">
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
            <Trash2 className="size-3.5" aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-secondary" />
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
            <div key={category}>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLOR[category] }}
                  aria-hidden="true"
                />
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{category}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 p-2.5"
                  >
                    {/* CHANGED: item image added */}
                    <div className="relative shrink-0 size-9 rounded-full overflow-hidden bg-secondary">
                      <Image
                        src={getImageUrl(item.name)}
                        alt={item.name}
                        width={36}
                        height={36}
                        className="object-cover w-full h-full"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-card-foreground">{item.name}</p>
                      {/* CHANGED: $ → ₹ */}
                      <p className="text-xs text-muted-foreground">
                        {item.price > 0 ? `${toRupees(item.price)} / ${item.unit}` : `per ${item.unit}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-secondary p-0.5">
                      <button
                        type="button"
                        onClick={() => onIncrement(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.name}`}
                        className="flex size-6 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-card"
                      >
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-card-foreground">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.name}`}
                        className="flex size-6 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-card"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.name)}
                      aria-label={`Remove ${item.name}`}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CHANGED: $ → ₹ on total */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-muted-foreground">Estimated total</span>
            <span className="font-display text-lg font-bold text-card-foreground">{toRupees(total)}</span>
          </div>
        </div>
      )}
    </section>
  )
}
