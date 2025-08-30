import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug
  const link = await prisma.link.findUnique({ where: { slug } })
  if (!link) return pretty404()
  const now = new Date()
  if (!link.isActive || (link.expiresAt && link.expiresAt <= now)) {
    return pretty404()
  }

  // Increment clicks and log click async
  await prisma.$transaction([
    prisma.link.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.click.create({
      data: {
        linkId: link.id,
        referer: req.headers.get('referer'),
        userAgent: req.headers.get('user-agent')
      }
    })
  ])

  return NextResponse.redirect(link.originalUrl, { status: 301 })
}

function pretty404() {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Link not found</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#020617,#0b1220,#000);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e2e8f0} .card{background:rgba(255,255,255,0.06);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);padding:32px 40px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.5);text-align:center} a{color:#93c5fd;text-decoration:none}</style></head><body><div class="card"><h1 style="margin:0 0 8px">Link not found</h1><p style="margin:0 0 16px;opacity:.8">This short link is inactive, expired, or doesn’t exist.</p><a href="/">Go to homepage</a></div></body></html>`
  return new NextResponse(html, { status: 404, headers: { 'Content-Type': 'text/html' } })
}

