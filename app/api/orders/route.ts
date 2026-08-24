import { NextResponse } from 'next/server'
import { getOrdersForUser, newOrderId, saveOrder, sendOrderEmail } from '@/lib/server/order-db'
import type { CartItem, DeliveryAddress, Order, PaymentMethod } from '@/lib/types'

const DELIVERY_SLOTS = ['Today, 6–8 PM', 'Tomorrow, 8–10 AM', 'Tomorrow, 4–6 PM']

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Missing email.' }, { status: 400 })
    }

    const orders = await getOrdersForUser(email)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('[BAZAR] Failed to fetch orders:', error)

    return NextResponse.json(
      { error: 'Could not fetch orders. Please try again.' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { userEmail, items, address, paymentMethod, slot } = body as {
      userEmail?: string
      items?: CartItem[]
      address?: DeliveryAddress
      paymentMethod?: PaymentMethod
      slot?: string
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing user email. Please sign in before placing an order.' },
        { status: 400 },
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Add at least one item before checkout.' },
        { status: 400 },
      )
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Delivery address is missing.' },
        { status: 400 },
      )
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.pincode
    ) {
      return NextResponse.json(
        { error: 'Please complete your delivery address.' },
        { status: 400 },
      )
    }

    if (!paymentMethod || !['card', 'upi', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Please choose a valid payment method.' },
        { status: 400 },
      )
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

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
      slot:
        slot && DELIVERY_SLOTS.includes(slot)
          ? slot
          : DELIVERY_SLOTS[0],
      placedAt: Date.now(),
      status: 'confirmed',
    }

    await saveOrder(order)

    const email = await sendOrderEmail(order)

    return NextResponse.json({
      order,
      email,
    })
  } catch (error) {
    console.error('[BAZAR] Failed to place order:', error)

    return NextResponse.json(
      {
        error:
          'Could not place your order. Check your deployment logs for the exact server error.',
      },
      { status: 500 },
    )
  }
}
