---
phase: 04-cms-driven-pages
plan: 02
subsystem: sanity-schemas, groq-queries, i18n
tags: [sanity, schema, groq, typescript, i18n, portabletext]
dependency_graph:
  requires: [04-01]
  provides: [tier-field, body-field, pdfDocument-schema, PROGRAMME_DETAIL_QUERY, getProgrammeBySlug, team-i18n, programmes-i18n, documents-i18n]
  affects: [04-03, 04-04, 04-05]
tech_stack:
  added: ["@portabletext/react@6.0.3", "@portabletext/types"]
  patterns: ["pdfDocument export rename (browser global collision avoidance)", "inline defineField for sub-field validation", "localised PortableTextBlock array object pattern"]
key_files:
  created: []
  modified:
    - src/sanity/schemas/teamMember.ts
    - src/sanity/schemas/programme.ts
    - src/sanity/schemas/document.ts
    - src/sanity/schemas/index.ts
    - src/lib/sanity/queries.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json
    - package.json
decisions:
  - "pdfDocument export/schema name used (not 'document') — avoids browser global collision per Phase 04-01 bug fix pattern"
  - "PortableTextBlock imported from @portabletext/types (transitive of sanity) — avoids extra package while keeping explicit type"
  - "ALL_DOCUMENTS_QUERY targets _type == pdfDocument — schema name changed from 'document'"
  - "BM and Tamil translations are approximations — native-speaker review before public launch (consistent with Phase 3 policy)"
metrics:
  duration: "5min"
  completed_date: "2026-03-25"
  tasks_completed: 3
  files_modified: 9
---

# Phase 4 Plan 2: Schema Mutations, Queries, Types, i18n Summary

**One-liner:** Sanity schema mutations (tier/body/pdfDocument), GROQ query updates with asset dereferencing, TypeScript type extensions, getProgrammeBySlug helper, and i18n namespaces for all three CMS-driven pages.

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Schema mutations | 290275a | tier on teamMember, body on programme, pdfDocument rename + title required validation, index.ts update |
| 2 | GROQ queries + types + @portabletext/react | e2a26cf | TeamMember.tier, Programme.body, SanityDocument.file dereferenced, PROGRAMME_DETAIL_QUERY, getProgrammeBySlug, @portabletext/react installed |
| 3 | i18n namespaces | edaacac | team/programmes/documents namespaces in en.json, ms.json, ta.json |

## Verification Results

| Test Suite | Status | Notes |
|-----------|--------|-------|
| tests/sanity/schemas.test.ts | GREEN (33/33) | tier, body, pdfDocument validation all pass |
| tests/ui/i18n-messages.test.ts | GREEN (198/198) | All team/programmes/documents keys present in all 3 locales |
| tests/pages/programmes.test.ts GROQ tests | GREEN (3/3) | PROGRAMME_DETAIL_QUERY, getProgrammeBySlug, body field |
| tests/pages/documents.test.ts GROQ tests | GREEN (4/4) | asset->, url?, size? all present |
| tests/pages/programmes.test.ts page tests | RED (5 fail) | Expected — pages created in 04-04 |
| tests/pages/documents.test.ts page tests | RED (5 fail) | Expected — pages created in 04-05 |
| tests/pages/team.test.ts | RED (5 fail) | Expected — pages created in 04-03 |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] document.ts export/schema name mismatch with test expectations**
- **Found during:** Task 1 (checking schemas.test.ts imports `{ pdfDocument }`)
- **Issue:** document.ts exported `document` and had `name: 'document'`, but tests expected `pdfDocument` and `name: 'pdfDocument'`. schemas/index.ts imported `{ document }` causing schema registry test failure.
- **Fix:** Renamed export to `pdfDocument`, changed schema name to `pdfDocument`, updated index.ts import. Also updated ALL_DOCUMENTS_QUERY to target `_type == "pdfDocument"`.
- **Files modified:** src/sanity/schemas/document.ts, src/sanity/schemas/index.ts, src/lib/sanity/queries.ts
- **Note:** This aligns with the Phase 04-01 decision recorded in STATE.md: "Schema test bug fix: import changed from '{ document }' to '{ pdfDocument }'"

## Known Stubs

None — this plan is a data foundation plan with no UI components. All changes are schema definitions, GROQ queries, TypeScript types, and i18n keys. No UI stubs.

## Self-Check: PASSED
