'use client'

import { CATEGORY_COLOR, CATEGORIES } from '@/lib/products'
import type { Category, Language } from '@/lib/types'
import { localizeCategory } from '@/lib/product-translations'
import { ui } from '@/lib/ui-translations'

interface CategoryRailProps {
  active: Category | 'All'
  language: Language
  onSelect: (category: Category | 'All') => void
}

export function CategoryRail({
  active,
  language,
  onSelect,
}: CategoryRailProps) {
  const items: (Category | 'All')[] = ['All', ...CATEGORIES]

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
      {items.map((item) => {
        const isActive = item === active
        const color = item === 'All' ? undefined : CATEGORY_COLOR[item]

        return (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
            style={!isActive && color ? { borderColor: color } : undefined}
          >
            {item === 'All' ? ui(language).all : localizeCategory(item, language)}
          </button>
        )
      })}
    </div>
  )
}
