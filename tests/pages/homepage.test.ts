import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/page.tsx');
const HERO_PATH = path.resolve(process.cwd(), 'src/components/home/HeroSection.tsx');
const IMPACT_PATH = path.resolve(process.cwd(), 'src/components/home/ImpactStats.tsx');
const PROGRAMMES_PATH = path.resolve(process.cwd(), 'src/components/home/ProgrammeHighlights.tsx');

describe('homepage page.tsx (HOME-01, HOME-02, HOME-03, HOME-04)', () => {
  it('page.tsx file exists', () => {
    expect(fs.existsSync(PAGE_PATH)).toBe(true);
  });

  it('page.tsx contains HeroSection', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    expect(content).toContain('HeroSection');
  });

  it('page.tsx contains ImpactStats', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    expect(content).toContain('ImpactStats');
  });

  it('page.tsx contains ProgrammeHighlights', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    expect(content).toContain('ProgrammeHighlights');
  });

  it('page.tsx contains membership CTA link', () => {
    const content = fs.readFileSync(PAGE_PATH, 'utf-8');
    expect(content).toContain('membership');
  });
});

describe('homepage components exist (HOME-01)', () => {
  it('HeroSection.tsx exists', () => {
    expect(fs.existsSync(HERO_PATH)).toBe(true);
  });

  it('ImpactStats.tsx exists', () => {
    expect(fs.existsSync(IMPACT_PATH)).toBe(true);
  });

  it('ProgrammeHighlights.tsx exists', () => {
    expect(fs.existsSync(PROGRAMMES_PATH)).toBe(true);
  });
});

describe('years active logic (HOME-02)', () => {
  it('years active is a number >= 24', () => {
    const yearsActive = new Date().getFullYear() - 2002;
    expect(typeof yearsActive).toBe('number');
    expect(yearsActive).toBeGreaterThanOrEqual(24);
  });
});
