# Requirements: Seputeh HYO Website

**Defined:** 2026-03-11
**Core Value:** Youth and community members can discover Seputeh HYO, understand their work, and take action — joining as a member, exploring programmes, or collaborating — all in their preferred language.

## v1 Requirements

### Infrastructure & Foundation

- [x] **INFRA-01**: Project scaffolded as Next.js 15 (App Router) with Tailwind CSS v4 and shadcn/ui
- [x] **INFRA-02**: Sanity v3 CMS connected and Studio accessible at `/studio`
- [x] **INFRA-03**: next-intl v4 configured with URL-prefixed locale routing (`/en/`, `/ms/`, `/ta/`)
- [x] **INFRA-04**: Site deployed to Vercel with Singapore edge node
- [x] **INFRA-05**: Resend account connected for transactional email delivery
- [x] **INFRA-06**: Dependabot enabled for automated dependency security updates
- [x] **INFRA-07**: UptimeRobot monitoring configured to alert org email on outages

### Branding & Global UI

- [x] **BRAND-01**: Seputeh HYO logo and brand colours applied across all pages
- [x] **BRAND-02**: Noto Sans Tamil loaded via next/font for Tamil locale
- [x] **BRAND-03**: Responsive layout across mobile, tablet, and desktop (no horizontal scroll)
- [x] **BRAND-04**: Touch targets ≥ 44px; base font ≥ 16px
- [x] **BRAND-05**: Sticky navigation bar visible on all pages
- [x] **BRAND-06**: Consistent header and footer with contact info, social links, and privacy policy link
- [x] **BRAND-07**: Functional 404 page
- [x] **BRAND-08**: First Contentful Paint ≤ 1.8s; images optimised and lazy-loaded
- [x] **BRAND-09**: WCAG 2.1 AA colour contrast (≥ 4.5:1), alt text, keyboard navigation, heading hierarchy

### Internationalisation

- [x] **I18N-01**: Language switcher in nav using native-script labels (English / Bahasa Malaysia / தமிழ்) — not flags
- [x] **I18N-02**: All UI strings available in EN, BM, and Tamil via next-intl JSON message files
- [ ] **I18N-03**: All CMS content (programmes, team bios, page copy) has EN, BM, and Tamil fields
- [x] **I18N-04**: Tamil locale sets `html[lang="ta"]` with correct font-family and line-height (~1.7)
- [x] **I18N-05**: Locale URLs bookmarkable and shareable (no component-state toggling)

### Homepage

- [x] **HOME-01**: Hero section with mission statement above the fold
- [x] **HOME-02**: Impact section showing years active, member count, and programmes delivered
- [x] **HOME-03**: Highlights of current/recent programmes (CMS-driven)
- [x] **HOME-04**: Call-to-action button linking to Be Part of Us
- [x] **HOME-05**: Social media links visible in footer

### About Us

- [x] **ABOUT-01**: Organisation history including founding date (16 September 2002)
- [x] **ABOUT-02**: Mission and vision statements
- [x] **ABOUT-03**: Five focus areas (leadership, culture, community service, social awareness, well-being)
- [x] **ABOUT-04**: Organisation registration/details visible on page

### Our Team

- [x] **TEAM-01**: Committee member cards showing name, role, and photo
- [x] **TEAM-02**: Team members managed via Sanity CMS (admin can add/edit/remove without code)
- [x] **TEAM-03**: Committee structure visible (President, VP, Secretary, etc.)

### Our Programmes

- [x] **PROG-01**: Programme listing page showing all programmes from CMS
- [x] **PROG-02**: Each programme has title, description, and photo
- [x] **PROG-03**: Programmes managed via Sanity CMS (admin can add/edit/remove without code)
- [x] **PROG-04**: Programmes categorised (Leadership, Cultural, Community Service, Well-being, etc.)

### Be Part of Us (Membership)

- [x] **MEMB-01**: Membership application form with fields: full name, date of birth, gender, mobile, email, area/location, interests
- [x] **MEMB-02**: PDPA consent checkbox required before form submission
- [x] **MEMB-03**: Form validated client-side (React Hook Form + Zod) and server-side (Server Action)
- [x] **MEMB-04**: Automated confirmation email sent to applicant on successful submission (via Resend)
- [x] **MEMB-05**: Submission forwarded to org's official email address
- [x] **MEMB-06**: Form available in all three locales with translated labels and error messages

### Contact Us

- [x] **CONT-01**: Contact form with name, email, subject, and message fields
- [x] **CONT-02**: Form submissions delivered to org's official email (via Resend)
- [x] **CONT-03**: WhatsApp deep link with pre-filled message (`wa.me/` link)
- [x] **CONT-04**: Organisation email address displayed
- [x] **CONT-05**: Social media links displayed (Facebook, Instagram, and others)
- [x] **CONT-06**: Google Map embed showing Seputeh parliamentary area

### Documentation

- [x] **DOCS-01**: PDF document library listing all uploaded documents
- [x] **DOCS-02**: Each document shows: display title (in active locale), category, year, upload date, file size, and download link
- [x] **DOCS-03**: Documents filterable by category
- [x] **DOCS-04**: PDFs uploaded and managed via Sanity Studio (admin uploads directly, served from Sanity CDN)
- [x] **DOCS-05**: Document schema enforces required metadata fields (title in all 3 locales, category, year)

### Admin & CMS

- [x] **ADMIN-01**: `siteSettings` Sanity schema stores contact email, WhatsApp number, and social URLs (nothing hardcoded)
- [x] **ADMIN-02**: Sanity Studio accessible for non-technical admins to manage all content
- [x] **ADMIN-03**: At least two admin accounts registered under org's official email (not personal emails)
- [x] **ADMIN-04**: Sanity webhook triggers ISR revalidation so published content appears within seconds

### SEO & Legal

- [x] **SEO-01**: Unique `<title>` and `<meta description>` per page in active locale
- [x] **SEO-02**: Open Graph tags for social sharing on all pages
- [x] **SEO-03**: `sitemap.xml` and `robots.txt` generated
- [x] **SEO-04**: Privacy Policy page covering PDPA 2010 compliance
- [x] **SEO-05**: HTTPS enforced (Vercel provides SSL by default)

---

## v2 Requirements

### Enhanced Features

- **ENH-01**: Search bar for PDF document library by title keyword
- **ENH-02**: Programme detail pages with photo gallery
- **ENH-03**: Organisation milestone timeline on About Us page
- **ENH-04**: Upcoming events calendar view for Programmes
- **ENH-05**: Social media feed embed (Instagram widget)

### Member Portal

- **PORT-01**: Member login with access to member-only documents
- **PORT-02**: Membership application status tracking

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Member authentication / login | Adds complexity — documentation is fully public in v1 |
| Donation / payment gateway | Not required for v1 membership or programme engagement |
| Real-time chat or forum | WhatsApp handles direct communication |
| Mobile app (iOS/Android) | Web-first; mobile app is a separate project |
| Machine translation (Google Translate widget) | Culturally inappropriate for Tamil community NGO — all 3 locales must be human-translated |
| IC number collection on membership form | PDPA risk — not collecting unless strictly necessary |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 – INFRA-07 | Phase 1 | Pending |
| BRAND-01 – BRAND-09 | Phase 2 | Pending |
| I18N-01 – I18N-05 | Phase 2 | Pending |
| HOME-01 – HOME-05 | Phase 3 | Complete |
| ABOUT-01 – ABOUT-04 | Phase 3 | Complete |
| TEAM-01 – TEAM-03 | Phase 4 | Pending |
| PROG-01 – PROG-04 | Phase 4 | Pending |
| DOCS-01 – DOCS-05 | Phase 4 | Pending |
| MEMB-01 – MEMB-06 | Phase 5 | Pending |
| CONT-01 – CONT-06 | Phase 3 | Complete |
| ADMIN-01 – ADMIN-04 | Phase 1 | Pending |
| SEO-01 – SEO-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 52
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after initial definition*
