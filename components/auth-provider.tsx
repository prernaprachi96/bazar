'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSession, logIn as authLogIn, logOut as authLogOut, signUp as authSignUp, type User } from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  hydrated: boolean
  logIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>
  logOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setUser(getSession())
    setHydrated(true)
  }, [])

  const logIn = useCallback(async (email: string, password: string) => {
    const result = await authLogIn(email, password)
    if (result.user) setUser(result.user)
    return { error: result.error }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const result = await authSignUp(name, email, password)
    if (result.user) setUser(result.user)
    return { error: result.error }
  }, [])

  const logOut = useCallback(() => {
    authLogOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, hydrated, logIn, signUp, logOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
