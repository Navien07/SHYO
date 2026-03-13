# Phase 3: Core Static Pages — Research

**Researched:** 2026-03-14
**Domain:** Next.js 15 App Router static pages, Sanity CMS schema extension, Resend email, next-intl Server Actions
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Homepage — Hero**
- Layout: Full-bleed background image with text overlaid (dark overlay on photo for readability)
- Image source: Stored in Sanity `siteSettings` schema — admin-editable, no code change required to swap the hero photo
- Headline: "Be Part of The Change" (EN) — BM and Tamil translations TBD (human-translated, not auto-translated)
- Subline: The org's mission statement — same translation requirement applies
- CTAs: Two buttons — "Join Us" (primary, saffron, → membership form) + "Learn More" (secondary, → About Us page)

**Homepage — Impact Statistics**
- Years active: Hardcoded, auto-calculated from founding year 2002 (no CMS needed — always accurate)
- Member count + Programmes delivered: CMS-editable via Sanity `siteSettings` schema
- Initial values: Placeholder (0 or TBD); admin fills in real numbers before launch

**Homepage — Programme Highlights**
- Count: 3 cards — fetches 3 most recently published programmes from Sanity
- Card content: Photo + title + category badge (no description snippet)
- Linking: Each card links to `/[locale]/programmes/[slug]` — Phase 4 builds those detail pages; cards will 404 until Phase 4 is deployed
- Empty state: Show 3 skeleton/placeholder cards with a "Coming soon" message if Sanity returns 0 programmes
- "View All" CTA: Button below the highlights section links to `/[locale]/programmes` (Phase 4 page)

**Contact Form**
- Fields: Name, email, subject (free-text, not dropdown), message
- Success state: Form replaced inline with a success message ("Thank you, we'll be in touch") — no redirect
- Validation errors: Inline under each field as the user interacts — no top-level summary
- Delivery: Server Action → Resend → org email (CONT-02); RESEND_API_KEY was explicitly deferred from Phase 1 to Phase 3

### Claude's Discretion
- About Us page sectioning and visual layout (founding date, mission/vision, 5 focus areas, registration details)
- Visual treatment for the five focus areas (cards, icon list, or plain prose)
- Google Map embed approach (full iframe or static image with link)
- Contact page layout beyond the form spec (arrangement of form, WhatsApp link, email, social, map)
- Server Action implementation pattern for the contact form
- Form loading/pending states and disabled-button-on-submit behaviour

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section with mission statement above the fold | Hero pattern: full-bleed bg-image + `siteSettings.heroImage` from Sanity; overlay via Tailwind `before:` pseudo-element or absolute dark div |
| HOME-02 | Impact section: years active, member count, programmes delivered | Years = `new Date().getFullYear() - 2002`; member count + programmes delivered from extended `siteSettings` GROQ query |
| HOME-03 | Programme highlights CMS-driven (3 cards) | Extend `ALL_PROGRAMMES_QUERY` with `[0..2]` slice; reuse existing `Programme` type; skeleton empty state component |
| HOME-04 | CTA button linking to Be Part of Us | shadcn `Button` (saffron via `bg-brand-saffron`); `Link` from `@/i18n/navigation` to `/membership` |
| HOME-05 | Social media links visible in footer | Already delivered in Phase 2 `Footer.tsx` — verify siteSettings feeds correctly |
| ABOUT-01 | Organisation history including founding date 16 September 2002 | Static content in next-intl message files; founding date hardcoded EN/BM/Tamil |
| ABOUT-02 | Mission and vision statements | Static content in next-intl message files; no CMS needed |
| ABOUT-03 | Five focus areas (leadership, culture, community service, social awareness, well-being) | Static content; visual treatment at Claude's discretion; icon-list or card grid |
| ABOUT-04 | Organisation registration/details visible on page | Static content in next-intl message files |
| CONT-01 | Contact form: name, email, subject, message | `useActionState` + Server Action + Zod validation; inline field errors |
| CONT-02 | Form submissions to org email via Resend | Resend v4 `resend.emails.send()` in Server Action; RESEND_API_KEY env var |
| CONT-03 | WhatsApp deep link with pre-filled message | `wa.me/{number}?text=...` href; number from `siteSettings.whatsappNumber` |
| CONT-04 | Org email address displayed | From `siteSettings.contactEmail`; already fetched in locale layout |
| CONT-05 | Social media links (Facebook, Instagram, others) | From `siteSettings.facebookUrl` / `instagramUrl`; reuse Footer SVG icons pattern |
| CONT-06 | Google Map embed showing Seputeh parliamentary area | `<iframe>` embed from Google Maps; or static image with link — Claude's discretion |
</phase_requirements>

---

## Summary

Phase 3 builds the three primary content pages (Homepage, About Us, Contact Us) on top of the fully-built infrastructure from Phases 1 and 2. The technology stack is already in place: Next.js 15 App Router, next-intl v4, Sanity v3 with ISR, Tailwind CSS v4, shadcn/ui, and Resend v4. No new dependencies are required.

The most technically involved work is the contact form: it needs a Client Component wrapper (`'use client'`), React's `useActionState` hook (React 19 / Next.js 15 standard), a separate `actions.ts` file with `'use server'` directive, Zod schema validation, and Resend email delivery. The inline per-field error display and inline success state (no redirect) are locked decisions that constrain the form's state shape.

The Sanity `siteSettings` schema must be extended with three new fields — `heroImage` (image), `memberCount` (number), `programmesDelivered` (number) — and the `SITE_SETTINGS_QUERY` GROQ query and `SiteSettings` TypeScript type must be updated to match. The existing test suite in `tests/sanity/schemas.test.ts` will need new assertions for these fields.

**Primary recommendation:** Implement in this order: (1) Sanity schema + query extension, (2) Homepage, (3) About Us, (4) Contact Us form + Server Action. This order ensures CMS data is available before pages consume it, and defers the most complex piece (form + Resend) to last.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^15.5.12 | App Router pages, Server Actions | Already installed |
| next-intl | ^4.8.3 | `getTranslations` in Server Components, `useTranslations` in Client | Already installed + configured |
| Sanity v3 | ^3.99.0 | CMS content, `siteSettings` schema | Already installed + connected |
| next-sanity | ^9.12.3 | `sanityFetch()` with ISR tags | Already installed |
| @sanity/image-url | ^1.2.0 | `urlFor(image).width(N).url()` for Sanity-hosted images | Already installed |
| Resend | ^4.8.0 | Transactional email delivery | Already installed |
| Tailwind CSS v4 | ^4.2.1 | Styling; brand tokens in `@theme {}` | Already installed |
| shadcn Button | installed | Hero CTAs and form submit | Already installed via `@base-ui/react` |
| Zod | bundled via node_modules | Server-side form validation | Already present (transitive dep) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `react` `useActionState` | React 19 (^19.2.4) | Form state + pending + errors | Contact form Client Component |
| `lucide-react` | ^0.577.0 | Icons for focus area cards or contact page | If icon-list visual treatment chosen |
| `@/i18n/navigation` `Link` | next-intl internal | Locale-aware `<Link>` | All page-to-page links (prevents locale-stacking bug) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `useActionState` | React Hook Form | RHF is overkill for a 4-field form; `useActionState` is idiomatic Next.js 15 and zero extra dependency |
| Resend via Server Action | API Route | Server Actions are simpler, no separate route file needed, same security boundary |
| `@sanity/image-url` urlFor | next-sanity-image package | `next-sanity-image` offers responsive sizes but adds a dependency; `urlFor().width().url()` with `<Image>` fill is sufficient for hero and programme cards |

**Installation:** No new packages required. All dependencies are already in `package.json`.

---

## Architecture Patterns

### Recommended Project Structure for Phase 3

```
src/
├── app/[locale]/
│   ├── page.tsx                    # Homepage — replace stub (Server Component)
│   ├── about/
│   │   └── page.tsx                # About Us (Server Component)
│   └── contact/
│       ├── page.tsx                # Contact Us page (Server Component, renders ContactForm)
│       ├── actions.ts              # Server Action — 'use server' file
│       └── ContactForm.tsx         # Client Component — 'use client', useActionState
├── sanity/schemas/
│   └── siteSettings.ts             # EXTEND: add heroImage, memberCount, programmesDelivered
├── lib/sanity/
│   └── queries.ts                  # EXTEND: SITE_SETTINGS_QUERY + SiteSettings type
├── components/
│   └── home/
│       ├── HeroSection.tsx         # Server Component
│       ├── ImpactStats.tsx         # Server Component
│       └── ProgrammeHighlights.tsx # Server Component
└── messages/
    ├── en.json                     # ADD: homepage, about, contact namespaces
    ├── ms.json                     # ADD: same namespaces in Bahasa Malaysia
    └── ta.json                     # ADD: same namespaces in Tamil
```

### Pattern 1: Server Component Page with CMS Data

**What:** Async Server Component fetches Sanity data at render time; ISR handles staleness.
**When to use:** All CMS-driven sections (hero image, impact stats, programme highlights, contact page metadata).

```typescript
// Source: https://nextjs.org/docs/app/guides/forms
// src/app/[locale]/page.tsx
import { getSiteSettings, getProgrammeHighlights } from '@/lib/sanity/queries';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const [siteSettings, programmes] = await Promise.all([
    getSiteSettings(),
    getProgrammeHighlights(),
  ]);
  const t = await getTranslations('home');

  return (
    <main>
      <HeroSection siteSettings={siteSettings} t={t} />
      <ImpactStats siteSettings={siteSettings} />
      <ProgrammeHighlights programmes={programmes} />
    </main>
  );
}
```

### Pattern 2: Contact Form with useActionState

**What:** Client Component wraps the form; Server Action in a separate `actions.ts` file handles validation and Resend delivery.
**When to use:** Contact Us form (CONT-01, CONT-02).

```typescript
// Source: https://nextjs.org/docs/app/guides/forms
// src/app/[locale]/contact/actions.ts
'use server'
import { z } from 'zod';
import { Resend } from 'resend';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export type ContactFormState = {
  success: boolean;
  errors?: { name?: string[]; email?: string[]; subject?: string[]; message?: string[] };
};

export async function sendContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'Seputeh HYO <noreply@yourdomain.com>',
    to: [process.env.ORG_EMAIL!],
    subject: `Contact: ${parsed.data.subject}`,
    html: `<p>From: ${parsed.data.name} (${parsed.data.email})</p><p>${parsed.data.message}</p>`,
  });
  if (error) return { success: false };
  return { success: true };
}
```

```typescript
// src/app/[locale]/contact/ContactForm.tsx
'use client'
import { useActionState } from 'react';
import { sendContactForm, type ContactFormState } from './actions';

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactForm, initialState);

  if (state.success) {
    return <p>Thank you, we'll be in touch.</p>;
  }

  return (
    <form action={formAction}>
      {/* fields with state.errors?.fieldName inline */}
      <button disabled={pending} type="submit">Send</button>
    </form>
  );
}
```

### Pattern 3: Sanity Image with urlFor

**What:** Build Sanity CDN URL then pass to `next/image`.
**When to use:** Hero background image, programme card photos.

```typescript
// Source: https://www.sanity.io/docs/presenting-images
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

const builder = imageUrlBuilder(client);
export function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

// Usage:
<Image
  src={urlFor(siteSettings.heroImage).width(1920).quality(80).url()}
  alt="Hero"
  fill
  className="object-cover"
  priority
/>
```

### Pattern 4: next-intl in Server Components vs Server Actions

**What:** `getTranslations()` (async, from `next-intl/server`) is used in Server Components and Server Actions. `useTranslations()` (sync hook) is used in Client Components.
**When to use:** Use `getTranslations` everywhere server-side; use `useTranslations` in `'use client'` components.

```typescript
// Server Component or Server Action
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('about');

// Client Component
import { useTranslations } from 'next-intl';
const t = useTranslations('contact');
```

### Pattern 5: Extending SITE_SETTINGS_QUERY

**What:** Add new fields to the GROQ projection and TypeScript type in one place.
**When to use:** Adding `heroImage`, `memberCount`, `programmesDelivered` for Phase 3.

```typescript
// src/lib/sanity/queries.ts — updated
export type SiteSettings = {
  _id: string;
  contactEmail?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  heroImage?: { asset: { _ref: string } };
  memberCount?: number;
  programmesDelivered?: number;
};

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{
    _id, contactEmail, whatsappNumber, facebookUrl, instagramUrl,
    heroImage, memberCount, programmesDelivered
  }`
);
```

### Anti-Patterns to Avoid

- **Using `useTranslations` in a Server Component:** It is a hook and only works in Client Components. Use `getTranslations` (async) instead.
- **Using `next/link` instead of `@/i18n/navigation` Link:** Will not prepend locale prefix, breaking `/ms/` and `/ta/` routes. This is an established project decision from Phase 2.
- **Hardcoding `contactEmail` or `whatsappNumber` in page markup:** Must always read from `siteSettings`; these live in Sanity.
- **Instantiating Resend outside the Server Action:** `new Resend(...)` must be inside the server-side function call so RESEND_API_KEY is not exposed to the client bundle.
- **Missing `'use server'` at top of actions.ts:** The entire file must start with `'use server'` when all exports are server actions.
- **`cache: 'no-store'` without explicit opt-in:** Next.js 15 changed the default from `force-cache` to `no-store`. The project already handles this correctly in `sanityFetch()` — do not bypass it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP client, nodemailer | Resend v4 `resend.emails.send()` | Already installed; handles retries, SPF/DKIM, delivery tracking |
| Form validation | Manual regex checks | Zod `schema.safeParse()` | Type-safe, composable, returns structured `fieldErrors` matching `useActionState` state shape |
| Responsive images from Sanity | Manual CDN URL construction | `@sanity/image-url` `urlFor()` builder | Already installed; handles hotspot cropping, format negotiation, width/quality params |
| Locale-aware links | Manual `/${locale}/path` string concat | `Link` from `@/i18n/navigation` | Locale-stacking bug prevention (established Phase 2 decision) |
| Loading/disabled state tracking | `useState` + manual flag | `useActionState` `pending` third return value | Single source of truth; works with progressive enhancement |

**Key insight:** The full server-side stack (Sanity fetch, Resend send, Zod validate, next-intl translate) is already wired. Phase 3 composes these pieces into pages rather than building new infrastructure.

---

## Common Pitfalls

### Pitfall 1: siteSettings Schema/Query Mismatch

**What goes wrong:** `siteSettings.heroImage` returns `undefined` in the page even after adding it to Sanity Studio, because the GROQ query projection does not include the new field.
**Why it happens:** The existing `SITE_SETTINGS_QUERY` only selects `{ _id, contactEmail, whatsappNumber, facebookUrl, instagramUrl }`. New schema fields are invisible unless explicitly added to the projection.
**How to avoid:** Extend the GROQ query and TypeScript type in `src/lib/sanity/queries.ts` as the first task of the phase, before building any page that needs the new fields.
**Warning signs:** TypeScript shows `Property 'heroImage' does not exist on type 'SiteSettings'`.

### Pitfall 2: Schema Test Count Assertion Fails

**What goes wrong:** `tests/sanity/schemas.test.ts` asserts `schemaTypes` has length 4. If a new schema file is added, or the siteSettings schema changes field count, existing tests fail.
**Why it happens:** `it('exports an array of 4 schemas', ...)` is a hard count assertion.
**How to avoid:** No new schema documents are added in Phase 3 (only fields added to existing `siteSettings`). Update `siteSettings` field assertions in the test file to cover the new fields (`heroImage`, `memberCount`, `programmesDelivered`).
**Warning signs:** `vitest` run fails with "expected 4 to be 5" or similar.

### Pitfall 3: Resend `from` Domain Mismatch

**What goes wrong:** Resend rejects the send call or delivers to spam because the `from` address domain is not verified.
**Why it happens:** Resend requires DNS records (SPF, DKIM) on the sending domain. The account was deferred to Phase 3 (per STATE.md) and domain verification takes 24-48h.
**How to avoid:** Use `onboarding@resend.dev` as the `from` address during development and testing (Resend's own verified domain). Switch to the org's verified domain before production launch.
**Warning signs:** `error.message` from `resend.emails.send()` contains "domain not verified" or similar.

### Pitfall 4: Contact Form Server Action Missing `prevState` Parameter

**What goes wrong:** `useActionState` passes `prevState` as the first argument to the server action. If the action is defined as `(formData: FormData)` instead of `(prevState: State, formData: FormData)`, Zod validation will fail silently because `formData` receives the state object, not the FormData.
**Why it happens:** The `useActionState` hook changes the action signature — this is a Next.js 15 / React 19 breaking change from `useFormState`.
**How to avoid:** Always define contact form actions as `async function sendContactForm(prevState: ContactFormState, formData: FormData)`.
**Warning signs:** `formData.get('name')` returns `null`; Zod parse fails on all fields.

### Pitfall 5: Hero Image Missing from `next.config.ts` remotePatterns

**What goes wrong:** Next.js `<Image>` throws `Invalid src prop` because `cdn.sanity.io` is not in the allowed `remotePatterns`.
**Why it happens:** Next.js Image component requires explicit domain allowlisting for external images.
**How to avoid:** Add Sanity CDN to `next.config.ts` remotePatterns before implementing the hero image.

```typescript
// next.config.ts addition
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' },
  ],
},
```

**Warning signs:** Build error or runtime error: "hostname 'cdn.sanity.io' is not configured under images.remotePatterns".

### Pitfall 6: Programme Highlight Cards Link to Non-Existent Routes

**What goes wrong:** Programme card links to `/[locale]/programmes/[slug]` produce 404s in Phase 3 because Phase 4 hasn't built those pages yet.
**Why it happens:** User confirmed this is intentional (cards link forward to Phase 4 slug pages). The 404 page from Phase 2 will render.
**How to avoid:** This is by design. No action needed. Document in code comments that Phase 4 resolves these 404s.
**Warning signs:** None — expected behaviour until Phase 4 is deployed.

---

## Code Examples

Verified patterns from official sources:

### Resend v4 — Send Email

```typescript
// Source: https://resend.com/docs/send-with-nodejs
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Seputeh HYO <noreply@yourdomain.com>',
  to: ['contact@seputehhyo.org'],
  subject: 'New contact form submission',
  html: '<p>Message body here</p>',
});

if (error) {
  // Handle delivery failure — return error state to client
  return { success: false };
}
// data.id is the Resend message ID
```

### useActionState — Next.js 15 / React 19

```typescript
// Source: https://nextjs.org/docs/app/guides/forms
'use client'
import { useActionState } from 'react';

const [state, formAction, pending] = useActionState(serverAction, initialState);

// In the form:
// <form action={formAction}>
// <button disabled={pending}>Send</button>
```

### Sanity Image URL

```typescript
// Source: https://www.sanity.io/docs/presenting-images
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

const builder = imageUrlBuilder(client);
function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

// Build URL: urlFor(image).width(1920).quality(75).url()
```

### next-intl Server Component vs Client Component

```typescript
// Source: https://next-intl.dev/docs/environments/server-client-components

// Server Component (async):
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('home');
t('heroHeadline') // → "Be Part of The Change"

// Client Component (sync hook):
import { useTranslations } from 'next-intl';
const t = useTranslations('contact');
t('formName') // → "Name"
```

### WhatsApp Deep Link

```typescript
// Standard wa.me format with pre-filled message
const waNumber = siteSettings?.whatsappNumber?.replace(/\D/g, '');
const waMessage = encodeURIComponent('Hi Seputeh HYO, I would like to enquire...');
const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;
```

### Years Active Calculation

```typescript
// No CMS needed — always current
const yearsActive = new Date().getFullYear() - 2002;
// 2026 → 24 years
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` + `useFormStatus` | `useActionState` (React 19) | React 19 / Next.js 15 | Single hook replaces two; `pending` is third return value |
| `cache: 'force-cache'` as default | `cache: 'no-store'` as default | Next.js 15 | Must explicitly set `force-cache` in `sanityFetch()` — already done in this project |
| `useFormStatus` from `react-dom` | Still usable but `useActionState` preferred | Next.js 15 docs | Use `useActionState` for new forms |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: Replaced by `useActionState` from `react` in React 19. Do not import from `react-dom`.

---

## Open Questions

1. **Resend `from` domain**
   - What we know: Resend account exists (INFRA-05 is checked), RESEND_API_KEY was deferred to Phase 3
   - What's unclear: Whether the org's domain (e.g. `seputehhyo.org`) has completed DNS verification in Resend yet
   - Recommendation: Use `onboarding@resend.dev` as `from` during development. Add an env var `ORG_EMAIL` for the recipient and `RESEND_FROM` for the verified sender domain. Document the domain verification step in the plan.

2. **About Us and Contact Us translated copy**
   - What we know: BM and Tamil translations are human-translated (no machine translation)
   - What's unclear: Whether the translated strings are available now or are TBD (placeholder)
   - Recommendation: Use EN copy as placeholder in BM/Tamil message files with a `// TODO: human translate` comment. Plan should include a task for the human translation handoff.

3. **Hero image availability**
   - What we know: User confirmed org photography is available to be provided
   - What's unclear: Whether an image asset will be uploaded to Sanity before Phase 3 is built
   - Recommendation: Implement hero with a graceful fallback — if `siteSettings.heroImage` is null, show a brand-green solid background with text overlaid. This lets the page render correctly before the image is uploaded.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^2.1.9 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --reporter=verbose` |

Note: `vitest.config.ts` sets `environment: 'node'` and `include: ['tests/**/*.test.ts']`. All Phase 3 tests must be `.ts` files in the `tests/` directory following the node-only pattern (no DOM, no React import resolution — use `fs.readFileSync`/`existsSync` for file-based assertions, consistent with Phase 2 approach).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero section renders at `src/app/[locale]/page.tsx` | structural | `npx vitest run tests/pages/homepage.test.ts` | Wave 0 |
| HOME-02 | Impact stats: years active calculated from 2002, memberCount/programmesDelivered in siteSettings | unit | `npx vitest run tests/pages/homepage.test.ts` | Wave 0 |
| HOME-03 | Programme highlights section exists in page file | structural | `npx vitest run tests/pages/homepage.test.ts` | Wave 0 |
| HOME-04 | CTA button exists with link to membership | structural | `npx vitest run tests/pages/homepage.test.ts` | Wave 0 |
| HOME-05 | Social links in footer (already in Phase 2) | structural | `npx vitest run tests/ui/layout.test.ts` | Exists |
| ABOUT-01–04 | About Us page file exists; EN message keys present | structural | `npx vitest run tests/pages/about.test.ts` | Wave 0 |
| CONT-01 | Contact form component exists | structural | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| CONT-02 | Server Action file exists with sendContactForm export | structural | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| CONT-02 | Zod schema validates all 4 required fields | unit | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| CONT-03 | WhatsApp href format correct | unit | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| CONT-04–05 | Contact page file exists | structural | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| CONT-06 | Map embed present in contact page file | structural | `npx vitest run tests/pages/contact.test.ts` | Wave 0 |
| siteSettings schema | heroImage, memberCount, programmesDelivered fields present | unit | `npx vitest run tests/sanity/schemas.test.ts` | Exists (extend) |
| i18n messages | home, about, contact namespaces present in all 3 locales | unit | `npx vitest run tests/ui/i18n-messages.test.ts` | Exists (extend) |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/pages/homepage.test.ts` — structural checks for HOME-01 through HOME-04; years-active calculation unit test
- [ ] `tests/pages/about.test.ts` — structural: about page file exists; EN message keys for ABOUT-01 through ABOUT-04 present
- [ ] `tests/pages/contact.test.ts` — structural: contact page + ContactForm + actions.ts exist; Zod validation unit tests; WhatsApp href format
- [ ] Extend `tests/sanity/schemas.test.ts` — add assertions for `heroImage`, `memberCount`, `programmesDelivered` in `siteSettings` schema
- [ ] Extend `tests/ui/i18n-messages.test.ts` — add assertions for `home`, `about`, `contact` namespaces in all 3 locale JSON files

---

## Sources

### Primary (HIGH confidence)
- `src/lib/sanity/queries.ts` — existing queries, types, fetch patterns
- `src/sanity/schemas/siteSettings.ts` — current siteSettings schema (fields to extend)
- `src/sanity/schemas/programme.ts` — programme schema and localizedString helper
- `src/app/[locale]/layout.tsx` — locale layout wrapping pattern (Header/Footer auto-applied)
- `src/components/layout/Footer.tsx` — social links rendering pattern reusable in Contact page
- `src/app/globals.css` — brand token names (`brand-green`, `brand-saffron`, `brand-charcoal`)
- `vitest.config.ts` — test environment: node, include: tests/**/*.test.ts
- [Next.js 15 Forms Guide](https://nextjs.org/docs/app/guides/forms) — `useActionState` pattern, Server Action signature
- [Resend Node.js Docs](https://resend.com/docs/send-with-nodejs) — `resend.emails.send()` API

### Secondary (MEDIUM confidence)
- [next-intl Server Actions docs](https://next-intl.dev/docs/environments/actions-metadata-route-handlers) — `getTranslations` usage in Server Actions
- [Sanity Presenting Images docs](https://www.sanity.io/docs/apis-and-sdks/presenting-images) — `@sanity/image-url` urlFor pattern

### Tertiary (LOW confidence)
- None — all critical claims are verified against project source code or official docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; versions verified from package.json
- Architecture: HIGH — patterns derived from existing project code (queries.ts, layout.tsx, Footer.tsx) and official docs
- Pitfalls: HIGH — schema query mismatch and Server Action signature pitfalls verified against Next.js 15 official docs; Resend domain pitfall from official Resend docs
- Test patterns: HIGH — vitest config and existing test files read directly from project

**Research date:** 2026-03-14
**Valid until:** 2026-05-14 (stable libraries; next-intl and Next.js minor versions move faster — recheck if >30 days)
