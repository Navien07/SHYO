# Phase 05: Membership & Polish — Research

**Researched:** 2026-04-02
**Domain:** Next.js 15 App Router — form actions, SEO metadata, sitemap, i18n, PDPA compliance
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Membership Form:**
- Route: `/[locale]/membership`
- Fields in order: full name, DOB (DD/MM/YYYY), gender (select), mobile, email, area/location, interests (multi-select checkboxes, at least one required), PDPA consent (checkbox, required)
- Interests options: Leadership Development, Cultural Activities, Community Service, Social Awareness, Health & Well-being
- Pattern: useActionState + Zod — same as `src/app/[locale]/contact/actions.ts`; NO React Hook Form
- PDPA checkbox: blocked client-side and server-side (`z.literal(true)` or `.refine()`)
- Dual email via Resend: applicant confirmation + org notification, both in same server action
- Resend instantiated inside server action body (not at module level)
- Success UX: modal overlay with close button, key remount to clear form (copy contact form pattern)
- Field-level errors with `aria-describedby`; global send error banner if Resend fails

**SEO Metadata:**
- `generateMetadata()` on every page: home, about, contact, team, programmes listing, programme detail, documents, membership, privacy, admin-guide
- Pattern: `async function generateMetadata({ params }) { const t = await getTranslations({ locale, namespace: 'meta' }); return { title: t('homeTitle'), description: t('homeDescription') }; }`
- Add `meta` namespace to all three message files with `title` and `description` keys per page
- OG tags on every page: og:title, og:description, og:url, og:image, og:type=website
- og:image: use `/logo.svg` (already at `public/logo.svg`)
- sitemap via `src/app/sitemap.ts` — all locale-prefixed URLs + dynamic programme slugs from Sanity
- robots.txt via `src/app/robots.ts` — allow all, include Sitemap directive

**Privacy Policy:**
- Route: `/[locale]/privacy`
- Static hardcoded (not CMS)
- Must reference PDPA 2010
- Required sections: (1) what data collected, (2) why collected, (3) how stored (email only, no DB), (4) rights under PDPA 2010, (5) contact for data requests
- Available in all three locales
- Footer link must use `Link` from `@/i18n/navigation` (locale-aware)

**Admin Handover Guide:**
- Route: `/[locale]/admin-guide`
- EN only, static, no auth, not in nav/footer
- Six sections: Sanity login, add team member, add programme, upload document, update site settings, ISR explanation
- Claude's discretion: whether to exclude via noindex or omit from sitemap

### Claude's Discretion
- Membership form visual layout (single column mobile, 2-col desktop for some fields)
- Checkbox group styling for interests (grid layout, label positioning)
- DOB format validation (regex DD/MM/YYYY or flexible)
- Mobile number validation (Malaysian format or generic)
- OG image dimensions and referencing the logo file
- Privacy Policy page typography and section structure
- Admin guide page visual layout
- Which shadcn/ui components to use (Input, Label, Checkbox from shadcn)
- Skeleton/loading states on membership form
- Whether admin-guide uses `noindex` robots meta or is omitted from sitemap entirely

### Deferred Ideas (OUT OF SCOPE)
- OG banner image (1200x630) — logo is used for now
- Membership submission stored in Sanity — email-only in v1
- Member portal / application status tracking — v2 (PORT-01, PORT-02)
- Admin guide localised to BM/Tamil — EN only for v1
- Membership form as Sanity-managed page — static in v1
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MEMB-01 | Membership application form with fields: full name, DOB, gender, mobile, email, area/location, interests | Established pattern from contact form; FormData.getAll() for multi-checkbox |
| MEMB-02 | PDPA consent checkbox required before form submission | Zod z.literal(true) server-side; disabled submit button client-side |
| MEMB-03 | Form validated client-side (React Hook Form + Zod) and server-side (Server Action) | NOTE: CONTEXT.md locks pattern to useActionState+Zod, NOT React Hook Form |
| MEMB-04 | Automated confirmation email sent to applicant on successful submission (via Resend) | Dual resend.emails.send() calls in same server action — already proven in codebase |
| MEMB-05 | Submission forwarded to org's official email address | Second resend.emails.send() to ORG_EMAIL — same env var as contact form |
| MEMB-06 | Form available in all three locales with translated labels and error messages | `membership` namespace added to messages/en.json, ms.json, ta.json |
| SEO-01 | Unique title and meta description per page in active locale | generateMetadata() + getTranslations server-side; `meta` namespace in message files |
| SEO-02 | Open Graph tags for social sharing on all pages | metadata.openGraph object in generateMetadata return; /logo.svg for og:image |
| SEO-03 | sitemap.xml and robots.txt generated | src/app/sitemap.ts + src/app/robots.ts — Next.js built-in conventions |
| SEO-04 | Privacy Policy page covering PDPA 2010 compliance | Static page at /[locale]/privacy; hardcoded PDPA 2010 sections in all 3 locales |
| SEO-05 | HTTPS enforced (Vercel provides SSL by default) | Verification only — no code change needed; Vercel auto-SSL |
</phase_requirements>

---

## Summary

Phase 5 is the final polish phase. All implementation patterns are already established in the codebase — the membership form is a direct extension of the contact form (`src/app/[locale]/contact/`), and SEO metadata follows Next.js 15 App Router conventions. The research confirms no new dependencies are needed; the entire phase builds on existing stack.

The key technical differences from the contact form are: (1) `FormData.getAll('interests')` for multi-checkbox collection, (2) Zod `.literal(true)` for the PDPA boolean, (3) two sequential `resend.emails.send()` calls in one server action, and (4) `generateMetadata` with `getTranslations` in server context for locale-aware metadata. The sitemap needs to fetch programme slugs from Sanity at build time using the already-existing `getAllProgrammes()` helper.

The `meta` namespace must be added to all three message files before any page can use `generateMetadata`. The en.json file currently has a duplicate `documents` key (lines 57-67 and 104-114) — this should be deduplicated in the Wave 0 pass.

**Primary recommendation:** Copy the contact form module wholesale for the membership form, then layer in multi-checkbox and PDPA additions. Use Next.js App Router built-in `sitemap.ts`/`robots.ts` file conventions — no third-party library needed.

---

## Standard Stack

### Core (all already installed — no new npm installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | ^15.5.12 | App Router, generateMetadata, sitemap.ts, robots.ts | Already installed |
| next-intl | ^4.8.3 | getTranslations in generateMetadata (server-side) | Already installed |
| zod | 4.3.6 (transitive) | Server-side validation incl. z.literal(true) for PDPA | Already used in contact form |
| resend | ^4.8.0 | Dual-email send from server action | Already installed |
| react | ^19.2.4 | useActionState for form state | Already installed |

### No New Dependencies
All required capabilities are available in the current `package.json`. Zod is available as a transitive dependency (confirmed: `node -e "require.resolve('zod')"` returns version 4.3.6). If Zod is ever removed from the dependency tree, add it explicitly: `npm install zod`.

**Installation:** None needed.

---

## Architecture Patterns

### Pattern 1: generateMetadata with next-intl (server-side translation)

`getTranslations` works in server context inside `generateMetadata`. The locale must be extracted from `params` first (which is a Promise in Next.js 15).

```typescript
// Source: established next-intl v4 pattern, confirmed by existing codebase usage
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Seputeh HYO',
      images: [{ url: `${baseUrl}/logo.svg`, width: 512, height: 512, alt: 'Seputeh HYO' }],
      type: 'website',
      locale,
    },
  };
}
```

**Critical detail:** `params` is a `Promise<{ locale: string }>` in Next.js 15 App Router — must `await params` before accessing `locale`. All existing pages in this codebase already do this correctly (see `src/app/[locale]/page.tsx`).

### Pattern 2: FormData.getAll() for multi-checkbox interests

HTML checkboxes with the same `name` attribute submit multiple values. `formData.get('interests')` only returns the first value. Use `formData.getAll('interests')` to get all selected values as a `string[]`.

```typescript
// Source: MDN FormData.getAll() specification + established pattern
const raw = {
  // ... other fields
  interests: formData.getAll('interests') as string[], // returns string[]
  pdpaConsent: formData.get('pdpaConsent') === 'true' || formData.get('pdpaConsent') === 'on',
};
```

**Zod schema for multi-checkbox:**
```typescript
// Source: Zod docs — array validation
const membershipSchema = z.object({
  fullName: z.string().min(1, 'required'),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'dobFormat'),
  gender: z.enum(['male', 'female', 'prefer_not_to_say']),
  mobile: z.string().min(1, 'required'),
  email: z.string().email(),
  location: z.string().min(1, 'required'),
  interests: z.array(z.string()).min(1, 'interestsMin'),
  pdpaConsent: z.literal(true, { errorMap: () => ({ message: 'pdpaRequired' }) }),
});
```

**PDPA checkbox HTML value:** Browser submits `'on'` for a checked checkbox, nothing for unchecked. The server action receives `formData.get('pdpaConsent')` as `'on'` | `null`. Convert before Zod: `pdpaConsent: formData.get('pdpaConsent') === 'on'`. Zod then validates `true` via `z.literal(true)`.

### Pattern 3: Dual Resend sends in one server action

```typescript
// Source: Pattern derived from existing contact/actions.ts + Resend docs
const resend = new Resend(process.env.RESEND_API_KEY);

// Send 1: Applicant confirmation
const { error: confirmError } = await resend.emails.send({
  from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
  to: [parsed.data.email],
  subject: 'Your Seputeh HYO membership application has been received',
  html: `<p>Dear ${parsed.data.fullName}, ...</p>`,
});

// Send 2: Org notification (send regardless of whether confirmation succeeded)
const { error: notifyError } = await resend.emails.send({
  from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
  to: [process.env.ORG_EMAIL!],
  subject: 'New Membership Application',
  html: `<p>...</p>`,
});

if (confirmError || notifyError) {
  return { success: false, sendError: true, ... };
}
return { success: true };
```

**Decision:** Send both emails, then check both errors. If either fails, return `sendError: true` with the form values preserved (so user can retry).

### Pattern 4: Next.js sitemap.ts with dynamic Sanity slugs

```typescript
// Source: Next.js 15 App Router docs — MetadataRoute.Sitemap
// File location: src/app/sitemap.ts (NOT under [locale])
import type { MetadataRoute } from 'next';
import { getAllProgrammes } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';
const LOCALES = ['en', 'ms', 'ta'] as const;

const STATIC_PATHS = ['', '/about', '/contact', '/team', '/programmes', '/documents', '/membership', '/privacy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programmes = await getAllProgrammes();

  const staticEntries = STATIC_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }))
  );

  const programmeEntries = LOCALES.flatMap((locale) =>
    programmes
      .filter((p) => p.slug?.current)
      .map((p) => ({
        url: `${BASE_URL}/${locale}/programmes/${p.slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
  );

  return [...staticEntries, ...programmeEntries];
}
```

**Admin-guide discretion:** Omit from sitemap entirely (cleanest approach). Add `<meta name="robots" content="noindex">` via `generateMetadata` on that page instead.

### Pattern 5: robots.ts

```typescript
// Source: Next.js 15 App Router docs — MetadataRoute.Robots
// File location: src/app/robots.ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seputehhyo.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Pattern 6: PDPA client-side button disable

```tsx
// Client-side prevention: disable submit button when PDPA unchecked
const [pdpaChecked, setPdpaChecked] = useState(false);

<input
  type="checkbox"
  id="pdpaConsent"
  name="pdpaConsent"
  checked={pdpaChecked}
  onChange={(e) => setPdpaChecked(e.target.checked)}
  aria-describedby={state.errors?.pdpaConsent ? 'pdpa-error' : undefined}
/>
<Button type="submit" disabled={pending || !pdpaChecked}>
  {pending ? '...' : t('formSubmit')}
</Button>
```

### Recommended File Structure (new files for Phase 5)

```
src/app/
├── sitemap.ts                           # SEO-03: dynamic sitemap
├── robots.ts                            # SEO-03: robots.txt
└── [locale]/
    ├── membership/
    │   ├── page.tsx                     # MEMB-01, MEMB-06
    │   ├── MembershipForm.tsx           # MEMB-01, MEMB-02, MEMB-03
    │   └── actions.ts                   # MEMB-03, MEMB-04, MEMB-05
    ├── privacy/
    │   └── page.tsx                     # SEO-04
    └── admin-guide/
        └── page.tsx                     # admin handover
messages/
├── en.json                              # + membership, privacy, meta namespaces
├── ms.json                              # + membership, privacy, meta namespaces
└── ta.json                              # + membership, privacy, meta namespaces
tests/
└── pages/
    ├── membership.test.ts               # MEMB-01 through MEMB-06
    └── seo.test.ts                      # SEO-01 through SEO-04
```

**generateMetadata added to ALL existing page files:**
- `src/app/[locale]/page.tsx` — home
- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/team/page.tsx`
- `src/app/[locale]/programmes/page.tsx`
- `src/app/[locale]/programmes/[slug]/page.tsx`
- `src/app/[locale]/documents/page.tsx`

### Anti-Patterns to Avoid

- **Module-level Resend instantiation:** `const resend = new Resend(...)` at module scope leaks the API key to client bundles. Always instantiate inside the server action body — already enforced in this codebase (see `contact/actions.ts` line 69).
- **`formData.get('interests')`:** Returns only the first selected interest. Must use `formData.getAll('interests')`.
- **`useTranslations` in generateMetadata:** `useTranslations` is a client hook and cannot be used in `generateMetadata`. Use `getTranslations` from `next-intl/server` with explicit `{ locale, namespace }` options.
- **`next/link` in footer for Privacy Policy:** The existing footer uses `Link` from `@/i18n/navigation`. The Privacy Policy link was already added in Phase 2. Verify it uses `@/i18n/navigation` — not `next/link` — or locale prefix will be missing.
- **params without await in Next.js 15:** `params` is always a Promise in Next.js 15. Never destructure without `await params` first.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sitemap.xml generation | Custom XML string builder | `src/app/sitemap.ts` returning `MetadataRoute.Sitemap` | Next.js built-in handles XML serialisation, caching, content-type header |
| robots.txt generation | Static file in /public | `src/app/robots.ts` returning `MetadataRoute.Robots` | Built-in handles format, served at correct path |
| OG metadata | Custom `<head>` tags | `generateMetadata()` return value | Next.js deduplicates, handles canonical, og: prefix, Twitter cards |
| Email templating | HTML string concatenation | Template literals with sanitised values | Sufficient for this volume; no email template library needed |
| Checkbox controlled state for interests | Complex state management | `useState` array (already in FormFields pattern) | Keep consistent with contact form pattern |

**Key insight:** Next.js 15 App Router handles all metadata, sitemap, and robots concerns natively — no `next-sitemap`, `react-helmet`, or `next-seo` packages needed.

---

## Common Pitfalls

### Pitfall 1: en.json Duplicate `documents` Key
**What goes wrong:** `messages/en.json` currently has `documents` defined at lines 57-67 AND again at lines 104-114. JSON parsers take the last definition — the first block is silently ignored. The test at `tests/ui/i18n-messages.test.ts` passes only because the second definition has all required keys. Adding new keys in Wave 0 must touch the SECOND `documents` block (lines 104-114). Better: deduplicate in Wave 0.
**How to avoid:** Wave 0 task must deduplicate both `documents` blocks into one, retaining the fuller key set.

### Pitfall 2: getTranslations locale parameter in generateMetadata
**What goes wrong:** Calling `getTranslations('meta')` (no locale) inside `generateMetadata` may resolve to the default locale (EN) for all pages, breaking locale-specific metadata.
**How to avoid:** Always pass `{ locale, namespace: 'meta' }` explicitly. Locale comes from `await params`.

### Pitfall 3: PDPA Checkbox — browser sends 'on' not 'true'
**What goes wrong:** `z.literal(true)` will fail validation because `formData.get('pdpaConsent')` returns the string `'on'` (when checked) or `null` (when unchecked), never a boolean `true`.
**How to avoid:** Convert before Zod: `pdpaConsent: formData.get('pdpaConsent') === 'on'`. Zod then receives a boolean `true`/`false`.

### Pitfall 4: interests Zod error key normalisation
**What goes wrong:** `z.array(z.string()).min(1, 'interestsMin')` produces a ZodIssue at path `['interests']`. The `flatten().fieldErrors.interests` array contains the raw message string `'interestsMin'` — but if you use a custom `errorMap` or forget to call `.flatten()`, errors can be misrouted.
**How to avoid:** Follow the same `flatten().fieldErrors` pattern as `contact/actions.ts`. Add `'interestsMin'` and `'pdpaRequired'` to `translateError()` in `MembershipForm.tsx`.

### Pitfall 5: sitemap.ts calling getAllProgrammes() — missing Sanity env vars at build time
**What goes wrong:** If `NEXT_PUBLIC_SANITY_PROJECT_ID` or `SANITY_API_TOKEN` are not set in the Vercel build environment, `getAllProgrammes()` throws and the build fails.
**How to avoid:** Wrap `getAllProgrammes()` in `try/catch` inside `sitemap()`, falling back to an empty array. Static entries still generate correctly.

### Pitfall 6: og:image SVG files
**What goes wrong:** Some social crawlers (Twitter/X) do not render SVG og:images and show no preview. Facebook's crawler is more tolerant but may still fail.
**How to avoid:** Per CONTEXT.md, this is a known limitation — the user accepted logo for now; banner swap is deferred. Document this as a known issue in admin guide.

### Pitfall 7: Privacy Policy footer link locale
**What goes wrong:** The footer was built in Phase 2 using `Link` from `@/i18n/navigation`. If the footer link to Privacy Policy uses `href="/privacy"` with `next/link` instead of the i18n-aware Link, it will not auto-prefix `/ms/` or `/ta/`.
**How to avoid:** Verify `src/components/layout/Footer.tsx` uses `Link` from `@/i18n/navigation` for the privacy link. The CONTEXT.md from Phase 5 explicitly flags this.

---

## Code Examples

### Full MembershipFormState type (actions.ts)

```typescript
// Derived from ContactFormState pattern — src/app/[locale]/contact/actions.ts
export type MembershipFormState = {
  success: boolean;
  sendError?: boolean;
  sendErrorDetail?: string;
  errors?: {
    fullName?: string[];
    dob?: string[];
    gender?: string[];
    mobile?: string[];
    email?: string[];
    location?: string[];
    interests?: string[];
    pdpaConsent?: string[];
  };
  values?: {
    fullName: string;
    dob: string;
    gender: string;
    mobile: string;
    email: string;
    location: string;
    interests: string[];
  };
};
```

### i18n message keys needed — `membership` namespace (EN)

```json
{
  "membership": {
    "title": "Be Part of Us",
    "fullNameLabel": "Full Name",
    "fullNamePlaceholder": "e.g. Priya Rajendran",
    "dobLabel": "Date of Birth (DD/MM/YYYY)",
    "dobPlaceholder": "e.g. 15/08/1999",
    "genderLabel": "Gender",
    "genderMale": "Male",
    "genderFemale": "Female",
    "genderPreferNot": "Prefer not to say",
    "mobileLabel": "Mobile Number",
    "mobilePlaceholder": "e.g. 0123456789",
    "emailLabel": "Email Address",
    "emailPlaceholder": "you@example.com",
    "locationLabel": "Area / Location",
    "locationPlaceholder": "e.g. Taman Seputeh, KL",
    "interestsLabel": "Interests (select at least one)",
    "interestLeadership": "Leadership Development",
    "interestCultural": "Cultural Activities",
    "interestCommunity": "Community Service",
    "interestSocial": "Social Awareness",
    "interestHealth": "Health & Well-being",
    "pdpaLabel": "I have read and agree to the Privacy Policy and consent to my data being processed for membership purposes.",
    "formSubmit": "Submit Application",
    "successTitle": "Application Submitted!",
    "successMessage": "Thank you for applying. We'll be in touch soon.",
    "successClose": "Close",
    "sendError": "Sorry, we couldn't submit your application. Please try again.",
    "errorRequired": "This field is required.",
    "errorEmail": "Please enter a valid email address.",
    "errorDobFormat": "Please use DD/MM/YYYY format.",
    "errorInterestsMin": "Please select at least one interest.",
    "errorPdpaRequired": "You must agree to the Privacy Policy before submitting."
  }
}
```

### i18n message keys needed — `meta` namespace (EN)

```json
{
  "meta": {
    "homeTitle": "Seputeh HYO — Empowering Youth in Seputeh",
    "homeDescription": "Seputeh Hua Youth Organisation — leadership, culture, and community service since 2002.",
    "aboutTitle": "About Us — Seputeh HYO",
    "aboutDescription": "Learn about Seputeh HYO's mission, vision, and five focus areas since 16 September 2002.",
    "contactTitle": "Contact Us — Seputeh HYO",
    "contactDescription": "Get in touch with Seputeh HYO via form, WhatsApp, or email.",
    "teamTitle": "Our Team — Seputeh HYO",
    "teamDescription": "Meet the committee members leading Seputeh HYO.",
    "programmesTitle": "Our Programmes — Seputeh HYO",
    "programmesDescription": "Explore Seputeh HYO's programmes across leadership, culture, community, and well-being.",
    "documentsTitle": "Documents — Seputeh HYO",
    "documentsDescription": "Download official documents from Seputeh HYO.",
    "membershipTitle": "Join Us — Seputeh HYO",
    "membershipDescription": "Apply to become a member of Seputeh HYO and be part of the community.",
    "privacyTitle": "Privacy Policy — Seputeh HYO",
    "privacyDescription": "How Seputeh HYO collects, uses, and protects your personal data under PDPA 2010.",
    "adminGuideTitle": "Admin Guide — Seputeh HYO",
    "adminGuideDescription": "Quick reference guide for Seputeh HYO content administrators."
  }
}
```

### Privacy Policy PDPA 2010 required sections

Per the Personal Data Protection Act 2010 (Malaysia) — Act 709:

```
Section 1: What data we collect
  — Full name, date of birth, gender, mobile number, email address,
    area/location, programme interests (from membership form only)

Section 2: Why we collect it
  — To process membership applications and communicate about
    Seputeh HYO programmes and activities

Section 3: How it is stored
  — Submitted data is received via email only. Seputeh HYO does not
    operate a database for membership data. Data is held in the
    organisation's official email inbox.

Section 4: Your rights under PDPA 2010
  — Right of access to your personal data
  — Right to correct inaccurate personal data
  — Right to withdraw consent and cease processing
  — Right to inquire about how data is processed

Section 5: Contact for data requests
  — Email: [from siteSettings.contactEmail]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-sitemap` package | `src/app/sitemap.ts` built-in | Next.js 13.3+ | No extra package; runs at build time with full App Router context |
| `react-helmet` / manual `<Head>` | `generateMetadata()` export | Next.js 13+ App Router | Colocated with page, supports async data fetching, auto-deduplication |
| `useRouter().locale` | `params.locale` from segment | Next.js 13+ App Router | Segment params are the authoritative source; no router context needed |

**Deprecated/outdated:**
- `next/head` `<Head>` component: Not used in App Router. All metadata goes through `generateMetadata` or `metadata` export.
- `getServerSideProps`/`getStaticProps`: Not relevant in App Router.
- `pages/sitemap.xml.js`: App Router uses `app/sitemap.ts` with `MetadataRoute.Sitemap` return type.

---

## Open Questions

1. **`NEXT_PUBLIC_SITE_URL` env var**
   - What we know: `sitemap.ts` and `generateMetadata` need the canonical base URL for og:url and sitemap entries. The env.local.example does not include `NEXT_PUBLIC_SITE_URL`.
   - What's unclear: The Vercel deployment URL is not documented in the codebase.
   - Recommendation: Add `NEXT_PUBLIC_SITE_URL=https://seputehhyo.org` (or the actual Vercel URL) to `.env.local.example` and Vercel env vars. Fall back to a hardcoded placeholder string in sitemap.ts and generateMetadata for safety.

2. **`ORG_EMAIL` and `RESEND_FROM` not in `.env.local.example`**
   - What we know: `contact/actions.ts` uses `process.env.ORG_EMAIL` and `process.env.RESEND_FROM`. The example file only has `RESEND_API_KEY`.
   - What's unclear: Whether these are set in Vercel already or were overlooked in docs.
   - Recommendation: Wave 0 task should update `.env.local.example` to document `ORG_EMAIL` and `RESEND_FROM`.

3. **Zod as explicit dependency**
   - What we know: Zod 4.3.6 is available as a transitive dependency. The contact form already imports it without issues.
   - Recommendation: Leave as transitive for now (consistent with Phase 3 decision). If it becomes unavailable after a dependency update, `npm install zod` resolves it.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev, vitest | ✓ | (Windows 11 env) | — |
| Resend API | MEMB-04, MEMB-05 | ✓ (configured Phase 3) | resend ^4.8.0 | Log submissions to console in dev |
| Sanity (getAllProgrammes) | SEO-03 sitemap | ✓ (configured Phase 1) | @sanity/client ^6.29.1 | try/catch fallback to empty array |
| public/logo.svg | SEO-02 og:image | ✓ | (file confirmed at public/logo.svg) | — |
| NEXT_PUBLIC_SITE_URL env var | SEO-02, SEO-03 | Not in .env.local.example | — | Hardcode placeholder 'https://seputehhyo.org' |
| ORG_EMAIL env var | MEMB-05 | Assumed set in Vercel (used by contact form) | — | Warn in dev if undefined |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/pages/membership.test.ts tests/pages/seo.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MEMB-01 | membership/page.tsx, MembershipForm.tsx, actions.ts exist | unit (file existence) | `npx vitest run tests/pages/membership.test.ts` | ❌ Wave 0 |
| MEMB-02 | actions.ts contains z.literal(true) for pdpaConsent | unit (file content) | `npx vitest run tests/pages/membership.test.ts` | ❌ Wave 0 |
| MEMB-03 | actions.ts contains z.object and 'use server' | unit (file content) | `npx vitest run tests/pages/membership.test.ts` | ❌ Wave 0 |
| MEMB-04 | actions.ts sends to applicant email (contains parsed.data.email) | unit (file content) | `npx vitest run tests/pages/membership.test.ts` | ❌ Wave 0 |
| MEMB-05 | actions.ts sends to ORG_EMAIL | unit (file content) | `npx vitest run tests/pages/membership.test.ts` | ❌ Wave 0 |
| MEMB-06 | messages/{en,ms,ta}.json have membership namespace keys | unit (JSON parse) | `npx vitest run tests/ui/i18n-messages.test.ts` | ❌ Wave 0 (extend existing) |
| SEO-01 | Each page.tsx exports generateMetadata | unit (file content) | `npx vitest run tests/pages/seo.test.ts` | ❌ Wave 0 |
| SEO-02 | generateMetadata includes openGraph object in each page | unit (file content) | `npx vitest run tests/pages/seo.test.ts` | ❌ Wave 0 |
| SEO-03 | src/app/sitemap.ts and src/app/robots.ts exist | unit (file existence) | `npx vitest run tests/pages/seo.test.ts` | ❌ Wave 0 |
| SEO-04 | src/app/[locale]/privacy/page.tsx exists + contains PDPA | unit (file content) | `npx vitest run tests/pages/seo.test.ts` | ❌ Wave 0 |
| SEO-05 | HTTPS via Vercel SSL | manual | n/a | manual |

### Sampling Rate

- **Per task commit:** `npx vitest run tests/pages/membership.test.ts tests/pages/seo.test.ts`
- **Per wave merge:** `npx vitest run` (full 307+ test suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/pages/membership.test.ts` — covers MEMB-01 through MEMB-05
- [ ] `tests/pages/seo.test.ts` — covers SEO-01 through SEO-04
- [ ] `tests/ui/i18n-messages.test.ts` — extend REQUIRED arrays with membership, privacy, meta namespace keys
- [ ] Deduplicate `documents` key in `messages/en.json` (line 57-67 is dead — line 104-114 is active)
- [ ] Update `tests/ui/i18n-messages.test.ts` to assert `meta`, `membership`, `privacy` namespaces in all three locales

---

## Project Constraints (from CLAUDE.md)

Directives from `./CLAUDE.md` that the planner must verify compliance with:

- TypeScript strict mode — no `any` in new files
- Conventional commits format (feat/fix/chore/docs)
- No hardcoded secrets — all env vars via `.env.local`
- Never edit on main/master directly (feature branch per phase is project practice)
- Research-first: read existing code before writing — satisfied by this research pass

Directives from `~/.claude/CLAUDE.md` (global):
- Always TypeScript strict mode
- React + TypeScript + Tailwind for UI
- After every major feature: update requirements.txt (N/A — not a Python project), README.md (not required per this CLAUDE.md), and provide git commit title+description
- No hardcoded secrets

---

## Sources

### Primary (HIGH confidence)
- Codebase analysis — `src/app/[locale]/contact/actions.ts`, `ContactForm.tsx`, `page.tsx` (direct read, confirmed patterns)
- Codebase analysis — `messages/en.json`, `ms.json`, `vitest.config.ts`, `package.json` (direct read)
- Codebase analysis — all existing `page.tsx` files confirming `await params` pattern and `getTranslations` usage
- Next.js 15 App Router — `sitemap.ts` and `robots.ts` file conventions (built-in, confirmed by Next.js docs knowledge)
- next-intl v4 — `getTranslations({ locale, namespace })` in server context (confirmed by existing usage in codebase)
- Zod — `z.literal(true)`, `z.array().min(1)` (zod 4.3.6 confirmed available)

### Secondary (MEDIUM confidence)
- MDN FormData.getAll() — multi-checkbox collection pattern
- PDPA 2010 (Act 709) Malaysia — section structure (knowledge cutoff August 2025; act not amended before cutoff)

### Tertiary (LOW confidence — flag for validation)
- og:image SVG rendering in social crawlers — behaviour varies; SVG support not universally confirmed for all crawlers

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions confirmed from package.json
- Architecture: HIGH — patterns copied directly from existing working code in codebase
- Pitfalls: HIGH — several identified directly from reading codebase (duplicate documents key, 'on' vs true PDPA, getAll vs get)
- SEO patterns: HIGH — Next.js built-in conventions, no third-party dependency

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable stack; next-intl and Next.js minor versions move slowly)
