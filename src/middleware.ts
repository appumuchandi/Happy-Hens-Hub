
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Pass the current pathname to the layout via headers so we can detect it in Server Components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Match all paths except static files, images, and internal Next.js assets
    '/((?!_next/static|_next/image|favicon.ico|images|mobileapp).*)',
  ],
}
