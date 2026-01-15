import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Si intenta acceder al dashboard sin token, redirigir a login
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Si intenta acceder al login con token, redirigir al dashboard
  if (pathname.includes('/login')) {
    if (authToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
