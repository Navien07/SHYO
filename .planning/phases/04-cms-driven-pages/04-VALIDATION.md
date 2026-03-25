---
phase: 4
slug: cms-driven-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.1.9 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-W0-01 | 00 | 0 | TEAM-01,02,03 | unit | `npx vitest run tests/pages/team.test.ts` | ❌ W0 | ⬜ pending |
| 4-W0-02 | 00 | 0 | PROG-01,02,03,04 | unit | `npx vitest run tests/pages/programmes.test.ts` | ❌ W0 | ⬜ pending |
| 4-W0-03 | 00 | 0 | DOCS-01,02,03,04,05 | unit | `npx vitest run tests/pages/documents.test.ts` | ❌ W0 | ⬜ pending |
| 4-W0-04 | 00 | 0 | TEAM-02,03,DOCS-04,05 | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ (fix+extend) | ⬜ pending |
| 4-W0-05 | 00 | 0 | I18N | unit | `npx vitest run tests/ui/i18n-messages.test.ts` | ✅ (extend) | ⬜ pending |
| 4-01-01 | 01 | 1 | TEAM-02,03 | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ | ⬜ pending |
| 4-01-02 | 01 | 1 | TEAM-01,02,03 | unit | `npx vitest run tests/pages/team.test.ts` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | PROG-01,02,03,04 | unit | `npx vitest run tests/pages/programmes.test.ts` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 1 | DOCS-01,02,03,04,05 | unit | `npx vitest run tests/pages/documents.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pages/team.test.ts` — stubs for TEAM-01, TEAM-02, TEAM-03
- [ ] `tests/pages/programmes.test.ts` — stubs for PROG-01, PROG-02, PROG-03, PROG-04
- [ ] `tests/pages/documents.test.ts` — stubs for DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
- [ ] Fix `tests/sanity/schemas.test.ts` — rename `document` import to `pdfDocument`; fix `name === 'document'` assertion; add `tier` field assertions; add validation assertions for title/category/year required fields
- [ ] Update `tests/ui/i18n-messages.test.ts` — add `team`, `programmes`, `documents` namespace key assertions for all 3 locales

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin adds team member in Studio → appears on /team in all locales | TEAM-01 | Requires live Sanity Studio + ISR revalidation | Add member in Studio, publish, verify card appears on /en/team, /ms/team, /ta/team |
| Admin creates programme → appears on listing in all locales | PROG-01,02 | Requires live Sanity Studio | Create programme in Studio, publish, verify on /en/programmes, /ms/programmes, /ta/programmes |
| Admin uploads PDF → appears in Document Library with correct metadata | DOCS-01,02,03 | Requires live Sanity + file upload | Upload PDF with all metadata, publish, verify row appears with correct title, file size, download link |
| Document category filter narrows list | DOCS-04 | Requires browser interaction | Click category tab, verify only matching documents visible |
| PDF without required metadata cannot be published | DOCS-05 | Requires Sanity Studio validation UI | Attempt to publish document with missing title/category/year, verify Studio blocks publish |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
