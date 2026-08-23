export type Category =
  | 'Dairy'
  | 'Produce'
  | 'Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Household'
  | 'Meat & Seafood'
  | 'Frozen'
  | 'Pantry'
  | 'Personal Care'

export interface Product {
  id: string
  name: string
  category: Category
  brand: string
  price: number
  unit: string
  inSeason: boolean
  onSale: boolean
  outOfStock: boolean
  tags: string[]
}

export interface CartItem {
  id: string
  name: string
  category: Category
  brand: string
  price: number
  unit: string
  quantity: number
  /** epoch ms when last added/updated — used for the low-stock nudge */
  addedAt: number
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  /** optional product cards attached to an assistant message */
  products?: Product[]
}

export type Intent =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'SEARCH_ITEM'
  | 'SET_QUANTITY'
  | 'FILTER_PRICE'
  | 'SUGGEST'
  | 'CLEAR'
  | 'UNKNOWN'

export interface ParsedCommand {
  intent: Intent
  item?: string
  quantity?: number
  maxPrice?: number
  minPrice?: number
  brand?: string
  /** the raw transcript that produced this command */
  raw: string
}

export type Language = 'en-US' | 'hi-IN' | 'es-ES'

export interface DeliveryAddress {
  fullName: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
}

export type PaymentMethod = 'card' | 'upi' | 'cod'

export interface Order {
  id: string
  userEmail: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  slot: string
  placedAt: number
  status: OrderStatus
}

export type OrderStatus = 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered'
