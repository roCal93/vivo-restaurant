import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './src/lib/locales'

const ADMIN_COOKIE = 'admin_token'
const ADMIN_SECRET = process.env.ADMIN_SECRET

function decodeBase64Url(input: string): string | null {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4)
    return atob(padded)
  } catch {
    return null
  }
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!ADMIN_SECRET || !token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(ADMIN_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const expectedSignatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    )
    const expectedSignature = toBase64Url(expectedSignatureBuffer)

    if (!timingSafeEqualString(signature, expectedSignature)) {
      return false
    }

    const payloadJson = decodeBase64Url(payload)
    if (!payloadJson) return false

    const parsed = JSON.parse(payloadJson) as { exp?: number }
    if (!parsed.exp || typeof parsed.exp !== 'number') return false

    return Date.now() <= parsed.exp
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl
    const isReservationPage =
      pathname === '/reservation-page' || pathname.endsWith('/reservation-page')
    if (req.method === 'GET' && isReservationPage) {
      const sensitiveParams = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'message',
        'website',
        'consent',
      ]

      const cleanedUrl = req.nextUrl.clone()
      let removed = false
      for (const key of sensitiveParams) {
        if (cleanedUrl.searchParams.has(key)) {
          cleanedUrl.searchParams.delete(key)
          removed = true
        }
      }

      if (removed) {
        return NextResponse.redirect(cleanedUrl)
      }
    }

    const isRscOrPrefetchRequest =
      req.headers.get('rsc') === '1' ||
      req.headers.has('next-router-prefetch') ||
      req.headers.get('accept')?.includes('text/x-component')

    // ── Admin routes ──────────────────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
      // Always allow the login page
      if (pathname === '/admin/login') return NextResponse.next()
      // Redirect to login if token is missing or invalid
      const token = req.cookies.get(ADMIN_COOKIE)?.value
      const isValid = await isValidAdminToken(token)
      if (!isValid) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.next()
    }

    // Ignore static assets, API and other non-page requests
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    const segments = pathname.split('/').filter(Boolean)
    const first = segments[0]
    const locale =
      first && (locales as readonly string[]).includes(first)
        ? first
        : defaultLocale

    // Only redirect when there is NO locale segment at all ("/").
    // If the first segment exists but is not a supported locale (e.g. "/f"),
    // we let the request through so the app can render a proper 404.
    if (!first) {
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}${url.pathname}`

      const redirectRes = NextResponse.redirect(url)
      try {
        redirectRes.cookies.set({
          name: 'locale',
          value: locale,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        })
      } catch {
        const cookieValue = `locale=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === 'production' ? '; Secure; HttpOnly' : ''}`
        redirectRes.headers.set('set-cookie', cookieValue)
      }

      return redirectRes
    }

    // If the first segment exists but is not a supported locale, do not rewrite/redirect.
    if (!(locales as readonly string[]).includes(first)) {
      return NextResponse.next()
    }

    const res = NextResponse.next()

    // Avoid mutating cookies on RSC/prefetch requests used by App Router soft navigation.
    if (isRscOrPrefetchRequest) {
      return res
    }

    const currentLocaleCookie = req.cookies.get('locale')?.value
    if (currentLocaleCookie === locale) {
      return res
    }

    try {
      // Prefer the Cookies API when available (sets HttpOnly cookie)
      res.cookies.set({
        name: 'locale',
        value: locale,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      })
    } catch {
      // Fallback to setting header
      const cookieValue = `locale=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === 'production' ? '; Secure; HttpOnly' : ''}`
      res.headers.set('set-cookie', cookieValue)
    }

    return res
  } catch {
    const { pathname } = req.nextUrl
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }
}

// Match all non-api and non-_next routes (including /admin)
export const config = {
  matcher: ['/((?!_next|api|static).*)'],
}
