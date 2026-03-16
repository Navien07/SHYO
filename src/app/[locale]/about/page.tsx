import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Page heading */}
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-12">{t('foundingDate')}</p>

      {/* Mission & Vision */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-brand-green mb-3">{t('missionHeading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('mission')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-brand-green mb-3">{t('visionHeading')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('vision')}</p>
        </div>
      </section>

      {/* Five Focus Areas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t('focusAreasHeading')}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            t('focusLeadership'),
            t('focusCulture'),
            t('focusCommunity'),
            t('focusSocialAwareness'),
            t('focusWellbeing'),
          ].map((area) => (
            <li
              key={area}
              className="flex items-center gap-3 p-4 rounded-lg border border-brand-green/20 bg-brand-green/5"
            >
              <span className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0" />
              <span className="font-medium text-gray-800">{area}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Registration Details */}
      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">{t('registrationHeading')}</h2>
        <p className="text-gray-600">
          <span className="font-medium">{t('registrationLabel')}:</span>{' '}
          {t('registrationNumber')}
        </p>
      </section>
    </main>
  );
}
