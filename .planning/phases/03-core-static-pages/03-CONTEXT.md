# Phase 3: Core Static Pages — Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Homepage, About Us, and Contact Us pages are live in all three locales (EN, BM, Tamil) with accurate content. The contact form delivers submissions to the org email via Resend. Creating the full Programmes listing page and Team page are Phase 4; the membership form is Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Homepage — Hero
- **Layout:** Full-bleed background image with text overlaid (dark overlay on photo for readability)
- **Image source:** Stored in Sanity `siteSettings` schema — admin-editable, no code change required to swap the hero photo
- **Headline:** "Be Part of The Change" (EN) — BM and Tamil translations TBD (human-translated, not auto-translated)
- **Subline:** The org's mission statement — same translation requirement applies
- **CTAs:** Two buttons — "Join Us" (primary, saffron, → membership form) + "Learn More" (secondary, → About Us page)

### Homepage — Impact Statistics
- **Years active:** Hardcoded, auto-calculated from founding year 2002 (no CMS needed — always accurate)
- **Member count + Programmes delivered:** CMS-editable via Sanity `siteSettings` schema (admin can update without code)
- **Initial values:** Placeholder (0 or TBD); admin fills in real numbers before launch

### Homepage — Programme Highlights
- **Count:** 3 cards — fetches 3 most recently published programmes from Sanity
- **Card content:** Photo + title + category badge (no description snippet)
- **Linking:** Each card links to `/[locale]/programmes/[slug]` — Phase 4 builds those detail pages; cards will 404 until Phase 4 is deployed
- **Empty state:** Show 3 skeleton/placeholder cards with a "Coming soon" message if Sanity returns 0 programmes
- **"View All" CTA:** Button below the highlights section links to `/[locale]/programmes` (Phase 4 page)

### Contact Form
- **Fields:** Name, email, subject (free-text, not dropdown), message
- **Success state:** Form replaced inline with a success message ("Thank you, we'll be in touch") — no redirect, user stays on Contact Us
- **Validation errors:** Inline under each field as the user interacts — no top-level summary
- **Delivery:** Server Action → Resend → org email (CONT-02); RESEND_API_KEY was explicitly deferred from Phase 1 to Phase 3

### Claude's Discretion
- About Us page sectioning and visual layout (founding date, mission/vision, 5 focus areas, registration details)
- Visual treatment for the five focus areas (cards, icon list, or plain prose — Claude chooses)
- Google Map embed approach (full iframe or static image with link)
- Contact page layout beyond the form spec (arrangement of form, WhatsApp link, email, social, map)
- Server Action implementation pattern for the contact form
- Form loading/pending states and disabled-button-on-submit behaviour

</decisions>

<specifics>
## Specific Ideas

- Hero headline: **"Be Part of The Change"** (exact casing confirmed by user)
- Hero image is org photography (user confirmed photos are available — to be provided)
- Impact section is important to the org; years active auto-calculated is preferred over manual entry
- Programme cards intentionally link forward to Phase 4 slug pages — user confirmed this even knowing those pages don't exist yet; implies Phase 3 and 4 should be deployed together or Phase 4 immediately follows

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/Header.tsx`, `Footer.tsx`, `Nav.tsx`, `NavLink.tsx`, `LanguageSwitcher.tsx`, `MobileDrawer.tsx` — all built in Phase 2; Phase 3 pages inherit layout automatically via locale layout shell
- `src/lib/sanity/queries.ts` — `ALL_PROGRAMMES_QUERY` already defined (returns `_id, title, description, image, category, slug`); use this for homepage highlights, limit to 3
- `src/lib/sanity/queries.ts` — `SITE_SETTINGS_QUERY` already fetches `contactEmail, whatsappNumber, facebookUrl, instagramUrl`; Phase 3 needs to **extend** this query to also fetch `heroImage`, `memberCount`, `programmesDelivered`
- `src/components/ui/button.tsx` — shadcn Button installed; use for hero CTAs and form submit button
- `src/lib/utils.ts` — `cn()` helper available

### Established Patterns
- All CMS content uses `LocalizedString` type (`{ en?, ms?, ta? }`) — About Us copy and hero text should follow same pattern if stored in Sanity, or be sourced from next-intl message files
- Locale layout (`src/app/[locale]/layout.tsx`) wraps all pages — no need to add Header/Footer to each page
- `sanityFetch()` with ISR for CMS-driven content; revalidation triggered by Sanity webhook
- Brand tokens in `src/app/globals.css` `@theme {}` block: `--color-brand-green: #32a852`, saffron accent
- All user-facing strings use next-intl (`useTranslations` / `getTranslations`) — not hardcoded English

### Integration Points
- `src/app/[locale]/page.tsx` — currently a stub; replace with full homepage implementation
- New routes to create: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/contact/page.tsx`
- `siteSettings` Sanity schema needs new fields: `heroImage` (image type), `memberCount` (number), `programmesDelivered` (number)
- Contact form needs a Server Action (e.g., `src/app/[locale]/contact/actions.ts`) calling Resend
- RESEND_API_KEY env var must be added to Vercel project settings before contact form goes live

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-core-static-pages*
*Context gathered: 2026-03-13*
