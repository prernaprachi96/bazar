'use client'

import { LogOut, User as UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/auth-provider'

export function ProfileMenu() {
  const { user, logOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null
  const initial = user.name.trim().slice(0, 1).toUpperCase() || 'U'
  const memberSince = new Date(user.joinedAt).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-border bg-card p-4 shadow-lg shadow-primary/10"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-card-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
            <UserIcon className="size-3.5 shrink-0" aria-hidden="true" />
            Member since {memberSince}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              logOut()
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4" aria-hidden="true" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
