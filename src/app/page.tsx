import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ShortenForm from '@/components/ShortenForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mt-20">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Short links, long impact.</CardTitle>
          <p className="text-white/70">Create clean, reliable short URLs with a beautiful dark glass interface.</p>
        </CardHeader>
        <CardContent>
          <ShortenForm authenticated={!!session?.user} />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-white/60">It’s free and fast. No ads.</p>
    </div>
  )
}

