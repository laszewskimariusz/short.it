import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Persist user id to the token when signing in
        token.uid = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token as any).uid || token.sub || ''
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Session {
    user?: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}
