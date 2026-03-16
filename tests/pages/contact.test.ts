import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/contact/page.tsx');
const FORM_PATH = path.resolve(process.cwd(), 'src/app/[locale]/contact/ContactForm.tsx');
const ACTIONS_PATH = path.resolve(process.cwd(), 'src/app/[locale]/contact/actions.ts');

describe('contact page and component files (CONT-01, CONT-02)', () => {
  it('contact/page.tsx file exists', () => {
    expect(fs.existsSync(PAGE_PATH)).toBe(true);
  });

  it('contact/ContactForm.tsx file exists', () => {
    expect(fs.existsSync(FORM_PATH)).toBe(true);
  });

  it('contact/actions.ts file exists', () => {
    expect(fs.existsSync(ACTIONS_PATH)).toBe(true);
  });
});

describe('contact actions.ts contents (CONT-04, CONT-05)', () => {
  it('actions.ts contains "use server" directive', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('use server');
  });

  it('actions.ts exports sendContactForm', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('sendContactForm');
  });

  it('actions.ts contains z.object (Zod schema)', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('z.object');
  });

  it('actions.ts contains z.string().email() (email validation)', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('z.string().email()');
  });
});

describe('contact page.tsx contents (CONT-03, CONT-06)', () => {
  it('contact/page.tsx contains WhatsApp link (wa.me)', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    expect(content).toContain('wa.me');
  });

  it('contact/page.tsx contains map embed (iframe or google.com/maps)', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    const hasIframe = content.includes('iframe');
    const hasGoogleMaps = content.includes('google.com/maps');
    expect(hasIframe || hasGoogleMaps).toBe(true);
  });
});
