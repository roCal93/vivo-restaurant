import { NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/lib/locales'

export async function GET() {
  return NextResponse.json(
    { locales, defaultLocale },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600',
      },
    }
  )
}
