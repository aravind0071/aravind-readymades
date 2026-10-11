import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_SESSION_NAME } from '@/lib/auth/constants';
import { verifySessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Unified login redirect: /admin/login -> /login
  if (pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', '/admin/dashboard');
    return NextResponse.redirect(url);
  }

  // 2. Read and verify session token from cookie
  const sessionCookie = request.cookies.get(COOKIE_SESSION_NAME)?.value;
  const session = await verifySessionToken(sessionCookie);

  // 3. Protect Admin Routes: Only HOST allowed!
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== 'host') {
      // Authenticated but not a host (member tried to access admin)
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = '/account';
      deniedUrl.searchParams.set('error', 'unauthorized_host_required');
      return NextResponse.redirect(deniedUrl);
    }

    return NextResponse.next();
  }

  // 4. Protect Member Account Routes: Any Authenticated User allowed
  if (pathname.startsWith('/account')) {
    if (!session) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 5. If already logged in, visiting /login redirects to respective destination
  if (pathname === '/login' && session) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    if (redirectParam && redirectParam.startsWith('/')) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }

    const destination = session.role === 'host' ? '/admin/dashboard' : '/account';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login'],
};
