'use client'

import { Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_COLOR } from '@/lib/products'
import type { Product } from '@/lib/types'
import { localizeCategory, localizeProductName } from '@/lib/product-translations'
import type { Language } from '@/lib/types'

interface ProductCardProps {
  product: Product
  language: Language
  onAdd: (name: string) => void
}

// CHANGED: ₹ conversion
const USD_TO_INR = 83
function toRupees(usd: number) {
  return `₹${(usd * USD_TO_INR).toFixed(0)}`
}

// Use a curated map of food product images from Unsplash (keyword-based, always relevant)
const PRODUCT_IMAGES: Record<string, string> = {
  'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&auto=format',
  'Almond Milk': 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=80&h=80&fit=crop&auto=format',
  'Oat Milk': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=80&fit=crop&auto=format',
  'Soy Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop&auto=format',
  'Butter': 'https://images.unsplash.com/photo-1589985270958-bf087b1b7a65?w=80&h=80&fit=crop&auto=format',
  'Cheddar Cheese': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&auto=format',
  'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop&auto=format',
  'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&h=80&fit=crop&auto=format',
  'Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop&auto=format',
  'Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&auto=format',
  'Oranges': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=80&h=80&fit=crop&auto=format',
  'Strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop&auto=format',
  'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop&auto=format',
  'Tomatoes': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=80&h=80&fit=crop&auto=format',
  'Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&h=80&fit=crop&auto=format',
  'Avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop&auto=format',
  'Bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=80&h=80&fit=crop&auto=format',
  'Bagels': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&auto=format',
  'Croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=80&h=80&fit=crop&auto=format',
  'Tortillas': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop&auto=format',
  'Muffins': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop&auto=format',
  'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&h=80&fit=crop&auto=format',
  'Orange Juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&h=80&fit=crop&auto=format',
  'Coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&h=80&fit=crop&auto=format',
  'Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=80&h=80&fit=crop&auto=format',
  'Cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=80&h=80&fit=crop&auto=format',
  'Sparkling Water': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=80&h=80&fit=crop&auto=format',
  'Potato Chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=80&h=80&fit=crop&auto=format',
  'Chocolate': 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=80&h=80&fit=crop&auto=format',
  'Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=80&h=80&fit=crop&auto=format',
  'Popcorn': 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=80&h=80&fit=crop&auto=format',
  'Granola Bars': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=80&h=80&fit=crop&auto=format',
  'Nuts': 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=80&h=80&fit=crop&auto=format',
  'Paper Towels': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=80&h=80&fit=crop&auto=format',
  'Toilet Paper': 'https://images.unsplash.com/photo-1583947582886-f1ec78b7e3f7?w=80&h=80&fit=crop&auto=format',
  'Dish Soap': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=80&h=80&fit=crop&auto=format',
  'Laundry Detergent': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=80&h=80&fit=crop&auto=format',
  'Trash Bags': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=80&h=80&fit=crop&auto=format',
  'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=80&h=80&fit=crop&auto=format',
  'Ground Beef': 'https://images.unsplash.com/photo-1588347818036-c7a4a1d87d0e?w=80&h=80&fit=crop&auto=format',
  'Salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=80&h=80&fit=crop&auto=format',
  'Bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=80&h=80&fit=crop&auto=format',
  'Tofu': 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=80&h=80&fit=crop&auto=format',
  'Frozen Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop&auto=format',
  'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop&auto=format',
  'Frozen Peas': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop&auto=format',
  'Frozen Berries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=80&h=80&fit=crop&auto=format',
  'Rice': 'https://images.unsplash.com/photo-1536304993881-ff86e0c9fc99?w=80&h=80&fit=crop&auto=format',
  'Pasta': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=80&h=80&fit=crop&auto=format',
  'Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&h=80&fit=crop&auto=format',
  'Cereal': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=80&h=80&fit=crop&auto=format',
  'Peanut Butter': 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=80&h=80&fit=crop&auto=format',
  'Flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&h=80&fit=crop&auto=format',
  'Sugar': 'https://images.unsplash.com/photo-1581444093073-37c2d5b6fa79?w=80&h=80&fit=crop&auto=format',
  'Toothpaste': 'https://images.unsplash.com/photo-1609275803894-b14ec6b82a35?w=80&h=80&fit=crop&auto=format',
  'Shampoo': 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=80&h=80&fit=crop&auto=format',
  'Soap': 'https://images.unsplash.com/photo-1584473457493-17c4c24290a5?w=80&h=80&fit=crop&auto=format',
  'Deodorant': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=80&h=80&fit=crop&auto=format',
}

function getImageUrl(name: string): string {
  return PRODUCT_IMAGES[name] ?? `https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&auto=format`
}

export function ProductCard({
  product,
  language,
  onAdd,
}: ProductCardProps) {
  const productName = localizeProductName(product.name, language)
  const categoryName = localizeCategory(product.category, language)
  
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
          alt={productName}
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
          <p className="truncate font-semibold text-card-foreground">{productName}</p>

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
          {product.brand} · {categoryName} · {product.unit}
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
          aria-label={product.outOfStock ? `${productName} is out of stock` : `Add ${productName} to list`}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          {product.outOfStock ? 'Unavailable' : 'Add'}
        </Button>
      </div>
    </div>
  )
}
