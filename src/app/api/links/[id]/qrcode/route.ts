import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const link = await prisma.link.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const shortUrl = `${base}/r/${link.slug}`
  const dataUrl = await QRCode.toDataURL(shortUrl, { margin: 1, width: 256 })
  const base64 = dataUrl.split(',')[1]
  const buf = Buffer.from(base64, 'base64')
  return new NextResponse(buf, {
    status: 200,
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' }
  })
}

