import type { OpeningDayConfig } from './opening-days'

/**
 * Fetches opening days from the first TextMapBlock found on the home page.
 * This is the single source of truth for the restaurant's opening hours.
 */
export async function fetchOpeningDaysFromTextMap(
  strapiUrl: string,
  strapiToken: string
): Promise<OpeningDayConfig[]> {
  try {
    const res = await fetch(
      `${strapiUrl}/api/pages?filters[slug][$eq]=home&locale=fr&pagination[pageSize]=1&populate[sections][populate][blocks][populate]=*`,
      {
        headers: { Authorization: `Bearer ${strapiToken}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return []

    const data = await res.json()
    const page = data?.data?.[0]
    if (!page) return []

    for (const section of page.sections || []) {
      for (const block of section.blocks || []) {
        if (block.__component !== 'blocks.text-map-block') continue
        const openingDays = block.openingDays
        if (Array.isArray(openingDays) && openingDays.length > 0) {
          return openingDays as OpeningDayConfig[]
        }
      }
    }
    return []
  } catch {
    return []
  }
}
