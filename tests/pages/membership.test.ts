import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PAGE_PATH = path.resolve(process.cwd(), 'src/app/[locale]/membership/page.tsx');
const FORM_PATH = path.resolve(process.cwd(), 'src/app/[locale]/membership/MembershipForm.tsx');
const ACTIONS_PATH = path.resolve(process.cwd(), 'src/app/[locale]/membership/actions.ts');

describe('membership page and component files (MEMB-01)', () => {
  it('membership/page.tsx file exists', () => {
    expect(fs.existsSync(PAGE_PATH)).toBe(true);
  });

  it('membership/MembershipForm.tsx file exists', () => {
    expect(fs.existsSync(FORM_PATH)).toBe(true);
  });

  it('membership/actions.ts file exists', () => {
    expect(fs.existsSync(ACTIONS_PATH)).toBe(true);
  });
});

describe('membership actions.ts PDPA consent (MEMB-02)', () => {
  it('actions.ts contains z.literal(true) for PDPA consent validation', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('z.literal(true)');
  });
});

describe('membership actions.ts server action and schema (MEMB-03)', () => {
  it('actions.ts contains "use server" directive', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('use server');
  });

  it('actions.ts contains z.object (Zod schema)', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('z.object');
  });
});

describe('membership actions.ts applicant confirmation email (MEMB-04)', () => {
  it('actions.ts sends confirmation to applicant using parsed.data.email', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('parsed.data.email');
  });
});

describe('membership actions.ts org notification email (MEMB-05)', () => {
  it('actions.ts sends notification to organisation using ORG_EMAIL', () => {
    const content = fs.readFileSync(ACTIONS_PATH, 'utf-8');
    expect(content).toContain('ORG_EMAIL');
  });
});
