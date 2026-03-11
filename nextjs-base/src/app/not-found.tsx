'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { locales, defaultLocale } from '@/lib/locales'
import { Button } from '@/components/ui/Button'

export default function RootNotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if the first segment looks like an invalid locale
    const segments = pathname?.split('/').filter(Boolean) || []
    const firstSegment = segments[0]

    // If first segment exists but is not a valid locale, redirect to default locale
    if (
      firstSegment &&
      !(locales as readonly string[]).includes(firstSegment)
    ) {
      const remainingPath = segments.slice(1).join('/')
      const newPath = remainingPath
        ? `/${defaultLocale}/${remainingPath}`
        : `/${defaultLocale}`
      router.replace(newPath)
    }
  }, [pathname, router])

  const content = {
    fr: {
      title: '404',
      message: "Cette page n'existe pas.",
      button: "Retour à l'accueil",
    },
    en: {
      title: '404',
      message: "This page doesn't exist.",
      button: 'Back to home',
    },
  }

  const text = content[defaultLocale as 'fr' | 'en']

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(43.41% 65.16% at 65.56% 45.02%, #3CB152 0%, #194B23 79.62%)',
      }}
      aria-labelledby="notfound-title"
    >
      <section className="w-full max-w-xl rounded-xl border border-white/20 bg-white/5 p-8 md:p-10 text-center text-[#EBFFEE]">
        <h1 id="notfound-title" className="text-5xl font-semibold mb-4">
          {text.title}
        </h1>
        <p className="mb-8 opacity-90">{text.message}</p>
        <Button
          href={`/${defaultLocale}`}
          className="!text-base !leading-normal px-6 py-2"
        >
          {text.button}
        </Button>
      </section>
    </main>
  )
}
