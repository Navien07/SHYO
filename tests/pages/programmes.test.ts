import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROGRAMMES_PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/programmes/page.tsx');
const PROGRAMME_DETAIL_PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/programmes/[slug]/page.tsx');
const QUERIES_PATH = path.resolve(process.cwd(), 'src/lib/sanity/queries.ts');

describe('Programmes listing page existence (PROG-01)', () => {
  it('src/app/[locale]/programmes/page.tsx exists', () => {
    expect(fs.existsSync(PROGRAMMES_PAGE_PATH)).toBe(true);
  });

  it('programmes listing page fetches getAllProgrammes', () => {
    const content = fs.readFileSync(PROGRAMMES_PAGE_PATH, 'utf-8');
    expect(content).toContain('getAllProgrammes');
  });

  it('programmes listing page shows category badge (PROG-04)', () => {
    const content = fs.readFileSync(PROGRAMMES_PAGE_PATH, 'utf-8');
    expect(content).toContain('category');
  });
});

describe('Programme detail page existence (PROG-02)', () => {
  it('src/app/[locale]/programmes/[slug]/page.tsx exists', () => {
    expect(fs.existsSync(PROGRAMME_DETAIL_PAGE_PATH)).toBe(true);
  });

  it('programme detail page uses getProgrammeBySlug', () => {
    const content = fs.readFileSync(PROGRAMME_DETAIL_PAGE_PATH, 'utf-8');
    expect(content).toContain('getProgrammeBySlug');
  });
});

describe('GROQ query for programme detail (PROG-03)', () => {
  it('queries.ts exports PROGRAMME_DETAIL_QUERY', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toContain('PROGRAMME_DETAIL_QUERY');
  });

  it('queries.ts exports getProgrammeBySlug helper', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toContain('getProgrammeBySlug');
  });

  it('PROGRAMME_DETAIL_QUERY fetches body field', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toMatch(/PROGRAMME_DETAIL_QUERY[\s\S]*?body/);
  });
});
