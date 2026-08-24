'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { parseCommand } from '@/lib/nlp'
import {
  PRODUCTS,
  categoryForName,
  findProductByName,
  findSubstitutes,
} from '@/lib/products'
import type { CartItem, Intent, Product } from '@/lib/types'

const STORAGE_KEY = 'petal-shopping-cart'

export interface CommandResult {
  intent: Intent
  reply: string
  products?: Product[]
  toast?: { type: 'success' | 'error' | 'info'; message: string }
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function useShoppingStore() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  // Mirror of `cart` for synchronous reads inside command handlers.
  const cartRef = useRef<CartItem[]>([])

  const commit = useCallback((next: CartItem[]) => {
    cartRef.current = next
    setCart(next)
  }, [])

  useEffect(() => {
    const initial = loadCart()
    cartRef.current = initial
    setCart(initial)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [cart, hydrated])

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart])

  const addItem = useCallback(
    (name: string, quantity = 1): CommandResult => {
      const product = findProductByName(name)

      // ── CHANGED: reject items not found in the catalog ──
      if (!product) {
        return {
          intent: 'ADD_ITEM',
          reply: `Sorry, "${name}" is not available on BAZAR. Try searching for something else.`,
          toast: { type: 'error', message: `"${name}" not found in BAZAR` },
        }
      }

      // ── CHANGED: reject out-of-stock items instead of adding them ──
      if (product.outOfStock) {
        return {
          intent: 'ADD_ITEM',
          reply: `${product.name} is out of stock right now. Here are some alternatives you could try instead.`,
          products: findSubstitutes(product.name),
          toast: { type: 'info', message: `${product.name} is out of stock` },
        }
      }

      const displayName = product.name
      const category = product.category
      const price = product.price
      const unit = product.unit

      const prev = cartRef.current
      const idx = prev.findIndex((i) => i.name.toLowerCase() === displayName.toLowerCase())
      const existed = idx !== -1

      if (existed) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity, addedAt: Date.now() }
        commit(next)
      } else {
        commit([
          ...prev,
          {
            id: product.id,
            name: displayName,
            category,
            brand: product.brand,
            price,
            unit,
            quantity,
            addedAt: Date.now(),
          },
        ])
      }

      const qtyLabel = quantity > 1 ? `${quantity} × ` : ''
      return {
        intent: 'ADD_ITEM',
        reply: existed
          ? `Updated ${displayName} in your ${category} list.`
          : `Added ${qtyLabel}${displayName} to your ${category} list.`,
        toast: { type: 'success', message: `Added ${displayName}` },
      }
    },
    [commit],
  )

  const removeItem = useCallback(
    (name: string): CommandResult => {
      const prev = cartRef.current
      const found = prev.find((i) => i.name.toLowerCase().includes(name.toLowerCase()))
      if (!found) {
        return {
          intent: 'REMOVE_ITEM',
          reply: `I couldn't find "${titleCase(name)}" in your list.`,
          toast: { type: 'error', message: `"${titleCase(name)}" is not in your list` },
        }
      }
      commit(prev.filter((i) => i.id !== found.id))
      return {
        intent: 'REMOVE_ITEM',
        reply: `Removed ${found.name} from your list.`,
        toast: { type: 'success', message: `Removed ${found.name}` },
      }
    },
    [commit],
  )

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const prev = cartRef.current
      if (quantity <= 0) {
        commit(prev.filter((i) => i.id !== id))
        return
      }
      commit(prev.map((i) => (i.id === id ? { ...i, quantity, addedAt: Date.now() } : i)))
    },
    [commit],
  )

  const clearCart = useCallback((): CommandResult => {
    commit([])
    return {
      intent: 'CLEAR',
      reply: 'Cleared your whole shopping list.',
      toast: { type: 'info', message: 'List cleared' },
    }
  }, [commit])

  const searchProducts = useCallback(
    (query: string, opts?: { maxPrice?: number; minPrice?: number }): Product[] => {
      const q = query.trim().toLowerCase()
      const seen = new Set<string>()
      return PRODUCTS.filter((p) => {
        // Unavailable products never appear in search — only in-stock items are shown.
        if (p.outOfStock) return false
        if (q) {
          const hit =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tags.some((t) => t.includes(q) || q.includes(t))
          if (!hit) return false
        }
        if (opts?.maxPrice != null && p.price > opts.maxPrice) return false
        if (opts?.minPrice != null && p.price < opts.minPrice) return false
        return true
      })
        .sort((a, b) => a.price - b.price)
        .filter((p) => {
          const key = `${p.name}-${p.brand}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
    },
    [],
  )

  return {
    hydrated,
    cart,
    total,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    searchProducts,
    parseCommand,
  }
}
