---
phase: 1
slug: infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (to be bootstrapped in Wave 0) |
| **Config file** | `vitest.config.ts` — Wave 0 installs |
| **Quick run command** | `npx vitest run tests/sanity/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds (schema unit tests only) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run tests/sanity/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green + all manual checks documented as passed
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | INFRA-01, INFRA-02, INFRA-03 | smoke | `npx vitest run tests/smoke/routes.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 0 | ADMIN-01 | unit | `npx vitest run tests/sanity/schemas.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | INFRA-01 | smoke | `npx vitest run tests/smoke/routes.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 1 | INFRA-02, INFRA-03 | smoke | `npx vitest run tests/smoke/routes.test.ts` | ❌ W0 | ⬜ pending |
| 1-01-05 | 01 | 1 | ADMIN-01 | unit | `npx vitest run tests/sanity/schemas.test.ts` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | INFRA-04 | manual | Navigate to Vercel preview URL in browser | manual-only | ⬜ pending |
| 1-02-02 | 02 | 2 | ADMIN-04 | manual | Publish test document → check page updates within 10s | manual-only | ⬜ pending |
| 1-02-03 | 02 | 2 | INFRA-05 | manual | Trigger test email from Resend dashboard | manual-only | ⬜ pending |
| 1-03-01 | 03 | 3 | INFRA-06 | manual | Check GitHub repo → Security → Dependabot PRs visible | manual-only | ⬜ pending |
| 1-03-02 | 03 | 3 | INFRA-07 | manual | Pause UptimeRobot monitor, wait for alert email | manual-only | ⬜ pending |
| 1-03-03 | 03 | 3 | ADMIN-02, ADMIN-03 | manual | Check Studio renders all 4 schemas; verify 2 org-email admins | manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — project root config (`npm install -D vitest @vitejs/plugin-react`)
- [ ] `tests/sanity/schemas.test.ts` — unit stubs covering ADMIN-01 (siteSettings field presence, all four schemas export expected field names)
- [ ] `tests/smoke/routes.test.ts` — smoke stubs for INFRA-01 (locale routes `/en`, `/ms`, `/ta` return 200), INFRA-02 (studio returns 200), INFRA-03

*Framework install: `npm install -D vitest @vitejs/plugin-react` — Wave 0 task*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel deployment URL returns 200 | INFRA-04 | Requires live deployment with domain | Navigate to Vercel preview URL; confirm 200 OK |
| Resend sends test email | INFRA-05 | Requires live DNS + Resend account | Use Resend dashboard "Send Test Email"; confirm delivery |
| Dependabot PRs visible in GitHub | INFRA-06 | External GitHub service | Check repo → Security → Dependabot alerts/PRs |
| UptimeRobot sends alert on simulated outage | INFRA-07 | External monitoring service | Pause monitor, wait for alert email to org inbox |
| Studio renders all four schemas | ADMIN-02 | Requires browser + live Sanity Studio | Open `/studio` in browser; confirm all 4 schemas visible |
| Two admin accounts under org email registered | ADMIN-03 | Requires manual Sanity team invite | Check `manage.sanity.io` project members; confirm 2 org-email accounts |
| ISR revalidation fires after Sanity publish | ADMIN-04 | Requires live deployment + webhook | Publish test document in Studio; confirm page updates within 10s |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
