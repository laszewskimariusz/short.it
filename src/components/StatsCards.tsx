import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatsCards({ stats }: { stats: { total: number; clicks: number; active: number; inactive: number } }) {
  const items = [
    { label: 'Total Links', value: stats.total },
    { label: 'Total Clicks', value: stats.clicks },
    { label: 'Active', value: stats.active },
    { label: 'Inactive', value: stats.inactive }
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label}>
          <CardHeader>
            <CardTitle className="text-white/70 text-sm">{it.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

