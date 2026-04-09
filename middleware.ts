import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  // Protect everything except auth routes, login page, and Next.js internals
  matcher: [
    '/((?!api/auth|login|_next/static|_next/image|favicon\\.ico|public).*)',
  ],
}
