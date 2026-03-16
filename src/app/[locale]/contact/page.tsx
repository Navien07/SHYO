import { getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/lib/sanity/queries';
import { ContactForm } from './ContactForm';

export default async function ContactPage() {
  const [t, siteSettings] = await Promise.all([
    getTranslations('contact'),
    getSiteSettings(),
  ]);

  // WhatsApp deep link
  const waNumber = siteSettings?.whatsappNumber?.replace(/\D/g, '') ?? '';
  const waMessage = encodeURIComponent('Hi Seputeh HYO, I would like to enquire...');
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : '#';

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact Form */}
        <section>
          <ContactForm />
        </section>

        {/* Right: Contact Details */}
        <section className="space-y-8">
          {/* WhatsApp */}
          {waNumber && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('whatsappLabel')}</h2>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-green hover:underline"
              >
                {/* wa.me link — CONT-03 */}
                +{waNumber}
              </a>
            </div>
          )}

          {/* Email */}
          {siteSettings?.contactEmail && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('emailLabel')}</h2>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="text-brand-green hover:underline"
              >
                {siteSettings.contactEmail}
              </a>
            </div>
          )}

          {/* Social links */}
          {(siteSettings?.facebookUrl || siteSettings?.instagramUrl) && (
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('followUs')}</h2>
              <div className="flex gap-4">
                {siteSettings?.facebookUrl && (
                  <a
                    href={siteSettings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                )}
                {siteSettings?.instagramUrl && (
                  <a
                    href={siteSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-green hover:underline"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Google Map embed — CONT-06 */}
          <div>
            <h2 className="text-lg font-semibold mb-2">{t('mapLabel')}</h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63752.53539627049!2d101.65358259999999!3d3.1127786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49a0c3f0a4eb%3A0x69197f9e6b9dce68!2sSeputeh%2C%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1710000000000!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Seputeh, Kuala Lumpur map"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
