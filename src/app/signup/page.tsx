import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthForm from '@/components/AuthForm'

export default function SignUpPage() {
  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
    </div>
  )
}

