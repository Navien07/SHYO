---
phase: 03-core-static-pages
verified: 2026-03-17T00:00:00Z
status: human_needed
score: 16/16 must-haves verified
human_verification:
  - test: "Submit contact form with valid data in /en/contact"
    expected: "Inline success message replaces the form; email arrives in org inbox within 60s"
    why_human: "Requires live RESEND_API_KEY env var, network access, and email receipt"
  - test: "Submit contact form with empty fields in /en/contact"
    expected: "Inline field-level error messages appear under each empty field without page reload"
    why_human: "Requires browser with React hydration and Server Action round-trip"
  - test: "Tap WhatsApp link on /en/contact on a mobile device"
    expected: "WhatsApp opens with pre-filled message 'Hi Seputeh HYO, I would like to enquire...'"
    why_human: "Requires physical mobile device with WhatsApp installed"
  - test: "Visit /en/, /ms/, /ta/ and verify hero section"
    expected: "Hero with bg-brand-green fallback (or Sanity heroImage if set), dark overlay, headline, two CTAs visible above the fold"
    why_human: "Visual rendering and above-the-fold check requires browser"
  - test: "Switch between /en/about, /ms/about, /ta/about"
    expected: "All text updates to the correct locale — BM and Tamil translations appear for every section"
    why_human: "Visual locale-switch check requires browser; BM and Tamil translations were machine-generated and need human review before launch"
  - test: "Open /en/contact and check Google Map embed"
    expected: "Google Maps iframe renders without console errors showing the Seputeh, KL area"
    why_human: "Requires browser network access to load Google Maps embed"
  - test: "Verify RESEND_FROM, RESEND_API_KEY, ORG_EMAIL are set in Vercel project settings"
    expected: "All three env vars present in production environment"
    why_human: "Environment variable configuration is outside the codebase"
---

# Phase 3: Core Static Pages Verification Report

**Phase Goal:** Homepage, About Us, and Contact Us pages are live in all three locales with accurate content and a working contact form that delivers submissions to the org email.
**Verified:** 2026-03-17
**Status:** human_needed — all automated checks pass; 7 items require human/live testing
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting /en/, /ms/, or /ta/ shows a full homepage — not a stub | VERIFIED | `src/app/[locale]/page.tsx` is an async Server Component composing HeroSection, ImpactStats, ProgrammeHighlights; no stub text found |
| 2 | Hero section is above the fold with mission headline and two CTA buttons | VERIFIED | `HeroSection.tsx` renders `t('heroHeadline')`, `t('heroSubline')`, Link to /membership (joinUs), Link to /about (learnMore) |
| 3 | Impact stats section shows years active, member count, and programmes delivered | VERIFIED | `ImpactStats.tsx` calculates `new Date().getFullYear() - 2002`; renders memberCount and programmesDelivered from siteSettings; test confirms ≥ 24 |
| 4 | Programme highlights shows up to 3 cards or 'coming soon' state | VERIFIED | `ProgrammeHighlights.tsx` handles `programmes.length === 0` with skeleton + t('comingSoon'); card grid for non-empty |
| 5 | All homepage text renders in the correct locale language | VERIFIED | All JSX strings via `getTranslations('home')`; home namespace present in all 3 locale JSON files (28 i18n tests pass) |
| 6 | Visiting /en/about, /ms/about, /ta/about renders full About Us page | VERIFIED | `src/app/[locale]/about/page.tsx` exists as 56-line async Server Component with all four ABOUT requirement sections |
| 7 | Founding date 16 September 2002 visible on About page | VERIFIED | `t('foundingDate')` rendered; `messages/en.json about.foundingDate = "Founded on 16 September 2002"` |
| 8 | Mission, vision, five focus areas, and registration number present on About page | VERIFIED | All t() calls present in about/page.tsx; all keys confirmed in en.json, ms.json, ta.json (schema tests green) |
| 9 | Contact form with name/email/subject/message fields exists | VERIFIED | `ContactForm.tsx` has all four input/textarea fields with labels, placeholders via t() |
| 10 | Contact form submissions delivered to org email via Resend | VERIFIED (wiring) / NEEDS HUMAN (live) | `actions.ts` calls `resend.emails.send()` with ORG_EMAIL; Resend is instantiated inside the function; actual delivery requires live env |
| 11 | Submitting invalid data shows inline field errors without page reload | VERIFIED (wiring) / NEEDS HUMAN (live) | `ContactForm.tsx` uses `useActionState(sendContactForm, initialState)`; renders `state.errors.*` conditionally; translateError maps Zod keys to t() strings |
| 12 | WhatsApp deep link uses wa.me format with number from siteSettings | VERIFIED | `contact/page.tsx` constructs `https://wa.me/${waNumber}?text=...`; structural test passes |
| 13 | Organisation email address displayed on Contact page | VERIFIED | `siteSettings?.contactEmail` rendered as mailto link; conditional guard handles null siteSettings |
| 14 | Social media links (Facebook, Instagram) visible | VERIFIED | Footer.tsx (lines 78-95) renders facebookUrl and instagramUrl from siteSettings; contact/page.tsx also renders them |
| 15 | Google Map embed of Seputeh parliamentary area present | VERIFIED | `contact/page.tsx` has static Google Maps iframe with Seputeh coordinates; structural test passes |
| 16 | All page text renders in correct locale (EN/BM/Tamil) | VERIFIED | All three locale JSON files have complete home/about/contact namespaces; 171 i18n tests pass |

**Score:** 16/16 truths verified (7 require additional live/human confirmation)

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/[locale]/page.tsx` | Homepage Server Component | VERIFIED | Async, uses Promise.all for getSiteSettings + getProgrammeHighlights, composes three section components |
| `src/components/home/HeroSection.tsx` | Full-bleed hero with Sanity image, CTAs | VERIFIED | 52 lines; urlFor with cdn.sanity.io; bg-brand-green fallback; Link from @/i18n/navigation |
| `src/components/home/ImpactStats.tsx` | Three stat cards with dynamic years | VERIFIED | 34 lines; yearsActive = getFullYear() - 2002; memberCount + programmesDelivered from props |
| `src/components/home/ProgrammeHighlights.tsx` | 3-card grid or empty state | VERIFIED | 72 lines; skeleton empty state; programme card grid; "View All" link |
| `src/app/[locale]/about/page.tsx` | About Us Server Component | VERIFIED | 56 lines; getTranslations('about'); all four ABOUT sections present |
| `src/app/[locale]/contact/actions.ts` | Server Action with Zod + Resend | VERIFIED | 77 lines; 'use server' at line 1; sendContactForm(prevState, formData); Zod schema; resend.emails.send() |
| `src/app/[locale]/contact/ContactForm.tsx` | Client Component with useActionState | VERIFIED | 122 lines; 'use client' at line 1; useActionState from 'react'; inline field errors; success state |
| `src/app/[locale]/contact/page.tsx` | Contact page Server Component | VERIFIED | 108 lines; getSiteSettings(); ContactForm; wa.me link; email; social links; Google Maps iframe |
| `src/sanity/schemas/siteSettings.ts` | heroImage, memberCount, programmesDelivered fields | VERIFIED | All 3 fields present; schema tests green |
| `src/lib/sanity/queries.ts` | Extended SiteSettings type + GROQ query + getProgrammeHighlights() | VERIFIED | Type has 3 new fields; GROQ projection includes them; helper function exists |
| `next.config.ts` | cdn.sanity.io in remotePatterns | VERIFIED | `{ protocol: 'https', hostname: 'cdn.sanity.io' }` present |
| `messages/en.json` | home, about, contact namespaces | VERIFIED | All three namespaces with complete keys |
| `messages/ms.json` | home, about, contact namespaces in BM | VERIFIED | All three namespaces with complete keys |
| `messages/ta.json` | home, about, contact namespaces in Tamil | VERIFIED | All three namespaces with complete keys |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/[locale]/page.tsx` | `getSiteSettings()` + `getProgrammeHighlights()` | `Promise.all([...])` | WIRED | Lines 12-15: parallel fetch confirmed |
| `HeroSection.tsx` | `@/i18n/navigation` Link | `import { Link } from '@/i18n/navigation'` | WIRED | Line 5; no next/link used |
| `HeroSection.tsx` | `/membership` | `<Link href="/membership">` | WIRED | Line 38 |
| `ProgrammeHighlights.tsx` | `/programmes/${slug}` | `<Link href={...}>` | WIRED | Line 39; locale-aware via @/i18n/navigation |
| `contact/ContactForm.tsx` | `actions.ts sendContactForm` | `useActionState(sendContactForm, initialState)` | WIRED | Line 21 |
| `actions.ts` | Resend API | `resend.emails.send(...)` | WIRED | Line 54; instantiated inside function body (not module level) |
| `contact/page.tsx` | `getSiteSettings()` | `await Promise.all([getTranslations, getSiteSettings()])` | WIRED | Lines 6-9 |
| `about/page.tsx` | `getTranslations('about')` | `await getTranslations('about')` | WIRED | Line 4 |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HOME-01 | 03-03 | Hero section with mission statement above the fold | SATISFIED | HeroSection.tsx renders heroHeadline + heroSubline; bg-brand-green fallback |
| HOME-02 | 03-03 | Impact section showing years active, member count, programmes delivered | SATISFIED | ImpactStats.tsx: yearsActive calc + siteSettings.memberCount + siteSettings.programmesDelivered |
| HOME-03 | 03-03 | Highlights of current/recent programmes (CMS-driven) | SATISFIED | ProgrammeHighlights.tsx uses getProgrammeHighlights() (max 3 from Sanity) |
| HOME-04 | 03-03 | CTA button linking to Be Part of Us | SATISFIED | HeroSection.tsx: `<Link href="/membership">` with joinUs text |
| HOME-05 | 03-03 | Social media links visible in footer | SATISFIED | Footer.tsx lines 78-95: facebookUrl + instagramUrl from siteSettings; verified in Phase 2 |
| ABOUT-01 | 03-04 | Organisation history including founding date 16 Sep 2002 | SATISFIED | about/page.tsx: `t('foundingDate')` = "Founded on 16 September 2002" in all 3 locales |
| ABOUT-02 | 03-04 | Mission and vision statements | SATISFIED | about/page.tsx: missionHeading + mission + visionHeading + vision sections |
| ABOUT-03 | 03-04 | Five focus areas | SATISFIED | about/page.tsx: array of 5 focus area t() calls rendered as list items |
| ABOUT-04 | 03-04 | Organisation registration/details visible | SATISFIED | about/page.tsx: registrationHeading + registrationLabel + registrationNumber = "PPM-003-10-20092002" |
| CONT-01 | 03-05 | Contact form with name, email, subject, message fields | SATISFIED | ContactForm.tsx: four labeled input/textarea fields |
| CONT-02 | 03-05 | Form submissions delivered to org email via Resend | SATISFIED (wiring) | actions.ts: resend.emails.send() to ORG_EMAIL; NEEDS HUMAN for live delivery confirmation |
| CONT-03 | 03-05 | WhatsApp deep link with pre-filled message | SATISFIED | contact/page.tsx constructs wa.me URL with encodeURIComponent message; structural test passes |
| CONT-04 | 03-05 | Organisation email address displayed | SATISFIED | contact/page.tsx: `mailto:${siteSettings.contactEmail}` link rendered conditionally |
| CONT-05 | 03-05 | Social media links displayed (Facebook, Instagram) | SATISFIED | contact/page.tsx: facebookUrl + instagramUrl from siteSettings; also in Footer |
| CONT-06 | 03-05 | Google Map embed showing Seputeh parliamentary area | SATISFIED | contact/page.tsx: static iframe with Seputeh KL coordinates and `title="Seputeh, Kuala Lumpur map"` |

All 15 declared requirements satisfied. No orphaned requirements detected.

Note: HOME-05 was claimed in plan 03-03 but the social links implementation lives in Footer.tsx (Phase 2). The contact page also renders social links. Both satisfy HOME-05.

---

## Anti-Patterns Found

No blocker or warning anti-patterns found in Phase 3 files.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/home/HeroSection.tsx` | 9 | `imageUrlBuilder` defined at module level (not inside function) | Info | Minor deviation from plan's recommendation; works correctly, no client bundle exposure risk since this is a Server Component |
| `src/app/[locale]/contact/actions.ts` | 8 | `z.string().email()` without message string | Info | Email error normalized at lines 38-43 via `fieldErrors.email?.map(() => 'email')`; translateError in ContactForm correctly maps 'email' key — functionally equivalent to plan spec |
| `messages/ms.json`, `messages/ta.json` | — | BM and Tamil translations are machine-generated | Warning | Per plan and project policy, these must be human-reviewed before launch; marked in 03-02-SUMMARY.md |

---

## Human Verification Required

### 1. Contact Form Live Email Delivery

**Test:** Visit `/en/contact`, fill in all fields with valid data, submit.
**Expected:** Inline success message ("Thank you, we'll be in touch.") replaces the form; email arrives in `ORG_EMAIL` inbox within 60 seconds.
**Why human:** Requires live `RESEND_API_KEY`, `RESEND_FROM`, and `ORG_EMAIL` environment variables; email delivery cannot be tested programmatically.

### 2. Contact Form Validation Errors

**Test:** Visit `/en/contact`, click "Send Message" without filling any fields.
**Expected:** Inline red error messages appear under each empty field ("This field is required." / "Please enter a valid email address.") without page reload.
**Why human:** Requires browser with React hydration and Server Action round-trip; useActionState behaviour cannot be verified by static analysis.

### 3. WhatsApp Deep Link on Mobile

**Test:** On a mobile device, visit any `/[locale]/contact` and tap the WhatsApp link.
**Expected:** WhatsApp opens with "Hi Seputeh HYO, I would like to enquire..." pre-filled.
**Why human:** Requires physical mobile device with WhatsApp installed; deep link behaviour is not testable in CI.

### 4. Hero Section Visual Check (All 3 Locales)

**Test:** Visit `/en/`, `/ms/`, `/ta/` in a browser.
**Expected:** Hero section visible above the fold with dark overlay, mission headline in the correct locale language, and two CTA buttons ("Join Us" / "Learn More" in locale language).
**Why human:** Visual above-the-fold rendering requires browser; Sanity heroImage requires a published document to test fully.

### 5. About Page Locale Switch

**Test:** Visit `/en/about`, `/ms/about`, and `/ta/about` in a browser.
**Expected:** All copy (title, founding date, mission, vision, focus areas, registration number) appears in the correct language. BM and Tamil translations should be reviewed for accuracy by a native speaker before launch.
**Why human:** BM and Tamil translations are machine-generated and require human quality review per project policy.

### 6. Google Map Embed Render

**Test:** Visit `/en/contact` and inspect the right column.
**Expected:** Google Maps iframe loads correctly showing the Seputeh, Kuala Lumpur area; no console errors related to the embed.
**Why human:** Requires browser network access to load the Google Maps embed URL.

### 7. Vercel Environment Variables

**Test:** Check Vercel project settings for the production environment.
**Expected:** `RESEND_API_KEY`, `RESEND_FROM`, and `ORG_EMAIL` are set. `RESEND_FROM` should use a verified sender domain (or `onboarding@resend.dev` for development).
**Why human:** Environment variable configuration is outside the codebase and cannot be verified programmatically.

---

## Summary

Phase 3 goal is **substantively achieved** in code. All 16 observable truths are verified at the artifact and wiring levels:

- Homepage: Full three-section page (hero, impact stats, programme highlights) with locale-aware content — replacing the Phase 2 stub. CTA links correctly to /membership.
- About Us: Single-file Server Component rendering all four ABOUT requirements (history, mission/vision, five focus areas, registration number) from next-intl translations.
- Contact Us: Three-file implementation (Server Action + Client Component + page) with Zod validation, Resend delivery wiring, WhatsApp wa.me link, displayed org email, social links, and Google Maps iframe.
- Foundation: siteSettings schema extended with heroImage/memberCount/programmesDelivered; GROQ queries updated; cdn.sanity.io in remotePatterns; all 3 locale message files have complete home/about/contact namespaces.
- Test suite: 199 tests pass (28 page structural tests + 171 i18n/schema tests); zero failures.

The 7 human verification items are all runtime/live concerns (email delivery, WhatsApp deep link, visual rendering, BM/Tamil translation quality, Vercel env vars) — none represent missing code. The BM and Tamil translations should be reviewed by a native speaker before the site goes public.

---

_Verified: 2026-03-17_
_Verifier: Claude (gsd-verifier)_
