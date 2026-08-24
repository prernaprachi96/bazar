'use client'

import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  title: string
  subtitle?: string
  products: Product[]
  onAdd: (name: string) => void
  emptyMessage?: string
  language: Language
}

export function ProductGrid({ title, subtitle, products, onAdd, emptyMessage }: ProductGridProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyMessage ?? 'No products found in this category yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              product={product}
              language={language}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </section>
  )
}
