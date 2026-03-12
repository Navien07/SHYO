---
phase: 01-infrastructure
plan: "03"
subsystem: infra
tags: [dependabot, uptimerobot, sanity, github-actions, monitoring, security]

# Dependency graph
requires:
  - phase: 01-infrastructure plan 02
    provides: Vercel deployment URL (used as UptimeRobot monitor target)
provides:
  - Dependabot weekly npm dependency update schedule (.github/dependabot.yml)
  - UptimeRobot HTTP(s) monitor live — alerting org email + committee backup on outage
  - Two Sanity Administrator accounts registered under org email
affects:
  - 02-shared-ui (downstream phases inherit secure, monitored infrastructure)

# Tech tracking
tech-stack:
  added: [dependabot, uptimerobot]
  patterns:
    - "Dependabot groups: sanity/* + next-sanity, next-intl, tailwindcss/* as named groups"
    - "UptimeRobot 5-minute HTTP(s) polling with dual alert contacts (org email + committee member)"

key-files:
  created:
    - .github/dependabot.yml
  modified: []

key-decisions:
  - "Dependabot groups package families (sanity, next-intl, tailwind) to reduce PR noise — one grouped PR per family per week"
  - "UptimeRobot free tier sufficient for 5-minute monitoring of a low-traffic NGO site"
  - "Two org-email admin accounts in Sanity satisfy ADMIN-03 — prevents single-point-of-failure for CMS access"

patterns-established:
  - "Dependabot group pattern: use named groups for ecosystem families to batch related updates"

requirements-completed: [INFRA-06, INFRA-07, ADMIN-03]

# Metrics
duration: 15min
completed: 2026-03-12
---

# Phase 1 Plan 03: Operational Safeguards Summary

**Dependabot weekly npm updates, UptimeRobot 5-minute outage alerting, and dual org-email Sanity admin accounts — Phase 1 Infrastructure fully operational.**

## Performance

- **Duration:** ~15 min (Task 1 automated; Task 2 human-verified externally)
- **Started:** 2026-03-12T03:24:05Z
- **Completed:** 2026-03-12T03:39:00Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 1

## Accomplishments

- `.github/dependabot.yml` committed and pushed — Dependabot active on GitHub, npm ecosystem listed, weekly Monday 09:00 MYT schedule with grouped updates for sanity, next-intl, and tailwind
- UptimeRobot HTTP(s) monitor live at the Vercel production URL — 5-minute polling, alerting org email and committee backup email; site confirmed HTTP 200
- Two Administrator accounts registered under the org's official email domain in manage.sanity.io — satisfies ADMIN-03 single-point-of-failure protection
- Full test suite green: 26/26 tests passing (`npx vitest run`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Dependabot configuration** - `bf70558` (chore)
2. **Task 2: Human-verify checkpoint** - verified externally (no code commit)

**Plan metadata:** (docs commit — this summary)

## Files Created/Modified

- `.github/dependabot.yml` — Weekly npm Dependabot schedule; groups: sanity, next-intl, tailwind; open-pull-requests-limit: 5; timezone: Asia/Kuala_Lumpur

## Decisions Made

- **Dependabot grouping by package family:** Grouped `sanity`/`@sanity/*`/`next-sanity`, `next-intl`, and `tailwindcss`/`@tailwindcss/*` into named groups to reduce PR noise. One PR per family per weekly run rather than one PR per package.
- **UptimeRobot free tier selected:** 5-minute monitoring interval is adequate for a low-traffic NGO site. Free tier covers the monitoring requirement without ongoing cost.
- **Dual Sanity admin accounts:** Both accounts use the org's official email domain. Personal developer emails excluded per ADMIN-03 requirement.

## Deviations from Plan

None — plan executed exactly as written. Task 1 auto-completed without issues. Task 2 human-verify confirmed all three external services configured correctly.

## Issues Encountered

- No remote git origin was configured at time of commit — `.github/dependabot.yml` was committed locally (bf70558) and then pushed to GitHub by the user as part of the human verification step. Dependabot activation confirmed post-push.

## User Setup Completed

The following external services were configured manually during the human-verify checkpoint (Task 2):

| Service | Action | Status |
|---------|--------|--------|
| GitHub Dependabot | Pushed `.github/dependabot.yml`; npm ecosystem active | Confirmed |
| UptimeRobot | HTTP(s) monitor created for Vercel production URL; 5-min interval; dual alert contacts | Confirmed live — HTTP 200 |
| Sanity Studio | Second Administrator account invited under org email | Confirmed — 2 org-email admins |

## Next Phase Readiness

Phase 1 Infrastructure is **fully complete**. All 11 requirements satisfied:
- INFRA-01–07: Next.js 15 scaffolded, Sanity v3 wired, next-intl URL routing, Vercel deployed, Resend domain initiated, ISR webhook configured, Dependabot enabled
- ADMIN-01–04: Sanity Studio accessible, schemas created, two org-email admins registered

**Phase 2: Shared UI Foundation** can begin immediately. No blockers.

Open questions carried into Phase 2:
- Resend domain verification (initiated in Phase 1, 24-48h DNS propagation) — verify confirmed before Phase 3 contact form wiring
- Exact Seputeh HYO brand colour tokens needed — to be sourced from org materials at Phase 2 start

---
*Phase: 01-infrastructure*
*Completed: 2026-03-12*
