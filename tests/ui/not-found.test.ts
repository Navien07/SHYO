import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Localized 404 page (BRAND-07)', () => {
  it('not-found.tsx exists in [locale] segment', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/app/[locale]/not-found.tsx')
    );
    expect(exists).toBe(true);
  });
  it('not-found.tsx uses NotFound translation namespace', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/[locale]/not-found.tsx'),
      'utf-8'
    );
    expect(content).toContain("NotFound");
  });
  it('catch-all page.tsx exists to trigger notFound()', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/app/[locale]/[...rest]/page.tsx')
    );
    expect(exists).toBe(true);
  });
});
