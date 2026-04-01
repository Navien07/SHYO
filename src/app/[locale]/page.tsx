import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getSiteSettings, getProgrammeHighlights } from '@/lib/sanity/queries';
import HeroSection from '@/components/home/HeroSection'; // renders hero with /membership CTA
import ImpactStats from '@/components/home/ImpactStats';
import ProgrammeHighlights from '@/components/home/ProgrammeHighlights';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [siteSettings, programmes] = await Promise.all([
    getSiteSettings(),
    getProgrammeHighlights(),
  ]);

  return (
    <main>
      <HeroSection siteSettings={siteSettings} />
      <ImpactStats siteSettings={siteSettings} />
      <ProgrammeHighlights programmes={programmes} locale={locale} />
    </main>
  );
}
