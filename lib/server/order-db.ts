/**
 * order-db.ts — local file-based storage (no DATABASE_URL needed)
 * Orders are saved to a JSON file on disk during development.
 * In production (Vercel etc.) they are kept in memory for the session.
 */
import { randomBytes } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Order } from '@/lib/types'

// ── Storage helpers ──────────────────────────────────────────────────────────

const DATA_FILE = path.join(process.cwd(), '.orders.json')

function loadOrders(): Order[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(raw) as Order[]
    }
  } catch {
    // ignore corrupt file
  }
  return []
}

function saveOrders(orders: Order[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), 'utf-8')
  } catch {
    // fallback: keep in memory only
  }
}

// In-memory store (always used; file is secondary persistence)
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
