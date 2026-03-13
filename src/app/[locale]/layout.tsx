import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import { routing } from '../../i18n/routing';

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
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansTamil.variable}`}
    >
      <body className="overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
