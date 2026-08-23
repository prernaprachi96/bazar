import { neon } from '@neondatabase/serverless'
import { randomBytes } from 'node:crypto'
import type { Order } from '@/lib/types'

function sql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

async function ensureTable() {
  const db = sql()
  await db`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      data JSONB NOT NULL,
      placed_at BIGINT NOT NULL
    )
  `
}

export async function saveOrder(order: Order) {
  await ensureTable()
  const db = sql()
  await db`
    INSERT INTO orders (id, user_email, data, placed_at)
    VALUES (${order.id}, ${order.userEmail.toLowerCase()}, ${JSON.stringify(order)}, ${order.placedAt})
  `
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  await ensureTable()
  const db = sql()
  const rows = await db`SELECT data FROM orders WHERE id = ${orderId}`
  if (!rows.length) return null
  const order: Order = { ...(rows[0].data as Order), status }
  await db`UPDATE orders SET data = ${JSON.stringify(order)} WHERE id = ${orderId}`
  return order
}

export async function getOrder(orderId: string): Promise<Order | null> {
  await ensureTable()
  const db = sql()
  const rows = await db`SELECT data FROM orders WHERE id = ${orderId}`
  return rows.length ? (rows[0].data as Order) : null
}

export async function getOrdersForUser(email: string): Promise<Order[]> {
  await ensureTable()
  const db = sql()
  const rows = await db`
    SELECT data FROM orders
    WHERE user_email = ${email.toLowerCase()}
    ORDER BY placed_at DESC
  `
  return rows.map((r) => r.data as Order)
}

const STATUS_LABEL: Record<Order['status'], string> = {
  confirmed: 'Order Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

export function buildOrderEmail(order: Order) {
  const itemRows = order.items
    .map((i) => `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px">×${i.quantity}</td><td style="padding:4px 8px">$${(i.price * i.quantity).toFixed(2)}</td></tr>`)
    .join('')
  const subject = `Your Petal order #${order.id} is confirmed`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Order confirmed 🎉</h2>
      <p>Hi ${order.address.fullName}, thanks for shopping with Petal!</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemRows}</table>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <p><strong>Delivering to:</strong><br/>
         ${order.address.line1}, ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
         Phone: ${order.address.phone}</p>
      <p><strong>Delivery slot:</strong> ${order.slot}</p>
      <p style="color:#888;font-size:12px">Order ID: ${order.id}</p>
    </div>
  `
  return { subject, html }
}

export async function sendOrderEmail(order: Order): Promise<{ sent: boolean; subject: string; html: string }> {
  const { subject, html } = buildOrderEmail(order)
  return deliverEmail(order.userEmail, subject, html)
}

export async function sendStatusUpdateEmail(order: Order): Promise<{ sent: boolean; subject: string; html: string }> {
  const subject = `Update on order #${order.id}: ${STATUS_LABEL[order.status]}`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>${STATUS_LABEL[order.status]}</h2>
      <p>Hi ${order.address.fullName}, your order <strong>#${order.id}</strong> is now <strong>${STATUS_LABEL[order.status]}</strong>.</p>
      <p><strong>Delivery slot:</strong> ${order.slot}</p>
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
        from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
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