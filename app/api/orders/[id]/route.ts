import { NextResponse } from 'next/server'
import { getOrder, updateOrderStatus, sendStatusUpdateEmail } from '@/lib/server/order-db'
import type { OrderStatus } from '@/lib/types'

const VALID: OrderStatus[] = ['confirmed', 'packed', 'out_for_delivery', 'delivered']

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = (await req.json()) as { status: OrderStatus }
    if (!VALID.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }
    const order = updateOrderStatus(id, status)
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })

    const email = await sendStatusUpdateEmail(order)
    return NextResponse.json({ order, email })
  } catch {
    return NextResponse.json({ error: 'Could not update the order.' }, { status: 500 })
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = getOrder(id)
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  return NextResponse.json({ order })
}
