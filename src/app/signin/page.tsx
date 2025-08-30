import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthForm from '@/components/AuthForm'

export default function SignInPage() {
  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signin" />
        </CardContent>
      </Card>
    </div>
  )
}

