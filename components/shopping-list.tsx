'use client'

import { Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import { useMemo } from 'react'
import { CATEGORY_COLOR } from '@/lib/products'
import type { CartItem, Category, Language } from '@/lib/types'
import {
  localizeCategory,
  localizeProductName,
  localizeProductUnit,
} from '@/lib/product-translations'
import { productImageDataUri } from '@/lib/product-visuals'

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
  return productImageDataUri(name)
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

  const itemCount = cart.reduce(
    (count, item) => count + item.quantity,
    0,
  )

  // Keep the rest of your existing JSX here unchanged.
}
