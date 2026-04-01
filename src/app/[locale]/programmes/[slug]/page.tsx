import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import { getProgrammeBySlug, getAllProgrammes } from '@/lib/sanity/queries';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const programmes = await getAllProgrammes();
  return programmes.map((p) => ({ slug: p.slug?.current })).filter((p) => p.slug);
}

interface ProgrammeDetailProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProgrammeDetailProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('programmesTitle'),
    description: t('programmesDescription'),
    openGraph: {
      title: t('programmesTitle'),
      description: t('programmesDescription'),
      url: `${baseUrl}/${locale}/programmes/${slug}`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}

export default async function ProgrammeDetailPage({ params }: ProgrammeDetailProps) {
  const { locale, slug } = await params;
  const [t, programme] = await Promise.all([
    getTranslations('programmes'),
    getProgrammeBySlug(slug),
  ]);

  if (!programme) notFound();

  const builder = imageUrlBuilder(client);
  const title = programme.title?.[locale as 'en' | 'ms' | 'ta'] ?? programme.title?.en ?? '';
  const description = programme.description?.[locale as 'en' | 'ms' | 'ta'] ?? programme.description?.en ?? '';
  const bodyContent = programme.body?.[locale as 'en' | 'ms' | 'ta'] ?? programme.body?.en ?? [];

  return (
    <main>
      {/* Hero image — full width */}
      {programme.image && (
        <div className="w-full aspect-video relative max-h-[480px] overflow-hidden">
          <Image
            src={builder.image(programme.image).width(1200).height(675).url()}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content container */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/programmes">
          <Button variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToList')}
          </Button>
        </Link>

        {/* Category badge */}
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green/20 mb-3">
          {programme.category}
        </span>

        {/* Title */}
        <h1 className="text-[28px] font-semibold text-foreground mb-4">{title}</h1>

        {/* Description — blockquote style */}
        {description && (
          <p className="text-base text-muted-foreground border-l-4 border-brand-green pl-4 italic mb-8">
            {description}
          </p>
        )}

        {/* Body — PortableText */}
        {bodyContent && bodyContent.length > 0 && (
          <div className="prose prose-neutral max-w-none">
            <PortableText
              value={bodyContent}
              components={{
                block: {
                  h2: ({ children }) => <h2 className="text-[20px] font-semibold mt-8 mb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-[14px] font-semibold mt-6 mb-2 text-muted-foreground">{children}</h3>,
                  normal: ({ children }) => <p className="text-base mb-4 leading-relaxed">{children}</p>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-green pl-4 italic text-muted-foreground">{children}</blockquote>,
                },
                list: {
                  bullet: ({ children }) => <ul className="ml-6 mb-4 space-y-1 list-disc">{children}</ul>,
                  number: ({ children }) => <ol className="ml-6 mb-4 space-y-1 list-decimal">{children}</ol>,
                },
                marks: {
                  link: ({ children, value }) => (
                    <a href={value?.href} className="text-brand-green underline hover:text-brand-green/80" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
