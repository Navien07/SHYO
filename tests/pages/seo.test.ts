import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAGE_FILES = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/about/page.tsx',
  'src/app/[locale]/contact/page.tsx',
  'src/app/[locale]/team/page.tsx',
  'src/app/[locale]/programmes/page.tsx',
  'src/app/[locale]/programmes/[slug]/page.tsx',
  'src/app/[locale]/documents/page.tsx',
  'src/app/[locale]/membership/page.tsx',
  'src/app/[locale]/privacy/page.tsx',
];

describe('SEO generateMetadata (SEO-01)', () => {
  for (const filePath of PAGE_FILES) {
    it(`${filePath} contains generateMetadata`, () => {
      const fullPath = path.resolve(process.cwd(), filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).toContain('generateMetadata');
    });
  }
});

describe('SEO openGraph (SEO-02)', () => {
  for (const filePath of PAGE_FILES) {
    it(`${filePath} contains openGraph`, () => {
      const fullPath = path.resolve(process.cwd(), filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).toContain('openGraph');
    });
  }
});

describe('SEO sitemap and robots (SEO-03)', () => {
  it('src/app/sitemap.ts file exists', () => {
    const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  it('src/app/robots.ts file exists', () => {
    const robotsPath = path.resolve(process.cwd(), 'src/app/robots.ts');
    expect(fs.existsSync(robotsPath)).toBe(true);
  });
});

describe('SEO privacy page and PDPA content (SEO-04)', () => {
  it('src/app/[locale]/privacy/page.tsx file exists', () => {
    const privacyPath = path.resolve(process.cwd(), 'src/app/[locale]/privacy/page.tsx');
    expect(fs.existsSync(privacyPath)).toBe(true);
  });

  it('privacy/page.tsx contains PDPA', () => {
    const privacyPath = path.resolve(process.cwd(), 'src/app/[locale]/privacy/page.tsx');
    const content = fs.readFileSync(privacyPath, 'utf-8');
    expect(content).toContain('PDPA');
  });
});
