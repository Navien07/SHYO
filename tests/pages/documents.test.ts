import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DOCUMENTS_PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/documents/page.tsx');
const DOCUMENT_LIBRARY_PATH = path.resolve(process.cwd(), 'src/app/[locale]/documents/DocumentLibrary.tsx');
const QUERIES_PATH = path.resolve(process.cwd(), 'src/lib/sanity/queries.ts');

describe('Documents page existence (DOCS-01)', () => {
  it('src/app/[locale]/documents/page.tsx exists', () => {
    expect(fs.existsSync(DOCUMENTS_PAGE_PATH)).toBe(true);
  });

  it('documents page fetches getAllDocuments', () => {
    const content = fs.readFileSync(DOCUMENTS_PAGE_PATH, 'utf-8');
    expect(content).toContain('getAllDocuments');
  });
});

describe('DocumentLibrary client component (DOCS-03)', () => {
  it('DocumentLibrary.tsx exists', () => {
    expect(fs.existsSync(DOCUMENT_LIBRARY_PATH)).toBe(true);
  });

  it('DocumentLibrary.tsx has use client directive', () => {
    const content = fs.readFileSync(DOCUMENT_LIBRARY_PATH, 'utf-8');
    expect(content).toContain("'use client'");
  });

  it('DocumentLibrary.tsx has category filter state', () => {
    const content = fs.readFileSync(DOCUMENT_LIBRARY_PATH, 'utf-8');
    expect(content).toContain('useState');
  });
});

describe('GROQ document query with file asset (DOCS-02)', () => {
  it('ALL_DOCUMENTS_QUERY fetches file asset url', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toMatch(/ALL_DOCUMENTS_QUERY[\s\S]*?asset->/);
  });

  it('ALL_DOCUMENTS_QUERY fetches file asset size', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toMatch(/ALL_DOCUMENTS_QUERY[\s\S]*?size/);
  });
});

describe('pdfDocument schema required metadata (DOCS-04, DOCS-05)', () => {
  it('queries.ts SanityDocument type has file asset url field', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toContain('url?:');
  });

  it('queries.ts SanityDocument type has file asset size field', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toContain('size?:');
  });
});
