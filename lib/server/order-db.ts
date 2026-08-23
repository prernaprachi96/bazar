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

export function getOrdersForUser(email: string): Order[] {
  return readOrders()
    .filter((o) => o.userEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.placedAt - a.placedAt)
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
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // No email provider configured — just log it so it's visible in server logs.
    console.log(`[mock email] would send "${subject}" to ${order.userEmail}`)
    return { sent: false, subject, html }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'orders@petal.app',
        to: order.userEmail,
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
