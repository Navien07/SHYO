---
phase: 5
slug: membership-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already installed) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 0 | MEMB-01–06 | unit stubs | `npx vitest run tests/pages/membership.test.ts` | W0 | pending |
| 05-01-02 | 01 | 0 | SEO-01–03 | unit stubs | `npx vitest run tests/pages/seo.test.ts` | W0 | pending |
| 05-01-03 | 01 | 0 | SEO-04 | unit stubs | `npx vitest run tests/pages/seo.test.ts` | W0 | pending |
| 05-02-01 | 02 | 1 | MEMB-01–03 | unit | `npx vitest run tests/pages/membership.test.ts` | W0 | pending |
| 05-02-02 | 02 | 1 | MEMB-04–05 | unit | `npx vitest run tests/pages/membership.test.ts` | W0 | pending |
| 05-02-03 | 02 | 1 | MEMB-06 | unit | `npx vitest run tests/pages/membership.test.ts` | W0 | pending |
| 05-03-01 | 03 | 2 | SEO-01–02 | unit | `npx vitest run tests/pages/seo.test.ts` | W0 | pending |
| 05-03-02 | 03 | 2 | SEO-03 | unit | `npx vitest run tests/pages/seo.test.ts` | W0 | pending |
| 05-04-01 | 04 | 2 | SEO-04 | unit | `npx vitest run tests/pages/seo.test.ts` | W0 | pending |
| 05-04-03 | 04 | 2 | SEO-05 | manual | HTTPS verification on deployed URL | n/a | pending |
| 05-04-04 | 04 | 2 | QA | manual | Responsive + WCAG + Tamil QA checklist | n/a | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `tests/pages/membership.test.ts` — stubs for MEMB-01–06 (form fields, PDPA consent, Zod schema, Resend dual-send, i18n)
- [ ] `tests/pages/seo.test.ts` — stubs for SEO-01–04 (generateMetadata per page, OG tags, sitemap, robots.txt, privacy page)

*Existing infrastructure covers remaining pages — vitest already configured from Phase 2.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tamil rendering on mid-range Android | I18N-04 | Requires physical device | Load /ta/ pages on Android; verify Noto Sans Tamil renders, no clipped descenders |
| Email delivery within 60s | MEMB-04, MEMB-05 | Requires live Resend account + real email | Submit membership form; check applicant inbox and org inbox within 60s |
| HTTPS enforced | SEO-05 | Vercel SSL — infrastructure, not code | Confirm deployed URL uses https:// in browser |
| Admin can add content independently | ADMIN handover | Requires non-technical user | Walk org admin through adding a programme in Sanity Studio |
| WhatsApp deep link on mobile | CONT-03 | Requires mobile device | Tap WhatsApp link on mobile; verify pre-filled message opens |
| Responsive QA — no horizontal scroll | QA | Requires viewport testing | Test /membership and /privacy at 375px, 768px, 1280px in all 3 locales |
| Touch targets >= 44px | QA | Requires measurement | Measure membership form checkboxes and inputs on mobile viewport |
| WCAG 2.1 AA colour contrast | QA | Requires audit tool | Run axe/Lighthouse on /membership, confirm >= 4.5:1 ratio |
| Tamil rendering on membership form | QA | Requires device/emulation | Check /ta/membership form labels and error messages render correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
