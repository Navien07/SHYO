---
phase: 03-core-static-pages
plan: "02"
subsystem: sanity, i18n, config
tags: [sanity, next-intl, groq, next-image, typescript, trilingual]

requires:
  - phase: 02-shared-ui
    provides: siteSettings schema foundation (contactEmail, whatsappNumber, facebookUrl, instagramUrl), SiteSettings TypeScript type, getSiteSettings() fetch helper, next-intl locale messages (nav/footer/NotFound namespaces)
  - phase: 03-01
    provides: test stubs for schema fields (heroImage, memberCount, programmesDelivered) and i18n namespaces (home/about/contact) that Plan 02 implements

provides:
  - siteSettings Sanity schema extended with heroImage (image+hotspot), memberCount (number), programmesDelivered (number)
  - SiteSettings TypeScript type extended with 3 new optional fields
  - SITE_SETTINGS_QUERY GROQ projection updated to include 3 new fields
  - PROGRAMME_HIGHLIGHTS_QUERY — fetches 3 most-recent programmes by _createdAt desc
  - getProgrammeHighlights() typed fetch helper — ready for homepage use
  - cdn.sanity.io added to next.config.ts images.remotePatterns
  - messages/en.json — home (10 keys), about (13 keys), contact (17 keys) namespaces
  - messages/ms.json — same 3 namespaces in Bahasa Malaysia
  - messages/ta.json — same 3 namespaces in Tamil

affects:
  - 03-03 (homepage page.tsx — uses HeroSection with heroImage, ImpactStats with memberCount/programmesDelivered, ProgrammeHighlights with getProgrammeHighlights)
  - 03-04 (about page.tsx — uses about namespace)
  - 03-05 (contact page.tsx — uses contact namespace + siteSettings contactEmail/whatsappNumber)

tech-stack:
  added: []
  patterns:
    - "PROGRAMME_HIGHLIGHTS_QUERY uses [0..2] GROQ slice for efficient top-N fetch (no LIMIT keyword needed)"
    - "getProgrammeHighlights() follows same pattern as getAllProgrammes() — typed fetch helper wrapping defineQuery"

key-files:
  created: []
  modified:
    - src/sanity/schemas/siteSettings.ts
    - src/lib/sanity/queries.ts
    - next.config.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json

key-decisions:
  - "BM and Tamil translations are human-quality approximations — require native-speaker review before public launch"
  - "PROGRAMME_HIGHLIGHTS_QUERY uses [0..2] slice (returns 3 items) not [0..3] (returns 4) — off-by-one clarified in GROQ spec"

patterns-established:
  - "Typed fetch helpers mirror GROQ query exports: PROGRAMME_HIGHLIGHTS_QUERY + getProgrammeHighlights() pair"
  - "images.remotePatterns uses { protocol, hostname } object shape (Next.js 13+ requirement)"

requirements-completed:
  - HOME-01
  - HOME-02
  - HOME-03
  - HOME-04
  - HOME-05
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

duration: 3min
completed: 2026-03-16
---

# Phase 03 Plan 02: Foundation Data Layer Summary

**Sanity siteSettings extended with heroImage/memberCount/programmesDelivered, GROQ queries updated, cdn.sanity.io allowlisted, and trilingual home/about/contact message namespaces added to all 3 locale files**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-16T08:51:11Z
- **Completed:** 2026-03-16T08:54:31Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Extended siteSettings Sanity schema with 3 media/stats fields and updated TypeScript types and GROQ projection in sync
- Added PROGRAMME_HIGHLIGHTS_QUERY + getProgrammeHighlights() helper so homepage can fetch top-3 programmes without an extra full query
- Populated all i18n message namespaces (home, about, contact) across EN, BM, and Tamil — 144 i18n tests now pass GREEN

## Task Commits

1. **Task 1: Extend siteSettings schema, queries/types, next.config** — `0543ede` (feat)
2. **Task 2: Add home/about/contact namespaces to all 3 locale files** — `df14ff0` (feat)

## Files Created/Modified

- `src/sanity/schemas/siteSettings.ts` — Added heroImage (image+hotspot), memberCount (number), programmesDelivered (number) fields
- `src/lib/sanity/queries.ts` — Extended SiteSettings type; updated SITE_SETTINGS_QUERY projection; added PROGRAMME_HIGHLIGHTS_QUERY constant and getProgrammeHighlights() helper
- `next.config.ts` — Added images.remotePatterns allowing cdn.sanity.io
- `messages/en.json` — Added home (10 keys), about (13 keys), contact (17 keys) namespaces in English
- `messages/ms.json` — Added same 3 namespaces in Bahasa Malaysia
- `messages/ta.json` — Added same 3 namespaces in Tamil

## Decisions Made

- BM and Tamil translations are approximations pending human-reviewer sign-off before production launch. This matches the project policy noted in the plan.
- GROQ [0..2] slice is used (not [0..3]) — this is correct per GROQ spec (inclusive range, returns indices 0, 1, 2 = 3 items).

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. The full test suite showed 17 pre-existing failures in `tests/pages/` (homepage, about, contact page stubs) — these were already failing before Plan 02 and belong to Plans 03–05 scope. All tests that were passing before Plan 02 remain GREEN (188 passed).

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

- Plan 03 (Homepage) can now use: heroImage from siteSettings, memberCount, programmesDelivered, getProgrammeHighlights(), and home/about/contact message namespaces
- Plan 04 (About page) can use: about namespace with all 13 keys
- Plan 05 (Contact page) can use: contact namespace with all 17 keys, plus siteSettings.contactEmail and .whatsappNumber
- No blockers for Plans 03, 04, or 05

---
*Phase: 03-core-static-pages*
*Completed: 2026-03-16*

## Self-Check: PASSED

All 7 files confirmed present. Both task commits (0543ede, df14ff0) confirmed in git log.
