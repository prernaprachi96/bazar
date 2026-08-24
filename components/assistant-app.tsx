'use client'

import { TRANSLATIONS, t } from '@/lib/i18n'
import { MessageCircle, ShoppingBag, ShoppingBasket, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { getCanonicalProductName, localizeCategory } from '@/lib/product-translations'
import { ui } from '@/lib/ui-translations'

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
  const copy = ui(language)

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('bazar-language') as Language | null

    if (savedLanguage && savedLanguage in TRANSLATIONS) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem('bazar-language', nextLanguage)
    setLanguage(nextLanguage)
  }, [])

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
        case 'ADD_ITEM': {
          const canonicalName = getCanonicalProductName(
            parsed.item ?? '',
            language,
          )

          result = store.addToList(
            canonicalName,
            parsed.quantity ?? 1,
          )
          break
        }

        case 'REMOVE_ITEM': {
          const canonicalName = getCanonicalProductName(
            parsed.item ?? '',
            language,
          )

          result = store.removeFromList(canonicalName)
          break
        }

        case 'CLEAR_LIST':
          result = store.clearList()
          break

        case 'SEARCH': {
          const query = parsed.query ?? text

          setSearch({
            query,
            results: [],
            loading: true,
          })

          const results = getSuggestions(query, PRODUCTS)

          setSearch({
            query,
            results,
            loading: false,
          })

          result = {
            success: true,
            message:
              results.length > 0
                ? `I found ${results.length} products for "${query}".`
                : `I couldn't find products for "${query}".`,
          }

          break
        }

        case 'ADD_PRODUCT': {
          const product = PRODUCTS.find(
            (p) =>
              p.id === parsed.productId ||
              p.name.toLowerCase() === parsed.item?.toLowerCase(),
          )

          if (!product) {
            result = {
              success: false,
              message: 'I could not find that product.',
            }
            break
          }

          result = store.addToCart(product, parsed.quantity ?? 1)
          break
        }

        case 'REMOVE_PRODUCT': {
          const product = PRODUCTS.find(
            (p) =>
              p.id === parsed.productId ||
              p.name.toLowerCase() === parsed.item?.toLowerCase(),
          )

          if (!product) {
            result = {
              success: false,
              message: 'I could not find that product.',
            }
            break
          }

          result = store.removeFromCart(product.id)
          break
        }

        case 'VIEW_CART':
          setCartOpen(true)
          result = {
            success: true,
            message: 'Here is your cart.',
          }
          break

        case 'CHECKOUT':
          setCheckoutOpen(true)
          result = {
            success: true,
            message: 'Opening checkout.',
          }
          break

        default:
          result = {
            success: false,
            message:
              'I can help you add items, remove items, search products, or manage your cart.',
          }
      }

      pushMessage({
        role: 'assistant',
        text: result.message,
      })

      if (result.success) {
        notify({
          title: 'BAZAR',
          description: result.message,
        })
      }

      setProcessing(false)
      processingRef.current = false
    },
    [language, notify, pushMessage, store],
  )

  const handleSubmit = useCallback(() => {
    void runCommand(inputText)
  }, [inputText, runCommand])

  const speech = useSpeechRecognition({
    language,
    onResult: (text) => {
      setInputText(text)
    },
  })

  const handleMicToggle = useCallback(() => {
    if (speech.listening) {
      speech.stop()
    } else {
      speech.start()
    }
  }, [speech])

  const handleAddProduct = useCallback(
    (product: Product, quantity = 1) => {
      const result = store.addToCart(product, quantity)

      pushMessage({
        role: 'assistant',
        text: result.message,
      })

      if (result.success) {
        notify({
          title: 'Added to cart',
          description: result.message,
        })
      }
    },
    [notify, pushMessage, store],
  )

  const itemCount = useMemo(
    () => store.cart.reduce((n: number, i: CartItem) => n + i.quantity, 0),
    [store.cart],
  )

  const availableProducts = useMemo(
    () => PRODUCTS.filter((p) => !p.outOfStock),
    [],
  )

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
            <h1
              className="text-2xl font-black tracking-widest text-primary uppercase"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                letterSpacing: '0.15em',
              }}
            >
              BAZAR
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {copy.voiceShoppingAssistant}
            </p>
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
              onLanguageChange={handleLanguageChange}
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

        <CategoryRail
          active={activeCategory}
          language={language}
          onSelect={setActiveCategory}
        />

        {search ? (
          <SearchResults
            query={search.query}
            results={search.results}
            loading={search.loading}
            language={language}
            onAdd={handleAddProduct}
            onClose={() => setSearch(null)}
          />
        ) : (
          <ProductGrid
            title={
              activeCategory === 'All'
                ? copy.popularPicks
                : localizeCategory(activeCategory, language)
            }
            subtitle={
              activeCategory === 'All'
                ? copy.freshPicks
                : `${categoryProducts.length} ${copy.items}`
            }
            products={categoryProducts}
            language={language}
            onAdd={handleAddProduct}
          />
        )}

        <SuggestionsPanel
          cart={store.cart}
          language={language}
          onAdd={handleAddProduct}
        />
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
        <div
          className="fixed inset-0 z-40 flex justify-end bg-foreground/20 backdrop-blur-sm"
          role="dialog"
          aria-label="Assistant chat"
        >
          <div className="flex h-dvh w-full max-w-md flex-col bg-background p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                BAZAR Assistant
              </h2>

              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                aria-label="Close chat"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <ChatPanel
              messages={messages}
              input={inputText}
              onInputChange={setInputText}
              onSubmit={handleSubmit}
              processing={processing}
              language={language}
            />
          </div>
        </div>
      )}

      {cartOpen && (
        <ShoppingList
          items={store.cart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
          onRemove={(productId) => store.removeFromCart(productId)}
          onUpdateQuantity={(productId, quantity) =>
            store.updateCartQuantity(productId, quantity)
          }
          language={language}
        />
      )}

      {checkoutOpen && (
        <CheckoutFlow
          cart={store.cart}
          onClose={() => setCheckoutOpen(false)}
          onComplete={() => {
            store.clearCart()
            setCheckoutOpen(false)
          }}
          language={language}
        />
      )}

      {ordersOpen && (
        <OrderHistory
          onClose={() => setOrdersOpen(false)}
          language={language}
        />
      )}
    </main>
  )
}
