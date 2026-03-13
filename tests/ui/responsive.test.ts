import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const globalsCss = fs.readFileSync(
  path.resolve(process.cwd(), 'src/app/globals.css'),
  'utf-8'
);

describe('Responsive baseline in globals.css', () => {
  it('sets base font-size to 16px', () => {
    expect(globalsCss).toContain('font-size: 16px');
  });
});

describe('Root layout overflow', () => {
  it('locale layout or globals.css prevents horizontal scroll', () => {
    const localeLayout = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/[locale]/layout.tsx'),
      'utf-8'
    );
    const hasOverflow =
      globalsCss.includes('overflow-x-hidden') ||
      localeLayout.includes('overflow-x-hidden');
    expect(hasOverflow).toBe(true);
  });
});
