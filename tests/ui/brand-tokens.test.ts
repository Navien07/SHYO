import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const globalsCss = fs.readFileSync(
  path.resolve(process.cwd(), 'src/app/globals.css'),
  'utf-8'
);

describe('Brand tokens in globals.css', () => {
  it('has a non-inline @theme block (separate from shadcn @theme inline)', () => {
    // Must have a standalone @theme { without "inline" keyword immediately before it
    expect(globalsCss).toMatch(/@theme\s*\{/);
  });
  it('defines --color-brand-green as #32a852', () => {
    expect(globalsCss).toContain('--color-brand-green: #32a852');
  });
  it('defines --color-brand-green-dark as #1e7a36', () => {
    expect(globalsCss).toContain('--color-brand-green-dark: #1e7a36');
  });
  it('defines --color-brand-saffron as #c96a00', () => {
    expect(globalsCss).toContain('--color-brand-saffron: #c96a00');
  });
  it('defines --color-brand-charcoal as #1a1a1a', () => {
    expect(globalsCss).toContain('--color-brand-charcoal: #1a1a1a');
  });
  it('sets html[lang="ta"] line-height to 1.7 in @layer base', () => {
    expect(globalsCss).toContain('html[lang="ta"]');
    expect(globalsCss).toContain('line-height: 1.7');
  });
  it('sets base html font-size to 16px in @layer base', () => {
    expect(globalsCss).toContain('font-size: 16px');
  });
});
