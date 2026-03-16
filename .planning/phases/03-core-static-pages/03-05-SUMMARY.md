---
phase: 03-core-static-pages
plan: "05"
subsystem: contact-page
tags: [contact, server-action, resend, zod, useActionState, maps, whatsapp]
dependency_graph:
  requires:
    - 03-01  # translations/i18n (contact namespace)
    - 03-02  # siteSettings schema + queries
  provides:
    - contact-page
    - contact-server-action
  affects:
    - src/app/[locale]/contact/
tech_stack:
  added:
    - resend@^4.8.0 (email delivery via Server Action)
    - zod (form validation in Server Action)
  patterns:
    - Next.js 15 Server Actions with useActionState (React 19)
    - 'use server' file-level directive
    - 'use client' component with useActionState from react
    - Resend instantiated inside function body (not module level)
    - Zod error key normalisation for translateError in client component
key_files:
  created:
    - src/app/[locale]/contact/actions.ts
    - src/app/[locale]/contact/ContactForm.tsx
    - src/app/[locale]/contact/page.tsx
  modified: []
decisions:
  - Zod email schema uses z.string().email() (no custom message) — error mapped to 'email' key post-parse to satisfy test assertion and maintain translateError pattern
  - Resend instantiated inside sendContactForm body — prevents API key leaking to client bundle
  - Email validation errors normalised (mapped to 'email') after safeParse so translateError in ContactForm resolves t('errorEmail') correctly
  - Google Maps iframe uses referrerPolicy no-referrer-when-downgrade and loading=lazy per WCAG and performance best practice
  - Social links, WhatsApp, and email sections all conditionally rendered — graceful null handling when siteSettings returns null on first deploy
metrics:
  duration: 8min
  completed_date: "2026-03-16"
  tasks_completed: 2
  files_created: 3
  files_modified: 0
---

# Phase 3 Plan 05: Contact Us Page Summary

**One-liner:** Contact page with Resend Server Action (Zod + useActionState), WhatsApp wa.me link, org email, social links, and Google Maps iframe for Seputeh constituency.

## What Was Built

Three files implementing the full Contact Us feature:

1. **`src/app/[locale]/contact/actions.ts`** — Server Action (`'use server'`) with Zod schema validating name/email/subject/message; calls `resend.emails.send()` on valid data; returns `ContactFormState` with either `success: true` or field-level error keys.

2. **`src/app/[locale]/contact/ContactForm.tsx`** — Client Component (`'use client'`) using `useActionState(sendContactForm, initialState)` from `react` (React 19 pattern). Shows inline field errors under each input via `aria-describedby`. Replaces form with green success message on `state.success`.

3. **`src/app/[locale]/contact/page.tsx`** — Async Server Component. Calls `getSiteSettings()` and `getTranslations('contact')` in parallel. Renders `ContactForm`, WhatsApp `wa.me` deep link, `mailto:` org email, Facebook/Instagram links, and Google Maps iframe (Seputeh, KL).

## Verification Results

- `npx vitest run tests/pages/contact.test.ts` — 9/9 tests GREEN
- `npx vitest run` — 224/224 tests GREEN (no regression)
- `npx tsc --noEmit` — exits 0

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] z.string().email('email') would fail test assertion**

- **Found during:** Task 1
- **Issue:** The plan specifies `z.string().email('email')` but the test asserts `content.toContain('z.string().email()')` (no argument). Using the custom message form would fail the test.
- **Fix:** Used `z.string().email()` (no argument) and normalised email field errors to the short key `'email'` after `safeParse` in the Server Action body.
- **Files modified:** `src/app/[locale]/contact/actions.ts`
- **Commit:** b1b1dd9

## Post-Deployment Manual Verification Required

Contact form email delivery requires `RESEND_API_KEY`, `RESEND_FROM`, and `ORG_EMAIL` environment variables:

1. Visit `/en/contact` — confirm form renders without errors
2. Submit empty form — confirm inline field-level validation errors appear
3. Submit valid data — confirm inline success message replaces form
4. With env vars set: confirm email arrives in org inbox within 60s
5. Mobile: tap WhatsApp link — confirm WhatsApp opens with pre-filled message
6. Confirm Google Map renders without console errors

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/app/[locale]/contact/actions.ts | FOUND |
| src/app/[locale]/contact/ContactForm.tsx | FOUND |
| src/app/[locale]/contact/page.tsx | FOUND |
| Commit b1b1dd9 (actions.ts) | FOUND |
| Commit ccf7377 (ContactForm + page) | FOUND |
