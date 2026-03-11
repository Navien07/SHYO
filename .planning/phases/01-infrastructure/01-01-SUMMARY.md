---
phase: 01-infrastructure
plan: "01"
subsystem: infra
tags: [nextjs, tailwind, shadcn, sanity, next-intl, vitest, typescript]

# Dependency graph
requires: []
provides:
  - Next.js 15 project scaffolded with Tailwind v4 and shadcn/ui
  - next-intl v4 locale routing for /en/, /ms/, /ta/
  - Sanity v3 Studio embedded at /studio with four trilingual CMS schemas
  - Vitest test infrastructure with 26 passing tests
  - Vercel deployment config pinned to Singapore region
affects:
  - 01-02 (content pages depend on schemas and routing)
  - 01-03 (email setup depends on project scaffold)
  - all downstream phases

# Tech tracking
tech-stack:
  added:
    - next@^15.5.12
    - next-intl@^4.8.3
    - sanity@^3.99.0
    - next-sanity@^9.12.3
    - "@sanity/client@^6"
    - "@sanity/image-url@^1"
    - resend@^4.8.0
    - tailwindcss@^4
    - "@tailwindcss/postcss@^4"
    - vitest@^2
    - "@vitejs/plugin-react@^4"
    - shadcn/ui (Radix/Nova preset, button component)
  patterns:
    - localizedString helper for trilingual Sanity fields (object with en/ms/ta sub-fields)
    - next-intl createMiddleware with studio excluded from matcher
    - siteSettings singleton via __experimental_actions (update/publish only)
    - sanityFetch with force-cache and ISR tags for Next.js 15
    - Root layout as pass-through (html/body rendered in locale layout)

key-files:
  created:
    - src/i18n/routing.ts
    - src/i18n/request.ts
    - src/middleware.ts
    - src/sanity/env.ts
    - src/sanity/client.ts
    - src/sanity/schemas/programme.ts
    - src/sanity/schemas/teamMember.ts
    - src/sanity/schemas/document.ts
    - src/sanity/schemas/siteSettings.ts
    - src/sanity/schemas/index.ts
    - sanity.config.ts
    - src/app/studio/[[...tool]]/page.tsx
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/api/revalidate/route.ts
    - messages/en.json
    - messages/ms.json
    - messages/ta.json
    - vercel.json
    - vitest.config.ts
    - .env.local.example
    - tests/sanity/schemas.test.ts
    - tests/smoke/routes.test.ts
  modified:
    - package.json
    - next.config.ts
    - src/app/layout.tsx

key-decisions:
  - "Downgraded Next.js from 16 to ^15 for next-sanity@^9 peer compatibility (create-next-app installed v16)"
  - "Used shadcn --defaults flag (Radix/Nova preset) to bypass interactive prompts"
  - "localizedString helper pattern established for all trilingual schema fields"
  - "siteSettings __experimental_actions excludes create/delete to enforce singleton"
  - "Middleware matcher excludes studio, api, _next, _vercel, and static files"
  - "Root layout renders children directly (no html wrapper) — locale layout owns html/body"

patterns-established:
  - "localizedString(name, title): defineField pattern for trilingual object fields"
  - "next-intl middleware exclusion: /((?!api|_next|_vercel|studio|.*\\..*).*)/"
  - "sanityFetch with cache: force-cache and next: { tags } for ISR revalidation"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03, ADMIN-01, ADMIN-02]

# Metrics
duration: 11min
completed: 2026-03-11
---

# Phase 1 Plan 01: Project Scaffold Summary

**Next.js 15 + Tailwind v4 + shadcn/ui bootstrapped with Sanity v3 Studio at /studio (4 trilingual schemas), next-intl v4 routing for /en/ /ms/ /ta/, and Vitest with 26 passing tests**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-11T12:11:02Z
- **Completed:** 2026-03-11T12:22:24Z
- **Tasks:** 2
- **Files modified:** 23 files created/modified

## Accomplishments
- Next.js 15 project bootstrapped with Tailwind v4 CSS-first config via shadcn (no tailwind.config.js)
- four Sanity schemas (programme, teamMember, document, siteSettings) with trilingual en/ms/ta fields via localizedString helper
- next-intl v4 locale routing for /en/, /ms/, /ta/ with Studio excluded from middleware matcher
- Sanity Studio embedded at /studio with structureTool and visionTool plugins
- 26 vitest unit tests passing: all schemas validated, routing config verified

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap project and install dependencies** - `b9f0d0a` (feat)
2. **TDD RED: Failing tests** - `9161971` (test)
3. **Task 2: Wire next-intl routing, Sanity schemas, and Studio** - `f7f24d5` (feat)

_Note: TDD tasks have multiple commits (test RED → feat GREEN)_

## Files Created/Modified
- `src/i18n/routing.ts` - defineRouting with locales en/ms/ta
- `src/middleware.ts` - next-intl middleware excluding /studio from matcher
- `src/sanity/schemas/programme.ts` - Programme with trilingual title/description, image, category, slug
- `src/sanity/schemas/teamMember.ts` - TeamMember with trilingual name/role, photo, order
- `src/sanity/schemas/document.ts` - Document with trilingual title, category, year, file
- `src/sanity/schemas/siteSettings.ts` - Singleton with contactEmail, whatsappNumber, facebookUrl, instagramUrl
- `src/sanity/schemas/index.ts` - Registry of all 4 schemas
- `sanity.config.ts` - Sanity Studio config at /studio basePath
- `src/sanity/client.ts` - sanityFetch with force-cache and ISR tags
- `src/app/[locale]/layout.tsx` - Locale layout with NextIntlClientProvider
- `src/app/studio/[[...tool]]/page.tsx` - Embedded NextStudio
- `messages/en.json, ms.json, ta.json` - Translation files with nav keys
- `next.config.ts` - Updated with createNextIntlPlugin wrapper
- `vercel.json` - Singapore region (sin1)
- `vitest.config.ts` - Test runner config

## Decisions Made
- **Next.js version downgrade:** create-next-app@latest installed Next.js 16 but next-sanity@^9 requires ^14.2 or ^15. Downgraded to ^15 (Rule 1 auto-fix).
- **shadcn init approach:** Used `--defaults` flag to avoid interactive prompts (Radix/Nova preset selected automatically, includes button component).
- **localizedString helper:** Defined once per schema file as a local helper function (not shared module) for simplicity at this stage.
- **Root layout structure:** Root layout is a minimal pass-through returning `children` directly; the locale layout owns html/body/lang for correct locale-aware rendering.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Downgraded Next.js from v16 to v15 for peer compatibility**
- **Found during:** Task 1 (dependency installation)
- **Issue:** `create-next-app@latest` installed Next.js 16.1.6. `next-sanity@^9` has peer dependency `next@"^14.2 || ^15.0.0-0"`. npm install failed with ERESOLVE.
- **Fix:** Ran `npm install next@^15 react@^19 react-dom@^19` before installing core packages
- **Files modified:** package.json, package-lock.json
- **Verification:** All subsequent npm installs succeeded. 26 tests pass.
- **Committed in:** `b9f0d0a` (Task 1 commit)

**2. [Rule 3 - Blocking] Used `--defaults` flag for shadcn init to skip interactive prompts**
- **Found during:** Task 1 (shadcn initialization)
- **Issue:** `npx shadcn@latest init --yes` still launched interactive TUI even with `--yes` flag. Cannot be automated with stdin.
- **Fix:** Used `--defaults` flag which selects Next.js template and Nova preset non-interactively. Button component was included automatically.
- **Files modified:** components.json, src/components/ui/button.tsx, src/lib/utils.ts, src/app/globals.css
- **Verification:** components.json created, button component present
- **Committed in:** `b9f0d0a` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug/compatibility, 1 blocking)
**Impact on plan:** Both fixes were necessary for successful execution. The Next.js downgrade maintains full compatibility with all listed packages. No scope creep.

## Issues Encountered
- `create-next-app` used directory name "HYO" as package name, which fails npm naming restrictions (uppercase). Workaround: bootstrapped in a temp directory (`seputeh-hyo-temp`) and copied files to HYO project directory.

## User Setup Required

**External services require manual configuration before `npm run dev` will fully work.**

The Sanity client (`src/sanity/env.ts`) reads env vars at runtime. Without them set, the dev server will throw. Steps:

1. Copy `.env.local.example` to `.env.local`
2. Create a Sanity project at https://www.sanity.io/manage and fill in:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — from your Sanity project dashboard
   - `NEXT_PUBLIC_SANITY_DATASET` — typically `production`
   - `SANITY_API_TOKEN` — create a token with Editor permissions
   - `SANITY_REVALIDATE_SECRET` — any random string (used for webhook signature)
3. Set `RESEND_API_KEY` when ready to configure email (Plan 01-03)

Until env vars are set, use `NEXT_PUBLIC_SANITY_PROJECT_ID=placeholder NEXT_PUBLIC_SANITY_DATASET=production npm run dev` to start the dev server for UI development.

## Next Phase Readiness
- Project scaffold complete — all downstream phases can proceed
- Locale routing is wired (/en/, /ms/, /ta/ will return 200 once SANITY env vars are set)
- Sanity schemas are final — all four types defined with trilingual fields (retrofitting after content entry would be destructive)
- Studio accessible at /studio once Sanity project ID is configured
- Plan 01-02 (content pages) and 01-03 (email) can proceed in parallel

---
*Phase: 01-infrastructure*
*Completed: 2026-03-11*
