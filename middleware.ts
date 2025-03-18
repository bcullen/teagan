import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.isAdmin
    const pathname = req.nextUrl.pathname

    // Redirect non-admin users trying to access admin pages
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

