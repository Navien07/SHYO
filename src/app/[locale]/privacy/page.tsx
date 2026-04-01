import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    openGraph: {
      title: t('privacyTitle'),
      description: t('privacyDescription'),
      url: `${baseUrl}/${locale}/privacy`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  const sections = [
    { heading: t('section1Heading'), body: t('section1Body') },
    { heading: t('section2Heading'), body: t('section2Body') },
    { heading: t('section3Heading'), body: t('section3Body') },
    { heading: t('section4Heading'), body: t('section4Body') },
    { heading: t('section5Heading'), body: t('section5Body') },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      <p className="text-sm text-muted-foreground mb-12">{t('lastUpdated')}</p>

      {/* PDPA 2010 — Personal Data Protection Act 2010, Malaysia */}
      {sections.map((section) => (
        <section key={section.heading} className="mb-8">
          <h2 className="text-xl font-normal mb-3">{section.heading}</h2>
          <p className="text-base leading-relaxed">{section.body}</p>
        </section>
      ))}
    </main>
  );
}
