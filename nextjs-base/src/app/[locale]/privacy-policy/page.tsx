import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout'
import { fetchAPI } from '@/lib/strapi'
import { defaultLocale } from '@/lib/locales'

type PolicyData = {
  title?: string
  content?: string
  lastUpdated?: string
}

type PolicyResponse = {
  data?: PolicyData | null
}

export const revalidate = 60

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const response = await fetchAPI<PolicyResponse>('/privacy-policy', {
    locale,
    next: { revalidate: 60 },
  })

  let policy = response?.data

  // If the page is missing in the requested locale, fallback to default locale.
  if ((!policy?.title || !policy?.content) && locale !== defaultLocale) {
    const fallbackResponse = await fetchAPI<PolicyResponse>('/privacy-policy', {
      locale: defaultLocale,
      next: { revalidate: 60 },
    })
    policy = fallbackResponse?.data
  }

  if (!policy?.title || !policy?.content) {
    notFound()
  }

  return (
    <Layout locale={locale}>
      <section
        className="relative min-h-screen px-4 py-24"
        style={{
          background:
            'radial-gradient(43.41% 65.16% at 65.56% 45.02%, #3CB152 0%, #194B23 79.62%)',
        }}
      >
        <div className="max-w-4xl mx-auto rounded-xl border border-white/20 bg-white/5 p-6 md:p-10 text-[#EBFFEE]">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6">
            {policy.title}
          </h1>
          {policy.lastUpdated && (
            <p className="text-sm opacity-80 mb-6">
              {locale === 'en' ? 'Last updated:' : 'Derniere mise a jour :'}{' '}
              {policy.lastUpdated}
            </p>
          )}
          <article className="prose prose-invert max-w-none whitespace-pre-line">
            {policy.content}
          </article>
        </div>
      </section>
    </Layout>
  )
}
