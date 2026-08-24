/**
 * Product thumbnails are generated locally rather than fetched from a generic
 * photo URL. The previous remote URLs could change or point to an unrelated
 * photograph, which made a product card visually misleading.
 */
const PRODUCT_GLYPHS: Record<string, string> = {
  Milk: '🥛',
  'Almond Milk': '🥛',
  'Oat Milk': '🥛',
  'Soy Milk': '🥛',
  Butter: '🧈',
  'Cheddar Cheese': '🧀',
  'Greek Yogurt': '🥣',
  Eggs: '🥚',
  Apples: '🍎',
  Bananas: '🍌',
  Oranges: '🍊',
  Strawberries: '🍓',
  Spinach: '🥬',
  Tomatoes: '🍅',
  Carrots: '🥕',
  Avocado: '🥑',
  Bread: '🍞',
  Bagels: '🥯',
  Croissant: '🥐',
  Tortillas: '🫓',
  Muffins: '🧁',
  Water: '💧',
  'Orange Juice': '🧃',
  Coffee: '☕',
  Tea: '🍵',
  Cola: '🥤',
  'Sparkling Water': '🫧',
  'Potato Chips': '🍟',
  Chocolate: '🍫',
  Cookies: '🍪',
  Popcorn: '🍿',
  'Granola Bars': '🥜',
  Nuts: '🥜',
  'Paper Towels': '🧻',
  'Toilet Paper': '🧻',
  'Dish Soap': '🧼',
  'Laundry Detergent': '🧴',
  'Trash Bags': '🗑️',
  'Chicken Breast': '🍗',
  'Ground Beef': '🥩',
  Salmon: '🐟',
  Bacon: '🥓',
  Tofu: '🧊',
  'Frozen Pizza': '🍕',
  'Ice Cream': '🍨',
  'Frozen Peas': '🫛',
  'Frozen Berries': '🫐',
  Rice: '🍚',
  Pasta: '🍝',
  'Olive Oil': '🫒',
  Cereal: '🥣',
  'Peanut Butter': '🥜',
  Flour: '🌾',
  Sugar: '🍬',
  Toothpaste: '🦷',
  Shampoo: '🧴',
  Soap: '🧼',
  Deodorant: '🧴',
}

export function productImageDataUri(name: string) {
  const glyph = PRODUCT_GLYPHS[name] ?? '🛒'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#fdf2f8"/><text x="40" y="53" text-anchor="middle" font-size="42">${glyph}</text></svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
