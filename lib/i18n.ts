export type Language = 'en-US' | 'hi-IN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'ar-SA' | 'pt-BR'

export interface Translations {
  // voice bar
  listening: string
  placeholder: string
  voiceUnsupported: string
  micBlocked: string
  noSpeech: string
  networkError: string
  // chat / assistant replies
  removeWhich: string
  suggestIntro: string
  lowStock: string
  searchFound: (n: number, label: string, priceNote: string) => string
  searchNone: (label: string, priceNote: string) => string
  underPrice: (p: number) => string
  overPrice: (p: number) => string
  unknownCommand: string
  // shopping list
  emptyList: string
  shoppingList: string
  checkout: string
  myOrders: string
  // categories
  dairy: string
  produce: string
  bakery: string
  beverages: string
  snacks: string
  household: string
  meat: string
  frozen: string
  pantry: string
  personalCare: string
}

export const TRANSLATIONS: Record<Language, Translations> = {
  'en-US': {
    listening: 'Listening… speak now',
    placeholder: 'Say or type: "Add 2 milk", "Find apples under $3"',
    voiceUnsupported: "Voice input isn't supported in this browser — you can still type commands.",
    micBlocked: 'Microphone access was blocked. Enable it in your browser settings.',
    noSpeech: "I didn't catch that — try speaking again.",
    networkError: 'Something went wrong with voice input. Please try again.',
    removeWhich: 'Which item should I remove from your list?',
    suggestIntro: "Here are a few ideas based on what's in season and on sale.",
    lowStock: 'You may be running low on',
    searchFound: (n, label, priceNote) => `Found ${n} match${n === 1 ? '' : 'es'} for "${label}"${priceNote}. Tap Add on any of them.`,
    searchNone: (label, priceNote) => `I couldn't find anything for "${label}"${priceNote}. Try another item or price.`,
    underPrice: (p) => ` under $${p}`,
    overPrice: (p) => ` over $${p}`,
    unknownCommand: "I didn't understand that. Try: \"Add milk\", \"Remove eggs\", \"Find bread under $3\".",
    emptyList: 'Your list is empty — try saying "Add milk"',
    shoppingList: 'Shopping List',
    checkout: 'Checkout',
    myOrders: 'My Orders',
    dairy: 'Dairy', produce: 'Produce', bakery: 'Bakery', beverages: 'Beverages',
    snacks: 'Snacks', household: 'Household', meat: 'Meat & Seafood',
    frozen: 'Frozen', pantry: 'Pantry', personalCare: 'Personal Care',
  },
  'hi-IN': {
    listening: 'सुन रहा हूँ… अभी बोलें',
    placeholder: 'बोलें या टाइप करें: "दूध डालो", "सेब खोजो ₹50 से कम"',
    voiceUnsupported: 'इस ब्राउज़र में वॉयस इनपुट उपलब्ध नहीं है — आप टाइप कर सकते हैं।',
    micBlocked: 'माइक्रोफ़ोन की अनुमति नहीं है। ब्राउज़र सेटिंग में इसे चालू करें।',
    noSpeech: 'कुछ सुनाई नहीं दिया — फिर से बोलें।',
    networkError: 'वॉयस इनपुट में समस्या आई। कृपया पुनः प्रयास करें।',
    removeWhich: 'कौन सी चीज़ हटाऊं?',
    suggestIntro: 'यहाँ मौसमी और सेल पर कुछ सुझाव हैं।',
    lowStock: 'शायद आपके पास कम है:',
    searchFound: (n, label, priceNote) => `"${label}"${priceNote} के लिए ${n} परिणाम मिले। किसी पर भी जोड़ें टैप करें।`,
    searchNone: (label, priceNote) => `"${label}"${priceNote} के लिए कुछ नहीं मिला। कोई और चीज़ आज़माएं।`,
    underPrice: (p) => ` ₹${p} से कम`,
    overPrice: (p) => ` ₹${p} से अधिक`,
    unknownCommand: 'समझ नहीं आया। कोशिश करें: "दूध जोड़ो", "अंडे हटाओ", "ब्रेड खोजो"।',
    emptyList: 'सूची खाली है — "दूध जोड़ो" बोलकर शुरू करें',
    shoppingList: 'खरीदारी सूची',
    checkout: 'चेकआउट',
    myOrders: 'मेरे ऑर्डर',
    dairy: 'डेयरी', produce: 'सब्ज़ियाँ', bakery: 'बेकरी', beverages: 'पेय पदार्थ',
    snacks: 'स्नैक्स', household: 'घरेलू', meat: 'मांस और समुद्री भोजन',
    frozen: 'जमे हुए', pantry: 'पेंट्री', personalCare: 'व्यक्तिगत देखभाल',
  },
  'es-ES': {
    listening: 'Escuchando… habla ahora',
    placeholder: 'Di o escribe: "Agregar 2 leches", "Buscar manzanas menos de $3"',
    voiceUnsupported: 'La entrada de voz no es compatible con este navegador — puedes escribir.',
    micBlocked: 'El acceso al micrófono fue bloqueado. Actívalo en la configuración del navegador.',
    noSpeech: 'No capté nada — intenta hablar de nuevo.',
    networkError: 'Algo salió mal con la entrada de voz. Inténtalo de nuevo.',
    removeWhich: '¿Qué artículo debo eliminar de tu lista?',
    suggestIntro: 'Aquí hay algunas ideas basadas en lo que está en temporada y en oferta.',
    lowStock: 'Puede que te estés quedando sin:',
    searchFound: (n, label, priceNote) => `Encontré ${n} resultado${n === 1 ? '' : 's'} para "${label}"${priceNote}. Toca Agregar en cualquiera.`,
    searchNone: (label, priceNote) => `No encontré nada para "${label}"${priceNote}. Prueba otro artículo o precio.`,
    underPrice: (p) => ` menos de $${p}`,
    overPrice: (p) => ` más de $${p}`,
    unknownCommand: 'No entendí eso. Prueba: "Agregar leche", "Eliminar huevos", "Buscar pan menos de $3".',
    emptyList: 'Tu lista está vacía — prueba decir "Agregar leche"',
    shoppingList: 'Lista de compras',
    checkout: 'Pagar',
    myOrders: 'Mis pedidos',
    dairy: 'Lácteos', produce: 'Verduras', bakery: 'Panadería', beverages: 'Bebidas',
    snacks: 'Snacks', household: 'Hogar', meat: 'Carnes y mariscos',
    frozen: 'Congelados', pantry: 'Despensa', personalCare: 'Cuidado personal',
  },
  'fr-FR': {
    listening: 'Écoute… parlez maintenant',
    placeholder: 'Dites ou tapez : "Ajouter 2 laits", "Trouver pommes moins de 3€"',
    voiceUnsupported: "La saisie vocale n'est pas prise en charge — vous pouvez taper.",
    micBlocked: "L'accès au microphone a été bloqué. Activez-le dans les paramètres du navigateur.",
    noSpeech: "Je n'ai rien capté — réessayez de parler.",
    networkError: "Quelque chose s'est mal passé. Veuillez réessayer.",
    removeWhich: 'Quel article dois-je retirer de votre liste ?',
    suggestIntro: "Voici quelques idées basées sur ce qui est de saison et en promotion.",
    lowStock: 'Vous manquez peut-être de :',
    searchFound: (n, label, priceNote) => `Trouvé ${n} résultat${n === 1 ? '' : 's'} pour "${label}"${priceNote}. Appuyez sur Ajouter.`,
    searchNone: (label, priceNote) => `Rien trouvé pour "${label}"${priceNote}. Essayez un autre article.`,
    underPrice: (p) => ` moins de ${p}€`,
    overPrice: (p) => ` plus de ${p}€`,
    unknownCommand: "Je n'ai pas compris. Essayez : \"Ajouter lait\", \"Retirer œufs\", \"Trouver pain moins de 3€\".",
    emptyList: 'Votre liste est vide — essayez de dire "Ajouter lait"',
    shoppingList: 'Liste de courses',
    checkout: 'Payer',
    myOrders: 'Mes commandes',
    dairy: 'Produits laitiers', produce: 'Légumes', bakery: 'Boulangerie', beverages: 'Boissons',
    snacks: 'Snacks', household: 'Maison', meat: 'Viandes et poissons',
    frozen: 'Surgelés', pantry: 'Garde-manger', personalCare: 'Soins personnels',
  },
  'de-DE': {
    listening: 'Höre zu… sprechen Sie jetzt',
    placeholder: 'Sagen oder tippen Sie: "2 Milch hinzufügen", "Äpfel unter 3€ suchen"',
    voiceUnsupported: 'Spracheingabe wird in diesem Browser nicht unterstützt — Sie können tippen.',
    micBlocked: 'Mikrofonzugriff wurde blockiert. Aktivieren Sie ihn in den Browsereinstellungen.',
    noSpeech: 'Ich habe nichts gehört — versuchen Sie es erneut.',
    networkError: 'Bei der Spracheingabe ist ein Fehler aufgetreten. Bitte erneut versuchen.',
    removeWhich: 'Welchen Artikel soll ich aus Ihrer Liste entfernen?',
    suggestIntro: 'Hier sind einige Vorschläge basierend auf Saison und Angeboten.',
    lowStock: 'Möglicherweise haben Sie wenig:',
    searchFound: (n, label, priceNote) => `${n} Ergebnis${n === 1 ? '' : 'se'} für "${label}"${priceNote} gefunden. Tippen Sie auf Hinzufügen.`,
    searchNone: (label, priceNote) => `Nichts für "${label}"${priceNote} gefunden. Versuchen Sie einen anderen Artikel.`,
    underPrice: (p) => ` unter ${p}€`,
    overPrice: (p) => ` über ${p}€`,
    unknownCommand: 'Das habe ich nicht verstanden. Versuchen Sie: "Milch hinzufügen", "Eier entfernen", "Brot unter 3€ suchen".',
    emptyList: 'Ihre Liste ist leer — versuchen Sie "Milch hinzufügen"',
    shoppingList: 'Einkaufsliste',
    checkout: 'Zur Kasse',
    myOrders: 'Meine Bestellungen',
    dairy: 'Milchprodukte', produce: 'Gemüse', bakery: 'Bäckerei', beverages: 'Getränke',
    snacks: 'Snacks', household: 'Haushalt', meat: 'Fleisch & Meeresfrüchte',
    frozen: 'Tiefkühl', pantry: 'Vorratskammer', personalCare: 'Körperpflege',
  },
  'ja-JP': {
    listening: '聴いています…今話してください',
    placeholder: '話すか入力: "牛乳を追加", "300円以下のリンゴを探す"',
    voiceUnsupported: 'このブラウザでは音声入力がサポートされていません。テキストで入力できます。',
    micBlocked: 'マイクへのアクセスがブロックされています。ブラウザの設定で有効にしてください。',
    noSpeech: '聞こえませんでした。もう一度話してください。',
    networkError: '音声入力でエラーが発生しました。もう一度お試しください。',
    removeWhich: 'リストからどのアイテムを削除しますか？',
    suggestIntro: '旬のものやセール品からおすすめを紹介します。',
    lowStock: '在庫が少なくなっているかもしれません:',
    searchFound: (n, label, priceNote) => `"${label}"${priceNote}の検索結果: ${n}件。追加をタップしてください。`,
    searchNone: (label, priceNote) => `"${label}"${priceNote}の結果が見つかりませんでした。`,
    underPrice: (p) => ` ¥${p}以下`,
    overPrice: (p) => ` ¥${p}以上`,
    unknownCommand: '理解できませんでした。試してください: "牛乳を追加", "卵を削除", "パンを探す"。',
    emptyList: 'リストが空です — "牛乳を追加"と言ってみてください',
    shoppingList: 'ショッピングリスト',
    checkout: 'チェックアウト',
    myOrders: '注文履歴',
    dairy: '乳製品', produce: '野菜・果物', bakery: 'パン', beverages: '飲み物',
    snacks: 'お菓子', household: '日用品', meat: '肉・魚介',
    frozen: '冷凍食品', pantry: '食品庫', personalCare: '身だしなみ',
  },
  'ar-SA': {
    listening: 'يستمع… تحدث الآن',
    placeholder: 'قل أو اكتب: "أضف 2 حليب"، "ابحث عن تفاح أقل من 5 ر.س"',
    voiceUnsupported: 'الإدخال الصوتي غير مدعوم في هذا المتصفح — يمكنك الكتابة.',
    micBlocked: 'تم حظر الوصول إلى الميكروفون. فعّله من إعدادات المتصفح.',
    noSpeech: 'لم أسمع شيئاً — حاول التحدث مرة أخرى.',
    networkError: 'حدث خطأ في الإدخال الصوتي. يرجى المحاولة مرة أخرى.',
    removeWhich: 'أي عنصر تريد إزالته من قائمتك؟',
    suggestIntro: 'إليك بعض الاقتراحات بناءً على المنتجات الموسمية والعروض.',
    lowStock: 'قد تكون لديك كميات قليلة من:',
    searchFound: (n, label, priceNote) => `وجدت ${n} نتيجة لـ "${label}"${priceNote}. اضغط إضافة على أي منها.`,
    searchNone: (label, priceNote) => `لم أجد شيئاً لـ "${label}"${priceNote}. جرب عنصراً آخر.`,
    underPrice: (p) => ` أقل من ${p} ر.س`,
    overPrice: (p) => ` أكثر من ${p} ر.س`,
    unknownCommand: 'لم أفهم ذلك. جرب: "أضف حليب"، "احذف بيض"، "ابحث عن خبز".',
    emptyList: 'قائمتك فارغة — جرب قول "أضف حليب"',
    shoppingList: 'قائمة التسوق',
    checkout: 'الدفع',
    myOrders: 'طلباتي',
    dairy: 'منتجات الألبان', produce: 'خضار وفاكهة', bakery: 'مخبوزات', beverages: 'مشروبات',
    snacks: 'وجبات خفيفة', household: 'منزلي', meat: 'لحوم ومأكولات بحرية',
    frozen: 'مجمد', pantry: 'مؤونة', personalCare: 'عناية شخصية',
  },
  'pt-BR': {
    listening: 'Ouvindo… fale agora',
    placeholder: 'Diga ou digite: "Adicionar 2 leites", "Encontrar maçãs abaixo de R$3"',
    voiceUnsupported: 'Entrada de voz não é suportada neste navegador — você pode digitar.',
    micBlocked: 'O acesso ao microfone foi bloqueado. Ative-o nas configurações do navegador.',
    noSpeech: 'Não captei nada — tente falar novamente.',
    networkError: 'Algo deu errado com a entrada de voz. Tente novamente.',
    removeWhich: 'Qual item devo remover da sua lista?',
    suggestIntro: 'Aqui estão algumas ideias baseadas no que está na temporada e em promoção.',
    lowStock: 'Você pode estar com pouco:',
    searchFound: (n, label, priceNote) => `Encontrei ${n} resultado${n === 1 ? '' : 's'} para "${label}"${priceNote}. Toque em Adicionar.`,
    searchNone: (label, priceNote) => `Não encontrei nada para "${label}"${priceNote}. Tente outro item.`,
    underPrice: (p) => ` abaixo de R$${p}`,
    overPrice: (p) => ` acima de R$${p}`,
    unknownCommand: 'Não entendi. Tente: "Adicionar leite", "Remover ovos", "Encontrar pão abaixo de R$3".',
    emptyList: 'Sua lista está vazia — tente dizer "Adicionar leite"',
    shoppingList: 'Lista de compras',
    checkout: 'Finalizar compra',
    myOrders: 'Meus pedidos',
    dairy: 'Laticínios', produce: 'Hortifruti', bakery: 'Padaria', beverages: 'Bebidas',
    snacks: 'Lanches', household: 'Casa', meat: 'Carnes e frutos do mar',
    frozen: 'Congelados', pantry: 'Despensa', personalCare: 'Higiene pessoal',
  },
}

export function t(lang: Language): Translations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS['en-US']
}