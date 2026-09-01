import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { audit, rateLimit, requestFingerprint } from '@/lib/security'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/connexion',
    error: '/auth/erreur',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      if (token.id) {
        const current = await prisma.user.findUnique({ where: { id: token.id as string }, select: { role: true, suspended: true, permissions: true, deniedPermissions: true, emailVerified: true } })
        if (!current || current.suspended) { token.disabled = true; return token }
        token.disabled = false
        token.role = current.role
        token.permissions = current.permissions
        token.deniedPermissions = current.deniedPermissions
        token.emailVerified = current.emailVerified?.toISOString() || null
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).permissions = token.permissions
        ;(session.user as any).deniedPermissions = token.deniedPermissions
        ;(session.user as any).emailVerified = token.emailVerified
        if (token.disabled) return null as any
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email).trim().toLowerCase()
        const limited = await rateLimit('auth.login', `${email}:${requestFingerprint(request)}`, 10, 15 * 60)
        if (!limited.allowed) return null
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password || user.suspended) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!valid) {
          await audit('LOGIN_REJECTED', user.id, user.id)
          return null
        }

        await audit('LOGIN_SUCCEEDED', user.id, user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
})
