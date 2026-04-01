---
phase: 05-membership-polish
plan: 01
subsystem: testing-and-i18n
tags: [tdd, i18n, red-tests, membership, seo, trilingual]
dependency_graph:
  requires: []
  provides: [membership-test-stubs, seo-test-stubs, membership-i18n-namespaces, privacy-i18n-namespaces, meta-i18n-namespaces]
  affects: [tests/pages/membership.test.ts, tests/pages/seo.test.ts, tests/ui/i18n-messages.test.ts, messages/en.json, messages/ms.json, messages/ta.json]
tech_stack:
  added: []
  patterns: [tdd-red-stubs, fs-readFileSync-test-pattern, next-intl-namespace-structure]
key_files:
  created:
    - tests/pages/membership.test.ts
    - tests/pages/seo.test.ts
  modified:
    - tests/ui/i18n-messages.test.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json
    - .env.local.example
decisions:
  - en.json duplicate documents key removed — second occurrence kept per JSON spec (last wins) to restore clean state
  - BM and Tamil membership/privacy/meta translations are approximations — require native-speaker review before public launch
  - Test stubs use fs.readFileSync/existsSync pattern — avoids Next.js import errors in node/vitest environment
metrics:
  duration: 5min
  completed_date: "2026-04-01"
  tasks_completed: 2
  files_modified: 7
---

# Phase 5 Plan 01: Wave 0 RED Test Stubs and I18N Namespaces Summary

**One-liner:** TDD wave-0 stubs covering MEMB-01-05 and SEO-01-04 RED, plus membership/privacy/meta i18n namespaces GREEN across EN/BM/Tamil.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create RED test stubs for membership and SEO + extend i18n test | 90a9f91 | tests/pages/membership.test.ts, tests/pages/seo.test.ts, tests/ui/i18n-messages.test.ts |
| 2 | Populate i18n namespaces in all three locales + deduplicate en.json + update .env.local.example | 6822b94 | messages/en.json, messages/ms.json, messages/ta.json, .env.local.example |

## What Was Built

### Task 1 — RED Test Stubs

Created `tests/pages/membership.test.ts` with 5 describe blocks covering:
- MEMB-01: File existence for membership/page.tsx, MembershipForm.tsx, actions.ts
- MEMB-02: `z.literal(true)` PDPA consent validation in actions.ts
- MEMB-03: `'use server'` directive and `z.object` Zod schema in actions.ts
- MEMB-04: `parsed.data.email` applicant confirmation in actions.ts
- MEMB-05: `ORG_EMAIL` org notification in actions.ts

Created `tests/pages/seo.test.ts` with 4 describe blocks covering:
- SEO-01: `generateMetadata` in all 9 page files
- SEO-02: `openGraph` in all 9 page files
- SEO-03: `src/app/sitemap.ts` and `src/app/robots.ts` existence
- SEO-04: `src/app/[locale]/privacy/page.tsx` existence and contains `PDPA`

Extended `tests/ui/i18n-messages.test.ts` with:
- `REQUIRED_MEMBERSHIP_KEYS` (33 keys) + loop assertions for en/ms/ta
- `REQUIRED_PRIVACY_KEYS` (12 keys) + loop assertions for en/ms/ta
- `REQUIRED_META_KEYS` (18 keys) + loop assertions for en/ms/ta

### Task 2 — I18N Namespaces + Deduplication + Env Docs

- `messages/en.json`: removed duplicate `documents` key (lines 57-67); added `membership` (33 keys), `privacy` (12 keys), `meta` (18 keys) namespaces
- `messages/ms.json`: removed duplicate `documents` key; added same 3 namespaces in Bahasa Malaysia
- `messages/ta.json`: removed duplicate `documents` key; added same 3 namespaces in Tamil
- `.env.local.example`: documented `ORG_EMAIL`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL`

## Verification Results

- `tests/pages/membership.test.ts`: 10 tests FAIL (RED) — membership files don't exist yet. Correct.
- `tests/pages/seo.test.ts`: 20 tests FAIL (RED) — generateMetadata/sitemap/privacy files don't exist yet. Correct.
- `tests/ui/i18n-messages.test.ts`: 384 tests PASS (GREEN) — all existing + new namespace assertions pass.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan intentionally creates RED stubs. Membership/SEO implementation stubs will be resolved in Plans 02-04.

## Self-Check: PASSED

Files exist:
- FOUND: tests/pages/membership.test.ts
- FOUND: tests/pages/seo.test.ts
- FOUND: messages/en.json (contains "membership")
- FOUND: messages/ms.json (contains "Sertai Kami")
- FOUND: messages/ta.json (contains membership namespace)
- FOUND: .env.local.example (contains NEXT_PUBLIC_SITE_URL)

Commits exist:
- FOUND: 90a9f91 (test stubs)
- FOUND: 6822b94 (i18n + env)
