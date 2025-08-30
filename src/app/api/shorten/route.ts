import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { urlSchema } from '@/lib/validators'
import { customAlphabet } from 'nanoid'

// Simple in-memory rate limiter
type Entry = { count: number; resetAt: number }
const RATE_LIMIT = 10
const WINDOW_MS = 60_000
const lru = new Map<string, Entry>()

function checkRateLimit(ip: string) {
  const now = Date.now()
  const current = lru.get(ip)
  if (!current || current.resetAt < now) {
    lru.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= RATE_LIMIT) return false
  current.count++
  lru.set(ip, current)
  return true
}

async function fetchTitle(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2000)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    const html = await res.text()
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    return m ? m[1].trim().slice(0, 200) : null
  } catch {
    return null
  }
}

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip =
    (req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '') ||
    (req as any).ip ||
    'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const body = await req.json()
  const parsed = urlSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { originalUrl, alias, title, expiresAt } = parsed.data

  let slug = (alias || '').trim()
  if (!slug) {
    // Ensure unique slug
    for (let i = 0; i < 5; i++) {
      const candidate = nano()
      const exists = await prisma.link.findUnique({ where: { slug: candidate } })
      if (!exists) {
        slug = candidate
        break
      }
    }
    if (!slug) return NextResponse.json({ error: 'Failed to generate slug' }, { status: 500 })
  } else {
    const exists = await prisma.link.findUnique({ where: { slug } })
    if (exists) return NextResponse.json({ error: 'Alias already taken' }, { status: 409 })
  }

  let finalTitle = title?.trim() || null
  if (!finalTitle) finalTitle = await fetchTitle(originalUrl)

  const link = await prisma.link.create({
    data: {
      userId: session.user.id,
      slug,
      originalUrl,
      title: finalTitle,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  })

  return NextResponse.json({
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    title: link.title,
    isActive: link.isActive,
    clicks: link.clicks,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt
  })
}

