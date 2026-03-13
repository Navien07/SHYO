import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('src/i18n/navigation.ts (I18N-05)', () => {
  it('navigation.ts file exists', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/i18n/navigation.ts')
    );
    expect(exists).toBe(true);
  });
  it('exports Link, useRouter, usePathname from createNavigation', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/i18n/navigation.ts'),
      'utf-8'
    );
    expect(content).toContain('createNavigation');
    expect(content).toContain('Link');
    expect(content).toContain('useRouter');
    expect(content).toContain('usePathname');
  });
});

describe('LanguageSwitcher component (I18N-01)', () => {
  it('LanguageSwitcher.tsx file exists', () => {
    const exists = fs.existsSync(
      path.resolve(process.cwd(), 'src/components/layout/LanguageSwitcher.tsx')
    );
    expect(exists).toBe(true);
  });
  it('renders 3 locale labels in native script', () => {
    const content = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/layout/LanguageSwitcher.tsx'),
      'utf-8'
    );
    expect(content).toContain('English');
    expect(content).toContain('Bahasa Malaysia');
    expect(content).toContain('தமிழ்');
  });
});
