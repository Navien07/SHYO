import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { SiteSettings } from '@/lib/sanity/queries';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'programmes', href: '/programmes' },
  { key: 'team', href: '/team' },
  { key: 'documents', href: '/documents' },
  { key: 'contact', href: '/contact' },
  { key: 'membership', href: '/membership' },
] as const;

interface FooterProps {
  siteSettings: SiteSettings | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-brand-charcoal-text">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/*
          Mobile: flex-col (single column, Col1 → Col3 → Col2 order via order-* classes)
          Desktop: grid-cols-3
        */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:gap-8">

          {/* Col 1: Branding — order-1 (first on both mobile and desktop) */}
          <div className="order-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3" aria-label="Seputeh HYO — Home">
              <Image src="/logo.svg" alt="Seputeh HYO logo" width={120} height={30} />
            </Link>
            <p className="text-sm text-gray-400 mb-1">Seputeh HYO</p>
            <p className="text-sm text-gray-400 mb-4">{t('tagline')}</p>
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              {t('privacyPolicy')}
            </Link>
          </div>

          {/* Col 3 (Contact) — order-2 on mobile (before nav links), order-3 on desktop */}
          <div className="order-2 lg:order-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              {t('contact')}
            </h3>
            {siteSettings?.contactEmail && (
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="block text-sm text-gray-400 hover:text-white transition-colors mb-2 min-h-[44px] flex items-center"
                aria-label={`Email ${siteSettings.contactEmail}`}
              >
                {siteSettings.contactEmail}
              </a>
            )}
            {siteSettings?.whatsappNumber && (
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 hover:text-white transition-colors mb-4 min-h-[44px] flex items-center"
                aria-label="Contact us on WhatsApp"
              >
                WhatsApp
              </a>
            )}
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              {t('followUs')}
            </p>
            <div className="flex gap-3">
              {siteSettings?.facebookUrl && (
                <a
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Follow us on Facebook"
                >
                  {/* Facebook icon — inline SVG for zero dependency */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {siteSettings?.instagramUrl && (
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Follow us on Instagram"
                >
                  {/* Instagram icon — inline SVG */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
            {/* Fallback when no siteSettings data yet (Sanity not configured) */}
            {!siteSettings && (
              <p className="text-sm text-gray-500 italic">Contact info loading...</p>
            )}
          </div>

          {/* Col 2 (Quick Links) — order-3 on mobile (after contact), order-2 on desktop */}
          <div className="order-3 lg:order-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — copyright */}
      <div className="border-t border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
