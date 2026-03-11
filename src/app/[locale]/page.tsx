import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('nav');
  return (
    <main>
      <h1>Seputeh HYO</h1>
      <p>{t('home')}</p>
    </main>
  );
}
