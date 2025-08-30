import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { linkUpdateSchema } from '@/lib/validators'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const body = await req.json()
  const parsed = linkUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const data = parsed.data

  const link = await prisma.link.findFirst({ where: { id, userId: session.user.id } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (data.alias && data.alias !== link.slug) {
    const exists = await prisma.link.findUnique({ where: { slug: data.alias } })
    if (exists) return NextResponse.json({ error: 'Alias already taken' }, { status: 409 })
  }

  const updated = await prisma.link.update({
    where: { id },
    data: {
      slug: data.alias ?? link.slug,
      title: data.title ?? link.title,
      isActive: data.isActive ?? link.isActive,
      expiresAt: data.expiresAt === undefined ? link.expiresAt : data.expiresAt ? new Date(data.expiresAt) : null
    }
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const link = await prisma.link.findFirst({ where: { id, userId: session.user.id } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.link.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

