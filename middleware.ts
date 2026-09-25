import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Allow normal responsive rendering without hijacking desktop routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, manifest.json (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)',
  ],
};
