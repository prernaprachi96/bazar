'use client'

import { Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_COLOR } from '@/lib/products'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAdd: (name: string) => void
}

// CHANGED: ₹ conversion
const USD_TO_INR = 83
function toRupees(usd: number) {
  return `₹${(usd * USD_TO_INR).toFixed(0)}`
}

// CHANGED: use Picsum with a deterministic seed from item name
// Picsum is always available, no API key needed, never deprecated
function getImageUrl(name: string): string {
  // Create a stable number from the name string
  let seed = 0
  for (let i = 0; i < name.length; i++) {
    seed = (seed * 31 + name.charCodeAt(i)) % 1000
  }
  return `https://picsum.photos/seed/${seed}/40/40`
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-3 ${
        product.outOfStock ? 'opacity-60' : ''
      }`}
    >
      {/* CHANGED: item image using Picsum (always works) */}
      <div className="relative shrink-0 size-10 rounded-full overflow-hidden bg-secondary">
        <img
          src={getImageUrl(product.name)}
          alt={product.name}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        {/* Fallback initial circle */}
        <span
          className="hidden absolute inset-0 size-10 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
          style={{ backgroundColor: CATEGORY_COLOR[product.category] }}
          aria-hidden="true"
        >
          {product.name.slice(0, 1)}
        </span>
      </div>

      {/* Name + badges */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-card-foreground">{product.name}</p>

          {product.outOfStock && (
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
              Out of Stock
            </span>
          )}

          {product.onSale && !product.outOfStock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
              <Tag className="size-2.5" aria-hidden="true" /> Sale
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {product.brand} · {product.category} · per {product.unit}
        </p>
      </div>

      {/* CHANGED: price in ₹ */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-display text-sm font-bold text-card-foreground">
          {toRupees(product.price)}
        </span>
        <Button
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => onAdd(product.name)}
          disabled={product.outOfStock}
          aria-label={product.outOfStock ? `${product.name} is out of stock` : `Add ${product.name} to list`}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          {product.outOfStock ? 'Unavailable' : 'Add'}
        </Button>
      </div>
    </div>
  )
}
