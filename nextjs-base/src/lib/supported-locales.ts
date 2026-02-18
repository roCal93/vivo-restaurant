import { unstable_cache } from 'next/cache'
import { defaultLocale, locales as staticLocales } from './locales'

function uniq(values: string[]) {
  return Array.from(new Set(values))
}

async function fetchLocalesFromStrapi(): Promise<string[]> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const url = `${apiUrl.replace(/\/$/, '')}/api/i18n/locales`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = process.env.STRAPI_API_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  const json: unknown = await res.json()

  if (Array.isArray(json)) {
    return json
      .map((item) => (item as { code?: unknown })?.code)
      .filter((code): code is string => typeof code === 'string' && code.length > 0)
  }

  const data = (json as { data?: unknown })?.data
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        const obj = item as { code?: unknown; attributes?: { code?: unknown } }
        const code = obj.code ?? obj.attributes?.code
        return typeof code === 'string' ? code : undefined
      })
      .filter((code): code is string => typeof code === 'string' && code.length > 0)
  }

  return []
}

export const getSupportedLocales = unstable_cache(
  async () => {
    const fromStrapi = await fetchLocalesFromStrapi().catch(() => [])
    const merged = uniq([...(staticLocales as readonly string[]), ...fromStrapi])
    return merged
  },
  ['supported-locales'],
  { revalidate: 60 * 60 }
)

export async function isSupportedLocale(locale: string): Promise<boolean> {
  const supported = await getSupportedLocales()
  return supported.includes(locale)
}

export { defaultLocale }
