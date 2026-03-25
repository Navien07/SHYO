import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import { getAllProgrammes } from '@/lib/sanity/queries';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ImageOff } from 'lucide-react';

interface ProgrammesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProgrammesPage({ params }: ProgrammesPageProps) {
  const { locale } = await params;
  const [t, programmes] = await Promise.all([
    getTranslations('programmes'),
    getAllProgrammes(),
  ]);

  const builder = imageUrlBuilder(client);

  if (programmes.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-[28px] font-semibold mb-8">{t('title')}</h1>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LayoutGrid className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('emptyState')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-[28px] font-semibold mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((programme) => {
          const title = programme.title?.[locale as 'en' | 'ms' | 'ta'] ?? programme.title?.en ?? '';
          const description = programme.description?.[locale as 'en' | 'ms' | 'ta'] ?? programme.description?.en ?? '';

          return (
            <div
              key={programme._id}
              className="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Image */}
              {programme.image ? (
                <div className="aspect-video relative">
                  <Image
                    src={builder.image(programme.image).width(600).height(338).url()}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ImageOff className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Category badge */}
                <span className="inline-flex items-center self-start px-2 py-0.5 rounded text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green/20 mb-2">
                  {programme.category}
                </span>
                <h2 className="text-[20px] font-semibold text-foreground line-clamp-2 mb-2">{title}</h2>
                <p className="text-base text-muted-foreground line-clamp-3 flex-1">{description}</p>
                <div className="mt-4">
                  <Link href={`/programmes/${programme.slug?.current}`}>
                    <Button className="bg-brand-saffron text-white hover:bg-brand-saffron/90">
                      {t('readMore')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
