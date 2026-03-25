---
phase: 04-cms-driven-pages
plan: 01
subsystem: testing
tags: [vitest, tdd, sanity, i18n, schemas]

requires:
  - phase: 03-core-static-pages
    provides: established test pattern (fs.readFileSync), i18n test file, schema test file, queries.ts

provides:
  - 83 failing RED test assertions covering all Phase 4 requirements (TEAM-01-03, PROG-01-04, DOCS-01-05)
  - Fixed schema test bug (pdfDocument import and name assertion)
  - Page test stubs: team.test.ts, programmes.test.ts, documents.test.ts
  - i18n test assertions for team/programmes/documents namespaces in all 3 locales

affects: [04-02, 04-03, 04-04, 04-05]

tech-stack:
  added: []
  patterns:
    - "Wave 0 TDD: write all test stubs first (RED) before any implementation — gives downstream plans stable feedback loop"
    - "Page test stubs use fs.readFileSync/existsSync — avoids Next.js import errors in node test environment"

key-files:
  created:
    - tests/pages/team.test.ts
    - tests/pages/programmes.test.ts
    - tests/pages/documents.test.ts
  modified:
    - tests/sanity/schemas.test.ts
    - tests/ui/i18n-messages.test.ts

key-decisions:
  - "Schema test bug fix: import changed from '{ document }' to '{ pdfDocument }' — export name is pdfDocument (avoids browser global collision)"
  - "Schema registry assertion updated from 'document' to 'pdfDocument' — consistent with actual schema name"
  - "Page test stubs assert file existence + content presence (fs.readFileSync pattern) — consistent with Phase 3 test approach"
  - "ALL_TEAM_MEMBERS_QUERY tier inclusion test in team.test.ts covers both TEAM-02 and TEAM-03 requirements"

patterns-established:
  - "Wave 0 TDD: all page test stubs written in RED before any page implementation begins"
  - "i18n namespace tests loop over all 3 locales (en/ms/ta) for each key — 3x coverage per key"

requirements-completed: []

duration: 5min
completed: 2026-03-25
---

# Phase 4 Plan 01: Wave 0 TDD Test Stubs Summary

**83 RED test assertions for Phase 4 CMS pages — schema test bug fixed, page/query/i18n stubs in place as failing tests for team, programmes, and documents**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-25T15:18:00Z
- **Completed:** 2026-03-25T15:22:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Fixed pre-existing 6-test failure in schemas.test.ts caused by wrong `{ document }` import name
- Created 3 new page test stub files covering all 12 Phase 4 requirements (TEAM, PROG, DOCS)
- Added 54 new i18n assertions (18 keys × 3 locales) for team/programmes/documents namespaces
- Total: 224 passing (pre-existing), 83 failing RED (new Phase 4 stubs ready for 04-02 through 04-05)

## Task Commits

1. **Task 1: Fix schema test bug + add Phase 4 schema assertions** - `31cff68` (test)
2. **Task 2: Create page test stubs for team, programmes, documents** - `e6b603e` (test)
3. **Task 3: Update i18n-messages.test.ts with namespace assertions** - `7935509` (test)

## Files Created/Modified

- `tests/sanity/schemas.test.ts` — Fixed pdfDocument import bug; added tier/body/title-validation assertions (RED)
- `tests/pages/team.test.ts` — Page existence, getAllTeamMembers call, tier grouping, tier in query (RED)
- `tests/pages/programmes.test.ts` — Listing page, detail page, PROGRAMME_DETAIL_QUERY, getProgrammeBySlug (RED)
- `tests/pages/documents.test.ts` — Documents page, DocumentLibrary client component, asset query assertions (RED)
- `tests/ui/i18n-messages.test.ts` — Added team/programmes/documents namespace checks for all 3 locales (RED)

## Decisions Made

- Schema test import fix uses `{ pdfDocument }` (not alias) — makes test file consistent with actual export name
- Schema registry test updated to assert `'pdfDocument'` — the schema name in Sanity is `pdfDocument` not `document`
- Page test stubs check file existence AND content presence — ensures pages are properly wired, not empty stubs

## Deviations from Plan

None — plan executed exactly as specified. The 04-01 plan file was missing from the directory but was reconstructed from ROADMAP.md Wave 0 description and RESEARCH.md Wave 0 Gaps section.

## Issues Encountered

- 04-01-PLAN.md file was missing from `.planning/phases/04-cms-driven-pages/` directory — only 04-02 through 04-05 existed. Reconstructed plan objectives from ROADMAP.md plan list and RESEARCH.md Wave 0 Gaps section.

## Next Phase Readiness

- Plan 04-02 (schema mutations + queries + i18n + @portabletext/react) can proceed immediately
- All test assertions are documented in RED — 04-02 will turn schema/query/i18n assertions GREEN
- Page assertions (team/programmes/documents) remain RED until 04-03, 04-04, 04-05

---
*Phase: 04-cms-driven-pages*
*Completed: 2026-03-25*
