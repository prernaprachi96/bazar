'use client'

import { Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_COLOR } from '@/lib/products'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAdd: (name: string) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
        style={{ backgroundColor: CATEGORY_COLOR[product.category] }}
        aria-hidden="true"
      >
        {product.name.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-card-foreground">{product.name}</p>
          {product.onSale && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
              <Tag className="size-2.5" aria-hidden="true" /> Sale
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {product.brand} · {product.category} · per {product.unit}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-display text-sm font-bold text-card-foreground">
          ${product.price.toFixed(2)}
        </span>
        <Button
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => onAdd(product.name)}
          aria-label={`Add ${product.name} to list`}
        >
          <Plus className="size-3.5" aria-hidden="true" /> Add
        </Button>
      </div>
    </div>
  )
}
