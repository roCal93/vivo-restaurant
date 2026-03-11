'use client'

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const pathname = usePathname()
  const segments = pathname?.split('/').filter(Boolean) || []
  const locale =
    segments[0] === 'en' || segments[0] === 'fr' ? segments[0] : 'fr'

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

  const text = content[locale as 'fr' | 'en']

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
          href={`/${locale}`}
          className="!text-base !leading-normal px-6 py-2"
        >
          {text.button}
        </Button>
      </section>
    </main>
  )
}
