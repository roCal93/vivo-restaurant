'use client'

import { useMemo, useState } from 'react'

const CONSENT_COOKIE_NAME = 'cookie_consent'
const ONE_YEAR = 60 * 60 * 24 * 365

function setConsentCookie(value: 'accepted' | 'rejected') {
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(true)

  const isEn = useMemo(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.lang?.toLowerCase().startsWith('en')
  }, [])

  const labels = isEn
    ? {
        text: 'We use audience measurement cookies to improve the website. You can accept or refuse these cookies.',
        accept: 'Accept',
        reject: 'Refuse',
      }
    : {
        text: 'Nous utilisons des cookies de mesure d\'audience pour ameliorer le site. Vous pouvez accepter ou refuser ces cookies.',
        accept: 'Accepter',
        reject: 'Refuser',
      }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[300] px-4 pb-4">
      <div className="mx-auto max-w-4xl rounded-xl border border-white/30 bg-[#194B23]/95 text-[#EBFFEE] p-4 shadow-xl backdrop-blur-sm">
        <p className="text-sm leading-relaxed">{labels.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setConsentCookie('rejected')
              setVisible(false)
            }}
            className="rounded-md border border-[#EBFFEE]/40 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            {labels.reject}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsentCookie('accepted')
              setVisible(false)
              window.location.reload()
            }}
            className="rounded-md bg-[#EBFFEE] px-4 py-2 text-sm text-[#194B23] font-semibold hover:opacity-90 transition-opacity"
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
