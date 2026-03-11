# Phase 1: Infrastructure - Research

**Researched:** 2026-03-11
**Domain:** Next.js 15 / Sanity v3 / next-intl v4 / Vercel / Resend / Dependabot / UptimeRobot
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Next.js 15 (App Router) with Tailwind CSS v4 and shadcn/ui | Stack section — create-next-app bootstrap + shadcn init + Tailwind v4 |
| INFRA-02 | Sanity v3 CMS connected; Studio accessible at `/studio` | Sanity section — next-sanity integration, embedded Studio route |
| INFRA-03 | next-intl v4 with URL-prefixed locale routing (`/en/`, `/ms/`, `/ta/`) | next-intl section — defineRouting + middleware + `[locale]` segment |
| INFRA-04 | Site deployed to Vercel with Singapore edge node | Vercel section — environment variables, region pin, preview deploys |
| INFRA-05 | Resend account connected for transactional email | Resend section — API key env var, verified sender domain |
| INFRA-06 | Dependabot enabled for automated dependency security updates | Dependabot section — `.github/dependabot.yml` config |
| INFRA-07 | UptimeRobot monitoring configured to alert org email | UptimeRobot section — free tier HTTP monitor setup |
| ADMIN-01 | `siteSettings` Sanity schema stores contact email, WhatsApp, social URLs | Sanity schemas section — singleton document type pattern |
| ADMIN-02 | Sanity Studio accessible for non-technical admins to manage all content | Sanity section — embedded `/studio` route, role-based access |
| ADMIN-03 | At least two admin accounts under org's official email in Sanity Studio | Sanity admin section — project member invitation flow |
| ADMIN-04 | Sanity webhook triggers ISR revalidation on publish | ISR section — `revalidateTag`, `parseBody`, GROQ webhook |
</phase_requirements>

---

## Summary

Phase 1 is a pure infrastructure wiring phase: no production UI is built, but every service is connected and all Sanity schemas are defined so that subsequent phases never revisit plumbing decisions. The entire stack (Next.js 15 + Sanity v3 + next-intl v4 + Vercel + Resend) has a high degree of mutual integration — official SDKs and documented patterns exist for every seam between these services, reducing integration risk.

The highest-risk items in this phase are not technical but operational: registering all service accounts under the organisation's email (not the developer's), generating and storing the `SANITY_REVALIDATE_SECRET` for the ISR webhook, and verifying the Resend sender domain (which requires DNS record propagation and can take hours). These must happen before the phase can be marked complete.

The Sanity schema design is the most consequential architectural decision in this phase. All four schemas (`programme`, `teamMember`, `document`, `siteSettings`) must include trilingual fields from the start; retrofitting i18n fields after content has been entered is destructive. Use inline object fields (`{en, ms, ta}`) for text rather than the `@sanity/document-internationalization` document-per-locale pattern — this keeps all locale variants of a single record together and is simpler for non-technical admins.

**Primary recommendation:** Bootstrap with `create-next-app` + `npm create sanity@latest`, wire `next-sanity` and `next-intl`, define all four schemas with trilingual fields, set up Vercel deployment with env vars, then configure ISR webhook, Resend domain, Dependabot, and UptimeRobot as final steps.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | `^15` | App Router SSG/ISR framework | Creator-supported, best Next.js deployment target, native ISR |
| typescript | `^5` | Type safety | Sanity typegen + next-intl type-safe keys require it |
| sanity | `^3` | CMS schema definitions + Studio | Free tier fits NGO scale; non-technical Studio UI |
| @sanity/client | `^6` | Server-side GROQ queries | Official Sanity fetch client |
| next-sanity | `^9` | `sanityFetch` helper + webhook parsing | `parseBody` for webhook auth; `sanityFetch` manages cache tags |
| next-intl | `^4` | URL-prefixed locale routing + typed messages | Best App Router integration; `defineRouting` + middleware |
| tailwindcss | `^4` | Utility-first CSS | CSS-first config (no `tailwind.config.js` needed); 3-8x faster builds |
| @tailwindcss/postcss | `^4` | PostCSS integration for Tailwind v4 | Required peer for Tailwind v4 |
| resend | `^4` | Transactional email API | Best React/Next.js integration; 3 000 emails/month free |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @sanity/image-url | `^1` | Build optimised image URLs from Sanity image refs | Every image field in schemas |
| @sanity/document-internationalization | `^3` | Optional: document-per-locale CMS pattern | Only if field-level i18n proves insufficient — not recommended for this phase |
| shadcn/ui (CLI) | Latest | Accessible React component registry | Added per-component; full Tailwind v4 + React 19 support confirmed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sanity v3 (managed) | Payload CMS v3 (self-hosted) | Payload has excellent DX but requires a database + VPS; adds infrastructure Seputeh HYO cannot maintain |
| next-intl v4 | `next-i18next` | `next-i18next` does not support App Router natively; requires pages-router patterns |
| Resend | Nodemailer + SMTP | Nodemailer on Gmail has low delivery limits and requires managing SMTP credentials; Resend is purpose-built for serverless |
| Vercel Hobby | Netlify Starter | Netlify's credit-based free tier is less transparent; Next.js ISR support on Netlify has historically had edge cases |

**Installation:**

```bash
# 1. Bootstrap Next.js project
npx create-next-app@latest seputeh-hyo --typescript --tailwind --app --src-dir

# 2. Core CMS + i18n + email packages
npm install next-intl@^4 sanity@^3 next-sanity@^9 @sanity/client@^6 @sanity/image-url@^1
npm install resend@^4

# 3. Tailwind v4 peer (create-next-app may already install)
npm install tailwindcss@^4 @tailwindcss/postcss@^4

# 4. Initialise shadcn/ui (runs interactive CLI, handles Tailwind v4 automatically)
npx shadcn@latest init

# 5. Add skeleton shadcn components needed for studio route placeholder
npx shadcn@latest add button

# 6. Initialise Sanity project (creates sanity.config.ts, schemas/, studio route)
npm create sanity@latest -- --project <projectId> --dataset production --template clean

# 7. Generate TypeScript types from Sanity schema
npx sanity typegen generate
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── [locale]/            # Dynamic segment: "en" | "ms" | "ta"
│   │   ├── layout.tsx       # Sets <html lang={locale}>, provides next-intl messages
│   │   └── page.tsx         # Locale-aware home page (placeholder for Phase 1)
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts     # Sanity webhook → revalidateTag handler
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx     # Embedded Sanity Studio (catch-all route)
├── i18n/
│   ├── routing.ts           # defineRouting({ locales, defaultLocale })
│   └── request.ts           # getRequestConfig for server components
├── messages/
│   ├── en.json              # English UI strings (placeholder keys for Phase 1)
│   ├── ms.json
│   └── ta.json
├── sanity/
│   ├── client.ts            # createClient + sanityFetch helper
│   ├── env.ts               # Typed env vars for Sanity
│   └── schemas/
│       ├── index.ts         # Schema registry
│       ├── programme.ts
│       ├── teamMember.ts
│       ├── document.ts
│       └── siteSettings.ts
├── middleware.ts             # next-intl createMiddleware (locale routing)
└── sanity.config.ts         # Sanity Studio configuration
```

### Pattern 1: next-intl Locale Routing (defineRouting)

**What:** Centralised routing config that drives both middleware and navigation helpers.
**When to use:** Phase 1 bootstrap — this is the foundation for all i18n work.

```typescript
// src/i18n/routing.ts
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ms', 'ta'],
  defaultLocale: 'en',
});
```

```typescript
// src/middleware.ts
// Source: https://next-intl.dev/docs/routing/middleware
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static files and API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

```typescript
// src/i18n/request.ts
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'ms' | 'ta')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### Pattern 2: Sanity `sanityFetch` with Cache Tags

**What:** All data fetching uses tagged cache entries so the ISR webhook can bust exactly the right pages.
**When to use:** Every GROQ query in the app.

```typescript
// src/sanity/client.ts
// Source: https://github.com/sanity-io/next-sanity
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN so webhook-triggered revalidation fetches fresh data
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
}) {
  return client.fetch<T>(query, params, {
    next: { tags },
    cache: 'force-cache', // Required in Next.js 15 (not the default)
  });
}
```

### Pattern 3: ISR Revalidation Webhook Handler

**What:** Sanity calls this API route on every document publish/unpublish/delete; it verifies the signature then calls `revalidateTag` to purge only the affected content type.
**When to use:** Required for ADMIN-04.

```typescript
// src/app/api/revalidate/route.ts
// Source: https://www.sanity.io/guides/sanity-webhooks-and-on-demand-revalidation-in-nextjs
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 });
    }

    revalidateTag(body._type); // e.g. "programme", "teamMember", "document", "siteSettings"
    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
```

### Pattern 4: Embedded Sanity Studio Route

**What:** Studio served inside the Next.js app at `/studio` (catch-all route).
**When to use:** Phase 1 — makes Studio accessible without a separate deploy.

```typescript
// src/app/studio/[[...tool]]/page.tsx
// Source: https://www.sanity.io/docs/nextjs-embedded-studio
'use client';
import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

### Pattern 5: Sanity Schema with Inline Trilingual Fields

**What:** Every translatable text field uses an inline object `{en, ms, ta}` rather than the document-per-locale plugin. Admin sees all three language variants on one screen.
**When to use:** All four schemas in Phase 1.

```typescript
// src/sanity/schemas/programme.ts
// Source: Sanity v3 schema documentation
import { defineField, defineType } from 'sanity';

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'en', title: 'English', type: 'string' },
      { name: 'ms', title: 'Bahasa Malaysia', type: 'string' },
      { name: 'ta', title: 'Tamil', type: 'string' },
    ],
  });

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    localizedString('title', 'Title'),
    localizedString('description', 'Description'),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Leadership', 'Cultural', 'Community Service', 'Well-being', 'Social Awareness'],
      },
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' } }),
  ],
  preview: { select: { title: 'title.en' } },
});
```

### Pattern 6: `siteSettings` as Sanity Singleton

**What:** A single document that stores global config (contact email, WhatsApp number, social URLs). Prevents hardcoding in code per ADMIN-01.
**When to use:** Phase 1 schema definition.

```typescript
// src/sanity/schemas/siteSettings.ts
import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton: prevent creating more than one document of this type
  __experimental_actions: ['update', 'publish'], // No 'create' or 'delete'
  fields: [
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp Number (with country code)', type: 'string' }),
    defineField({ name: 'facebookUrl', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
  ],
});
```

### Anti-Patterns to Avoid

- **`@sanity/document-internationalization` plugin in Phase 1:** This plugin creates separate document per locale, which is more complex for non-technical admins (they must navigate between linked documents). Inline `{en, ms, ta}` object fields are simpler and sufficient for this project's content volume.
- **`cache: 'no-store'` on sanityFetch:** Disables ISR entirely; pages will never be cached. Always use `cache: 'force-cache'` with `tags` in Next.js 15.
- **Registering Sanity/Vercel/Resend accounts under the developer's personal email:** Violates ADMIN-03 and creates succession risk (see pitfalls).
- **Hardcoding contact email, WhatsApp number, or social URLs in code:** Violates ADMIN-01. All such values must be in the `siteSettings` Sanity document.
- **Creating the Studio as a separate Sanity-hosted project instead of embedding at `/studio`:** Adds a second domain to manage; the embedded route is simpler for admin bookmarking.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Webhook signature verification | Custom HMAC check | `parseBody` from `next-sanity/webhook` | Handles timing-safe comparison, body buffering, and error cases |
| Locale routing middleware | Custom middleware with regex | `createMiddleware` from `next-intl/middleware` | Handles default locale redirect, cookie persistence, and static file exclusion |
| Sanity asset URL construction | String concatenation | `@sanity/image-url` builder | Handles CDN URL, format, width, and hotspot cropping correctly |
| TypeScript types for Sanity schemas | Hand-written interfaces | `npx sanity typegen generate` | Generates exact types from your live schema definition |
| Accessible UI primitives (Button, Dialog, etc.) | Custom components | `npx shadcn@latest add <component>` | Radix UI primitives inside; WCAG 2.1 AA tested; you own the code |

**Key insight:** The integration seams between Next.js 15, Sanity, and next-intl all have official SDKs with documented patterns. Using anything else creates maintenance burden without benefit.

---

## Common Pitfalls

### Pitfall 1: `cache: 'force-cache'` is not the default in Next.js 15

**What goes wrong:** In Next.js 14, `fetch` defaulted to `force-cache`. In Next.js 15 the default changed to `no-store`. Any `sanityFetch` call without an explicit `cache: 'force-cache'` will bypass ISR entirely and make a live Sanity API call on every request.
**Why it happens:** Muscle memory from Next.js 14 patterns; documentation examples written before the v15 change.
**How to avoid:** Always pass `cache: 'force-cache'` inside the `next` option when using `sanityFetch`. This is already baked into the pattern above.
**Warning signs:** Pages show fresh Sanity content on every reload even without revalidation; Sanity API request count is high.

### Pitfall 2: Sanity webhook configured without `SANITY_REVALIDATE_SECRET`

**What goes wrong:** Unauthenticated `POST /api/revalidate` allows anyone to trigger cache purges, potentially causing degraded performance (constant revalidation).
**Why it happens:** Developer skips the secret to test quickly, then forgets to add it before deploying.
**How to avoid:** Generate a random secret (`openssl rand -hex 32`), add it to Vercel environment variables as `SANITY_REVALIDATE_SECRET`, and configure the same value in the Sanity webhook dashboard under "Secret". Use `parseBody` which validates the HMAC signature.
**Warning signs:** `isValidSignature` always returns `false` until the secret is set on both sides.

### Pitfall 3: next-intl middleware blocking Sanity Studio route

**What goes wrong:** The `matcher` in `middleware.ts` intercepts `/studio` requests and tries to redirect them as a locale-prefixed route, breaking Studio.
**Why it happens:** Overly broad matcher pattern.
**How to avoid:** The recommended matcher `/((?!api|_next|_vercel|.*\\..*).*)` does NOT exclude `/studio` by default. Add `studio` explicitly:
```typescript
matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
```
**Warning signs:** Navigating to `/studio` redirects to `/en/studio` (404).

### Pitfall 4: Resend sender domain not verified before testing

**What goes wrong:** Resend rejects email sends with a `400 The from address is not verified` error. DNS propagation for domain verification can take 24–48 hours.
**Why it happens:** Domain verification is started on the day of testing rather than at project kickoff.
**How to avoid:** Create the Resend account and add the DNS records (`MX`, `TXT`, `DKIM`) on the first day of the phase. By the time the Resend integration code is written, the domain will be verified.
**Warning signs:** Resend dashboard shows "Pending" status for the sender domain.

### Pitfall 5: Sanity `siteSettings` singleton allowing multiple documents

**What goes wrong:** Non-technical admin creates a second `siteSettings` document. The app queries the first one, the admin edits the second, and changes never appear on the site.
**Why it happens:** Default Sanity document types allow creating multiple instances.
**How to avoid:** Use `__experimental_actions: ['update', 'publish']` on the schema (removes the create/delete buttons in Studio). Additionally, configure the Studio desk structure to show `siteSettings` as a single-document panel rather than a list.
**Warning signs:** Studio shows a list view for Site Settings with a "Create" button.

### Pitfall 6: All service accounts under the developer's personal email

**What goes wrong:** Developer registers Sanity, Vercel, Resend, and GitHub under their own email. When they leave, the NGO loses access to the entire deployment pipeline.
**Why it happens:** It is faster to use an existing account. ADMIN-03 is treated as a post-launch concern.
**How to avoid:** Before creating any accounts, confirm the org has access to its official email (`info@seputehhyo.org.my` or equivalent). Register all service accounts under that email on day one. Add the developer as a team member with appropriate permissions.
**Warning signs:** Vercel project "Owner" is `developer@gmail.com`; no org email in the team.

### Pitfall 7: Tailwind v4 configuration mismatch with shadcn/ui

**What goes wrong:** Using an older `tailwind.config.js`-based setup with Tailwind v4 causes style conflicts. shadcn/ui's CLI `init` must be run after Tailwind v4 is installed to generate the correct CSS-variable-based theme in `globals.css`.
**Why it happens:** Following shadcn/ui docs written for Tailwind v3.
**How to avoid:** Run `npx shadcn@latest init` after Tailwind v4 is installed. The shadcn CLI detects v4 and generates the `@theme inline` block in CSS rather than a JS config. Refer to `ui.shadcn.com/docs/tailwind-v4`.
**Warning signs:** shadcn button styles appear unstyled or with incorrect colours.

---

## Code Examples

### Environment Variables Required

```bash
# .env.local (never commit — add to Vercel project env vars)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...         # Read token for server-side fetches
SANITY_REVALIDATE_SECRET=...   # openssl rand -hex 32
RESEND_API_KEY=re_...
```

### Vercel Singapore Region Pin

```json
// vercel.json
{
  "regions": ["sin1"]
}
```

Note: `sin1` is Vercel's Singapore region. Pinning ensures edge functions run from Singapore, not the US default, for Malaysian visitors.

### Dependabot Configuration

```yaml
# .github/dependabot.yml
# Source: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
```

Commit this file to the repository root. Dependabot will begin opening PRs automatically once the repo is connected to GitHub.

### Sanity Webhook Setup (Sanity Dashboard)

1. In `manage.sanity.io`, navigate to the project → API → Webhooks → Add webhook.
2. URL: `https://your-vercel-domain.vercel.app/api/revalidate`
3. Dataset: `production`
4. Trigger on: Create, Update, Delete
5. Filter: Leave empty (triggers on all document types)
6. Secret: Same value as `SANITY_REVALIDATE_SECRET` env var

### UptimeRobot Setup

Free tier provides one monitor type: HTTP(s) — checks every 5 minutes.

1. Create account at `uptimerobot.com` under the org email.
2. Add New Monitor → Monitor Type: HTTP(s) → Friendly Name: "Seputeh HYO" → URL: `https://yourdomain.vercel.app`.
3. Monitoring Interval: 5 minutes.
4. Alert Contacts: Add org email. Also add at least one committee member's personal email as a backup.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` (v3) | CSS-first `@theme` directive (v4) | Jan 2025 (Tailwind v4) | No JS config file needed; shadcn CLI handles migration |
| `next/headers` `cache: 'force-cache'` default | Must be set explicitly in Next.js 15 | Oct 2024 (Next.js 15) | ISR breaks silently if omitted |
| `middleware.ts` (historical name) | `middleware.ts` still correct for Next.js 15 (note: search results mentioned renaming, but this is NOT current — v15 still uses `middleware.ts`) | N/A | No change needed |
| `@sanity/document-internationalization` for i18n | Inline object fields `{en, ms, ta}` preferred for small projects | Ongoing recommendation | Simpler admin UX; no plugin dependency |
| Sanity Studio as separate hosted project | Embedded at `/studio` in Next.js app | Sanity v3 (2022+) | One deployment, one domain |

**Deprecated/outdated:**
- `next/navigation` `useRouter` for locale switching: Use `useRouter` from `next-intl/navigation` (the typed wrapper) instead.
- `getStaticPaths` / `getServerSideProps`: App Router uses `generateStaticParams` + Server Components.
- `next-i18next`: Designed for Pages Router; not compatible with App Router.

---

## Open Questions

1. **Resend sender domain**
   - What we know: Resend requires a custom domain with verified DNS records to send from a branded address.
   - What's unclear: Whether Seputeh HYO has an active domain (`seputehhyo.org.my` or similar) and can add DNS records.
   - Recommendation: Confirm domain registrar access in Week 1. If domain does not exist yet, register it before starting Phase 1. Resend verification is on the critical path.

2. **Sanity project ID and dataset**
   - What we know: `npm create sanity@latest` creates these interactively.
   - What's unclear: Whether a Sanity project already exists for this organisation.
   - Recommendation: Check `manage.sanity.io` before running the init command. If a project exists, use the existing `projectId`.

3. **Vercel team vs personal account**
   - What we know: Hobby (personal) plan is free; Teams plan starts at $20/month.
   - What's unclear: Whether the repo will be under a GitHub organisation account.
   - Recommendation: Use a personal Vercel account connected to the org GitHub for now (free). The project can be transferred to a Vercel team later if needed.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected yet — to be bootstrapped in Wave 0 |
| Config file | `jest.config.ts` or `vitest.config.ts` (to be created) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |
| Recommended framework | Vitest (faster, ESM-native, compatible with Next.js 15) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | `next dev` runs without errors; `/en/`, `/ms/`, `/ta/` resolve | smoke | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en` → 200 | ❌ Wave 0 |
| INFRA-02 | Studio at `/studio` returns 200 | smoke | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/studio` → 200 | ❌ Wave 0 |
| INFRA-03 | All three locale routes resolve | smoke | Check `/en`, `/ms`, `/ta` each return 200 | ❌ Wave 0 |
| INFRA-04 | Vercel deployment URL returns 200 | manual | Navigate to Vercel preview URL in browser | manual-only |
| INFRA-05 | Resend sends test email | manual | Trigger from Resend dashboard "Send Test Email" | manual-only |
| INFRA-06 | Dependabot PRs visible in GitHub | manual | Check GitHub repo → Security → Dependabot | manual-only |
| INFRA-07 | UptimeRobot sends alert on simulated outage | manual | Pause monitor in UptimeRobot, wait for alert email | manual-only |
| ADMIN-01 | `siteSettings` schema has contact email, WhatsApp, social URL fields | unit | `vitest run tests/sanity/schemas.test.ts` | ❌ Wave 0 |
| ADMIN-02 | Studio renders all four schemas | smoke | Studio visual check via browser | manual-only |
| ADMIN-03 | Two admin accounts under org email | manual | Check Sanity project members in manage.sanity.io | manual-only |
| ADMIN-04 | ISR revalidation fires after Sanity publish (page updates within seconds) | integration | Publish test document → check page renders updated content within 10s | manual-only |

### Sampling Rate

- **Per task commit:** `npx vitest run tests/sanity/` (schema unit tests only, < 5s)
- **Per wave merge:** Full smoke suite (curl checks for locale routes + studio route)
- **Phase gate:** All smoke tests green + all manual checks documented as passed before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/sanity/schemas.test.ts` — covers ADMIN-01 (siteSettings field presence), validates all four schemas export the expected field names
- [ ] `tests/smoke/routes.test.ts` — covers INFRA-01, INFRA-02, INFRA-03 (locale routes + studio return 200)
- [ ] `vitest.config.ts` — project root config
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react` — if not already present

---

## Sources

### Primary (HIGH confidence)

- `next-intl.dev/docs/getting-started/app-router/with-i18n-routing` — `defineRouting`, middleware, `getRequestConfig` patterns
- `next-intl.dev/docs/routing/middleware` — Matcher configuration, Studio exclusion pattern
- `github.com/sanity-io/next-sanity` — `sanityFetch`, `parseBody`, embedded Studio patterns
- `sanity.io/guides/sanity-webhooks-and-on-demand-revalidation-in-nextjs` — ISR webhook setup
- `ui.shadcn.com/docs/tailwind-v4` — Confirmed Tailwind v4 + shadcn/ui full compatibility, CLI handles migration
- `docs.github.com/en/code-security/dependabot/...` — `dependabot.yml` schema for npm
- Prior domain research: `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md` (all HIGH confidence, researched 2026-03-11)

### Secondary (MEDIUM confidence)

- `victoreke.com/blog/sanity-webhooks-and-on-demand-revalidation-in-nextjs` — Practical implementation walkthrough (cross-verified with official Sanity guide)
- `buildwithmatija.com/blog/nextjs-internationalization-guide-next-intl-2025` — next-intl v4 setup walkthrough (cross-verified with official docs)

### Tertiary (LOW confidence)

- None — all claims verified against official sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed via search against official docs; prior research also HIGH
- Architecture: HIGH — official patterns from next-sanity and next-intl docs; no speculation
- Pitfalls: HIGH — Next.js 15 `force-cache` change is a documented breaking change; webhook secret, middleware matcher, and account ownership pitfalls are verified practical issues
- Validation architecture: MEDIUM — Vitest choice is a recommendation; the specific test file paths are Wave 0 design, not pre-existing

**Research date:** 2026-03-11
**Valid until:** 2026-06-11 (90 days — stack is stable, but verify next-intl patch versions before planning)
