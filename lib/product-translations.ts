export type Translation = {
  'hi-IN': string
  'es-ES': string
  'fr-FR': string
  'de-DE': string
  'ja-JP': string
  'ar-SA': string
  'pt-BR': string
}

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
    'pt-BR': 'Leite de amêndoa',
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

  // Keep this catalog complete: every seed in lib/products.ts has a label in
  // every supported locale, so switching language never falls back to English.
  'Soy Milk': {
    'hi-IN': 'सोया दूध',
    'es-ES': 'Leche de soja',
    'fr-FR': 'Lait de soja',
    'de-DE': 'Sojamilch',
    'ja-JP': '豆乳',
    'ar-SA': 'حليب الصويا',
    'pt-BR': 'Leite de soja',
  },

  'Cheddar Cheese': {
    'hi-IN': 'चेडर चीज़',
    'es-ES': 'Queso cheddar',
    'fr-FR': 'Fromage cheddar',
    'de-DE': 'Cheddar-Käse',
    'ja-JP': 'チェダーチーズ',
    'ar-SA': 'جبن شيدر',
    'pt-BR': 'Queijo cheddar',
  },

  'Greek Yogurt': {
    'hi-IN': 'ग्रीक योगर्ट',
    'es-ES': 'Yogur griego',
    'fr-FR': 'Yaourt grec',
    'de-DE': 'Griechischer Joghurt',
    'ja-JP': 'ギリシャヨーグルト',
    'ar-SA': 'زبادي يوناني',
    'pt-BR': 'Iogurte grego',
  },

  Strawberries: {
    'hi-IN': 'स्ट्रॉबेरी',
    'es-ES': 'Fresas',
    'fr-FR': 'Fraises',
    'de-DE': 'Erdbeeren',
    'ja-JP': 'いちご',
    'ar-SA': 'فراولة',
    'pt-BR': 'Morangos',
  },

  Spinach: {
    'hi-IN': 'पालक',
    'es-ES': 'Espinaca',
    'fr-FR': 'Épinards',
    'de-DE': 'Spinat',
    'ja-JP': 'ほうれん草',
    'ar-SA': 'سبانخ',
    'pt-BR': 'Espinafre',
  },

  Tomatoes: {
    'hi-IN': 'टमाटर',
    'es-ES': 'Tomates',
    'fr-FR': 'Tomates',
    'de-DE': 'Tomaten',
    'ja-JP': 'トマト',
    'ar-SA': 'طماطم',
    'pt-BR': 'Tomates',
  },

  Carrots: {
    'hi-IN': 'गाजर',
    'es-ES': 'Zanahorias',
    'fr-FR': 'Carottes',
    'de-DE': 'Karotten',
    'ja-JP': 'にんじん',
    'ar-SA': 'جزر',
    'pt-BR': 'Cenouras',
  },

  Avocado: {
    'hi-IN': 'एवोकाडो',
    'es-ES': 'Aguacate',
    'fr-FR': 'Avocat',
    'de-DE': 'Avocado',
    'ja-JP': 'アボカド',
    'ar-SA': 'أفوكادو',
    'pt-BR': 'Abacate',
  },

  Bagels: {
    'hi-IN': 'बेगल',
    'es-ES': 'Bagels',
    'fr-FR': 'Bagels',
    'de-DE': 'Bagels',
    'ja-JP': 'ベーグル',
    'ar-SA': 'بيغل',
    'pt-BR': 'Bagels',
  },

  Croissant: {
    'hi-IN': 'क्रोइसैन',
    'es-ES': 'Cruasán',
    'fr-FR': 'Croissant',
    'de-DE': 'Croissant',
    'ja-JP': 'クロワッサン',
    'ar-SA': 'كرواسون',
    'pt-BR': 'Croissant',
  },

  Tortillas: {
    'hi-IN': 'टॉर्टिला',
    'es-ES': 'Tortillas',
    'fr-FR': 'Tortillas',
    'de-DE': 'Tortillas',
    'ja-JP': 'トルティーヤ',
    'ar-SA': 'تورتيلا',
    'pt-BR': 'Tortilhas',
  },

  Muffins: {
    'hi-IN': 'मफिन',
    'es-ES': 'Muffins',
    'fr-FR': 'Muffins',
    'de-DE': 'Muffins',
    'ja-JP': 'マフィン',
    'ar-SA': 'مافن',
    'pt-BR': 'Muffins',
  },

  'Orange Juice': {
    'hi-IN': 'संतरे का रस',
    'es-ES': 'Zumo de naranja',
    'fr-FR': 'Jus d’orange',
    'de-DE': 'Orangensaft',
    'ja-JP': 'オレンジジュース',
    'ar-SA': 'عصير برتقال',
    'pt-BR': 'Suco de laranja',
  },

  Cola: {
    'hi-IN': 'कोला',
    'es-ES': 'Refresco de cola',
    'fr-FR': 'Cola',
    'de-DE': 'Cola',
    'ja-JP': 'コーラ',
    'ar-SA': 'كولا',
    'pt-BR': 'Refrigerante de cola',
  },

  'Sparkling Water': {
    'hi-IN': 'सोडा वाटर',
    'es-ES': 'Agua con gas',
    'fr-FR': 'Eau gazeuse',
    'de-DE': 'Sprudelwasser',
    'ja-JP': '炭酸水',
    'ar-SA': 'مياه غازية',
    'pt-BR': 'Água com gás',
  },

  'Potato Chips': {
    'hi-IN': 'आलू के चिप्स',
    'es-ES': 'Papas fritas',
    'fr-FR': 'Chips',
    'de-DE': 'Kartoffelchips',
    'ja-JP': 'ポテトチップス',
    'ar-SA': 'رقائق البطاطس',
    'pt-BR': 'Batatas chips',
  },

  Chocolate: {
    'hi-IN': 'चॉकलेट',
    'es-ES': 'Chocolate',
    'fr-FR': 'Chocolat',
    'de-DE': 'Schokolade',
    'ja-JP': 'チョコレート',
    'ar-SA': 'شوكولاتة',
    'pt-BR': 'Chocolate',
  },

  Cookies: {
    'hi-IN': 'कुकीज़',
    'es-ES': 'Galletas',
    'fr-FR': 'Biscuits',
    'de-DE': 'Kekse',
    'ja-JP': 'クッキー',
    'ar-SA': 'بسكويت',
    'pt-BR': 'Biscoitos',
  },

  Popcorn: {
    'hi-IN': 'पॉपकॉर्न',
    'es-ES': 'Palomitas',
    'fr-FR': 'Pop-corn',
    'de-DE': 'Popcorn',
    'ja-JP': 'ポップコーン',
    'ar-SA': 'فشار',
    'pt-BR': 'Pipoca',
  },

  'Granola Bars': {
    'hi-IN': 'ग्रेनोला बार',
    'es-ES': 'Barras de granola',
    'fr-FR': 'Barres de céréales',
    'de-DE': 'Müsliriegel',
    'ja-JP': 'グラノーラバー',
    'ar-SA': 'ألواح جرانولا',
    'pt-BR': 'Barras de granola',
  },

  Nuts: {
    'hi-IN': 'मेवे',
    'es-ES': 'Frutos secos',
    'fr-FR': 'Noix',
    'de-DE': 'Nüsse',
    'ja-JP': 'ナッツ',
    'ar-SA': 'مكسرات',
    'pt-BR': 'Nozes',
  },

  'Paper Towels': {
    'hi-IN': 'पेपर टॉवल',
    'es-ES': 'Toallas de papel',
    'fr-FR': 'Essuie-tout',
    'de-DE': 'Küchenpapier',
    'ja-JP': 'ペーパータオル',
    'ar-SA': 'مناشف ورقية',
    'pt-BR': 'Toalhas de papel',
  },

  'Toilet Paper': {
    'hi-IN': 'टॉयलेट पेपर',
    'es-ES': 'Papel higiénico',
    'fr-FR': 'Papier toilette',
    'de-DE': 'Toilettenpapier',
    'ja-JP': 'トイレットペーパー',
    'ar-SA': 'ورق تواليت',
    'pt-BR': 'Papel higiênico',
  },

  'Dish Soap': {
    'hi-IN': 'बर्तन धोने का साबुन',
    'es-ES': 'Lavavajillas',
    'fr-FR': 'Liquide vaisselle',
    'de-DE': 'Spülmittel',
    'ja-JP': '食器用洗剤',
    'ar-SA': 'سائل جلي',
    'pt-BR': 'Detergente de louça',
  },

  'Laundry Detergent': {
    'hi-IN': 'कपड़े धोने का डिटर्जेंट',
    'es-ES': 'Detergente para ropa',
    'fr-FR': 'Lessive',
    'de-DE': 'Waschmittel',
    'ja-JP': '洗濯洗剤',
    'ar-SA': 'مسحوق غسيل',
    'pt-BR': 'Sabão em pó',
  },

  'Trash Bags': {
    'hi-IN': 'कूड़े के बैग',
    'es-ES': 'Bolsas de basura',
    'fr-FR': 'Sacs-poubelle',
    'de-DE': 'Müllbeutel',
    'ja-JP': 'ごみ袋',
    'ar-SA': 'أكياس قمامة',
    'pt-BR': 'Sacos de lixo',
  },

  'Chicken Breast': {
    'hi-IN': 'चिकन ब्रेस्ट',
    'es-ES': 'Pechuga de pollo',
    'fr-FR': 'Blanc de poulet',
    'de-DE': 'Hähnchenbrust',
    'ja-JP': '鶏むね肉',
    'ar-SA': 'صدر دجاج',
    'pt-BR': 'Peito de frango',
  },

  'Ground Beef': {
    'hi-IN': 'कीमा बीफ़',
    'es-ES': 'Carne molida',
    'fr-FR': 'Bœuf haché',
    'de-DE': 'Rinderhackfleisch',
    'ja-JP': '牛ひき肉',
    'ar-SA': 'لحم بقري مفروم',
    'pt-BR': 'Carne moída',
  },

  Salmon: {
    'hi-IN': 'सैल्मन',
    'es-ES': 'Salmón',
    'fr-FR': 'Saumon',
    'de-DE': 'Lachs',
    'ja-JP': 'サーモン',
    'ar-SA': 'سلمون',
    'pt-BR': 'Salmão',
  },

  Bacon: {
    'hi-IN': 'बेकन',
    'es-ES': 'Tocino',
    'fr-FR': 'Bacon',
    'de-DE': 'Speck',
    'ja-JP': 'ベーコン',
    'ar-SA': 'لحم مقدد',
    'pt-BR': 'Bacon',
  },

  Tofu: {
    'hi-IN': 'टोफू',
    'es-ES': 'Tofu',
    'fr-FR': 'Tofu',
    'de-DE': 'Tofu',
    'ja-JP': '豆腐',
    'ar-SA': 'توفو',
    'pt-BR': 'Tofu',
  },

  'Frozen Pizza': {
    'hi-IN': 'फ्रोज़न पिज़्ज़ा',
    'es-ES': 'Pizza congelada',
    'fr-FR': 'Pizza surgelée',
    'de-DE': 'Tiefkühlpizza',
    'ja-JP': '冷凍ピザ',
    'ar-SA': 'بيتزا مجمدة',
    'pt-BR': 'Pizza congelada',
  },

  'Ice Cream': {
    'hi-IN': 'आइसक्रीम',
    'es-ES': 'Helado',
    'fr-FR': 'Glace',
    'de-DE': 'Eiscreme',
    'ja-JP': 'アイスクリーム',
    'ar-SA': 'آيس كريم',
    'pt-BR': 'Sorvete',
  },

  'Frozen Peas': {
    'hi-IN': 'फ्रोज़न मटर',
    'es-ES': 'Guisantes congelados',
    'fr-FR': 'Petits pois surgelés',
    'de-DE': 'Tiefkühlerbsen',
    'ja-JP': '冷凍グリーンピース',
    'ar-SA': 'بازلاء مجمدة',
    'pt-BR': 'Ervilhas congeladas',
  },

  'Frozen Berries': {
    'hi-IN': 'फ्रोज़न बेरी',
    'es-ES': 'Bayas congeladas',
    'fr-FR': 'Fruits rouges surgelés',
    'de-DE': 'Tiefkühlbeeren',
    'ja-JP': '冷凍ベリー',
    'ar-SA': 'توت مجمد',
    'pt-BR': 'Frutas vermelhas congeladas',
  },

  'Olive Oil': {
    'hi-IN': 'जैतून का तेल',
    'es-ES': 'Aceite de oliva',
    'fr-FR': 'Huile d’olive',
    'de-DE': 'Olivenöl',
    'ja-JP': 'オリーブオイル',
    'ar-SA': 'زيت زيتون',
    'pt-BR': 'Azeite de oliva',
  },

  Cereal: {
    'hi-IN': 'सीरियल',
    'es-ES': 'Cereal',
    'fr-FR': 'Céréales',
    'de-DE': 'Müsli',
    'ja-JP': 'シリアル',
    'ar-SA': 'حبوب الإفطار',
    'pt-BR': 'Cereal',
  },

  'Peanut Butter': {
    'hi-IN': 'पीनट बटर',
    'es-ES': 'Mantequilla de cacahuete',
    'fr-FR': 'Beurre de cacahuète',
    'de-DE': 'Erdnussbutter',
    'ja-JP': 'ピーナッツバター',
    'ar-SA': 'زبدة الفول السوداني',
    'pt-BR': 'Pasta de amendoim',
  },

  Flour: {
    'hi-IN': 'आटा',
    'es-ES': 'Harina',
    'fr-FR': 'Farine',
    'de-DE': 'Mehl',
    'ja-JP': '小麦粉',
    'ar-SA': 'دقيق',
    'pt-BR': 'Farinha',
  },

  Sugar: {
    'hi-IN': 'चीनी',
    'es-ES': 'Azúcar',
    'fr-FR': 'Sucre',
    'de-DE': 'Zucker',
    'ja-JP': '砂糖',
    'ar-SA': 'سكر',
    'pt-BR': 'Açúcar',
  },

  Deodorant: {
    'hi-IN': 'डिओडोरेंट',
    'es-ES': 'Desodorante',
    'fr-FR': 'Déodorant',
    'de-DE': 'Deodorant',
    'ja-JP': 'デオドラント',
    'ar-SA': 'مزيل عرق',
    'pt-BR': 'Desodorante',
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
}
