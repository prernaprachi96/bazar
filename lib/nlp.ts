import type { ParsedCommand } from './types'

/**
 * Rule-based NLP layer (no external API, works offline).
 *
 * Approach: normalize the transcript, detect an intent from verb keywords
 * (supporting English, Hindi-transliteration, and Spanish), then extract the
 * item noun, quantity, and any price filter via regex. Chosen for zero cost,
 * instant response, and predictable behavior within an 8-hour build.
 */

// Verb keyword banks per intent, across languages.
const ADD_WORDS = ['add', 'need', 'want', 'buy', 'get', 'put', 'include', 'i need', 'i want', 'add to', 'agregar', 'comprar', 'necesito', 'quiero', 'jodo', 'chahiye', 'khareedo', 'lena hai']
const REMOVE_WORDS = ['remove', 'delete', 'take off', 'drop', 'get rid of', 'eliminar', 'quitar', 'borrar', 'hatao', 'nikaalo', 'delete karo']
const SEARCH_WORDS = ['find', 'search', 'look for', 'show me', 'do you have', 'buscar', 'encontrar', 'dhundo', 'khojo', 'search karo']
const SUGGEST_WORDS = ['suggest', 'recommend', 'what should', 'ideas', 'sugerir', 'recomendar', 'batao kya', 'suggest karo']
const CLEAR_WORDS = ['clear list', 'clear my list', 'empty list', 'empty my list', 'clear cart', 'remove everything', 'vaciar', 'sab hatao', 'poora list saaf']

// number words -> value (en / hi-translit / es)
const NUMBER_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, dozen: 12,
  ek: 1, do: 2, teen: 3, char: 4, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
}

// filler unit/measure words to strip from the extracted item name
const NOISE_WORDS = new Set([
  'to', 'my', 'the', 'a', 'an', 'of', 'some', 'please', 'from', 'list', 'cart', 'bottle', 'bottles', 'box', 'boxes',
  'bag', 'bags', 'can', 'cans', 'pack', 'packs', 'piece', 'pieces', 'kg', 'lb', 'lbs', 'litre', 'litres', 'liter',
  'liters', 'gallon', 'gallons', 'me', 'i', 'want', 'need', 'buy', 'get', 'para', 'de', 'mi', 'lista', 'ko', 'mere',
  'meri', 'mein', 'se',
])

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w))
}

function firstMatchIndex(text: string, words: string[]): number {
  let idx = -1
  for (const w of words) {
    const i = text.indexOf(w)
    if (i !== -1 && (idx === -1 || i < idx)) idx = i
  }
  return idx
}

function extractQuantity(text: string): number | undefined {
  const digit = text.match(/\b(\d+)\b/)
  if (digit) return parseInt(digit[1], 10)
  for (const [word, val] of Object.entries(NUMBER_WORDS)) {
    const re = new RegExp(`\\b${word}\\b`)
    if (re.test(text)) return val
  }
  return undefined
}

function extractPriceFilter(text: string): { maxPrice?: number; minPrice?: number } {
  const out: { maxPrice?: number; minPrice?: number } = {}
  const under = text.match(/(?:under|below|less than|cheaper than|menos de|se kam)\s*\$?\s*(\d+(?:\.\d+)?)/)
  if (under) out.maxPrice = parseFloat(under[1])
  const over = text.match(/(?:over|above|more than|at least|se zyada|mas de)\s*\$?\s*(\d+(?:\.\d+)?)/)
  if (over) out.minPrice = parseFloat(over[1])
  const between = text.match(/between\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?\s*(\d+(?:\.\d+)?)/)
  if (between) {
    out.minPrice = parseFloat(between[1])
    out.maxPrice = parseFloat(between[2])
  }
  return out
}

/** Clean an extracted item phrase into a concise noun. */
function cleanItem(phrase: string): string {
  const words = phrase
    .replace(/[$.,!?]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => !(w in NUMBER_WORDS))
    .filter((w) => !/^\d+$/.test(w))
    .filter((w) => !NOISE_WORDS.has(w))
  return words.join(' ').trim()
}

/** Remove the leading verb keyword so it does not leak into the item name. */
function stripLeadingVerb(text: string, verbs: string[]): string {
  let result = text
  const sorted = [...verbs].sort((a, b) => b.length - a.length)
  for (const v of sorted) {
    if (result.startsWith(v + ' ')) {
      result = result.slice(v.length).trim()
      break
    }
    const idx = result.indexOf(' ' + v + ' ')
    if (idx !== -1) {
      result = result.slice(idx + v.length + 2).trim()
      break
    }
  }
  return result
}

export function parseCommand(input: string): ParsedCommand {
  const raw = input
  const text = ` ${input.toLowerCase().trim()} `.replace(/\s+/g, ' ').trim()

  if (!text) return { intent: 'UNKNOWN', raw }

  // CLEAR (check before remove so "clear list" wins)
  if (includesAny(text, CLEAR_WORDS)) {
    return { intent: 'CLEAR', raw }
  }

  const priceFilter = extractPriceFilter(text)

  // SEARCH / FILTER_PRICE
  if (includesAny(text, SEARCH_WORDS) || priceFilter.maxPrice != null || priceFilter.minPrice != null) {
    const stripped = stripLeadingVerb(text, SEARCH_WORDS)
    // remove the price clause from the item phrase
    const withoutPrice = stripped
      .replace(/(?:under|below|less than|cheaper than|over|above|more than|at least|menos de|mas de|se kam|se zyada)\s*\$?\s*\d+(?:\.\d+)?/g, '')
      .replace(/between\s*\$?\s*\d+(?:\.\d+)?\s*(?:and|to|-)\s*\$?\s*\d+(?:\.\d+)?/g, '')
    const item = cleanItem(withoutPrice)
    const intent = includesAny(text, SEARCH_WORDS) || item ? 'SEARCH_ITEM' : 'FILTER_PRICE'
    return { intent, item: item || undefined, ...priceFilter, raw }
  }

  // SUGGEST
  if (includesAny(text, SUGGEST_WORDS)) {
    return { intent: 'SUGGEST', raw }
  }

  // REMOVE
  if (includesAny(text, REMOVE_WORDS)) {
    const stripped = stripLeadingVerb(text, REMOVE_WORDS)
    const item = cleanItem(stripped)
    return { intent: 'REMOVE_ITEM', item: item || undefined, raw }
  }

  // ADD (default action for a noun-ish phrase)
  if (includesAny(text, ADD_WORDS)) {
    const quantity = extractQuantity(text)
    const stripped = stripLeadingVerb(text, ADD_WORDS)
    const item = cleanItem(stripped)
    if (!item) return { intent: 'UNKNOWN', raw }
    return { intent: 'ADD_ITEM', item, quantity, raw }
  }

  // Bare noun with a quantity, e.g. "2 apples" -> treat as add
  const quantity = extractQuantity(text)
  const bareItem = cleanItem(text)
  if (bareItem && quantity != null) {
    return { intent: 'ADD_ITEM', item: bareItem, quantity, raw }
  }
  // A single/short bare noun -> assume add
  // A single/short bare noun -> assume add
  if (bareItem && bareItem.split(' ').length <= 3 && bareItem.length > 1) {
    return { intent: 'ADD_ITEM', item: bareItem, raw }
  }

  return { intent: 'UNKNOWN', raw }
}
