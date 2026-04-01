import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { MembershipForm } from './MembershipForm';

interface MembershipPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MembershipPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('membershipTitle'),
    description: t('membershipDescription'),
    openGraph: {
      title: t('membershipTitle'),
      description: t('membershipDescription'),
      url: `${baseUrl}/${locale}/membership`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}

export default async function MembershipPage({ params }: MembershipPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'membership' });

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <MembershipForm />
    </main>
  );
}
