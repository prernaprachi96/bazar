import { NextResponse } from 'next/server'
import { newOrderId, saveOrder, sendOrderEmail } from '@/lib/server/order-db'
import type { CartItem, DeliveryAddress, Order, PaymentMethod } from '@/lib/types'

const DELIVERY_SLOTS = ['Today, 6–8 PM', 'Tomorrow, 8–10 AM', 'Tomorrow, 4–6 PM']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userEmail, items, address, paymentMethod, slot } = body as {
      userEmail: string
      items: CartItem[]
      address: DeliveryAddress
      paymentMethod: PaymentMethod
      slot?: string
    }

    if (!userEmail || !Array.isArray(items) || items.length === 0 || !address) {
      return NextResponse.json({ error: 'Missing order details.' }, { status: 400 })
    }
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.pincode) {
      return NextResponse.json({ error: 'Please complete the delivery address.' }, { status: 400 })
    }
    if (!['card', 'upi', 'cod'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Please choose a payment method.' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const deliveryFee = subtotal >= 35 ? 0 : 4.99
    const total = subtotal + deliveryFee

    const order: Order = {
      id: newOrderId(),
      userEmail,
      items,
      subtotal,
      deliveryFee,
      total,
      address,
      paymentMethod,
      slot: slot && DELIVERY_SLOTS.includes(slot) ? slot : DELIVERY_SLOTS[0],
      placedAt: Date.now(),
      status: 'confirmed',
    }

    saveOrder(order)
    const email = await sendOrderEmail(order)

    return NextResponse.json({ order, email })
  } catch {
    return NextResponse.json({ error: 'Could not place your order. Please try again.' }, { status: 500 })
  }
}
