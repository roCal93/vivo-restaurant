import React from 'react'
import { LangSetter } from '@/components/locale'
import { PageTransition } from '@/components/animations/PageTransition'
import { notFound } from 'next/navigation'
import { isSupportedLocale } from '@/lib/supported-locales'

export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!(await isSupportedLocale(locale))) {
    notFound()
  }

  return (
    <PageTransition>
      <LangSetter lang={locale} />
      {children}
    </PageTransition>
  )
}
