import { NextResponse } from 'next/server'
import { verifyUser } from '@/lib/server/user-db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }
    const result = verifyUser(email, password)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 401 })
    return NextResponse.json({ user: result.user })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
