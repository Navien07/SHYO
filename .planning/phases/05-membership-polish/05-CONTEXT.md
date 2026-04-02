---
phase: "05"
phase_name: Membership & Polish
created: "2026-04-02"
status: ready_for_planning
---

# Phase 05: Membership & Polish — Context

Decisions captured from user discussion. Downstream researcher and planner must treat these as locked choices — do not re-ask or override.

---

## Phase Boundary

Membership application form live in all three locales, full SEO metadata on every page, Privacy Policy page, and admin handover guide at `/admin-guide`. This is the final phase — site must be production-ready after this.

---

## Membership Form

### Route
- URL: `/[locale]/membership`
- Nav key `nav.membership` already exists in all three locale message files — no change needed
- Homepage CTA "Be Part of Us" button must link to `/<locale>/membership`

### Fields (in order)
1. Full Name — text input, required
2. Date of Birth — text input (DD/MM/YYYY format), required
3. Gender — select dropdown: Male / Female / Prefer not to say, required
4. Mobile Number — text input, required
5. Email Address — email input, required
6. Area / Location — text input (neighbourhood or city in KL/Selangor), required
7. Interests — multi-select checkboxes (user can pick multiple), required (at least one)
8. PDPA Consent — checkbox, required before submission allowed

### Interests Options (5 focus areas — match About Us page)
- Leadership Development
- Cultural Activities
- Community Service
- Social Awareness
- Health & Well-being

### Form Pattern
- **useActionState + Zod** — same pattern as `src/app/[locale]/contact/actions.ts`
- No React Hook Form — stay consistent with existing codebase
- Client-side: `useActionState` + `useState` for field values
- Server-side: Zod `safeParse()` returning flattened `fieldErrors`
- Error translation: `translateError()` helper mapping Zod codes to i18n keys
- PDPA checkbox: must be `true` at server side (Zod `.literal(true)` or `.refine()`) — blocked client-side and server-side

### Email Behaviour
- **Applicant confirmation email** — sent to applicant's submitted email address; acknowledges receipt, tells them the org will be in touch
- **Org notification email** — sent to `ORG_EMAIL` with all submitted field values
- Both sent via Resend in the same server action (same pattern as contact form)
- Resend instantiated inside server action body — not at module level

### Success/Error UX
- Follow contact form pattern: success modal overlay with close button (key remount clears form)
- Field-level errors inline under each input with `aria-describedby`
- Global send error banner at top of form if Resend fails

---

## SEO Metadata

### Per-Page Metadata
- Add `generateMetadata()` to every page that doesn't have it: home, about, contact, team, programmes listing, programme detail, documents, membership, privacy, admin-guide
- Locale from `params.locale` selects correct i18n messages for `<title>` and `<meta description>`
- Pattern: `async function generateMetadata({ params }) { const t = await getTranslations({ locale, namespace: 'meta' }); return { title: t('homeTitle'), description: t('homeDescription') }; }`
- Add a `meta` namespace to all three message files with `title` and `description` keys per page

### Open Graph Tags
- Every page gets: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`
- `og:image`: Use the Seputeh HYO logo (already in codebase — locate existing logo path); will be swapped for a 1200×630 banner later
- `og:type`: `website` for all pages

### sitemap.xml
- Generate via `src/app/sitemap.ts` (Next.js dynamic sitemap)
- Must include all locale-prefixed URLs: `/en/`, `/ms/`, `/ta/`, `/en/about`, `/ms/about`, `/ta/about`, etc.
- Include all static pages + dynamic programme slugs (fetched from Sanity at build time)
- Set `priority` and `changefreq` appropriately

### robots.txt
- Generate via `src/app/robots.ts`
- Allow all crawlers
- Include `Sitemap:` directive pointing to deployed sitemap URL

---

## Privacy Policy Page

### Route
- `/[locale]/privacy`
- Footer already links to `/privacy` via `Link href="/privacy"` — middleware handles locale prefix; ensure the link uses locale-aware navigation (`Link` from `@/i18n/navigation`)

### Content
- **Static hardcoded** — not CMS-driven; admin cannot edit without a code change
- Must reference PDPA 2010 (Personal Data Protection Act 2010, Malaysia)
- Required sections:
  1. What data we collect (name, DOB, gender, mobile, email, location, interests — from membership form)
  2. Why we collect it (membership processing, programme communications)
  3. How it's stored (email-only, not stored in a database)
  4. Your rights under PDPA 2010
  5. Contact for data requests (org email from `siteSettings`)
- Available in all three locales with translated copy (approximate translations consistent with prior phases — native-speaker review before launch)
- Add `privacy` namespace to message files for page title and section headings

---

## Admin Handover Guide

### Route
- `/[locale]/admin-guide` — accessible page on the live site, admin can bookmark it
- Not linked from main nav or footer — direct URL access only
- Static page (no CMS, no auth)

### Content
- One-page reference for non-technical admins covering:
  1. How to log into Sanity Studio (`/studio`)
  2. How to add/edit/remove a team member
  3. How to add/edit/remove a programme
  4. How to upload a document (PDF) with required metadata
  5. How to update site settings (contact email, WhatsApp, social links)
  6. What ISR is (content appears live within seconds of publishing)
- Available in EN only (admin-facing guide)
- Add to sitemap with `noindex` robots meta tag (or exclude from sitemap — Claude's discretion)

---

## Responsive QA & Accessibility

- Responsive QA: verify no horizontal scroll, touch targets ≥ 44px, base font ≥ 16px across mobile/tablet/desktop in all 3 locales — already enforced by Phase 2 foundation; Phase 5 adds QA checklist verification pass
- WCAG 2.1 AA: colour contrast ≥ 4.5:1, keyboard navigation, heading hierarchy, alt text on all images — already enforced; Phase 5 confirms compliance
- Tamil rendering: Noto Sans Tamil on mid-range Android — established in Phase 2; Phase 5 confirms no regression
- These are verification/QA tasks, not new implementation — covered in plan as test/check tasks

---

## Reusable Assets Available

- `src/app/[locale]/contact/actions.ts` — Resend + Zod + useActionState pattern to copy for membership form
- `src/app/[locale]/contact/ContactForm.tsx` — form component pattern to copy
- `src/app/[locale]/contact/page.tsx` — page wiring pattern
- `src/components/ui/button.tsx` — shadcn Button (checkbox, input already available via shadcn)
- `cn()` from `src/lib/utils.ts`
- `messages/en.json`, `ms.json`, `ta.json` — add `membership`, `privacy`, `meta` namespaces
- Layout shell, Header, Footer, Nav — automatic via locale layout
- Brand tokens: `--color-brand-green: #32a852`, saffron accent — in `globals.css`
- Logo: locate existing logo asset path for og:image

---

## Claude's Discretion

The planner/executor decides these without asking the user:

- Membership form visual layout (single column on mobile, 2-col on desktop for some fields)
- Checkbox group styling for interests (grid layout, label positioning)
- DOB input format validation (regex for DD/MM/YYYY or flexible)
- Mobile number validation pattern (Malaysian mobile format or generic)
- OG image dimensions and how to reference the logo file
- Privacy Policy page typography and section structure
- Admin guide page visual layout
- Which shadcn/ui components to use for form inputs (Input, Label, Checkbox from shadcn)
- Skeleton/loading states on membership form
- Whether admin-guide is excluded from sitemap via `noindex` or omitted entirely

---

## Deferred Ideas

*(Captured but out of scope for Phase 5)*

- OG banner image (1200×630) — user confirmed logo for now, banner swap is a future task
- Membership submission stored in Sanity for admin review — email-only in v1
- Member portal / application status tracking — v2 (PORT-01, PORT-02)
- Admin guide localised to BM/Tamil — EN only for v1
- Membership form as a Sanity-managed page — static in v1

---

## Canonical References

- ROADMAP.md Phase 5: requirements MEMB-01–06, SEO-01–05
- Existing contact form: `src/app/[locale]/contact/` (actions.ts, ContactForm.tsx, page.tsx)
- Existing i18n messages: `messages/en.json`, `ms.json`, `ta.json`
- Phase 2 CONTEXT.md: brand tokens, layout shell, shadcn components
- Phase 3 CONTEXT.md: Resend pattern, Zod patterns, imageUrlBuilder
- Phase 4 CONTEXT.md: i18n namespace patterns, empty state patterns

---

*Phase: 05-membership-polish*
*Context gathered: 2026-04-02*
