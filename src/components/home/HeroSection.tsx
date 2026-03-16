import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import type { SiteSettings } from '@/lib/sanity/queries';

const builder = imageUrlBuilder(client);
function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

interface HeroSectionProps {
  siteSettings: SiteSettings | null;
}

export default async function HeroSection({ siteSettings }: HeroSectionProps) {
  const t = await getTranslations('home');

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-brand-green">
      {siteSettings?.heroImage && (
        <Image
          fill
          className="object-cover"
          src={urlFor(siteSettings.heroImage).width(1920).quality(80).url()}
          alt=""
          priority
        />
      )}
      {/* Dark overlay ensures text readability over any background image */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('heroHeadline')}</h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">{t('heroSubline')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/membership">
            <Button className="bg-brand-saffron hover:bg-brand-saffron/90 text-white">
              {t('joinUs')}
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="border-white text-white bg-transparent hover:bg-white/20 hover:text-white">
              {t('learnMore')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
