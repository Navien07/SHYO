---
phase: 02-shared-ui
plan: 03
subsystem: ui
tags: [next-intl, tailwind, next.js, footer, i18n, 404]

# Dependency graph
requires:
  - phase: 02-shared-ui plan 01
    provides: Wave 0 test stubs for layout, i18n-messages, not-found
  - phase: 02-shared-ui plan 02
    provides: Header component, getSiteSettings query, brand tokens, Nav shell components, navigation.ts
provides:
  - Footer component with 3-column desktop / single-column mobile layout (bg-brand-charcoal)
  - Locale layout with Header + main + Footer shell wrapping every page
  - Localized 404 page (not-found.tsx) using NotFound translation namespace
  - Catch-all route ([...rest]/page.tsx) triggering notFound()
  - Complete EN/BM/Tamil message files (9 nav + 8 footer + 3 NotFound keys each)
affects: [03-pages, 04-content, 05-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Footer receives siteSettings as prop from locale layout (Server Component to Server Component)"
    - "locale layout wraps getSiteSettings() in try/catch to gracefully handle missing Sanity env vars"
    - "Footer Quick Links use Link from @/i18n/navigation to auto-prepend locale prefix"
    - "Mobile column reorder: flex-col with order-* classes (Col1→Col3→Col2 — contact before nav on small screens)"

key-files:
  created:
    - src/components/layout/Footer.tsx
    - src/app/[locale]/not-found.tsx
    - src/app/[locale]/[...rest]/page.tsx
  modified:
    - src/app/[locale]/layout.tsx
    - messages/en.json
    - messages/ms.json
    - messages/ta.json
    - tests/ui/i18n-messages.test.ts

key-decisions:
  - "Footer uses Link from @/i18n/navigation (not next/link) — locale-aware links auto-prepend /ms/, /ta/ prefixes"
  - "getSiteSettings() wrapped in try/catch in locale layout — returns null gracefully in CI without Sanity env vars"
  - "Footer mobile order: Col1 (branding) → Col3 (contact) → Col2 (nav) via order-* Tailwind classes"
  - "i18n-messages.test.ts pre-existing bug fixed: continue inside for..of with for label invalid in ESM/esbuild context"

patterns-established:
  - "Server Component data fetching: locale layout fetches siteSettings, passes down as prop to Footer"
  - "Catch-all route pattern: [...rest]/page.tsx calls notFound() to trigger locale-aware 404 boundary"

requirements-completed: [BRAND-03, BRAND-04, BRAND-06, BRAND-07, I18N-02]

# Metrics
duration: 3min
completed: 2026-03-13
---

# Phase 2 Plan 03: Layout Shell + Footer + 404 Summary

**Sticky Header + dark charcoal 3-column Footer wired into locale layout shell, with localized 404 page and complete EN/BM/Tamil message files (20 keys each)**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-13T21:36:33Z
- **Completed:** 2026-03-13T21:39:27Z
- **Tasks:** 2 auto (+ 1 human-verify checkpoint pending)
- **Files modified:** 7

## Accomplishments
- Footer.tsx built with 3-column desktop layout (branding / quick links / contact+social), single-column mobile with contact before nav links
- Locale layout updated to inject Header + Footer around page content with flex-col min-h-screen body
- Localized 404 page created using useTranslations('NotFound') with catch-all route trigger
- All 3 message files completed: 9 nav + 8 footer + 3 NotFound keys in EN, BM (Bahasa Malaysia), and Tamil
- All 7 test files pass GREEN (77 tests total)

## Task Commits

Each task was committed atomically:

1. **Task 1: Footer component + locale layout update** - `0557b52` (feat)
2. **Task 2: Localized 404 page + complete message files** - `511f7a3` (feat)

## Files Created/Modified
- `src/components/layout/Footer.tsx` - 3-col desktop / 1-col mobile footer with bg-brand-charcoal, locale-aware Links, siteSettings prop
- `src/app/[locale]/layout.tsx` - Updated to inject Header, main wrapper, Footer with try/catch around getSiteSettings()
- `src/app/[locale]/not-found.tsx` - Localized 404 page using useTranslations('NotFound')
- `src/app/[locale]/[...rest]/page.tsx` - Catch-all route calling notFound()
- `messages/en.json` - Complete: 9 nav + 8 footer + 3 NotFound keys
- `messages/ms.json` - Complete Bahasa Malaysia translations
- `messages/ta.json` - Complete Tamil translations
- `tests/ui/i18n-messages.test.ts` - Pre-existing build error fixed (continue in for..of)

## Decisions Made
- Footer uses `Link` from `@/i18n/navigation` (not `next/link`) — ensures Quick Links on /ms/ send to /ms/about, not /about
- `getSiteSettings()` wrapped in try/catch in locale layout — Footer gracefully shows null state when Sanity env vars absent (CI/CD)
- Mobile footer column order uses `order-*` Tailwind classes: Col1 (branding, order-1) → Col3 (contact, order-2) → Col2 (nav, order-3 mobile / order-2 desktop)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing build error in i18n-messages.test.ts**
- **Found during:** Task 1 verification
- **Issue:** `continue` statement inside `for...of` loop used inside a `describe()` block — invalid in ESM/esbuild context, causes "Cannot use continue here" transform error
- **Fix:** Refactored to extract `loadMessages()` as a function returning null on error, check result inside describe block without continue
- **Files modified:** tests/ui/i18n-messages.test.ts
- **Verification:** Test file builds and runs — 57 tests pass GREEN
- **Committed in:** 0557b52 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 pre-existing bug in test stub)
**Impact on plan:** Fix was necessary to unblock i18n test verification. No scope creep.

## Issues Encountered
- None beyond the test stub bug documented above.

## User Setup Required
None - no external service configuration required for this plan.

## Next Phase Readiness
- Phase 2 layout shell complete: sticky nav + 3-locale language switcher + hamburger mobile drawer + dark charcoal footer on every locale page
- All 3 locales (EN/BM/Tamil) have complete UI string coverage
- 404 pages render translated content for all locales
- Browser verification (Task 3 checkpoint) still pending — awaiting human sign-off
- Phase 3 (pages) can proceed after browser verification passes

---
*Phase: 02-shared-ui*
*Completed: 2026-03-13*
