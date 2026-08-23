'use client'

import { CheckCircle2, ChevronRight, Mail, Package, PackageCheck, Truck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/toast'
import type { Order, OrderStatus } from '@/lib/types'

interface OrderHistoryProps {
  userEmail: string
  onClose: () => void
}

const STATUS_FLOW: OrderStatus[] = ['confirmed', 'packed', 'out_for_delivery', 'delivered']

const STATUS_META: Record<OrderStatus, { label: string; icon: React.ReactNode }> = {
  confirmed: { label: 'Order Confirmed', icon: <CheckCircle2 className="size-4" aria-hidden="true" /> },
  packed: { label: 'Packed', icon: <Package className="size-4" aria-hidden="true" /> },
  out_for_delivery: { label: 'Out for Delivery', icon: <Truck className="size-4" aria-hidden="true" /> },
  delivered: { label: 'Delivered', icon: <PackageCheck className="size-4" aria-hidden="true" /> },
}

export function OrderHistory({ userEmail, onClose }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { notify } = useToast()

  useEffect(() => {
    let cancelled = false
    fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setOrders(data.orders ?? [])
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
    return () => {
      cancelled = true
    }
  }, [userEmail])

  const advanceStatus = async (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status)
    const next = STATUS_FLOW[idx + 1]
    if (!next) return
    setUpdatingId(order.id)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      const data = await res.json()
      if (!res.ok) {
        notify('error', data.error ?? 'Could not update order.')
        return
      }
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? data.order : o)) ?? prev)
      notify(
        data.email?.sent ? 'success' : 'info',
        data.email?.sent
          ? `Email sent: "${STATUS_META[next].label}"`
          : `Status updated to "${STATUS_META[next].label}" (email logged, no provider configured)`,
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" role="dialog" aria-label="Order history">
      <div className="flex h-dvh w-full max-w-md flex-col overflow-y-auto bg-background p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">My Orders</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            aria-label="Close order history"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {orders === null && (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-secondary" />
            ))}
          </div>
        )}

        {orders !== null && orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
            No orders yet — once you check out, they'll show up here.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {orders?.map((order) => {
            const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]
            return (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-card-foreground">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.placedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                <p className="mb-2 truncate text-xs text-muted-foreground">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                </p>

                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
                  {STATUS_META[order.status].icon}
                  {STATUS_META[order.status].label}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail className="size-3 shrink-0" aria-hidden="true" /> Updates emailed to {order.userEmail}
                  </span>
                  {nextStatus && (
                    <button
                      type="button"
                      onClick={() => advanceStatus(order)}
                      disabled={updatingId === order.id}
                      className="flex shrink-0 items-center gap-1 rounded-full border border-primary px-2.5 py-1 text-[11px] font-semibold text-primary disabled:opacity-50"
                    >
                      {updatingId === order.id ? 'Updating…' : `Mark ${STATUS_META[nextStatus].label}`}
                      <ChevronRight className="size-3" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
