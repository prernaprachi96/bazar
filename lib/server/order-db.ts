import { neon } from '@neondatabase/serverless'
import { randomBytes } from 'node:crypto'
import type { Order, OrderStatus } from '@/lib/types'

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is missing. Add your Neon database URL to .env.local for local development and Vercel Environment Variables for deployment.',
    )
  }

  return neon(databaseUrl)
}

export async function saveOrder(order: Order) {
  const sql = getDatabase()

  await sql`
    INSERT INTO orders (
      id,
      user_email,
      items,
      subtotal,
      delivery_fee,
      total,
      address,
      payment_method,
      slot,
      placed_at,
      status
    )
    VALUES (
      ${order.id},
      ${order.userEmail},
      ${JSON.stringify(order.items)},
      ${order.subtotal},
      ${order.deliveryFee},
      ${order.total},
      ${JSON.stringify(order.address)},
      ${order.paymentMethod},
      ${order.slot},
      ${order.placedAt},
      ${order.status}
    )
    ON CONFLICT (id)
    DO UPDATE SET
      items = EXCLUDED.items,
      subtotal = EXCLUDED.subtotal,
      delivery_fee = EXCLUDED.delivery_fee,
      total = EXCLUDED.total,
      address = EXCLUDED.address,
      payment_method = EXCLUDED.payment_method,
      slot = EXCLUDED.slot,
      placed_at = EXCLUDED.placed_at,
      status = EXCLUDED.status
  `
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const sql = getDatabase()

  const rows = await sql`
    SELECT
      id,
      user_email,
      items,
      subtotal,
      delivery_fee,
      total,
      address,
      payment_method,
      slot,
      placed_at,
      status
    FROM orders
    WHERE id = ${orderId}
    LIMIT 1
  `

  return rows.length > 0 ? mapOrder(rows[0]) : null
}

export async function getOrdersForUser(userEmail: string): Promise<Order[]> {
  const sql = getDatabase()

  const rows = await sql`
    SELECT
      id,
      user_email,
      items,
      subtotal,
      delivery_fee,
      total,
      address,
      payment_method,
      slot,
      placed_at,
      status
    FROM orders
    WHERE LOWER(user_email) = LOWER(${userEmail})
    ORDER BY placed_at DESC
  `

  return rows.map(mapOrder)
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order | null> {
  const sql = getDatabase()

  const rows = await sql`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${orderId}
    RETURNING
      id,
      user_email,
      items,
      subtotal,
      delivery_fee,
      total,
      address,
      payment_method,
      slot,
      placed_at,
      status
  `

  return rows.length > 0 ? mapOrder(rows[0]) : null
}

export function newOrderId() {
  return `BZR-${Date.now().toString(36).toUpperCase()}-${randomBytes(2)
    .toString('hex')
    .toUpperCase()}`
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    userEmail: String(row.user_email),
    items: parseJson(row.items),
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    address: parseJson(row.address),
    paymentMethod: String(row.payment_method) as Order['paymentMethod'],
    slot: String(row.slot),
    placedAt: Number(row.placed_at),
    status: String(row.status) as OrderStatus,
  }
}

function parseJson<T>(value: unknown): T {
  if (typeof value === 'string') {
    return JSON.parse(value) as T
  }

  return value as T
}

export function buildOrderEmail(order: Order) {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 8px">${item.name}</td><td style="padding:4px 8px">×${item.quantity}</td><td style="padding:4px 8px">₹${Math.round(item.price * item.quantity * 83)}</td></tr>`,
    )
    .join('')

  const subject = `Your BAZAR order #${order.id} is confirmed`

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Order confirmed 🎉</h2>
      <p>Hi ${order.address.fullName}, thanks for shopping with BAZAR!</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${itemRows}
      </table>
      <p><strong>Total:</strong> ₹${Math.round(order.total * 83)}</p>
      <p><strong>Delivery slot:</strong> ${order.slot}</p>
      <p style="color:#888;font-size:12px">Order ID: ${order.id}</p>
    </div>
  `

  return { subject, html }
}

export async function sendOrderEmail(order: Order) {
  const { subject, html } = buildOrderEmail(order)

  console.log(`\n[BAZAR] Order email preview`)
  console.log(`To: ${order.userEmail}`)
  console.log(`Subject: ${subject}`)
  console.log(`Order: ${order.id}\n`)

  return {
    sent: false,
    subject,
    html,
  }
}

export async function sendStatusUpdateEmail(order: Order) {
  const subject = `Update on order #${order.id}: ${order.status}`

  console.log(`\n[BAZAR] Order status email preview`)
  console.log(`To: ${order.userEmail}`)
  console.log(`Subject: ${subject}\n`)

  return {
    sent: false,
    subject,
    html: `<p>${subject}</p>`,
  }
}
