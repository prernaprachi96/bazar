'use client'

import { useAuth } from '@/components/auth-provider'
import { AuthScreen } from '@/components/auth-screen'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <main className="flex min-h-dvh w-full items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" />
      </main>
    )
  }

  if (!user) return <AuthScreen />

  return <>{children}</>
}
