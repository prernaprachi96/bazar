import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { Order } from '@/lib/types'

// Same file-based approach as lib/server/user-db.ts — real records on the
// server rather than only in the browser. See that file's note about
// swapping in a hosted database for production persistence.

function resolveDbPath(): string {
  const primary = path.join(process.cwd(), 'data', 'orders.json')
  try {
    mkdirSync(path.dirname(primary), { recursive: true })
    return primary
  } catch {
    return path.join('/tmp', 'petal-orders.json')
  }
}

const DB_PATH = resolveDbPath()

function readOrders(): Order[] {
  try {
    if (!existsSync(DB_PATH)) return []
    const raw = readFileSync(DB_PATH, 'utf8')
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  writeFileSync(DB_PATH, JSON.stringify(orders, null, 2), 'utf8')
}

export function saveOrder(order: Order) {
  const orders = readOrders()
  orders.push(order)
  writeOrders(orders)
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], status }
  writeOrders(orders)
  return orders[idx]
}

export function getOrder(orderId: string): Order | null {
  return readOrders().find((o) => o.id === orderId) ?? null
}

export function getOrdersForUser(email: string): Order[] {
  return readOrders()
    .filter((o) => o.userEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.placedAt - a.placedAt)
}

const STATUS_LABEL: Record<Order['status'], string> = {
  confirmed: 'Order Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

/**
 * Builds the delivery-confirmation email content (subject + HTML), the same
 * way BigBasket/Amazon confirmation emails work: order summary, items,
 * delivery address, and the delivery window.
 *
 * Sending: if a RESEND_API_KEY env var is set, this actually sends the email
 * via Resend (https://resend.com — free tier, one API key, no server setup).
 * Without a key, the email is generated and returned/logged so the UI can
 * show exactly what would be sent — nothing fails, it just isn't delivered.
 */
export function buildOrderEmail(order: Order) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px">×${i.quantity}</td><td style="padding:4px 8px">$${(i.price * i.quantity).toFixed(2)}</td></tr>`,
    )
    .join('')

  const subject = `Your Petal order #${order.id} is confirmed`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Order confirmed 🎉</h2>
      <p>Hi ${order.address.fullName}, thanks for shopping with Petal! Here's your order summary.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemRows}</table>
      <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}<br/>
         <strong>Delivery fee:</strong> $${order.deliveryFee.toFixed(2)}<br/>
         <strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Delivering to:</strong><br/>
         ${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
         Phone: ${order.address.phone}</p>
      <p><strong>Delivery slot:</strong> ${order.slot}</p>
      <p><strong>Payment method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      <p style="color:#888;font-size:12px">Order ID: ${order.id}</p>
    </div>
  `
  return { subject, html }
}

export async function sendOrderEmail(order: Order): Promise<{ sent: boolean; subject: string; html: string }> {
  const { subject, html } = buildOrderEmail(order)
  return deliverEmail(order.userEmail, subject, html)
}

/**
 * Builds + sends a short status-update email (e.g. "Out for delivery") —
 * the same pattern BigBasket/Amazon use: one email per meaningful status
 * change, not just at checkout.
 */
export async function sendStatusUpdateEmail(order: Order): Promise<{ sent: boolean; subject: string; html: string }> {
  const subject = `Update on order #${order.id}: ${STATUS_LABEL[order.status]}`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>${STATUS_LABEL[order.status]}</h2>
      <p>Hi ${order.address.fullName}, your order <strong>#${order.id}</strong> is now <strong>${STATUS_LABEL[order.status]}</strong>.</p>
      <p><strong>Delivery slot:</strong> ${order.slot}<br/>
         <strong>Delivering to:</strong> ${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.pincode}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p style="color:#888;font-size:12px">Order ID: ${order.id}</p>
    </div>
  `
  return deliverEmail(order.userEmail, subject, html)
}

async function deliverEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; subject: string; html: string }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`[mock email] would send "${subject}" to ${to}`)
    return { sent: false, subject, html }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'orders@petal.app',
        to,
        subject,
        html,
      }),
    })
    return { sent: res.ok, subject, html }
  } catch {
    return { sent: false, subject, html }
  }
}

export function newOrderId() {
  return `PTL-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`
}
