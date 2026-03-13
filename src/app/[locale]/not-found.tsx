import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-brand-green-dark mb-4" aria-label="404 - Page not found">
        404
      </h1>
      <p className="text-xl text-gray-900 mb-2">{t('title')}</p>
      <p className="text-gray-600 mb-6 max-w-md">{t('description')}</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-brand-green-dark text-white font-medium rounded-md hover:bg-brand-green transition-colors"
      >
        {t('backHome')}
      </Link>
    </main>
  );
}
