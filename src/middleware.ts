import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const requestLimit = 60
const timeWindow = 60 * 1000
const requestCounts = new Map<string, { count: number; timestamp: number }>()

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname === '/' || !pathname.match(/^\/(en|vi)(\/|$)/)) {
        const defaultLocale = routing.defaultLocale 
        const url = new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}`, req.url)
        return NextResponse.redirect(url)
    }

    const langMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
    const locale = langMatch ? langMatch[1] : routing.defaultLocale

    const clientIP = req.headers.get('x-forwarded-for') ?? 'unknown'

    const now = Date.now()
    const requestData = requestCounts.get(clientIP)

    if (requestData) {
        if (now - requestData.timestamp < timeWindow) {
            if (requestData.count >= requestLimit) {
                return NextResponse.redirect(new URL(`/${locale}/auth/conflict`, req.url))
            }
            requestData.count++
        } else {
            requestCounts.set(clientIP, { count: 1, timestamp: now })
        }
    } else {
        requestCounts.set(clientIP, { count: 1, timestamp: now })
    }

    const token = req.cookies.get('token')?.value

    const pathWithoutLang = locale && langMatch ? pathname.substring(`/${locale}`.length) : pathname

    const protectedPaths = ['/admin', '/profile', '/api/protected-route']
    const protectedPatterns = ['/admin/', '/profile/', '/api/protected-route/']

    const isProtected =
        protectedPaths.includes(pathWithoutLang) ||
        protectedPatterns.some((pattern) => pathWithoutLang.startsWith(pattern))

    if (pathWithoutLang.startsWith('/auth/login') && token) {
        return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, req.url))
    }

    if (isProtected && !token) {
        const loginUrl = new URL(`/${locale}/auth/login`, req.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/:locale(en|vi)/dashboard/:path*',
        '/:locale(en|vi)/profile/:path*',
        '/:locale(en|vi)/api/protected-route/:path*',
        '/:locale(en|vi)/dashboard',
        '/:locale(en|vi)/profile',
        '/:locale(en|vi)/api/protected-route',
        '/:locale(en|vi)/auth/login',
        '/:locale(en|vi)/api/login',
        '/',
        '/((?!_next|api|static|public|favicon.ico).*)'
    ],
}