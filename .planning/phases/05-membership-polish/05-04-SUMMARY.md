---
phase: 05-membership-polish
plan: 04
subsystem: privacy-admin-qa
tags: [privacy, pdpa, admin-guide, noindex, seo, qa]
dependency_graph:
  requires: [05-01]
  provides: [privacy-page, admin-guide-page, pdpa-compliance]
  affects:
    - src/app/[locale]/privacy/page.tsx
    - src/app/[locale]/admin-guide/page.tsx
tech_stack:
  added: []
  patterns: [next-generateMetadata, next-intl-server-translations, noindex-robots-metadata]
key_files:
  created:
    - src/app/[locale]/privacy/page.tsx
    - src/app/[locale]/admin-guide/page.tsx
  modified: []
decisions:
  - Privacy page uses font-normal on H2 headings per UI-SPEC (not font-bold)
  - Admin Guide is EN-only hardcoded content — not CMS-driven per CONTEXT.md
  - Admin Guide noindex via robots object in generateMetadata — excluded from sitemap
  - Privacy page OG tags included (publicly indexed page)
  - Admin Guide omits openGraph entirely (noindex page does not need social sharing tags)
metrics:
  duration: 5min
  completed_date: "2026-04-02"
  tasks_completed: 2
  files_modified: 2
---

# Phase 5 Plan 04: Privacy Policy and Admin Guide Summary

**One-liner:** Static Privacy Policy with 5 PDPA 2010 sections across 3 locales, and EN-only Admin Guide with 6 Sanity Studio sections marked noindex.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create Privacy Policy page with PDPA 2010 sections and generateMetadata | b922c1c | src/app/[locale]/privacy/page.tsx |
| 2 | Create Admin Guide page with noindex and 6 Sanity sections | 3eb968a | src/app/[locale]/admin-guide/page.tsx |

## What Was Built

### Task 1 — Privacy Policy Page

`src/app/[locale]/privacy/page.tsx`:
- `generateMetadata` export using `meta` namespace (`privacyTitle`, `privacyDescription`)
- Full Open Graph tags (title, description, url, siteName, images, type, locale)
- Page renders 5 sections from `privacy` namespace translations (available in EN/BM/Tamil)
- Section content covers PDPA 2010: what data collected, why collected, how stored, rights under PDPA, contact for data requests
- `max-w-3xl` layout, H2 `font-normal` per UI-SPEC
- Footer link (`Link href="/privacy"` from `@/i18n/navigation`) already works — no Footer changes needed

### Task 2 — Admin Guide Page

`src/app/[locale]/admin-guide/page.tsx`:
- `generateMetadata` with `robots: { index: false, follow: false }` — prevents search indexing
- EN-only hardcoded content (no i18n, no CMS)
- 6 sections with `<strong>` labels for Sanity UI elements, `<code>` for `/studio` path
- Covers: login, team member editing, programme editing, PDF upload, site settings, ISR explanation
- Not linked from nav or footer — direct URL access only per CONTEXT.md

## Verification Results

- `tests/pages/seo.test.ts`: 22/22 tests PASS — SEO-01, SEO-02, SEO-03, SEO-04 all GREEN
- `npx vitest run`: 523/523 tests PASS — no regressions

## Checkpoints Awaiting

### Task 3: HTTPS Verification (SEO-05)
- Type: human-verify
- Status: awaiting — infrastructure verification only, no code change needed
- How to verify: confirm padlock icon at deployed Vercel URL, confirm http:// redirects to https://

### Task 4: Responsive QA and Accessibility Checklist
- Type: human-verify
- Status: awaiting — manual browser testing required
- Scope: membership form + privacy page responsive behaviour, WCAG 2.1 AA, Tamil rendering

## Deviations from Plan

None — automated tasks executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

Files exist:
- FOUND: src/app/[locale]/privacy/page.tsx (contains PDPA)
- FOUND: src/app/[locale]/admin-guide/page.tsx (contains Sanity Studio)

Commits exist:
- FOUND: b922c1c (privacy page)
- FOUND: 3eb968a (admin-guide page)
