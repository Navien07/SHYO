import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const layoutContent = fs.readFileSync(
  path.resolve(process.cwd(), 'src/app/[locale]/layout.tsx'),
  'utf-8'
);

describe('Noto Sans Tamil font loading in locale layout', () => {
  it('imports Noto_Sans_Tamil from next/font/google', () => {
    expect(layoutContent).toContain('Noto_Sans_Tamil');
    expect(layoutContent).toContain("next/font/google");
  });
  it('uses variable option to expose CSS custom property', () => {
    expect(layoutContent).toContain('--font-noto-sans-tamil');
  });
  it('applies both font variables to html element className', () => {
    expect(layoutContent).toContain('notoSansTamil.variable');
  });
});
