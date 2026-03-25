---
phase: 01-infrastructure
plan: "02"
subsystem: infra
tags: [vercel, sanity, next-intl, isr, resend, singapore, webhooks, env-vars]

# Dependency graph
requires:
  - phase: 01-infrastructure-01
    provides: Next.js 15 scaffold with Sanity schemas, next-intl routing, revalidate API route, vercel.json (sin1)

provides:
  - Live Vercel deployment at hyo-naviens-projects-1949cb7f.vercel.app (sin1 region)
  - All four core environment variables set in Vercel project settings
  - ISR revalidation webhook handler active (route exists, secret configured in Vercel)
  - Custom domain hyoseputeh.com added to Vercel (DNS propagation pending)
  - Locale routes /en, /ms, /ta verified live and returning 200

affects: [02-shared-ui, 03-core-pages, 04-cms-pages, 05-membership-polish]

# Tech tracking
tech-stack:
  added: [vercel-cli, vercel-deployment, vercel-github-integration]
  patterns:
    - "Vercel region pin via vercel.json regions field (read at deploy time)"
    - "ISR revalidation via Sanity webhook -> /api/revalidate -> revalidateTag(body._type)"
    - "HMAC webhook signature validation via next-sanity parseBody"
    - "GitHub push to master triggers automatic Vercel production deploy"

key-files:
  created: []
  modified:
    - vercel.json
    - .env.local.example

key-decisions:
  - "SANITY_REVALIDATE_SECRET must be set identically in Vercel env vars AND Sanity webhook secret field"
  - "RESEND_API_KEY deferred to Phase 3 — Resend account not yet created; contact form wired in Phase 3"
  - "ISR webhook setup is user-action only — cannot be automated via CLI (manage.sanity.io dashboard required)"
  - "vercel.json required explicit framework: nextjs field — Vercel auto-detection was insufficient for App Router routing"
  - "Custom domain hyoseputeh.com added early; DNS propagation async (24-72h)"

patterns-established:
  - "Vercel deployment: push to master triggers automatic prod deploy via GitHub integration"
  - "ISR: SANITY_REVALIDATE_SECRET must match identically in Vercel env vars AND Sanity webhook secret field"

requirements-completed: [INFRA-04, INFRA-05, ADMIN-04]

# Metrics
duration: ~180min (includes user verification and DNS setup)
completed: 2026-03-11
---

# Phase 1 Plan 02: Vercel Deployment with Singapore Edge and ISR Webhook Infrastructure Summary

**Next.js 15 app deployed live to Vercel Singapore (sin1) at hyo-naviens-projects-1949cb7f.vercel.app with all Sanity env vars set, locale routes /en /ms /ta verified returning 200, and ISR revalidation webhook secret pre-configured**

## Performance

- **Duration:** ~180 min (includes manual user verification steps and DNS setup)
- **Started:** 2026-03-11T12:25:54Z
- **Completed:** 2026-03-11T15:34:36Z
- **Tasks:** 2 of 2 (Task 1 automated, Task 2 human-verify checkpoint — approved by user)
- **Files modified:** 2

## Accomplishments

- Site deployed to Vercel Singapore (sin1) edge region; production URL confirmed live by user
- All four core environment variables set in Vercel project settings: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN, SANITY_REVALIDATE_SECRET
- Locale routes /en, /ms, /ta verified returning 200 by user
- Custom domain hyoseputeh.com added to Vercel project (DNS propagation pending)
- vercel.json corrected with `framework: "nextjs"` field to fix Vercel routing detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Prepare deployment configuration and generate secrets** - `11a18f5` (chore)
2. **Fix: Vercel framework detection and routing** - `3507222` (fix)
3. **Fix: Deprecated Sanity field, vitest config, missing peer deps** - `5f3254a` (fix)
4. **Checkpoint documentation** - `242031c` (docs)

**Plan metadata:** (this summary commit)

## Files Created/Modified

- `vercel.json` - Added `"framework": "nextjs"` field; `regions: ["sin1"]` was already present from Plan 01
- `.env.local.example` - Updated with documentation comments showing source for each of the five required env vars

## Decisions Made

- **RESEND_API_KEY deferred:** Resend account creation and domain verification deferred to Phase 3 (contact form). The key is not needed until the contact form API route is wired in Phase 3. Does not block Phase 2.
- **ISR webhook is user-action only:** The Sanity webhook at manage.sanity.io cannot be configured programmatically — requires dashboard access. User was given exact configuration steps. Webhook pending user action at manage.sanity.io.
- **vercel.json needed explicit framework field:** Vercel auto-detection was insufficient for correct Next.js 15 App Router routing. Adding `"framework": "nextjs"` resolved build and routing failures encountered during deployment.
- **Custom domain added early:** hyoseputeh.com was added to Vercel during this plan; DNS propagation may take 24-72h but was initiated.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Vercel build and routing failure due to missing framework field**
- **Found during:** Task 1 (deployment step)
- **Issue:** Vercel deployment built but routes returned errors; auto-detection of the Next.js framework was not working correctly without an explicit framework declaration in vercel.json
- **Fix:** Added `"framework": "nextjs"` to vercel.json
- **Files modified:** vercel.json
- **Verification:** Deployment succeeded; locale routes /en, /ms, /ta confirmed returning 200 by user
- **Committed in:** 3507222 (fix commit)

**2. [Rule 1 - Bug] Fixed deprecated Sanity field, vitest reporter config, and missing peer dependencies**
- **Found during:** Task 1 (build verification)
- **Issue:** Build had warnings/errors from deprecated `__experimental_actions` in siteSettings schema, incorrect vitest reporter field, and missing Next.js peer deps
- **Fix:** Removed `__experimental_actions`, corrected vitest config, added missing peer deps
- **Files modified:** Sanity schema file, vitest.config.ts, package.json
- **Verification:** Build passed cleanly post-fix
- **Committed in:** 5f3254a (fix commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for deployment to succeed and build to pass. No scope creep.

## Issues Encountered

- Vercel framework auto-detection did not recognize the Next.js App Router setup from vercel.json alone — required explicit `framework` field. Fixed inline per Rule 1.
- `__experimental_actions` was removed in Sanity v3 — removed from siteSettings schema per Sanity migration guidance.

## User Setup Required

The following items remain as pending user actions:

1. **Sanity ISR webhook** — Configure at manage.sanity.io -> project -> API -> Webhooks -> Add webhook:
   - URL: `https://hyo-naviens-projects-1949cb7f.vercel.app/api/revalidate`
   - Dataset: production
   - Triggers: Create, Update, Delete
   - Filter: (leave empty)
   - Secret: (same value as SANITY_REVALIDATE_SECRET set in Vercel env vars)

2. **RESEND_API_KEY** — Deferred to Phase 3. Create account at resend.com, add sender domain DNS records (24-48h propagation), then set RESEND_API_KEY in Vercel project env vars.

3. **Custom domain DNS** — hyoseputeh.com is added to Vercel. Add the Vercel-provided A/CNAME DNS records at your domain registrar to complete the connection (propagation: 24-72h).

## Next Phase Readiness

- Vercel deployment live and stable — Phase 2 (Shared UI Foundation) can begin immediately
- All Sanity env vars configured — CMS GROQ queries will work from deployed site
- ISR webhook pending user action — does not block Phase 2 (only affects publish-to-live latency)
- RESEND_API_KEY not set — does not block Phase 2 or Phase 3 development; only needed when contact form endpoint is activated

---
*Phase: 01-infrastructure*
*Completed: 2026-03-11*
