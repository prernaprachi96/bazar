'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { AuthScreen } from '@/components/auth-screen'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth()
  const [guestMode, setGuestMode] = useState(false)

  if (!hydrated) {
    return (
      <main className="flex min-h-dvh w-full items-center justify-center">
        <div
          className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-label="Loading"
        />
      </main>
    )
  }

  if (user || guestMode) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <AuthScreen />

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <button
          type="button"
          onClick={() => setGuestMode(true)}
          className="rounded-full border border-primary bg-card px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
        >
          Continue as Guest — Try Voice Shopping
        </button>
      </div>
    </div>
  )
}
