---
phase: 02
slug: shared-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | BRAND-01,BRAND-09 | unit | `npx vitest run tests/ui/brand-tokens.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | BRAND-02,I18N-04 | unit | `npx vitest run tests/ui/tamil-font.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | BRAND-05,BRAND-06 | unit | `npx vitest run tests/ui/layout.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | I18N-01,I18N-05 | unit | `npx vitest run tests/ui/lang-switcher.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | I18N-02 | unit | `npx vitest run tests/ui/i18n-messages.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | BRAND-07 | unit | `npx vitest run tests/ui/not-found.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | BRAND-03,BRAND-04 | unit | `npx vitest run tests/ui/responsive.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-04 | 02 | 2 | BRAND-08 | unit | `npx vitest run` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/ui/brand-tokens.test.ts` — stubs for BRAND-01, BRAND-09 (token existence, contrast check)
- [ ] `tests/ui/tamil-font.test.ts` — stubs for BRAND-02, I18N-04 (next/font config, CSS selector)
- [ ] `tests/ui/layout.test.ts` — stubs for BRAND-05, BRAND-06 (nav, header, footer component exports)
- [ ] `tests/ui/lang-switcher.test.ts` — stubs for I18N-01, I18N-05 (navigation.ts exports, locale URLs)
- [ ] `tests/ui/i18n-messages.test.ts` — stubs for I18N-02 (all message keys present in all 3 locales)
- [ ] `tests/ui/not-found.test.ts` — stubs for BRAND-07 (not-found.tsx exists, exports a component)
- [ ] `tests/ui/responsive.test.ts` — stubs for BRAND-03, BRAND-04 (touch target size, font size)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Noto Sans Tamil renders on Android (not system fallback) | BRAND-02, I18N-04 | Requires real device or BrowserStack | Open /ta/ on mid-range Android; DevTools → Fonts → confirm Noto Sans Tamil loaded |
| Sticky nav stays visible while scrolling | BRAND-05 | Visual/scroll behavior | Open any page, scroll to bottom, confirm nav bar is still fixed at top |
| No horizontal scroll on any viewport | BRAND-03 | Visual layout | Resize browser to 320px width; confirm no scrollbar appears |
| Lighthouse accessibility audit ≥ 4.5:1 contrast | BRAND-09 | Requires Lighthouse run | Run Lighthouse in Chrome DevTools on /en/, confirm Accessibility score, check contrast failures |
| Language switcher changes URL without full reload | I18N-05 | Requires browser navigation | Click language pill, confirm URL changes from /en/ to /ms/ and page content updates without white flash |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
