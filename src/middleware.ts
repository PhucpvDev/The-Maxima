import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { jwtDecode } from 'jwt-decode';

const requestLimit = 60;
const timeWindow = 60 * 1000;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
}

interface UserCookie {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/' || !pathname.match(/^\/(en|vi|zh)(\/|$)/)) {
    const defaultLocale = routing.defaultLocale;
    const url = new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}`, req.url);
    return NextResponse.redirect(url);
  }

  const langMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = langMatch ? langMatch[1] : routing.defaultLocale;

  const clientIP = req.headers.get('x-forwarded-for') ?? 'unknown';

  const now = Date.now();
  const requestData = requestCounts.get(clientIP);

  if (requestData) {
    if (now - requestData.timestamp < timeWindow) {
      if (requestData.count >= requestLimit) {
        return NextResponse.redirect(new URL(`/${locale}/auth/conflict`, req.url));
      }
      requestData.count++;
    } else {
      requestCounts.set(clientIP, { count: 1, timestamp: now });
    }
  } else {
    requestCounts.set(clientIP, { count: 1, timestamp: now });
  }

  const token = req.cookies.get('token')?.value;

  const pathWithoutLang = locale && langMatch ? pathname.substring(`/${locale}`.length) : pathname;

  const protectedPaths = ['/admin', '/profile', '/api/protected-route'];
  const protectedPatterns = ['/admin/', '/profile/', '/api/protected-route/'];

  const isProtected =
    protectedPaths.includes(pathWithoutLang) ||
    protectedPatterns.some((pattern) => pathWithoutLang.startsWith(pattern));

  const isAdminPath =
    pathWithoutLang === '/admin' ||
    protectedPatterns.some(() => pathWithoutLang.startsWith('/admin/'));

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTimestamp) {
        const response = NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
        response.cookies.set('token', '', { expires: new Date(0), path: '/' });
        response.cookies.set('refresh_token', '', { expires: new Date(0), path: '/' });
        return response;
      }
    } catch (error) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('token', '', { expires: new Date(0), path: '/' });
      response.cookies.set('refresh_token', '', { expires: new Date(0), path: '/' });
      console.error(error)
      return response;
    }
  }

  if (isAdminPath) {
    const userCookie = req.cookies.get('user')?.value;
    if (userCookie) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userCookie)) as UserCookie;
        if (decodedUser.role !== 'admin') {
          const response = NextResponse.redirect(new URL(`/${locale}/`, req.url));
          response.cookies.set('token', '', { expires: new Date(0), path: '/' });
          response.cookies.set('refresh_token', '', { expires: new Date(0), path: '/' });
          response.cookies.set('user', '', { expires: new Date(0), path: '/' });
          return response;
        }
      } catch (error) {
        console.error('Error decoding user cookie:', error);
        const response = NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
        response.cookies.set('token', '', { expires: new Date(0), path: '/' });
        response.cookies.set('refresh_token', '', { expires: new Date(0), path: '/' });
        return response;
      }
    } else {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
  }

  if (pathWithoutLang.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, req.url));
  }

  if (isProtected && !token) {
    const loginUrl = new URL(`/${locale}/auth/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:locale(en|vi|zh)/dashboard/:path*',
    '/:locale(en|vi|zh)/profile/:path*',
    '/:locale(en|vi|zh)/api/protected-route/:path*',
    '/:locale(en|vi|zh)/dashboard',
    '/:locale(en|vi|zh)/profile',
    '/:locale(en|vi|zh)/api/protected-route',
    '/:locale(en|vi|zh)/admin/:path*', 
    '/:locale(en|vi|zh)/admin',
    '/:locale(en|vi|zh)/auth/login',
    '/:locale(en|vi|zh)/api/login',
    '/',
    '/((?!_next|api|static|public|favicon.ico).*)'
  ],
};