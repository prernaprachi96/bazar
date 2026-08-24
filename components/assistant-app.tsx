'use client'

import { t } from '@/lib/i18n'
import { MessageCircle, ShoppingBag, ShoppingBasket, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ChatPanel } from '@/components/chat-panel'
import { CheckoutFlow } from '@/components/checkout-flow'
import { CategoryRail } from '@/components/category-rail'
import { OrderHistory } from '@/components/order-history'
import { ProfileMenu } from '@/components/profile-menu'
import { ProductGrid } from '@/components/product-grid'
import { SearchResults } from '@/components/search-results'
import { ShoppingList } from '@/components/shopping-list'
import { SuggestionsPanel } from '@/components/suggestions-panel'
import { useToast } from '@/components/toast'
import { VoiceSearchBar } from '@/components/voice-search-bar'
import { VoiceCommandCenter } from '@/components/voice-command-center'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { type CommandResult, useShoppingStore } from '@/hooks/use-shopping-store'
import { PRODUCTS } from '@/lib/products'
import { getSuggestions } from '@/lib/suggestions'
import type { CartItem, Category, ChatMessage, Language, Product } from '@/lib/types'
import { getCanonicalProductName } from '@/lib/product-translations'

interface SearchState {
  query: string
  results: Product[]
  loading: boolean
}

let messageSeq = 0
function nextId() {
  messageSeq += 1
  return `m-${Date.now()}-${messageSeq}`
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi! I\'m BAZAR. Tap the mic or type to manage your shopping list. Try "Add 2 milk" or "Find snacks under $4".',
}

export function AssistantApp() {
  const store = useShoppingStore()
  const { notify } = useToast()
  const { user } = useAuth()

  const [language, setLanguage] = useState<Language>('en-US')
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [search, setSearch] = useState<SearchState | null>(null)
  const [processing, setProcessing] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [cartOpen, setCartOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const processingRef = useRef(false)

  const tr = t(language)

  const pushMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: nextId() }])
  }, [])

  const runCommand = useCallback(
    async (rawText: string) => {
      const text = rawText.trim()
      if (!text || processingRef.current) return

      processingRef.current = true
      pushMessage({ role: 'user', text })
      setInputText('')
      setProcessing(true)

      await new Promise((r) => setTimeout(r, 350))

      const parsed = store.parseCommand(text)
      let result: CommandResult

      switch (parsed.intent) {
        case 'ADD_ITEM':
          const canonicalName = getCanonicalProductName(
            parsed.item ?? '',
            language,
          )

          result = store.addItem(
            canonicalName,
            parsed.quantity ?? 1,
          )
          setSearch(null)
          break

        case 'REMOVE_ITEM':
          result = parsed.item
            ? store.removeItem(
                getCanonicalProductName(parsed.item, language),
                )
            : { intent: 'REMOVE_ITEM', reply: tr.removeWhich }
          break

        case 'CLEAR':
          result = store.clearCart()
          setSearch(null)
          break

        case 'SEARCH_ITEM':
        case 'FILTER_PRICE': {
          const results = store.searchProducts(parsed.item ?? '', {
            maxPrice: parsed.maxPrice,
            minPrice: parsed.minPrice,
          })
          const label =
            parsed.item ||
            (parsed.maxPrice != null
              ? tr.underPrice(parsed.maxPrice)
              : parsed.minPrice != null
                ? tr.overPrice(parsed.minPrice)
                : 'items')
          setSearch({ query: label, results, loading: false })
          const priceNote =
            parsed.maxPrice != null
              ? tr.underPrice(parsed.maxPrice)
              : parsed.minPrice != null
                ? tr.overPrice(parsed.minPrice)
                : ''
          result = {
            intent: parsed.intent,
            reply: results.length
              ? tr.searchFound(results.length, label, priceNote)
              : tr.searchNone(label, priceNote),
          }
          break
        }

        case 'SUGGEST': {
          const s = getSuggestions(store.cart)
          const picks = [...s.seasonal.slice(0, 2), ...s.onSale.slice(0, 1)].slice(0, 3)
          const low = s.lowStock.length ? ` ${tr.lowStock} ${s.lowStock.join(', ')}.` : ''
          result = {
            intent: 'SUGGEST',
            reply: `${tr.suggestIntro}${low}`,
            products: picks,
          }
          break
        }

        default:
          result = {
            intent: 'UNKNOWN',
            reply: tr.unknownCommand,
          }
      }

      pushMessage({ role: 'assistant', text: result.reply, products: result.products })
      if (result.toast) notify(result.toast.type, result.toast.message)

      setProcessing(false)
      processingRef.current = false
    },
    [store, pushMessage, notify, tr],
  )

  const handleFinalSpeech = useCallback(
    (transcript: string) => {
      void runCommand(transcript)
    },
    [runCommand],
  )

  const speech = useSpeechRecognition({ language, onFinalResult: handleFinalSpeech })

  const handleMicToggle = useCallback(() => {
    if (speech.listening) speech.stop()
    else speech.start()
  }, [speech])

  const handleSubmit = useCallback(() => {
    if (speech.listening) speech.stop()
    if (inputText.trim()) void runCommand(inputText)
  }, [inputText, runCommand, speech])

  const handleAddProduct = useCallback(
    (name: string) => {
      const result = store.addItem(name)
      if (result.toast) notify(result.toast.type, result.toast.message)
    },
    [store, notify],
  )

  const handleRemove = useCallback(
    (name: string) => {
      const result = store.removeItem(name)
      if (result.toast) notify(result.toast.type, result.toast.message)
    },
    [store, notify],
  )

  const handleClear = useCallback(() => {
    const result = store.clearCart()
    if (result.toast) notify(result.toast.type, result.toast.message)
  }, [store, notify])

  const itemCount = useMemo(
    () => store.cart.reduce((n: number, i: CartItem) => n + i.quantity, 0),
    [store.cart],
  )

  const availableProducts = useMemo(() => PRODUCTS.filter((p) => !p.outOfStock), [])

  const categoryProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? availableProducts.slice(0, 24)
        : availableProducts.filter((p) => p.category === activeCategory),
    [activeCategory, availableProducts],
  )

  return (
    <main className="min-h-dvh w-full">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <ShoppingBag className="size-5" aria-hidden="true" />
          </span>
          <div className="hidden shrink-0 sm:block">
            <h1 className="text-2xl font-black tracking-widest text-primary uppercase" style={{fontFamily: "'Quicksand', sans-serif", letterSpacing: "0.15em"}}>BAZAR</h1>
            <p className="text-[11px] text-muted-foreground">Voice shopping assistant</p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:order-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBasket className="size-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </button>
            <ProfileMenu onOpenOrders={() => setOrdersOpen(true)} />
          </div>

          <div className="order-4 w-full sm:order-2 sm:w-auto sm:flex-1">
            <VoiceSearchBar
              value={inputText}
              onChange={setInputText}
              onSubmit={handleSubmit}
              onMicToggle={handleMicToggle}
              listening={speech.listening}
              interim={speech.transcript}
              processing={processing}
              supported={speech.supported}
              micError={speech.error}
              language={language}
              translations={tr}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <VoiceCommandCenter
        listening={speech.listening}
        transcript={speech.transcript}
        processing={processing}
        itemCount={itemCount}
        language={language}
        onCommand={(command) => void runCommand(command)}
        onMicToggle={handleMicToggle}
        micSupported={speech.supported}
      />

      <CategoryRail active={activeCategory} onSelect={setActiveCategory} />

        {search ? (
          <SearchResults
            query={search.query}
            results={search.results}
            loading={search.loading}
            onAdd={handleAddProduct}
            onClose={() => setSearch(null)}
          />
        ) : (
          <ProductGrid
            title={activeCategory === 'All' ? 'Popular picks' : activeCategory}
            subtitle={activeCategory === 'All' ? 'Fresh picks across every category' : `${categoryProducts.length} items`}
            products={categoryProducts}
            onAdd={handleAddProduct}
          />
        )}

        <SuggestionsPanel cart={store.cart} onAdd={handleAddProduct} />
      </div>

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40"
        aria-label="Open BAZAR assistant chat"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </button>

      {chatOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-foreground/20 backdrop-blur-sm" role="dialog" aria-label="Assistant chat">
          <div className="flex h-dvh w-full max-w-md flex-col bg-background p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">BAZAR Assistant</h2>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                aria-label="Close chat"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ChatPanel
                messages={messages}
                processing={processing}
                onAddProduct={handleAddProduct}
                onExample={(t) => void runCommand(t)}
              />
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-foreground/20 backdrop-blur-sm" role="dialog" aria-label="Shopping cart">
          <div className="flex h-dvh w-full max-w-md flex-col overflow-y-auto bg-background p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">{tr.shoppingList}</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                aria-label="Close cart"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <ShoppingList
              cart={store.cart}
              total={store.total}
              hydrated={store.hydrated}
              language={language}
              onIncrement={store.setQuantity}
              onRemove={handleRemove}
              onClear={handleClear}
            />
            {store.cart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutOpen(true)
                }}
                className="mt-4 h-11 shrink-0 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30"
              >
                {tr.checkout} · ₹{(store.total * 83).toFixed(0)}
              </button>
            )}
          </div>
        </div>
      )}

      {checkoutOpen && user && (
        <CheckoutFlow
          cart={store.cart}
          total={store.total}
          userEmail={user.email}
          userName={user.name}
          onClose={() => setCheckoutOpen(false)}
          onOrderComplete={handleClear}
        />
      )}

      {ordersOpen && user && <OrderHistory userEmail={user.email} onClose={() => setOrdersOpen(false)} />}
    </main>
  )
}
