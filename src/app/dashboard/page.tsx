import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/StatsCards'
import LinksTable from '@/components/LinksTable'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [links, clicks] = await Promise.all([
    prisma.link.findMany({ where: { userId: session.user.id } }),
    prisma.click.count({ where: { link: { userId: session.user.id } } })
  ])
  const stats = {
    total: links.length,
    clicks,
    active: links.filter((l) => l.isActive).length,
    inactive: links.filter((l) => !l.isActive).length
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <StatsCards stats={stats} />
      <LinksTable />
    </div>
  )
}

