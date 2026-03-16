import { getSiteSettings, getProgrammeHighlights } from '@/lib/sanity/queries';
import HeroSection from '@/components/home/HeroSection'; // renders hero with /membership CTA
import ImpactStats from '@/components/home/ImpactStats';
import ProgrammeHighlights from '@/components/home/ProgrammeHighlights';

interface HomePageProps {
  params: Promise<{ locale: string }>;
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
