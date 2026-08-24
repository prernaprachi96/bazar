'use client'

import { Lock, Mail, ShoppingBag, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'

export function AuthScreen() {
  const { logIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = mode === 'login' ? await logIn(email, password) : await signUp(name, email, password)
    setSubmitting(false)
    if (result.error) setError(result.error)
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-sm shadow-primary/10 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* CHANGED: Flower2 → ShoppingBag, "Petal" → "BAZAR" */}
          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">BAZAR</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Log in to your shopping assistant' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Full name</span>
              <span className="flex items-center gap-2 rounded-2xl border border-input bg-background px-3 py-2.5">
                <UserIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </span>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Email</span>
            <span className="flex items-center gap-2 rounded-2xl border border-input bg-background px-3 py-2.5">
              <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Password</span>
            <span className="flex items-center gap-2 rounded-2xl border border-input bg-background px-3 py-2.5">
              <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={4}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2 h-11 rounded-full text-sm font-semibold">
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setError(null)
              setMode(mode === 'login' ? 'signup' : 'login')
            }}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Your account is saved server-side with a hashed password — not just in your browser.
        </p>
      </div>
    </main>
  )
}
