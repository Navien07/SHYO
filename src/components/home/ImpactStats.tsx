import { getTranslations } from 'next-intl/server';
import type { SiteSettings } from '@/lib/sanity/queries';

interface ImpactStatsProps {
  siteSettings: SiteSettings | null;
}

export default async function ImpactStats({ siteSettings }: ImpactStatsProps) {
  const t = await getTranslations('home');
  const yearsActive = new Date().getFullYear() - 2002;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-5xl font-bold text-brand-green">{yearsActive}</p>
          <p className="text-gray-600 mt-2">{t('impactYears')}</p>
        </div>
        <div>
          <p className="text-5xl font-bold text-brand-green">
            {siteSettings?.memberCount ?? '—'}
          </p>
          <p className="text-gray-600 mt-2">{t('impactMembers')}</p>
        </div>
        <div>
          <p className="text-5xl font-bold text-brand-green">
            {siteSettings?.programmesDelivered ?? '—'}
          </p>
          <p className="text-gray-600 mt-2">{t('impactProgrammes')}</p>
        </div>
      </div>
    </section>
  );
}
