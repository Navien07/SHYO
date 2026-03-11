import { describe, it, expect } from 'vitest';
import { routing } from '../../src/i18n/routing';

describe('next-intl routing config', () => {
  it('defines locales en, ms, ta', () => {
    expect(routing.locales).toEqual(['en', 'ms', 'ta']);
  });
  it('sets defaultLocale to en', () => {
    expect(routing.defaultLocale).toBe('en');
  });
});
