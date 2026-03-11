import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout'
import { fetchAPI } from '@/lib/strapi'
import { defaultLocale } from '@/lib/locales'

type LegalData = {
  title?: string
  content?: string
  lastUpdated?: string
}

type LegalResponse = {
  data?: LegalData | null
}

export const revalidate = 60

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const response = await fetchAPI<LegalResponse>('/legal-notice', {
    locale,
    next: { revalidate: 60 },
  })

  let legal = response?.data

  // If the page is missing in the requested locale, fallback to default locale.
  if ((!legal?.title || !legal?.content) && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<LegalResponse>('/legal-notice', {
      locale: defaultLocale,
      next: { revalidate: 60 },
    })
    legal = fallbackResponse?.data
  }

  if (!legal?.title || !legal?.content) {
    notFound()
  }

  return (
    <Layout
      locale={locale}
      backgroundStyle={{
        background:
          'radial-gradient(43.41% 65.16% at 65.56% 45.02%, #3CB152 0%, #194B23 79.62%)',
      }}
    >
      <section className="relative px-4 py-24">
        <div className="max-w-4xl ml-auto rounded-xl border border-white/20 bg-white/5 p-6 md:p-10 text-[#EBFFEE] text-right">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6">
            {legal.title}
          </h1>
          {legal.lastUpdated && (
            <p className="text-sm opacity-80 mb-6">
              {locale === 'en' ? 'Last updated:' : 'Derniere mise a jour :'}{' '}
              {legal.lastUpdated}
            </p>
          )}
          <article className="prose prose-invert max-w-none whitespace-pre-line text-right">
            {legal.content}
          </article>
        </div>
      </section>
    </Layout>
  )
}
