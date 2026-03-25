---
phase: 04-cms-driven-pages
plan: "05"
subsystem: ui
tags: [next-intl, sanity, groq, react, lucide-react, tailwind]

# Dependency graph
requires:
  - phase: 04-01
    provides: Wave 0 TDD stubs for documents page tests (RED)
  - phase: 04-02
    provides: pdfDocument Sanity schema, SanityDocument type, getAllDocuments() query helper

provides:
  - PDF Document Library server page at /[locale]/documents with server-side data fetch
  - DocumentLibrary client component with category filter tabs, document table, file size formatting, and download links
  - ALL_DOCUMENTS_QUERY updated to dereference asset-> and fetch url + size
  - SanityDocument type updated with url? and size? on file.asset
  - documents i18n namespace added to en/ms/ta message files

affects:
  - nav (documents route already wired in Nav)
  - 04-01 (test stubs now GREEN)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server page passes pre-resolved translation strings as props to client component (getTranslations is server-only)
    - formatBytes() as local helper — no external library for file size formatting
    - Client-side filter with useState + .filter() — no URL params, no page reload

key-files:
  created:
    - src/app/[locale]/documents/page.tsx
    - src/app/[locale]/documents/DocumentLibrary.tsx
  modified:
    - src/lib/sanity/queries.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json

key-decisions:
  - "ALL_DOCUMENTS_QUERY uses asset-> dereference operator to fetch url and size from Sanity CDN — required for client-side rendering without server-side image builder"
  - "translations passed as resolved string props from server page to client component — getTranslations() is server-only and cannot be called in use client components"
  - "formatBytes() implemented as local helper (no external dep) — per RESEARCH.md Pattern 6"
  - "Category filter is purely client-side useState — no URL change, matches CONTEXT.md locked decision"
  - "Download uses <a href target=_blank> wrapping a Button — direct PDF open, no modal/confirmation per CONTEXT.md locked decision"

patterns-established:
  - "Server page pre-resolves all translation strings, passes to client component as typed translations prop"
  - "GROQ asset dereference pattern: file{ asset->{ url, size } } for file attachments"

requirements-completed: [DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05]

# Metrics
duration: 5min
completed: 2026-03-25
---

# Phase 04 Plan 05: Document Library Summary

**PDF Document Library with server-fetched Sanity documents, client-side category filter tabs, formatted file sizes, and accessible download links opening PDFs in new tab**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-25T15:30:00Z
- **Completed:** 2026-03-25T15:35:59Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments

- Document Library server page fetches all documents via getAllDocuments() with Promise.all for translations + data
- DocumentLibrary client component with 6-category filter tabs (All, Annual Report, Constitution, Minutes, Policy, Other), document table, formatBytes() helper, and download links
- ALL_DOCUMENTS_QUERY updated with asset-> GROQ dereference to expose url and size fields at runtime
- SanityDocument TypeScript type updated to reflect url? and size? on file.asset (matching runtime shape)
- documents i18n namespace added to all 3 locale message files (en, ms, ta) with 9 translation keys
- All 9 Wave 0 document test stubs now GREEN (DOCS-01 through DOCS-05)

## Task Commits

1. **Task 1: Document Library server page + DocumentLibrary client component** - `7af13fb` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/app/[locale]/documents/page.tsx` — Server component; fetches getAllDocuments() + translations, renders DocumentLibrary
- `src/app/[locale]/documents/DocumentLibrary.tsx` — 'use client' component; category filter state, table render, formatBytes(), download links with target=_blank
- `src/lib/sanity/queries.ts` — Updated ALL_DOCUMENTS_QUERY with asset-> dereference; updated SanityDocument type with url?/size?
- `messages/en.json` — Added documents namespace (9 keys)
- `messages/ms.json` — Added documents namespace (9 keys, BM translations)
- `messages/ta.json` — Added documents namespace (9 keys, Tamil translations)

## Decisions Made

- ALL_DOCUMENTS_QUERY uses `file{ asset->{ url, size } }` GROQ dereference — required to expose CDN url and file size at query time, avoiding separate client-side builder calls
- Translation strings pre-resolved on server and passed as `translations` prop — getTranslations() is server-only; client components cannot call it
- formatBytes() as local inline function — no external dependency needed for simple byte formatting
- Category filter is pure useState in-memory filter — matches CONTEXT.md locked decision (no URL params)
- Empty state shown when documents.length === 0; filtered-empty state shown as table row when filter has no matches

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated SanityDocument type and ALL_DOCUMENTS_QUERY to expose url/size fields**
- **Found during:** Task 1 (pre-implementation review of test requirements)
- **Issue:** Test assertions required `url?:` and `size?:` in SanityDocument type, and `asset->` in ALL_DOCUMENTS_QUERY. The existing type had `{ asset: { _ref: string } }` (reference only, no dereferenced fields) and the query did not dereference the asset, so url/size would be undefined at runtime
- **Fix:** Updated SanityDocument.file type to `{ asset?: { url?: string; size?: number } }`; updated GROQ query to `file{ asset->{ url, size } }`
- **Files modified:** src/lib/sanity/queries.ts
- **Verification:** 2 test assertions for DOCS-02/DOCS-04/DOCS-05 now GREEN
- **Committed in:** 7af13fb (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Fix was necessary for runtime correctness (file download links would always render '—' without url) and to satisfy Wave 0 test contract. No scope creep.

## Issues Encountered

None beyond the auto-fixed query/type update above.

## Known Stubs

None — the page fetches live Sanity data via getAllDocuments(). Empty state handling is implemented for both no-documents and filtered-no-match states. No hardcoded placeholders that block the plan goal.

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- Document Library page is complete and all tests GREEN
- Phase 04 Plan 05 satisfies DOCS-01 through DOCS-05
- Remaining Phase 04 plans: 02 (schema), 03 (team page), 04 (programmes page) — these are parallel wave 3 plans being handled by other agents
- After all wave 3 plans complete, Phase 04 is done and Phase 05 can begin

---
*Phase: 04-cms-driven-pages*
*Completed: 2026-03-25*
