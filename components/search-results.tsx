'use client'

import { SearchX, X } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { Language, Product } from '@/lib/types'
import { ui } from '@/lib/ui-translations'

interface SearchResultsProps {
  query: string
  results: Product[]
  loading: boolean
  language: Language
  onAdd: (name: string) => void
  onClose: () => void
}

export function SearchResults({
  query,
  results,
  loading,
  language,
  onAdd,
  onClose,
}: SearchResultsProps) {
  const copy = ui(language)

  return (
    <section
      aria-label={copy.searchResults}
      className="rounded-3xl border border-border bg-card p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-card-foreground">
          {query ? `${copy.resultsFor} "${query}"` : copy.searchResults}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close search results"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-2xl bg-secondary"
            />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <SearchX
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />

          <p className="text-sm font-semibold text-card-foreground">
            {copy.noMatches}
          </p>

          <p className="text-xs text-muted-foreground">
            {copy.tryDifferentSearch}
          </p>
        </div>
      ) : (
        <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {results.map((product) => (
            <ProductCard
              key={product.id}
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
