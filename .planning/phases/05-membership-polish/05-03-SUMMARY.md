---
phase: 05-membership-polish
plan: 03
subsystem: seo-metadata
tags: [seo, generateMetadata, open-graph, sitemap, robots]
dependency_graph:
  requires: [05-01, 05-02]
  provides: [seo-metadata-all-pages, sitemap, robots-txt]
  affects:
    - src/app/[locale]/page.tsx
    - src/app/[locale]/about/page.tsx
    - src/app/[locale]/contact/page.tsx
    - src/app/[locale]/team/page.tsx
    - src/app/[locale]/programmes/page.tsx
    - src/app/[locale]/programmes/[slug]/page.tsx
    - src/app/[locale]/documents/page.tsx
    - src/app/[locale]/membership/page.tsx
    - src/app/sitemap.ts
    - src/app/robots.ts
tech_stack:
  added: []
  patterns: [next-generateMetadata, next-intl-server-translations, next-sitemap-route, next-robots-route]
key_files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified:
    - src/app/[locale]/page.tsx
    - src/app/[locale]/about/page.tsx
    - src/app/[locale]/contact/page.tsx
    - src/app/[locale]/team/page.tsx
    - src/app/[locale]/programmes/page.tsx
    - src/app/[locale]/programmes/[slug]/page.tsx
    - src/app/[locale]/documents/page.tsx
    - src/app/[locale]/membership/page.tsx
decisions:
  - generateMetadata uses getTranslations from next-intl/server with namespace meta — avoids useTranslations which is client-only
  - Programme detail page extracts both locale and slug from awaited params for per-page OG URL
  - sitemap.ts wraps getAllProgrammes() in try/catch — prevents build failure when Sanity is unavailable
  - admin-guide excluded from STATIC_PATHS per CONTEXT.md decision — noindex page omitted from sitemap
metrics:
  duration: 8min
  completed_date: "2026-04-02"
  tasks_completed: 2
  files_modified: 10
---

# Phase 5 Plan 03: SEO Metadata and Sitemap Summary

**One-liner:** generateMetadata with locale-aware Open Graph added to all 8 existing pages; sitemap.ts generates 24 static + dynamic programme entries; robots.ts allows all crawlers.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add generateMetadata with Open Graph to documents and membership pages | 36f997a | src/app/[locale]/documents/page.tsx, src/app/[locale]/membership/page.tsx |
| 1 | Add generateMetadata with Open Graph to home, about, contact, team, programmes pages | b967013 | src/app/[locale]/page.tsx, about/page.tsx, contact/page.tsx, team/page.tsx, programmes/page.tsx, programmes/[slug]/page.tsx |
| 2 | Create sitemap.ts and robots.ts | efd5a73 | src/app/sitemap.ts, src/app/robots.ts |

## What Was Built

### Task 1 — generateMetadata with Open Graph on All 8 Pages

Added `generateMetadata` export to each existing page file. Every page:
- Imports `getTranslations` from `next-intl/server` and `Metadata` from `next`
- Awaits `params` to extract `locale`
- Calls `getTranslations({ locale, namespace: 'meta' })` for locale-aware title/description
- Returns `title`, `description`, and `openGraph` with `og:title`, `og:description`, `og:url`, `og:image` (logo.svg 512×512), `og:type: website`, `og:locale`
- URL varies per page (home = `baseUrl/locale`, about = `.../about`, etc.)
- Programme detail page includes slug in OG URL: `baseUrl/locale/programmes/slug`

### Task 2 — sitemap.ts and robots.ts

`src/app/sitemap.ts`:
- 8 static paths × 3 locales = 24 static entries
- Dynamic programme entries from `getAllProgrammes()` with try/catch fallback
- Homepage: `priority: 1.0`, `changeFrequency: weekly`; others: `priority: 0.8`, `changeFrequency: monthly`
- Programme pages: `priority: 0.6`
- admin-guide excluded per CONTEXT.md

`src/app/robots.ts`:
- Allows all crawlers (`userAgent: '*', allow: '/'`)
- Includes `sitemap:` directive pointing to `${BASE_URL}/sitemap.xml`

## Verification Results

- `tests/pages/seo.test.ts`: 18/22 tests PASS — SEO-01, SEO-02, SEO-03 GREEN
- 4 failing tests are SEO-04 (privacy page) — handled in Plan 04 as expected
- No regressions in prior test suites

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

Files exist:
- FOUND: src/app/sitemap.ts
- FOUND: src/app/robots.ts
- FOUND: src/app/[locale]/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/about/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/contact/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/team/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/programmes/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/programmes/[slug]/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/documents/page.tsx (contains generateMetadata)
- FOUND: src/app/[locale]/membership/page.tsx (contains generateMetadata)

Commits exist:
- FOUND: 36f997a (documents + membership generateMetadata)
- FOUND: b967013 (home, about, contact, team, programmes generateMetadata)
- FOUND: efd5a73 (sitemap.ts + robots.ts)
