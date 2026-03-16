import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import type { Programme } from '@/lib/sanity/queries';

const builder = imageUrlBuilder(client);
function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

interface ProgrammeHighlightsProps {
  programmes: Programme[];
  locale: string;
}

export default async function ProgrammeHighlights({ programmes, locale }: ProgrammeHighlightsProps) {
  const t = await getTranslations('home');

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">{t('programmesHeading')}</h2>

        {programmes.length === 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 rounded-lg animate-pulse h-64" />
              <div className="bg-gray-100 rounded-lg animate-pulse h-64" />
              <div className="bg-gray-100 rounded-lg animate-pulse h-64" />
            </div>
            <p className="text-center text-gray-500 mt-6">{t('comingSoon')}</p>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programmes.map((programme) => (
              <Link key={programme._id} href={`/programmes/${programme.slug.current}`}>
                {/* Programme card links to /programmes/[slug] — these 404 until Phase 4 builds detail pages. Intentional per CONTEXT.md. */}
                <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  {programme.image && (
                    <div className="relative h-48">
                      <Image
                        fill
                        className="object-cover"
                        src={urlFor(programme.image).width(600).quality(75).url()}
                        alt={programme.title[locale as 'en' | 'ms' | 'ta'] ?? ''}
                      />
                    </div>
                  )}
                  <span className="inline-block px-2 py-1 text-xs bg-brand-green text-white rounded mt-3 ml-3">
                    {programme.category}
                  </span>
                  <p className="font-semibold p-3">
                    {programme.title[locale as 'en' | 'ms' | 'ta'] ?? programme.title.en ?? ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/programmes">
            <Button variant="outline">{t('viewAll')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
