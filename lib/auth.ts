export interface User {
  id: string
  name: string
  email: string
  joinedAt: number
}

const SESSION_KEY = 'petal-session'

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function setSession(user: User | null) {
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else window.localStorage.removeItem(SESSION_KEY)
}

async function postJson(url: string, body: unknown): Promise<{ user?: User; error?: string }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error ?? 'Something went wrong. Please try again.' }
    return { user: data.user as User }
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' }
  }
}

// Signup/login are backed by a real server-side user record (see
// lib/server/user-db.ts) — passwords are hashed there and never touch
// localStorage. Only the logged-in-user's public profile is cached here so
// the app can restore the session on refresh without another round trip.
export async function signUp(name: string, email: string, password: string): Promise<{ user?: User; error?: string }> {
  const result = await postJson('/api/auth/signup', { name, email, password })
  if (result.user) setSession(result.user)
  return result
}

export async function logIn(email: string, password: string): Promise<{ user?: User; error?: string }> {
  const result = await postJson('/api/auth/login', { email, password })
  if (result.user) setSession(result.user)
  return result
}

export function logOut() {
  setSession(null)
}
