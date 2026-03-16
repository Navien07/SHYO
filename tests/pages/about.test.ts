import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/about/page.tsx');
const MESSAGES_EN_PATH = path.resolve(process.cwd(), 'messages/en.json');

const REQUIRED_ABOUT_KEYS = [
  'title',
  'foundingDate',
  'missionHeading',
  'visionHeading',
  'mission',
  'vision',
  'focusAreasHeading',
  'registrationHeading',
  'registrationNumber',
];

describe('about page.tsx (ABOUT-01)', () => {
  it('about/page.tsx file exists', () => {
    expect(fs.existsSync(PAGE_PATH)).toBe(true);
  });
});

describe('about i18n namespace keys (ABOUT-02, ABOUT-03, ABOUT-04)', () => {
  let messages: Record<string, Record<string, string>> | null = null;

  try {
    messages = JSON.parse(fs.readFileSync(MESSAGES_EN_PATH, 'utf-8'));
  } catch {
    messages = null;
  }

  for (const key of REQUIRED_ABOUT_KEYS) {
    it(`messages/en.json has about.${key}`, () => {
      expect(messages?.about?.[key]).toBeDefined();
    });
  }
});
