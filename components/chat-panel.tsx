'use client'

import { Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ProductCard } from '@/components/product-card'
import type { ChatMessage } from '@/lib/types'

interface ChatPanelProps {
  messages: ChatMessage[]
  processing: boolean
  onAddProduct: (name: string) => void
  onExample: (text: string) => void
}

const EXAMPLES = ['Add 2 milk', 'I need apples', 'Find toothpaste under $5', 'Remove milk', 'Suggest something']

export function ChatPanel({ messages, processing, onAddProduct, onExample }: ChatPanelProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, processing])

  return (
    <section
      aria-label="Assistant conversation"
      className="flex h-[420px] flex-col rounded-3xl border border-border bg-card/60 p-4 lg:h-[480px]"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-sm font-bold text-card-foreground">Petal Assistant</h2>
          <p className="text-xs text-muted-foreground">Your voice-powered shopping helper</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className="max-w-[85%] space-y-2">
              <div
                className={
                  m.role === 'user'
                    ? 'rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground'
                    : 'rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground'
                }
              >
                {m.text}
              </div>
              {m.products && m.products.length > 0 && (
                <div className="space-y-2">
                  {m.products.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={onAddProduct} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {processing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full bg-muted-foreground"
                  style={{ animation: `petal-bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onExample(ex)}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {ex}
          </button>
        ))}
      </div>
      <style>{`@keyframes petal-bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-4px);opacity:1}}`}</style>
    </section>
  )
}
