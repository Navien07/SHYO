---
phase: 02-shared-ui
plan: 01
subsystem: testing
tags: [vitest, tdd, brand-tokens, i18n, next-intl, tailwind, fonts]

# Dependency graph
requires:
  - phase: 01-infrastructure
    provides: vitest.config.ts with tests/**/*.test.ts include pattern, locale routing with en/ms/ta
provides:
  - 7 RED test stubs in tests/ui/ covering all Phase 2 validation requirements
  - Stable RED→GREEN feedback loop for Plans 02-02 and 02-03
affects:
  - 02-02
  - 02-03

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "File-content tests: use fs.readFileSync + expect(content).toContain() — no JSDOM, pure node environment"
    - "File-existence tests: use fs.existsSync — guard readFileSync calls to avoid test runner crashes"
    - "Loop-generated describe blocks: iterate locales array to generate per-locale test suites without repetition"

key-files:
  created:
    - tests/ui/brand-tokens.test.ts
    - tests/ui/tamil-font.test.ts
    - tests/ui/responsive.test.ts
    - tests/ui/layout.test.ts
    - tests/ui/lang-switcher.test.ts
    - tests/ui/i18n-messages.test.ts
    - tests/ui/not-found.test.ts
  modified: []

key-decisions:
  - "All test stubs use fs.readFileSync/existsSync — avoids Next.js import errors in node test environment"
  - "i18n-messages.test.ts uses loop over locales array to reduce repetition and ensure parity across en/ms/ta"
  - "layout.test.ts footer test uses case-insensitive regex match for contactEmail|SiteSettings|footer — flexible enough to pass any reasonable Footer implementation"

patterns-established:
  - "Wave 0 TDD: write all test stubs first (RED) before any implementation — gives Plans 02 and 03 stable feedback loop"
  - "File-based tests: prefer content assertions over component rendering for layout/CSS validation"

requirements-completed:
  - BRAND-01
  - BRAND-02
  - BRAND-03
  - BRAND-04
  - BRAND-05
  - BRAND-06
  - BRAND-07
  - BRAND-09
  - I18N-01
  - I18N-02
  - I18N-04
  - I18N-05

# Metrics
duration: 3min
completed: 2026-03-13
---

# Phase 2 Plan 01: Wave 0 Test Stubs Summary

**7 RED vitest stubs in tests/ui/ providing a stable failing test suite for all Phase 2 brand, layout, font, and i18n validation requirements**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T13:26:16Z
- **Completed:** 2026-03-13T13:29:00Z
- **Tasks:** 2
- **Files modified:** 7 created

## Accomplishments

- Created tests/ui/ directory with 7 test files covering 23 test assertions
- All tests run RED (failing) without crashing Vitest — runner completes cleanly
- Tests cover brand tokens, Tamil font, responsive baseline, header/footer layout, language switcher, i18n messages, and 404 page requirements

## Task Commits

Each task was committed atomically:

1. **Task 1: brand-tokens, tamil-font, responsive stubs** - `06ed5dc` (test)
2. **Task 2: layout, lang-switcher, i18n-messages, not-found stubs** - `f40f674` (test)

## Files Created/Modified

- `tests/ui/brand-tokens.test.ts` - BRAND-01/I18N-04: asserts CSS custom properties and html[lang=ta] line-height in globals.css
- `tests/ui/tamil-font.test.ts` - BRAND-02: asserts Noto Sans Tamil font import and variable option in locale layout
- `tests/ui/responsive.test.ts` - BRAND-03/BRAND-04: asserts overflow-x-hidden and 16px font-size baseline
- `tests/ui/layout.test.ts` - BRAND-05/BRAND-06: asserts Header sticky class and Footer component existence
- `tests/ui/lang-switcher.test.ts` - I18N-01/I18N-05: asserts 3 locale labels and navigation.ts createNavigation exports
- `tests/ui/i18n-messages.test.ts` - I18N-02: asserts nav/footer/NotFound keys exist in all 3 message files
- `tests/ui/not-found.test.ts` - BRAND-07: asserts not-found.tsx and catch-all page existence

## Decisions Made

- All test stubs use `fs.readFileSync`/`existsSync` to avoid Next.js module import errors in node test environment
- `i18n-messages.test.ts` loops over locale array to generate test suites — avoids 51 lines of repetition
- Footer test uses case-insensitive regex (`/contactEmail|SiteSettings|footer/i`) to remain flexible for implementation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 7 RED test stubs ready — Plans 02-02 and 02-03 can immediately start implementation and turn tests GREEN
- Tests are stable: no imports of Next.js modules, no JSDOM, pure node environment — will not flake as project evolves

---
*Phase: 02-shared-ui*
*Completed: 2026-03-13*
