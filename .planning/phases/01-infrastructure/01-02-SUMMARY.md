---
phase: 01-infrastructure
plan: "02"
subsystem: infra
tags: [vercel, sanity, resend, isr, webhook, deployment]

# Dependency graph
requires:
  - phase: 01-infrastructure
    plan: "01"
    provides: "Next.js 15 scaffold with vercel.json (sin1), revalidate route, and .env.local.example"
provides:
  - vercel.json pinned to Singapore (sin1) region
  - src/app/api/revalidate/route.ts ISR webhook handler (HMAC-validated, revalidateTag)
  - .env.local.example with all five env var documentation comments
  - SANITY_REVALIDATE_SECRET generation instructions for Vercel + Sanity webhook pairing
  - Deployment configuration ready for Vercel CLI push
affects:
  - 01-03 (email requires Resend domain verified and RESEND_API_KEY in Vercel)
  - all content phases (ISR revalidation confirms Sanity publish -> page refresh pipeline)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vercel region pin via vercel.json regions field (read at deploy time)"
    - "ISR revalidation via Sanity webhook -> /api/revalidate -> revalidateTag(body._type)"
    - "HMAC webhook signature validation via next-sanity parseBody"

key-files:
  created: []
  modified:
    - .env.local.example

key-decisions:
  - "SANITY_REVALIDATE_SECRET must be set identically in Vercel env vars AND Sanity webhook secret field"
  - "Vercel region sin1 is read from vercel.json at deploy time — no dashboard config needed"
  - "Resend domain verification is async (24-48h DNS propagation) — initiate on Day 1"

patterns-established:
  - "Sanity webhook -> revalidateTag(body._type): tags all cached fetches by document type for granular ISR"

requirements-completed: [INFRA-04, INFRA-05, ADMIN-04]

# Metrics
duration: 5min
completed: 2026-03-11
---

# Phase 1 Plan 02: Deployment and Services Summary

**Vercel deployment config with Singapore (sin1) region pin, ISR revalidation webhook handler (HMAC-validated via next-sanity parseBody), and .env.local.example updated with source documentation for all five required env vars**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-11T12:25:54Z
- **Completed:** 2026-03-11T12:30:00Z
- **Tasks:** 1/2 (Task 2 is a checkpoint requiring human verification)
- **Files modified:** 1

## Accomplishments
- vercel.json confirmed with Singapore region (sin1) — no changes needed (already correct from Plan 01)
- src/app/api/revalidate/route.ts confirmed with correct HMAC validation via parseBody and revalidateTag call
- .env.local.example updated with documentation comments showing source for each env var
- SANITY_REVALIDATE_SECRET generated: `37c46723a3bdc96c5b84b58ba29a9ff3e337980d80dcce833b90f16b2188bc42`

## Task Commits

1. **Task 1: Prepare deployment configuration** - `11a18f5` (chore)

**Plan metadata:** (pending — waiting on Task 2 human verification)

## Files Created/Modified
- `.env.local.example` - Updated with documentation comments for all five env vars (source instructions)

## Decisions Made
- vercel.json and revalidate route were already correct from Plan 01 — no changes needed to either file
- Generated SANITY_REVALIDATE_SECRET using Node.js crypto.randomBytes(32) per plan specification

## Deviations from Plan

None - code preparation executed exactly as written. Vercel CLI deployment requires user authentication (expected per plan).

## Issues Encountered
- No GitHub remote configured yet — `git push origin master` in plan steps is a prerequisite that requires user to create a GitHub repo and push before Vercel can import it, OR use `vercel --yes` directly without GitHub integration.

## User Setup Required

**All deployment steps require user action.** Vercel CLI is installed (v48.2.0) but not authenticated.

### Step-by-step deployment instructions:

**1. Authenticate with Vercel:**
```bash
vercel login
```

**2. Push code to GitHub (optional but recommended):**
```bash
# Create repo at github.com first, then:
git remote add origin https://github.com/YOUR-ORG/seputeh-hyo.git
git push -u origin master
```

**3. Deploy to Vercel:**
```bash
cd "C:/Users/navie/OneDrive/Documents/ANeura/HYO"
vercel --yes
```

**4. Set all five environment variables in Vercel:**
```bash
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
vercel env add NEXT_PUBLIC_SANITY_DATASET production
vercel env add SANITY_API_TOKEN production
vercel env add SANITY_REVALIDATE_SECRET production
vercel env add RESEND_API_KEY production
```

Values needed:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — from manage.sanity.io project settings
- `NEXT_PUBLIC_SANITY_DATASET` — `production`
- `SANITY_API_TOKEN` — create Viewer token at manage.sanity.io -> API -> Tokens
- `SANITY_REVALIDATE_SECRET` — `37c46723a3bdc96c5b84b58ba29a9ff3e337980d80dcce833b90f16b2188bc42`
- `RESEND_API_KEY` — from resend.com dashboard -> API Keys

**5. Trigger production deploy with env vars:**
```bash
vercel --prod
```

**6. Configure Sanity ISR webhook** at manage.sanity.io -> project -> API -> Webhooks -> Add webhook:
- URL: `https://{your-vercel-domain}/api/revalidate`
- Dataset: production
- Trigger on: Create, Update, Delete
- Filter: (leave empty)
- Secret: `37c46723a3bdc96c5b84b58ba29a9ff3e337980d80dcce833b90f16b2188bc42`

**7. Set up Resend** at resend.com -> Domains -> Add Domain:
- Enter the org domain (e.g. seputehhyo.org.my)
- Add MX, TXT (SPF), and DKIM records at DNS registrar
- Status will show "Pending" (DNS propagation takes 24-48h)

## Next Phase Readiness
- Plan 01-03 (email) can start once RESEND_API_KEY is set in Vercel and domain is pending verification
- Content pages and CMS work can proceed once Sanity project ID is configured
- ISR webhook must be tested before content publishing pipeline is considered complete

---
*Phase: 01-infrastructure*
*Completed: 2026-03-11*
