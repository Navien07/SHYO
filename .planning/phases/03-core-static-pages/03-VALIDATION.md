---
phase: 3
slug: core-static-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^2.1.9 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | HOME-01–04 | structural | `npx vitest run tests/pages/homepage.test.ts` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 0 | ABOUT-01–04 | structural | `npx vitest run tests/pages/about.test.ts` | ❌ W0 | ⬜ pending |
| 3-01-03 | 01 | 0 | CONT-01–06 | structural+unit | `npx vitest run tests/pages/contact.test.ts` | ❌ W0 | ⬜ pending |
| 3-01-04 | 01 | 0 | siteSettings | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ extend | ⬜ pending |
| 3-01-05 | 01 | 0 | i18n namespaces | unit | `npx vitest run tests/ui/i18n-messages.test.ts` | ✅ extend | ⬜ pending |
| 3-02-01 | 02 | 1 | HOME-01 | structural | `npx vitest run tests/pages/homepage.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-02 | 02 | 1 | HOME-02 | unit | `npx vitest run tests/pages/homepage.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-03 | 02 | 1 | HOME-03 | structural | `npx vitest run tests/pages/homepage.test.ts` | ❌ W0 | ⬜ pending |
| 3-02-04 | 02 | 1 | HOME-04 | structural | `npx vitest run tests/pages/homepage.test.ts` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 1 | ABOUT-01–04 | structural | `npx vitest run tests/pages/about.test.ts` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 2 | CONT-01–02 | structural+unit | `npx vitest run tests/pages/contact.test.ts` | ❌ W0 | ⬜ pending |
| 3-04-02 | 04 | 2 | CONT-03 | unit | `npx vitest run tests/pages/contact.test.ts` | ❌ W0 | ⬜ pending |
| 3-04-03 | 04 | 2 | CONT-04–06 | structural | `npx vitest run tests/pages/contact.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pages/homepage.test.ts` — structural checks for HOME-01 through HOME-04; years-active calculation unit test
- [ ] `tests/pages/about.test.ts` — structural: about page file exists; EN message keys for ABOUT-01 through ABOUT-04 present
- [ ] `tests/pages/contact.test.ts` — structural: contact page + ContactForm + actions.ts exist; Zod validation unit tests; WhatsApp href format
- [ ] Extend `tests/sanity/schemas.test.ts` — add assertions for `heroImage`, `memberCount`, `programmesDelivered` in `siteSettings` schema
- [ ] Extend `tests/ui/i18n-messages.test.ts` — add assertions for `home`, `about`, `contact` namespaces in all 3 locale JSON files

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contact form delivers email to org inbox | CONT-02 | Requires live Resend API key and email receipt | Submit form in browser; verify email arrives in org inbox within 60s |
| WhatsApp deep link opens pre-filled message on mobile | CONT-03 | Requires physical mobile device | Tap link on mobile; verify WhatsApp opens with pre-filled message |
| Google Map embed loads without console errors | CONT-06 | Requires browser network access | Open contact page; check browser console for map errors |
| Hero image renders with correct overlay in all 3 locales | HOME-01 | Visual verification of overlay + image | Visit `/en/`, `/ms/`, `/ta/` and verify hero visual |
| Programme highlights cards link correctly | HOME-03 | Cross-phase dependency (Phase 4 routes) | Expected 404 until Phase 4 — verify cards render and link to correct pattern |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
