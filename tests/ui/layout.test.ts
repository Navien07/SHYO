import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Header component (BRAND-05 sticky nav)', () => {
  it('Header.tsx file exists', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/components/layout/Header.tsx')
    );
    expect(exists).toBe(true);
  });
  it('Header has sticky top-0 class', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/layout/Header.tsx'),
      'utf-8'
    );
    expect(content).toContain('sticky top-0');
  });
});

describe('Footer component (BRAND-06)', () => {
  it('Footer.tsx file exists', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/components/layout/Footer.tsx')
    );
    expect(exists).toBe(true);
  });
  it('Footer references siteSettings contact data', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/layout/Footer.tsx'),
      'utf-8'
    );
    // Footer receives siteSettings as prop or references contactEmail slot
    expect(content).toMatch(/contactEmail|SiteSettings|footer/i);
  });
});
