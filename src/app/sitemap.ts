import type { MetadataRoute } from 'next';
import { getAllProgrammes } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';
const LOCALES = ['en', 'ms', 'ta'] as const;
const STATIC_PATHS = [
  '',           // home
  '/about',
  '/contact',
  '/team',
  '/programmes',
  '/documents',
  '/membership',
  '/privacy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let programmes: { slug?: { current?: string } }[] = [];
  try {
    programmes = await getAllProgrammes();
  } catch {
    // Fallback: if Sanity unavailable at build time, generate sitemap without dynamic entries
    programmes = [];
  }

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '' ? 1.0 : 0.8,
    }))
  );

  const programmeEntries = LOCALES.flatMap((locale) =>
    programmes
      .filter((p) => p.slug?.current)
      .map((p) => ({
        url: `${BASE_URL}/${locale}/programmes/${p.slug!.current}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  );

  return [...staticEntries, ...programmeEntries];
}
