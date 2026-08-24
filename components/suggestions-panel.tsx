'use client'

import { Bell, Leaf, Plus, Tag } from 'lucide-react'
import { useMemo } from 'react'
import { getSuggestions } from '@/lib/suggestions'
import type { CartItem, Product, Language } from '@/lib/types'
import { localizeProductName } from '@/lib/product-translations'
import { ui } from '@/lib/ui-translations'

interface SuggestionsPanelProps {
  cart: CartItem[]
  onAdd: (name: string) => void
  language: Language
}

export function SuggestionsPanel({
  cart,
  onAdd,
  language,
}: SuggestionsPanelProps) {
  const copy = ui(language)

  const { lowStock, seasonal, onSale } = useMemo(
    () => getSuggestions(cart),
    [cart],
  )

  return (
    <section
      aria-label={copy.smartSuggestions}
      className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bell className="size-4" aria-hidden="true" />
        </span>

        <h2 className="font-display text-sm font-bold text-card-foreground">
          {copy.smartSuggestions}
        </h2>
      </div>

      {lowStock.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            {copy.runningLow}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {lowStock.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onAdd(name)}
                className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="size-3" aria-hidden="true" />
                {localizeProductName(name, language)}
              </button>
            ))}
          </div>
        </div>
      )}

      <SuggestionRow
        icon={<Leaf className="size-3.5" aria-hidden="true" />}
        title={copy.inSeason}
        products={seasonal}
        onAdd={onAdd}
        language={language}
      />

      <SuggestionRow
        icon={<Tag className="size-3.5" aria-hidden="true" />}
        title={copy.onSale}
        products={onSale}
        onAdd={onAdd}
        language={language}
      />
    </section>
  )
}

function SuggestionRow({
  icon,
  title,
  products,
  onAdd,
  language,
}: {
  icon: React.ReactNode
  title: string
  products: Product[]
  onAdd: (name: string) => void
  language: Language
}) {
  if (products.length === 0) return null

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {icon} {title}
      </p>

      <div className="flex snap-x gap-2 overflow-x-auto pb-1">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onAdd(p.name)}
            className="group flex w-28 shrink-0 snap-start flex-col gap-1 rounded-2xl border border-border bg-background/50 p-3 text-left transition-colors hover:border-primary"
          >
            <span className="truncate text-sm font-bold text-card-foreground">
              {localizeProductName(p.name, language)}
            </span>

            <span className="text-xs text-muted-foreground">
              ₹{(p.price * 83).toFixed(0)}
            </span>

            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Plus className="size-3" aria-hidden="true" />
              {ui(language).add}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
