# Roadmap: Seputeh HYO Website

**Created:** 2026-03-11
**Milestone:** v1 Launch
**Target:** Production-ready website with CMS, trilingual support, and all core pages

---

## Phases

- [x] **Phase 1: Infrastructure** — Tech stack wired together, CMS schemas defined, deployment live, Dependabot + UptimeRobot operational (3/3 plans complete)
- [x] **Phase 2: Shared UI Foundation** — Layout shell, navigation, brand tokens, i18n message files (completed 2026-03-13)
- [x] **Phase 3: Core Static Pages** — Homepage, About Us, Contact Us with working contact form (completed 2026-03-16)
- [ ] **Phase 4: CMS-Driven Pages** — Our Team, Our Programmes, PDF Document Library
- [ ] **Phase 5: Membership & Polish** — Membership form, responsive QA, accessibility, SEO, admin handover

---

## Phase Details

### Phase 1: Infrastructure

**Goal:** Next.js, Sanity, next-intl, Vercel, and Resend are wired together, all CMS schemas are defined, and the deployed site skeleton is live at a Vercel URL.

**Deliverables:**
- Next.js 15 App Router project scaffolded with Tailwind CSS v4 and shadcn/ui
- Sanity v3 Studio accessible at `/studio` with schemas for `programme`, `teamMember`, `document`, and `siteSettings`
- next-intl v4 configured with URL-prefixed locale routing (`/en/`, `/ms/`, `/ta/`)
- Site deployed to Vercel with Singapore edge node
- Resend account connected and verified sender domain configured
- `siteSettings` schema stores contact email, WhatsApp number, and social URLs (nothing hardcoded in code)
- Sanity webhook configured to trigger ISR revalidation on publish
- At least two admin accounts registered under the org's official email in Sanity Studio
- Dependabot enabled for automated dependency security updates
- UptimeRobot monitoring configured to alert org email on outages

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04

**Success Criteria:**
1. Running `next dev` serves the app at `localhost:3000` without errors, and `/en/`, `/ms/`, and `/ta/` routes all resolve.
2. Sanity Studio at `/studio` is accessible and all four schemas (`programme`, `teamMember`, `document`, `siteSettings`) appear with trilingual fields on every content type.
3. A test page deployed to Vercel updates its content within seconds of a Sanity publish (ISR revalidation confirmed).
4. Resend sends a test email successfully from the configured sender domain.
5. Dependabot PRs are visible in the repository and UptimeRobot sends an alert to the org email on a simulated outage.

**Parallelizable with:** None (all subsequent phases depend on this)

---

### Phase 2: Shared UI Foundation

**Goal:** Every page in every locale shares a consistent layout shell, sticky navigation with language switcher, brand tokens, and complete i18n message files — so all downstream pages can be built without revisiting global UI.

**Deliverables:**
- Tailwind CSS brand token file with Seputeh HYO logo colours and typography scale
- Noto Sans Tamil loaded via `next/font` with correct `html[lang="ta"]` font-family and line-height (~1.7)
- Layout shell: consistent header and footer with contact info, social links, and privacy policy link
- Sticky navigation bar visible on all pages
- Language switcher in nav using native-script labels (English / Bahasa Malaysia / தமிழ்) — no flags
- GROQ query helper library (reusable typed fetch functions for all content types)
- next-intl JSON message files fully populated for EN, BM, and Tamil across all UI strings
- Functional 404 page
- Responsive baseline: no horizontal scroll, touch targets ≥ 44px, base font ≥ 16px

**Requirements:** BRAND-01, BRAND-02, BRAND-03, BRAND-04, BRAND-05, BRAND-06, BRAND-07, BRAND-08, BRAND-09, I18N-01, I18N-02, I18N-03, I18N-04, I18N-05

**Plans:** 3/3 plans complete

Plans:
- [x] 02-01-PLAN.md — Wave 0 test stubs (7 failing tests covering all Phase 2 requirements) (completed 2026-03-13)
- [x] 02-02-PLAN.md — Brand tokens + fonts + navigation.ts + Header/Nav/LanguageSwitcher/MobileDrawer + GROQ helpers
- [x] 02-03-PLAN.md — Footer + locale layout wiring + 404 page + complete EN/BM/Tamil message files

**Success Criteria:**
1. Navigating between `/en/`, `/ms/`, and `/ta/` via the language switcher changes the URL and all UI strings without a full page reload; URLs are bookmarkable and shareable.
2. On a mid-range Android device, Tamil text renders with Noto Sans Tamil (not a system fallback), correct line-height, and no clipped descenders.
3. The sticky nav and footer are present and correctly branded on every page across all screen sizes (mobile, tablet, desktop) with no horizontal scroll.
4. A Lighthouse accessibility audit reports no colour contrast failures (≥ 4.5:1) and all interactive elements are reachable via keyboard.

**Parallelizable with:** None (Phase 3 and 4 depend on layout shell and i18n messages)

---

### Phase 3: Core Static Pages

**Goal:** Homepage, About Us, and Contact Us pages are live in all three locales with accurate content and a working contact form that delivers submissions to the org email.

**Deliverables:**
- Homepage with hero section (mission statement above the fold), impact statistics, CMS-driven programme highlights, and call-to-action button linking to membership form
- Social media links visible in the homepage footer
- About Us page with founding date (16 September 2002), mission and vision statements, five focus areas, and organisation registration details
- Contact Us page with contact form (name, email, subject, message), Resend delivery to org email, WhatsApp deep link, displayed org email address, social media links, and Google Map embed
- All pages rendered in EN, BM, and Tamil with translated copy

**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, ABOUT-01, ABOUT-02, ABOUT-03, ABOUT-04, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06

**Plans:** 5/5 plans complete

Plans:
- [x] 03-01-PLAN.md — Wave 0 TDD stubs (homepage, about, contact page tests RED + extend schema + i18n test files)
- [x] 03-02-PLAN.md — Wave 1: siteSettings schema extension + GROQ queries + next.config.ts + all i18n namespaces
- [x] 03-03-PLAN.md — Wave 2: Homepage (HeroSection + ImpactStats + ProgrammeHighlights)
- [x] 03-04-PLAN.md — Wave 2: About Us page (parallel with 03-03)
- [ ] 03-05-PLAN.md — Wave 3: Contact Us page + ContactForm + Server Action + Resend wiring

**Success Criteria:**
1. Visiting `/en/`, `/ms/`, and `/ta/` each shows a distinct homepage with the mission statement above the fold, impact numbers, and at least one programme highlight pulled from Sanity.
2. The Contact Us form submits successfully in all three locales and an email arrives in the org inbox within 60 seconds; submitting an empty form shows translated validation errors.
3. The About Us page shows the founding date (16 September 2002), all five focus areas, and the organisation registration number in all three locales.
4. The WhatsApp deep link opens a pre-filled WhatsApp message on mobile; the Google Map embed loads without console errors.

**Parallelizable with:** Phase 4 (CMS-driven pages can be built in parallel once Phase 2 is complete)

---

### Phase 4: CMS-Driven Pages

**Goal:** Our Team, Our Programmes, and PDF Document Library pages are live and fully admin-editable via Sanity Studio — no developer intervention required to add, update, or remove content.

**Deliverables:**
- Our Team page with committee member cards (name, role, photo) and visible committee structure (President, VP, Secretary, etc.)
- Our Programmes page listing all programmes from Sanity with title, description, photo, and category in all three locales
- PDF Document Library listing all uploaded documents with display title (active locale), category, year, upload date, file size, and download link
- Document library filterable by category
- All three pages managed entirely via Sanity Studio without code changes
- Sanity `document` schema enforces required metadata fields (title in all 3 locales, category, year)

**Requirements:** TEAM-01, TEAM-02, TEAM-03, PROG-01, PROG-02, PROG-03, PROG-04, DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05

**Plans:** 1/5 plans executed

Plans:
- [x] 04-01-PLAN.md — Wave 1: TDD stubs (fix schema test bug + create page test stubs + extend i18n tests)
- [ ] 04-02-PLAN.md — Wave 2: Schema mutations (tier, body, title validation) + GROQ queries + types + i18n messages + @portabletext/react
- [ ] 04-03-PLAN.md — Wave 3: Our Team page (tier-grouped member cards)
- [ ] 04-04-PLAN.md — Wave 3: Programmes listing + detail pages (parallel with 04-03)
- [ ] 04-05-PLAN.md — Wave 3: Document Library page + client-side category filter (parallel with 04-03, 04-04)

**Success Criteria:**
1. A non-technical admin can add a new team member in Sanity Studio and see the card appear on the Our Team page (in all three locales) within seconds of publishing, without touching any code.
2. A non-technical admin can create a new programme with title, description, photo, and category in Sanity Studio; the programme appears on the listing page in the correct category in all three locales.
3. A non-technical admin can upload a PDF in Sanity Studio with required metadata and it immediately appears in the Document Library with the correct display title, category, year, upload date, file size, and a working download link.
4. The document category filter correctly narrows the library to the selected category; documents without all required metadata fields cannot be published (Sanity validation enforced).

**Parallelizable with:** Phase 3 (can be built concurrently once Phase 2 is complete)

---

### Phase 5: Membership & Polish

**Goal:** The membership application form is live in all three locales with PDPA consent and email confirmation, and the entire site passes responsive QA, Tamil rendering checks, accessibility audit, and SEO requirements — ready for admin handover.

**Deliverables:**
- Membership application form with all required fields (full name, date of birth, gender, mobile, email, area/location, interests), PDPA consent checkbox, client-side and server-side validation (React Hook Form + Zod)
- Automated confirmation email sent to applicant on successful submission (via Resend)
- Submission forwarded to org's official email
- Form available in all three locales with translated labels and error messages
- Responsive QA pass across mobile, tablet, and desktop in all three locales
- Tamil rendering verified on a real mid-range Android device
- Full accessibility audit with WCAG 2.1 AA compliance confirmed
- Unique `<title>` and `<meta description>` per page in active locale
- Open Graph tags on all pages
- `sitemap.xml` and `robots.txt` generated
- Privacy Policy page covering PDPA 2010 compliance
- HTTPS enforced (Vercel SSL)
- Admin handover: at least two org-email admin accounts in Sanity, credentials in shared password manager, one-page CMS quick-reference guide delivered

**Requirements:** MEMB-01, MEMB-02, MEMB-03, MEMB-04, MEMB-05, MEMB-06, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05

**Plans:** 1/4 plans executed

Plans:
- [x] 05-01-PLAN.md — Wave 0: TDD stubs + i18n namespaces (membership, privacy, meta) + deduplicate en.json + env docs
- [ ] 05-02-PLAN.md — Wave 1: Membership form (actions.ts + MembershipForm.tsx + page.tsx) with Zod + Resend dual-send
- [ ] 05-03-PLAN.md — Wave 2: SEO metadata (generateMetadata + OG on all pages) + sitemap.ts + robots.ts
- [ ] 05-04-PLAN.md — Wave 2: Privacy Policy page + Admin Guide page (parallel with 05-03)

**Success Criteria:**
1. A user can complete and submit the membership form in Tamil, English, and Bahasa Malaysia; a confirmation email arrives in the applicant's inbox and a notification arrives in the org's inbox within 60 seconds of submission.
2. Submitting the membership form without the PDPA consent checkbox checked is blocked at the client; submitting malformed data is blocked at the server with translated error messages.
3. Every page in all three locales has a unique `<title>`, `<meta description>`, and Open Graph tags visible in the page source; `sitemap.xml` lists all locale-prefixed URLs.
4. A non-technical admin can log into Sanity Studio using an org-email account, add a programme, and see it live on the site — independently, without developer assistance.
5. The Privacy Policy page is accessible from the footer on every page and references PDPA 2010 compliance.

**Parallelizable with:** None (final phase; depends on all prior phases)

---

## Progress

| Phase | Name | Requirements | Status | Completed |
|-------|------|-------------|--------|-----------|
| 1 | Infrastructure | INFRA-01-07, ADMIN-01-04 (11 req) | Complete | 2026-03-12 |
| 2 | Shared UI Foundation | BRAND-01-09, I18N-01-05 (14 req) | Complete | 2026-03-13 |
| 3 | Core Static Pages | HOME-01-05, ABOUT-01-04, CONT-01-06 (16 req) | Complete | 2026-03-16 |
| 4 | CMS-Driven Pages | 1/5 | In Progress|  |
| 5 | Membership & Polish | 1/4 | In Progress|  |

**Coverage:** 52/52 v1 requirements mapped across 5 phases. No orphans.

---

*Roadmap created: 2026-03-11*
*Granularity: coarse (5 phases)*
*Next step: `/gsd:execute-phase 05-membership-polish`*
