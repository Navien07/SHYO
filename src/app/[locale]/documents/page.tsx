import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getAllDocuments } from '@/lib/sanity/queries';
import { DocumentLibrary } from './DocumentLibrary';

interface DocumentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DocumentsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('documentsTitle'),
    description: t('documentsDescription'),
    openGraph: {
      title: t('documentsTitle'),
      description: t('documentsDescription'),
      url: `${baseUrl}/${locale}/documents`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale } = await params;
  const [t, documents] = await Promise.all([
    getTranslations('documents'),
    getAllDocuments(),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-[28px] font-semibold mb-8">{t('title')}</h1>
      <DocumentLibrary
        documents={documents}
        locale={locale}
        translations={{
          colTitle: t('colTitle'),
          colCategory: t('colCategory'),
          colYear: t('colYear'),
          colDate: t('colDate'),
          colSize: t('colSize'),
          download: t('download'),
          filterAll: t('filterAll'),
          emptyState: t('emptyState'),
        }}
      />
    </main>
  );
}
