---
phase: 02-shared-ui
plan: 02
subsystem: shared-ui
tags: [brand-tokens, navigation, i18n, tailwind, next-intl, shadcn, sanity]
dependency_graph:
  requires: [02-01]
  provides: [02-03]
  affects: [all-pages]
tech_stack:
  added:
    - next/font/google (Inter + Noto_Sans_Tamil via CSS variables)
    - shadcn Sheet component (right-side drawer)
    - next-intl createNavigation (locale-aware routing primitives)
    - next-sanity defineQuery (Sanity TypeGen compatible GROQ helpers)
  patterns:
    - "@theme block for Tailwind v4 brand token registration"
    - "Server/client component split: Nav server, NavLink/MobileDrawer/LanguageSwitcher client"
    - "Locale-aware imports from @/i18n/navigation (not next/navigation) to prevent locale-stacking bug"
    - "ISR cache tags pattern for Sanity content types"
key_files:
  created:
    - src/app/globals.css (extended with brand @theme block + Tamil @layer base)
    - src/app/[locale]/layout.tsx (updated with font variables)
    - src/i18n/navigation.ts
    - src/components/layout/Header.tsx
    - src/components/layout/Nav.tsx
    - src/components/layout/NavLink.tsx
    - src/components/layout/LanguageSwitcher.tsx
    - src/components/layout/MobileDrawer.tsx
    - src/lib/sanity/queries.ts
    - public/logo.svg
    - src/components/ui/sheet.tsx (via shadcn CLI)
  modified:
    - src/app/globals.css
    - src/app/[locale]/layout.tsx
decisions:
  - "Nav.tsx is a Server Component (uses useTranslations from next-intl server-side API); NavLink/LanguageSwitcher/MobileDrawer are 'use client' (need useState/useRouter/useLocale/usePathname)"
  - "LanguageSwitcher uses router.replace with locale option from @/i18n/navigation to avoid locale-stacking bug (/en/ms/about)"
  - "Inter font variable named --font-noto-sans (matching shadcn convention) not --font-inter"
  - "Footer tests in layout.test.ts remain RED — Footer is a Plan 03 deliverable, pre-existing RED stubs from Plan 01"
metrics:
  duration: 4min
  completed: "2026-03-13"
  tasks_completed: 3
  files_created: 11
---

# Phase 2 Plan 02: Brand Tokens, Navigation Shell, and GROQ Query Helpers Summary

Brand token layer registered in Tailwind v4 via standalone @theme block, Nav/Header shell built with server/client component split, locale-aware routing primitives created, and typed GROQ fetch helpers established for all 4 Sanity content types.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Brand tokens in globals.css + locale layout font wiring | 3efc7cd | src/app/globals.css, src/app/[locale]/layout.tsx |
| 2 | navigation.ts + Header/Nav/NavLink/LanguageSwitcher/MobileDrawer + logo | a44eb7e | 8 files (see key_files) |
| 3 | GROQ typed query helpers | 305b3f5 | src/lib/sanity/queries.ts |

## Verification Results

**Wave 2 tests (brand-tokens, tamil-font, responsive, layout, lang-switcher):** 18 PASS, 2 intentional RED (Footer — Plan 03 scope)

**TypeScript:** No errors in new files. One pre-existing error in tests/ui/i18n-messages.test.ts (Plan 01 stub uses `continue` in non-loop context — out of scope).

## Decisions Made

1. Nav.tsx is a Server Component (uses useTranslations, no React hooks). NavLink, LanguageSwitcher, and MobileDrawer are 'use client' (use useState/useRouter/useLocale/usePathname).
2. LanguageSwitcher imports useRouter and usePathname from @/i18n/navigation (not next/navigation) to prevent locale-stacking bug (/en/ms/about).
3. Inter font CSS variable named --font-noto-sans to match shadcn convention (not --font-inter).
4. MobileDrawer uses shadcn Sheet (installed via CLI) with side="right" and SheetTitle sr-only for accessibility.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

All created files verified:
- src/app/globals.css — FOUND (contains --color-brand-green: #32a852)
- src/app/[locale]/layout.tsx — FOUND (contains Noto_Sans_Tamil, notoSansTamil.variable)
- src/i18n/navigation.ts — FOUND (exports createNavigation result)
- src/components/layout/Header.tsx — FOUND (contains sticky top-0 z-50)
- src/components/layout/Nav.tsx — FOUND (7 nav links, NavLink, MobileDrawer)
- src/components/layout/NavLink.tsx — FOUND (usePathname from @/i18n/navigation)
- src/components/layout/LanguageSwitcher.tsx — FOUND (contains தமிழ்)
- src/components/layout/MobileDrawer.tsx — FOUND (Sheet side="right")
- src/lib/sanity/queries.ts — FOUND (exports getSiteSettings, getAllProgrammes, getAllTeamMembers, getAllDocuments)
- public/logo.svg — FOUND

All commits verified:
- 3efc7cd — feat(02-02): brand tokens in globals.css + locale layout font wiring
- a44eb7e — feat(02-02): navigation.ts + nav shell components + placeholder logo
- 305b3f5 — feat(02-02): GROQ typed query helpers for Sanity content types
