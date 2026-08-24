'use client'

import { CheckCircle2, Languages, Mic, Search, ShoppingBasket, Sparkles } from 'lucide-react'
import type { Language } from '@/lib/types'

interface VoiceCommandCenterProps {
  listening: boolean
  transcript: string
  processing: boolean
  itemCount: number
  language: Language
  onCommand: (command: string) => void
  onMicToggle: () => void
  micSupported: boolean
}

interface DashboardCopy {
  badge: string
  headingStart: string
  headingHighlight: string
  description: string
  ready: string
  listening: string
  processing: string
  tapMic: string
  unsupported: string
  languages: string
  suggestions: string
  item: string
  items: string
  addMilk: string
  addWater: string
  findSnacks: string
  suggestItems: string
}

const DASHBOARD_COPY: Record<Language, DashboardCopy> = {
  'en-US': {
    badge: 'BAZAR VOICE COMMERCE',
    headingStart: 'Shop by speaking.',
    headingHighlight: 'Simple as that.',
    description:
      'Add items, manage quantities, find products by price, and get smart suggestions without touching your list.',
    ready: 'Ready for your next command',
    listening: 'Listening — speak naturally',
    processing: 'Understanding your command…',
    tapMic: 'Tap the microphone to start',
    unsupported: 'Voice input is unavailable in this browser',
    languages: 'languages',
    suggestions: 'suggestions',
    item: 'item in cart',
    items: 'items in cart',
    addMilk: 'Add milk',
    addWater: '2 bottles of water',
    findSnacks: 'Snacks under $4',
    suggestItems: 'Suggest items',
  },

  'hi-IN': {
    badge: 'BAZAR वॉइस कॉमर्स',
    headingStart: 'बोलकर खरीदारी करें।',
    headingHighlight: 'इतना आसान।',
    description:
      'अपनी सूची को छुए बिना सामान जोड़ें, मात्रा बदलें, कीमत से खोजें और स्मार्ट सुझाव पाएं।',
    ready: 'आपके अगले कमांड के लिए तैयार',
    listening: 'सुन रहा हूँ — स्वाभाविक रूप से बोलें',
    processing: 'आपका कमांड समझ रहा हूँ…',
    tapMic: 'शुरू करने के लिए माइक्रोफ़ोन दबाएं',
    unsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है',
    languages: 'भाषाएं',
    suggestions: 'स्मार्ट सुझाव',
    item: 'आइटम कार्ट में',
    items: 'आइटम कार्ट में',
    addMilk: 'दूध जोड़ें',
    addWater: '2 पानी की बोतलें',
    findSnacks: '₹300 से कम स्नैक्स',
    suggestItems: 'सुझाव दें',
  },

  'es-ES': {
    badge: 'COMERCIO POR VOZ BAZAR',
    headingStart: 'Compra hablando.',
    headingHighlight: 'Así de simple.',
    description:
      'Agrega productos, cambia cantidades, busca por precio y recibe recomendaciones sin tocar tu lista.',
    ready: 'Listo para tu próximo comando',
    listening: 'Escuchando — habla naturalmente',
    processing: 'Entendiendo tu comando…',
    tapMic: 'Toca el micrófono para empezar',
    unsupported: 'La voz no está disponible en este navegador',
    languages: 'idiomas',
    suggestions: 'sugerencias',
    item: 'artículo en el carrito',
    items: 'artículos en el carrito',
    addMilk: 'Agregar leche',
    addWater: '2 botellas de agua',
    findSnacks: 'Snacks por menos de $4',
    suggestItems: 'Sugerir productos',
  },

  'fr-FR': {
    badge: 'COMMERCE VOCAL BAZAR',
    headingStart: 'Faites vos courses en parlant.',
    headingHighlight: 'Tout simplement.',
    description:
      'Ajoutez des articles, gérez les quantités, recherchez par prix et recevez des suggestions intelligentes.',
    ready: 'Prêt pour votre prochaine commande',
    listening: 'Écoute en cours — parlez naturellement',
    processing: 'Compréhension de votre commande…',
    tapMic: 'Appuyez sur le microphone pour commencer',
    unsupported: 'La saisie vocale est indisponible dans ce navigateur',
    languages: 'langues',
    suggestions: 'suggestions',
    item: 'article dans le panier',
    items: 'articles dans le panier',
    addMilk: 'Ajouter du lait',
    addWater: '2 bouteilles d’eau',
    findSnacks: 'Snacks sous 4 €',
    suggestItems: 'Suggérer des articles',
  },

  'de-DE': {
    badge: 'BAZAR SPRACH-COMMERCE',
    headingStart: 'Einkaufen per Sprache.',
    headingHighlight: 'So einfach ist das.',
    description:
      'Fügen Sie Artikel hinzu, ändern Sie Mengen, suchen Sie nach Preisen und erhalten Sie smarte Vorschläge.',
    ready: 'Bereit für Ihren nächsten Befehl',
    listening: 'Hört zu — sprechen Sie ganz natürlich',
    processing: 'Ihr Befehl wird verstanden…',
    tapMic: 'Tippen Sie auf das Mikrofon, um zu beginnen',
    unsupported: 'Spracheingabe ist in diesem Browser nicht verfügbar',
    languages: 'Sprachen',
    suggestions: 'Vorschläge',
    item: 'Artikel im Warenkorb',
    items: 'Artikel im Warenkorb',
    addMilk: 'Milch hinzufügen',
    addWater: '2 Wasserflaschen',
    findSnacks: 'Snacks unter 4 €',
    suggestItems: 'Artikel vorschlagen',
  },

  'ja-JP': {
    badge: 'BAZAR 音声コマース',
    headingStart: '話して買い物。',
    headingHighlight: 'とても簡単です。',
    description:
      '商品追加、数量変更、価格検索、スマートなおすすめを、リストに触れずに利用できます。',
    ready: '次のコマンドを受け付けます',
    listening: '聞いています — 自然に話してください',
    processing: 'コマンドを解析中…',
    tapMic: 'マイクをタップして開始',
    unsupported: 'このブラウザでは音声入力を利用できません',
    languages: '言語',
    suggestions: 'おすすめ',
    item: '商品をカートに追加',
    items: '商品をカートに追加',
    addMilk: '牛乳を追加',
    addWater: '水を2本追加',
    findSnacks: '4ドル以下のスナック',
    suggestItems: 'おすすめを表示',
  },

  'ar-SA': {
    badge: 'بازار للتسوق الصوتي',
    headingStart: 'تسوّق باستخدام صوتك.',
    headingHighlight: 'بهذه البساطة.',
    description:
      'أضف المنتجات، غيّر الكميات، ابحث بالسعر، واحصل على اقتراحات ذكية دون لمس قائمتك.',
    ready: 'جاهز للأمر التالي',
    listening: 'يستمع الآن — تحدث بشكل طبيعي',
    processing: 'جارٍ فهم طلبك…',
    tapMic: 'اضغط على الميكروفون للبدء',
    unsupported: 'الإدخال الصوتي غير متاح في هذا المتصفح',
    languages: 'لغات',
    suggestions: 'اقتراحات',
    item: 'منتج في السلة',
    items: 'منتجات في السلة',
    addMilk: 'أضف الحليب',
    addWater: 'أضف زجاجتي ماء',
    findSnacks: 'وجبات خفيفة أقل من 4$',
    suggestItems: 'اقترح منتجات',
  },

  'pt-BR': {
    badge: 'COMÉRCIO POR VOZ BAZAR',
    headingStart: 'Compre falando.',
    headingHighlight: 'É simples assim.',
    description:
      'Adicione itens, gerencie quantidades, pesquise por preço e receba sugestões sem tocar na sua lista.',
    ready: 'Pronto para seu próximo comando',
    listening: 'Ouvindo — fale naturalmente',
    processing: 'Entendendo seu comando…',
    tapMic: 'Toque no microfone para começar',
    unsupported: 'A entrada por voz não está disponível neste navegador',
    languages: 'idiomas',
    suggestions: 'sugestões',
    item: 'item no carrinho',
    items: 'itens no carrinho',
    addMilk: 'Adicionar leite',
    addWater: '2 garrafas de água',
    findSnacks: 'Lanches abaixo de $4',
    suggestItems: 'Sugerir itens',
  },
}

export function VoiceCommandCenter({
  listening,
  transcript,
  processing,
  itemCount,
  language,
  onCommand,
  onMicToggle,
  micSupported,
}: VoiceCommandCenterProps) {
  const copy = DASHBOARD_COPY[language]

  const status = processing
    ? copy.processing
    : listening
      ? copy.listening
      : copy.ready

  const quickCommands = [
    {
      label: copy.addMilk,
      command: language === 'hi-IN' ? 'doodh jodo' : language === 'es-ES' ? 'agregar leche' : 'Add milk',
      icon: ShoppingBasket,
    },
    {
      label: copy.addWater,
      command: language === 'hi-IN' ? '2 bottle water add karo' : 'Add 2 bottles of water',
      icon: Mic,
    },
    {
      label: copy.findSnacks,
      command: 'Find snacks under $4',
      icon: Search,
    },
    {
      label: copy.suggestItems,
      command: 'Suggest something',
      icon: Sparkles,
    },
  ]

  return (
    <section
      aria-label="Voice command center"
      className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-accent/30 p-5 shadow-sm sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-xs font-bold text-primary shadow-sm">
            <span
              className={`size-2 rounded-full ${
                listening ? 'animate-pulse bg-primary' : 'bg-emerald-500'
              }`}
            />
            {copy.badge}
          </div>

          <h2 className="max-w-xl font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {copy.headingStart} <span className="text-primary">{copy.headingHighlight}</span>
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {quickCommands.map(({ label, command, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => onCommand(command)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-2 text-xs font-bold text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-3xl border border-border bg-card/80 p-4 text-center shadow-sm backdrop-blur sm:min-w-60">
          <button
            type="button"
            onClick={onMicToggle}
            disabled={!micSupported || processing}
            aria-label={listening ? 'Stop listening' : 'Start voice input'}
            className={`relative flex size-20 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
              listening ? 'bg-destructive shadow-destructive/30' : 'bg-primary shadow-primary/30'
            }`}
          >
            {listening && (
              <span
                className="absolute inset-0 animate-ping rounded-full bg-destructive/30"
                aria-hidden="true"
              />
            )}
            <Mic className="relative size-8" aria-hidden="true" />
          </button>

          <p className="mt-3 text-sm font-bold text-card-foreground">{status}</p>

          <p className="mt-1 min-h-5 max-w-52 truncate text-xs text-muted-foreground">
            {transcript ||
              (micSupported ? copy.tapMic : copy.unsupported)}
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-border/70 pt-4 sm:max-w-md">
        <Metric
          icon={<Languages className="size-3.5" aria-hidden="true" />}
          value="8"
          label={copy.languages}
        />

        <Metric
          icon={<Sparkles className="size-3.5" aria-hidden="true" />}
          value="Smart"
          label={copy.suggestions}
        />

        <Metric
          icon={<CheckCircle2 className="size-3.5" aria-hidden="true" />}
          value={String(itemCount)}
          label={itemCount === 1 ? copy.item : copy.items}
        />
      </div>
    </section>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-bold text-card-foreground">{value}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  )
}
