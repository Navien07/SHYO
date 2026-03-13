import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import { routing } from '../../i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/sanity/queries';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-noto-sans-tamil',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'ms' | 'ta')) {
    notFound();
  }
  const messages = await getMessages();

  let siteSettings = null;
  try {
    siteSettings = await getSiteSettings();
  } catch {
    // Sanity env vars not configured (e.g. CI without .env.local) — graceful fallback
    siteSettings = null;
  }

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansTamil.variable}`}
    >
      <body className="overflow-x-hidden flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer siteSettings={siteSettings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
