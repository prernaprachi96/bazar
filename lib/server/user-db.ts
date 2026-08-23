import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// A small file-based "database" so signup/login are real server-side records,
// not browser localStorage. Good enough for a student project / local dev.
//
// IMPORTANT (production note): most serverless hosts (Vercel included) give
// functions a read-only filesystem except /tmp, and /tmp is wiped between
// deployments/cold starts — so this file will NOT persist forever in
// production. For a real deployment, swap this module for a hosted database
// (Supabase/Postgres, PlanetScale, MongoDB Atlas — all have free tiers) and
// keep the same createUser/verifyUser function signatures so nothing else
// in the app has to change.

interface StoredUser {
  id: string
  name: string
  email: string
  salt: string
  hash: string
  joinedAt: number
}

export interface PublicUser {
  id: string
  name: string
  email: string
  joinedAt: number
}

function resolveDbPath(): string {
  const primary = path.join(process.cwd(), 'data', 'users.json')
  try {
    mkdirSync(path.dirname(primary), { recursive: true })
    return primary
  } catch {
    // Read-only project dir (typical on serverless) — fall back to /tmp.
    return path.join('/tmp', 'petal-users.json')
  }
}

const DB_PATH = resolveDbPath()

function readUsers(): StoredUser[] {
  try {
    if (!existsSync(DB_PATH)) return []
    const raw = readFileSync(DB_PATH, 'utf8')
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf8')
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex')
}

function toPublic(u: StoredUser): PublicUser {
  return { id: u.id, name: u.name, email: u.email, joinedAt: u.joinedAt }
}

export function createUser(name: string, email: string, password: string): { user?: PublicUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase()
  if (!name.trim()) return { error: 'Please enter your name.' }
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return { error: 'Please enter a valid email.' }
  if (password.length < 4) return { error: 'Password must be at least 4 characters.' }

  const users = readUsers()
  if (users.some((u) => u.email === normalizedEmail)) {
    return { error: 'An account with this email already exists. Try logging in instead.' }
  }

  const salt = randomBytes(16).toString('hex')
  const user: StoredUser = {
    id: `u-${Date.now()}-${randomBytes(4).toString('hex')}`,
    name: name.trim(),
    email: normalizedEmail,
    salt,
    hash: hashPassword(password, salt),
    joinedAt: Date.now(),
  }
  writeUsers([...users, user])
  return { user: toPublic(user) }
}

export function verifyUser(email: string, password: string): { user?: PublicUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()
  const match = users.find((u) => u.email === normalizedEmail)
  if (!match) return { error: 'Incorrect email or password.' }

  const attempted = Buffer.from(hashPassword(password, match.salt), 'hex')
  const stored = Buffer.from(match.hash, 'hex')
  const ok = attempted.length === stored.length && timingSafeEqual(attempted, stored)
  if (!ok) return { error: 'Incorrect email or password.' }

  return { user: toPublic(match) }
}
