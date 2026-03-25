import { getTranslations } from 'next-intl/server';
import { getAllDocuments } from '@/lib/sanity/queries';
import { DocumentLibrary } from './DocumentLibrary';

interface DocumentsPageProps {
  params: Promise<{ locale: string }>;
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
