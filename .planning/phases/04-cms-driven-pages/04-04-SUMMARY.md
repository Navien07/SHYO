---
phase: 04-cms-driven-pages
plan: "04"
subsystem: programmes-pages
tags: [programmes, cms, portabletext, isr, i18n, card-grid]
dependency_graph:
  requires: [04-01, 04-02]
  provides: [programmes-listing-page, programmes-detail-page, PROGRAMME_DETAIL_QUERY, getProgrammeBySlug]
  affects: [src/lib/sanity/queries.ts, messages/en.json, messages/ms.json, messages/ta.json]
tech_stack:
  added: ["@portabletext/react (PortableText component)"]
  patterns: [server-component, generateStaticParams, ISR, locale-aware-link, imageUrlBuilder]
key_files:
  created:
    - src/app/[locale]/programmes/page.tsx
    - src/app/[locale]/programmes/[slug]/page.tsx
  modified:
    - src/lib/sanity/queries.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json
decisions:
  - "generateStaticParams returns only { slug } objects (not locale cross-product) — locale segment handles its own params via locale/layout.tsx"
  - "PortableText bodyContent falls back to programme.body?.en ?? [] — prevents undefined crash per RESEARCH.md Pitfall 3"
  - "programmes i18n namespace added to all three locale files — title/emptyState/readMore/backToList keys"
metrics:
  duration: "3 minutes"
  completed_date: "2026-03-25"
  tasks_completed: 2
  files_created: 2
  files_modified: 4
---

# Phase 04 Plan 04: Programmes Pages Summary

Programmes listing page and detail page built as Next.js App Router Server Components. Listing shows all CMS-managed programmes as a responsive card grid; detail page renders hero image, category badge, description, and PortableText rich body. All 8 Wave 0 programme test stubs GREEN.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Programmes listing page with card grid | ea4223a | src/app/[locale]/programmes/page.tsx, src/lib/sanity/queries.ts, messages/*.json |
| 2 | Programme detail page with PortableText + generateStaticParams | bbdca56 | src/app/[locale]/programmes/[slug]/page.tsx |

## What Was Built

### Task 1: Programmes Listing Page

- `src/app/[locale]/programmes/page.tsx` — Server Component with `getAllProgrammes()` fetch
- Responsive card grid: 1 col mobile, 2 col tablet, 3 col desktop
- Each card: aspect-video image (with `ImageOff` fallback), category badge, title, description, Read More button
- Empty state with `LayoutGrid` icon when no programmes exist
- Locale-aware links via `@/i18n/navigation` Link component
- Added `PROGRAMME_DETAIL_QUERY` and `getProgrammeBySlug` to `src/lib/sanity/queries.ts`
- Added `PortableTextBlock` type to `Programme` type
- Added `programmes` namespace (`title`, `emptyState`, `readMore`, `backToList`) to all three locale message files

### Task 2: Programme Detail Page

- `src/app/[locale]/programmes/[slug]/page.tsx` — Server Component
- `generateStaticParams` exports slug list for static generation at build time
- `notFound()` called for invalid/missing slugs
- Hero image (full width, max 480px), Back link, category badge, title, description blockquote
- `PortableText` with custom components: h2, h3, normal paragraphs, blockquotes, bullet/number lists, external links
- Body content falls back to `programme.body?.en ?? []` to prevent undefined crash

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

**Note:** Pre-existing failures in `tests/pages/team.test.ts`, `tests/pages/documents.test.ts`, and i18n tests for `team`/`documents` namespaces are unchanged. These are scoped to plans 04-03 and 04-05 respectively.

## Verification

- `npx vitest run tests/pages/programmes.test.ts` — 8/8 GREEN
- Full suite: 238 pass, 69 pre-existing failures (team/documents pages not yet built, scoped to other plans)
- No regressions introduced

## Self-Check

Files created:
- src/app/[locale]/programmes/page.tsx — FOUND
- src/app/[locale]/programmes/[slug]/page.tsx — FOUND

Commits:
- ea4223a — FOUND
- bbdca56 — FOUND

## Self-Check: PASSED
