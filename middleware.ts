import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Import auth0 dynamically to handle missing env vars
    const { auth0 } = await import('./lib/auth0')
    return await auth0.middleware(request)
  } catch (error) {
    console.error('Auth0 middleware error:', error)
    // If Auth0 is not configured, allow the request to proceed
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}