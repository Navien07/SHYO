import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEAM_PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/team/page.tsx');
const QUERIES_PATH = path.resolve(process.cwd(), 'src/lib/sanity/queries.ts');

describe('Our Team page existence (TEAM-01)', () => {
  it('src/app/[locale]/team/page.tsx exists', () => {
    expect(fs.existsSync(TEAM_PAGE_PATH)).toBe(true);
  });

  it('team page.tsx fetches getAllTeamMembers', () => {
    const content = fs.readFileSync(TEAM_PAGE_PATH, 'utf-8');
    expect(content).toContain('getAllTeamMembers');
  });
});

describe('Our Team tier grouping (TEAM-03)', () => {
  it('team page.tsx groups by president tier', () => {
    const content = fs.readFileSync(TEAM_PAGE_PATH, 'utf-8');
    expect(content).toContain('president');
  });

  it('team page.tsx groups by senior tier', () => {
    const content = fs.readFileSync(TEAM_PAGE_PATH, 'utf-8');
    expect(content).toContain('senior');
  });

  it('team page.tsx groups by committee tier', () => {
    const content = fs.readFileSync(TEAM_PAGE_PATH, 'utf-8');
    expect(content).toContain('committee');
  });
});

describe('Our Team queries include tier (TEAM-02)', () => {
  it('ALL_TEAM_MEMBERS_QUERY includes tier in projection', () => {
    const content = fs.readFileSync(QUERIES_PATH, 'utf-8');
    expect(content).toMatch(/ALL_TEAM_MEMBERS_QUERY/);
    expect(content).toContain('tier');
  });
});
