import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);

  // If a mobile device visits the root landing page, route directly to Mobile Home (M07)
  // (per ADR-0008, unless ?view=desktop is explicitly requested)
  if (pathname === '/' && isMobile && searchParams.get('view') !== 'desktop') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Ensure desktop-only marketing routes redirect to mobile app experience on mobile devices
  if (pathname === '/how-it-works' && isMobile && searchParams.get('view') !== 'desktop') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

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
