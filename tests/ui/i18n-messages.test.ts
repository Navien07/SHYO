import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const REQUIRED_NAV_KEYS = ['home', 'about', 'programmes', 'team', 'documents', 'contact', 'membership', 'openMenu', 'closeMenu'];
const REQUIRED_FOOTER_KEYS = ['tagline', 'privacyPolicy', 'copyright', 'quickLinks', 'contact'];
const REQUIRED_NOT_FOUND_KEYS = ['title', 'description', 'backHome'];

function loadMessages(locale: string): Record<string, Record<string, string>> | null {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), `messages/${locale}.json`), 'utf-8')
    );
  } catch {
    return null;
  }
}

for (const locale of ['en', 'ms', 'ta']) {
  describe(`messages/${locale}.json (I18N-02)`, () => {
    const messages = loadMessages(locale);

    it('file must be valid JSON', () => {
      expect(messages).not.toBeNull();
    });

    for (const key of REQUIRED_NAV_KEYS) {
      it(`has nav.${key}`, () => {
        expect(messages?.nav?.[key]).toBeDefined();
      });
    }
    for (const key of REQUIRED_FOOTER_KEYS) {
      it(`has footer.${key}`, () => {
        expect(messages?.footer?.[key]).toBeDefined();
      });
    }
    for (const key of REQUIRED_NOT_FOUND_KEYS) {
      it(`has NotFound.${key}`, () => {
        expect(messages?.NotFound?.[key]).toBeDefined();
      });
    }
  });
}
