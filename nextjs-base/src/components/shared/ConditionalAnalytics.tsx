'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'

function hasConsent(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie
    .split(';')
    .some((c) => c.trim() === 'cookie_consent=accepted')
}

export default function ConditionalAnalytics() {
  const [accepted, setAccepted] = useState(hasConsent)

  useEffect(() => {
    const handler = () => setAccepted(true)
    window.addEventListener('cookie-consent-accepted', handler)
    return () => window.removeEventListener('cookie-consent-accepted', handler)
  }, [])

  if (!accepted) return null
  return <Analytics />
}
