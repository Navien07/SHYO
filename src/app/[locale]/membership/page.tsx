import { getTranslations } from 'next-intl/server';
import { MembershipForm } from './MembershipForm';

interface MembershipPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MembershipPage({ params }: MembershipPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'membership' });

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <MembershipForm />
    </main>
  );
}
