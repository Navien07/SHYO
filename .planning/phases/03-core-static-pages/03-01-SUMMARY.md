---
phase: 03-core-static-pages
plan: "01"
subsystem: testing
tags: [vitest, tdd, i18n, sanity, fs-existssync, red-state]

# Dependency graph
requires:
  - phase: 02-shared-ui
    provides: test infrastructure (vitest, fs-based test patterns), i18n-messages.test.ts and schemas.test.ts as extension base
provides:
  - Failing test stubs for all 15 Phase 3 requirements (HOME-01 to HOME-04, ABOUT-01 to ABOUT-04, CONT-01 to CONT-06)
  - tests/pages/homepage.test.ts — structural + unit tests for homepage components
  - tests/pages/about.test.ts — structural + namespace key tests for about page
  - tests/pages/contact.test.ts — structural + content + Zod assertion tests for contact page
  - Extended schemas.test.ts with siteSettings Phase 3 field assertions
  - Extended i18n-messages.test.ts with home/about/contact namespace assertions for all 3 locales
affects:
  - 03-02 (homepage implementation — these tests become green)
  - 03-03 (about implementation — about tests become green)
  - 03-04 (contact implementation — contact tests become green)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - fs.existsSync for component file existence assertions in node test environment
    - fs.readFileSync for string-content assertions (no-import pattern for 'use server' files)
    - Pure logic unit tests (years-active) inline without imports

key-files:
  created:
    - tests/pages/homepage.test.ts
    - tests/pages/about.test.ts
    - tests/pages/contact.test.ts
  modified:
    - tests/sanity/schemas.test.ts
    - tests/ui/i18n-messages.test.ts

key-decisions:
  - "siteSettings schema was already extended with heroImage/memberCount/programmesDelivered before this TDD plan ran — schema assertions pass immediately (not RED)"
  - "Contact actions.ts Zod import skipped — fs.readFileSync used instead to avoid 'use server' module import errors in node test env"
  - "about.test.ts loads en.json directly for namespace key checks, matching the existing i18n-messages.test.ts pattern"

patterns-established:
  - "File existence assertions: fs.existsSync(path.resolve(process.cwd(), 'src/...'))"
  - "Content assertions: fs.readFileSync(path, 'utf-8').includes('string') — avoids Next.js/React imports in node env"
  - "Namespace key loops: for (const key of REQUIRED_KEYS) { it('has namespace.key', ...) } — consistent with Phase 2 i18n test pattern"

requirements-completed:
  - HOME-01
  - HOME-02
  - HOME-03
  - HOME-04
  - ABOUT-01
  - ABOUT-02
  - ABOUT-03
  - ABOUT-04
  - CONT-01
  - CONT-02
  - CONT-03
  - CONT-04
  - CONT-05
  - CONT-06

# Metrics
duration: 3min
completed: 2026-03-16
---

# Phase 3 Plan 01: Core Static Pages Test Stubs Summary

**5 test files covering all 15 Phase 3 requirements in RED state — 47 tests failing (26 page stubs + 21 missing ms/ta locale keys), zero syntax errors, all Phase 2 tests remain green**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-16T16:51:02Z
- **Completed:** 2026-03-16T16:54:00Z
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 extended)

## Accomplishments

- Created 3 new test files (`homepage.test.ts`, `about.test.ts`, `contact.test.ts`) with 28 assertions covering all 15 Phase 3 requirements via structural file checks and content assertions
- Extended `schemas.test.ts` with 3 new siteSettings field assertions (heroImage, memberCount, programmesDelivered)
- Extended `i18n-messages.test.ts` with home (10 keys), about (9 keys), contact (11 keys) namespace assertions across all 3 locales (EN/BM/Tamil) — 90 new assertions total

## Task Commits

Each task was committed atomically:

1. **Task 1: Write homepage, about, and contact test stubs (RED)** - `d9bf0a0` (test)
2. **Task 2: Extend existing test files for siteSettings and i18n Phase 3 namespaces** - `f6ade1d` (test)

**Plan metadata:** _(pending final commit)_

## Files Created/Modified

- `tests/pages/homepage.test.ts` — 3 describes: page content checks (HeroSection/ImpactStats/ProgrammeHighlights/membership), component existence checks, years-active unit test
- `tests/pages/about.test.ts` — page existence check + about namespace key loop against en.json
- `tests/pages/contact.test.ts` — page/form/actions existence, actions.ts directive/export/Zod content checks, page content checks (wa.me, map embed)
- `tests/sanity/schemas.test.ts` — added 3 assertions for heroImage, memberCount, programmesDelivered inside existing siteSettings describe block
- `tests/ui/i18n-messages.test.ts` — added REQUIRED_HOME_KEYS (10), REQUIRED_ABOUT_KEYS (9), REQUIRED_CONTACT_KEYS (11) constants and corresponding locale loops

## Decisions Made

- Contact actions.ts Zod import skipped in favor of `fs.readFileSync` content check — avoids `'use server'` module import errors in the vitest node environment (consistent with Phase 2 pattern for Next.js-specific files)
- about.test.ts namespace key checks load `messages/en.json` directly rather than going through the full locale loop — simpler for a file-existence-paired test
- siteSettings schema assertions written as planned; they pass immediately because the schema was pre-extended in a prior session (documented as deviation below)

## Deviations from Plan

### Observation (not an auto-fix)

**siteSettings schema pre-extended before TDD plan**
- **Found during:** Task 2 verification
- **Issue:** Plan expected `heroImage`, `memberCount`, `programmesDelivered` assertions to fail RED. The `src/sanity/schemas/siteSettings.ts` file already contains all three fields (likely added during Phase 2 Plan 03 or an ad-hoc session).
- **Impact:** The 3 schema assertions pass immediately (GREEN) rather than failing RED. This is correct test behaviour — the tests accurately reflect the schema state. No fix needed.
- **Resolution:** Assertions left as written; they correctly verify the schema and will guard against accidental field removal.

---

**Total deviations:** 0 auto-fixes — 1 observation (schema pre-implemented)
**Impact on plan:** No scope creep. Deviations do not affect completeness of test coverage.

## Issues Encountered

None — all tests created without errors. The pre-extended schema meant 3 of the 90 new test assertions were immediately green rather than red, but this reflects correct state.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 15 Phase 3 requirements have automated test coverage
- `npx vitest run` correctly exits non-zero (47 failing tests), providing a clear feedback loop for implementations
- Phase 3 Plans 02-04 can begin implementing homepage, about, and contact pages with confidence that tests will turn green as each requirement is met
- All Phase 2 tests remain green (no regression)

---
*Phase: 03-core-static-pages*
*Completed: 2026-03-16*
