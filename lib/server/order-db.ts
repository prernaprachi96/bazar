/**
 * order-db.ts — in-memory storage with optional file persistence.
 * On Vercel (read-only filesystem) all orders are kept in memory per session.
 * In local dev, orders are also written to .orders.json for persistence.
 */
import { randomBytes } from 'node:crypto'
import type { Order } from '@/lib/types'

// ── Storage helpers ──────────────────────────────────────────────────────────

// Detect if we are running in a writable local environment (not Vercel/lambda)
const IS_LOCAL = process.env.NODE_ENV === 'development' && !process.env.VERCEL

// Lazy-load fs only in local dev — avoids any import-time crash in serverless
function loadOrders(): Order[] {
  if (!IS_LOCAL) return []
  try {
    // Dynamic require so bundler/Vercel never tries to resolve fs at build time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('node:fs') as typeof import('node:fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('node:path') as typeof import('node:path')
    const file = path.join(process.cwd(), '.orders.json')
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8')) as Order[]
    }
  } catch {
    // corrupt file or env mismatch — silently fall through
  }
  return []
}

function saveOrders(orders: Order[]) {
  if (!IS_LOCAL) return // no-op on Vercel
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('node:fs') as typeof import('node:fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('node:path') as typeof import('node:path')
    fs.writeFileSync(path.join(process.cwd(), '.orders.json'), JSON.stringify(orders, null, 2), 'utf-8')
  } catch {
    // keep in memory only
  }
}

// In-memory store — primary storage everywhere, secondary persistence in dev
let memOrders: Order[] = loadOrders()

// ── Public API ───────────────────────────────────────────────────────────────

export async function saveOrder(order: Order) {
  memOrders = memOrders.filter((o) => o.id !== order.id)
  memOrders.unshift(order)
  saveOrders(memOrders)
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  const idx = memOrders.findIndex((o) => o.id === orderId)
  if (idx === -1) return null
  memOrders[idx] = { ...memOrders[idx], status }
  saveOrders(memOrders)
  return memOrders[idx]
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return memOrders.find((o) => o.id === orderId) ?? null
}

export async function getOrdersForUser(email: string): Promise<Order[]> {
  return memOrders
    .filter((o) => o.userEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.placedAt - a.placedAt)
}

// ── Email (mock — logs to terminal, no API key needed) ───────────────────────

const STATUS_LABEL: Record<Order['status'], string> = {
  confirmed: 'Order Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

export function buildOrderEmail(order: Order) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px">×${i.quantity}</td><td style="padding:4px 8px">$${(i.price * i.quantity).toFixed(2)}</td></tr>`,
    )
    .join('')
  const subject = `Your BAZAR order #${order.id} is confirmed`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Order confirmed 🎉</h2>
      <p>Hi ${order.address.fullName}, thanks for shopping with BAZAR!</p>
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
  // Log to terminal instead of sending a real email
  console.log(`\n[BAZAR] Order email (mock)`)
  console.log(`  To:      ${order.userEmail}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Items:   ${order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}`)
  console.log(`  Total:   $${order.total.toFixed(2)}\n`)
  return { sent: false, subject, html }
}

export async function sendStatusUpdateEmail(order: Order): Promise<{ sent: boolean; subject: string; html: string }> {
  const subject = `Update on order #${order.id}: ${STATUS_LABEL[order.status]}`
  console.log(`\n[BAZAR] Status email (mock): ${subject}\n`)
  const html = `<p>${STATUS_LABEL[order.status]}</p>`
  return { sent: false, subject, html }
}

export function newOrderId() {
  return `BZR-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`
}
