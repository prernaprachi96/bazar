'use client'

import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  notify: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const ICON = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const ACCENT: Record<ToastType, string> = {
  success: 'text-primary',
  error: 'text-destructive',
  info: 'text-accent-foreground',
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(toast.id), 2800)
    return () => clearTimeout(t)
  }, [toast.id, onDone])

  const Icon = ICON[toast.type]
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-primary/10 animate-in slide-in-from-bottom-4 fade-in"
    >
      <Icon className={`size-5 shrink-0 ${ACCENT[toast.type]}`} aria-hidden="true" />
      <p className="text-sm font-semibold text-card-foreground">{toast.message}</p>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), type, message }])
  }, [])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
