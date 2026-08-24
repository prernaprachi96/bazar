import type { Category, Language } from '@/lib/types'

type Translation = Partial<Record<Language, string>>

const PRODUCT_TRANSLATIONS: Record<string, Translation> = {
  Milk: {
    'hi-IN': 'दूध',
    'es-ES': 'Leche',
    'fr-FR': 'Lait',
    'de-DE': 'Milch',
    'ja-JP': '牛乳',
    'ar-SA': 'حليب',
    'pt-BR': 'Leite',
  },

  'Almond Milk': {
    'hi-IN': 'बादाम दूध',
    'es-ES': 'Leche de almendras',
    'fr-FR': 'Lait d’amande',
    'de-DE': 'Mandelmilch',
    'ja-JP': 'アーモンドミルク',
    'ar-SA': 'حليب اللوز',
    'pt-BR': 'Leite de amêndoas',
  },

  'Oat Milk': {
    'hi-IN': 'जई का दूध',
    'es-ES': 'Leche de avena',
    'fr-FR': 'Lait d’avoine',
    'de-DE': 'Hafermilch',
    'ja-JP': 'オーツミルク',
    'ar-SA': 'حليب الشوفان',
    'pt-BR': 'Leite de aveia',
  },

  Butter: {
    'hi-IN': 'मक्खन',
    'es-ES': 'Mantequilla',
    'fr-FR': 'Beurre',
    'de-DE': 'Butter',
    'ja-JP': 'バター',
    'ar-SA': 'زبدة',
    'pt-BR': 'Manteiga',
  },

  Eggs: {
    'hi-IN': 'अंडे',
    'es-ES': 'Huevos',
    'fr-FR': 'Œufs',
    'de-DE': 'Eier',
    'ja-JP': '卵',
    'ar-SA': 'بيض',
    'pt-BR': 'Ovos',
  },

  Apples: {
    'hi-IN': 'सेब',
    'es-ES': 'Manzanas',
    'fr-FR': 'Pommes',
    'de-DE': 'Äpfel',
    'ja-JP': 'りんご',
    'ar-SA': 'تفاح',
    'pt-BR': 'Maçãs',
  },

  Bananas: {
    'hi-IN': 'केले',
    'es-ES': 'Plátanos',
    'fr-FR': 'Bananes',
    'de-DE': 'Bananen',
    'ja-JP': 'バナナ',
    'ar-SA': 'موز',
    'pt-BR': 'Bananas',
  },

  Oranges: {
    'hi-IN': 'संतरे',
    'es-ES': 'Naranjas',
    'fr-FR': 'Oranges',
    'de-DE': 'Orangen',
    'ja-JP': 'オレンジ',
    'ar-SA': 'برتقال',
    'pt-BR': 'Laranjas',
  },

  Bread: {
    'hi-IN': 'ब्रेड',
    'es-ES': 'Pan',
    'fr-FR': 'Pain',
    'de-DE': 'Brot',
    'ja-JP': 'パン',
    'ar-SA': 'خبز',
    'pt-BR': 'Pão',
  },

  Water: {
    'hi-IN': 'पानी',
    'es-ES': 'Agua',
    'fr-FR': 'Eau',
    'de-DE': 'Wasser',
    'ja-JP': '水',
    'ar-SA': 'ماء',
    'pt-BR': 'Água',
  },

  Coffee: {
    'hi-IN': 'कॉफी',
    'es-ES': 'Café',
    'fr-FR': 'Café',
    'de-DE': 'Kaffee',
    'ja-JP': 'コーヒー',
    'ar-SA': 'قهوة',
    'pt-BR': 'Café',
  },

  Tea: {
    'hi-IN': 'चाय',
    'es-ES': 'Té',
    'fr-FR': 'Thé',
    'de-DE': 'Tee',
    'ja-JP': 'お茶',
    'ar-SA': 'شاي',
    'pt-BR': 'Chá',
  },

  Rice: {
    'hi-IN': 'चावल',
    'es-ES': 'Arroz',
    'fr-FR': 'Riz',
    'de-DE': 'Reis',
    'ja-JP': '米',
    'ar-SA': 'أرز',
    'pt-BR': 'Arroz',
  },

  Pasta: {
    'hi-IN': 'पास्ता',
    'es-ES': 'Pasta',
    'fr-FR': 'Pâtes',
    'de-DE': 'Pasta',
    'ja-JP': 'パスタ',
    'ar-SA': 'معكرونة',
    'pt-BR': 'Macarrão',
  },

  Toothpaste: {
    'hi-IN': 'टूथपेस्ट',
    'es-ES': 'Pasta de dientes',
    'fr-FR': 'Dentifrice',
    'de-DE': 'Zahnpasta',
    'ja-JP': '歯磨き粉',
    'ar-SA': 'معجون أسنان',
    'pt-BR': 'Pasta de dente',
  },

  Shampoo: {
    'hi-IN': 'शैम्पू',
    'es-ES': 'Champú',
    'fr-FR': 'Shampooing',
    'de-DE': 'Shampoo',
    'ja-JP': 'シャンプー',
    'ar-SA': 'شامبو',
    'pt-BR': 'Shampoo',
  },

  Soap: {
    'hi-IN': 'साबुन',
    'es-ES': 'Jabón',
    'fr-FR': 'Savon',
    'de-DE': 'Seife',
    'ja-JP': '石鹸',
    'ar-SA': 'صابون',
    'pt-BR': 'Sabonete',
  },
}

const CATEGORY_TRANSLATIONS: Record<Category, Translation> = {
  Dairy: {
    'hi-IN': 'डेयरी',
    'es-ES': 'Lácteos',
    'fr-FR': 'Produits laitiers',
    'de-DE': 'Milchprodukte',
    'ja-JP': '乳製品',
    'ar-SA': 'منتجات الألبان',
    'pt-BR': 'Laticínios',
  },

  Produce: {
    'hi-IN': 'फल और सब्ज़ियां',
    'es-ES': 'Frutas y verduras',
    'fr-FR': 'Fruits et légumes',
    'de-DE': 'Obst und Gemüse',
    'ja-JP': '青果',
    'ar-SA': 'الفواكه والخضروات',
    'pt-BR': 'Hortifruti',
  },

  Bakery: {
    'hi-IN': 'बेकरी',
    'es-ES': 'Panadería',
    'fr-FR': 'Boulangerie',
    'de-DE': 'Bäckerei',
    'ja-JP': 'ベーカリー',
    'ar-SA': 'مخبوزات',
    'pt-BR': 'Padaria',
  },

  Beverages: {
    'hi-IN': 'पेय पदार्थ',
    'es-ES': 'Bebidas',
    'fr-FR': 'Boissons',
    'de-DE': 'Getränke',
    'ja-JP': '飲み物',
    'ar-SA': 'مشروبات',
    'pt-BR': 'Bebidas',
  },

  Snacks: {
    'hi-IN': 'स्नैक्स',
    'es-ES': 'Aperitivos',
    'fr-FR': 'Snacks',
    'de-DE': 'Snacks',
    'ja-JP': 'スナック',
    'ar-SA': 'وجبات خفيفة',
    'pt-BR': 'Lanches',
  },

  Household: {
    'hi-IN': 'घरेलू सामान',
    'es-ES': 'Hogar',
    'fr-FR': 'Maison',
    'de-DE': 'Haushalt',
    'ja-JP': '日用品',
    'ar-SA': 'مستلزمات المنزل',
    'pt-BR': 'Casa',
  },

  'Meat & Seafood': {
    'hi-IN': 'मांस और समुद्री भोजन',
    'es-ES': 'Carne y mariscos',
    'fr-FR': 'Viandes et fruits de mer',
    'de-DE': 'Fleisch und Meeresfrüchte',
    'ja-JP': '肉と魚介類',
    'ar-SA': 'اللحوم والمأكولات البحرية',
    'pt-BR': 'Carnes e frutos do mar',
  },

  Frozen: {
    'hi-IN': 'फ्रोज़न फूड',
    'es-ES': 'Congelados',
    'fr-FR': 'Surgelés',
    'de-DE': 'Tiefkühlprodukte',
    'ja-JP': '冷凍食品',
    'ar-SA': 'أطعمة مجمدة',
    'pt-BR': 'Congelados',
  },

  Pantry: {
    'hi-IN': 'पेंट्री',
    'es-ES': 'Despensa',
    'fr-FR': 'Garde-manger',
    'de-DE': 'Vorratskammer',
    'ja-JP': '食品庫',
    'ar-SA': 'المؤن',
    'pt-BR': 'Despensa',
  },

  'Personal Care': {
    'hi-IN': 'व्यक्तिगत देखभाल',
    'es-ES': 'Cuidado personal',
    'fr-FR': 'Soins personnels',
    'de-DE': 'Körperpflege',
    'ja-JP': 'パーソナルケア',
    'ar-SA': 'العناية الشخصية',
    'pt-BR': 'Cuidados pessoais',
  },
}

export function localizeProductName(
  canonicalEnglishName: string,
  language: Language,
) {
  if (language === 'en-US') {
    return canonicalEnglishName
  }

  return (
    PRODUCT_TRANSLATIONS[canonicalEnglishName]?.[language] ??
    canonicalEnglishName
  )
}

export function localizeCategory(
  category: Category,
  language: Language,
) {
  if (language === 'en-US') {
    return category
  }

  return CATEGORY_TRANSLATIONS[category]?.[language] ?? category
}

export function getCanonicalProductName(
  productName: string,
  language: Language,
) {
  const query = productName.trim().toLocaleLowerCase()

  for (const [englishName, translations] of Object.entries(PRODUCT_TRANSLATIONS)) {
    const translatedName = translations[language]

    if (
      englishName.toLocaleLowerCase() === query ||
      translatedName?.toLocaleLowerCase() === query
    ) {
      return englishName
    }
  }

  return productName
}
