---
phase: "02"
phase_name: Shared UI Foundation
created: "2026-03-13"
---

# Phase 02: Shared UI Foundation — Design Context

Decisions captured from user discussion. Downstream researcher and planner must treat these as locked choices — do not re-ask or override.

---

## Brand Colours & Visual Identity

**Decisions:**
- **Primary colour:** `#32a852` (medium green)
- **Accent colour:** Saffron/orange — Claude selects a complementary tone that:
  - Contrasts well against white backgrounds
  - Works alongside `#32a852` without clashing
  - Meets WCAG 4.5:1 contrast for text on white
  - Suggested starting point: `#E8820C` (warm saffron orange)
- **Overall feel:** Clean & light — white/light grey page backgrounds; green used for nav, buttons, active states, and accents; saffron reserved for CTAs and highlights
- **No dark mode required** for v1

**Tokens to define (Tailwind CSS v4 `@theme` block):**
- `--color-brand-green: #32a852`
- `--color-brand-saffron: [chosen saffron]`
- `--color-brand-green-dark: [10% darkened for hover states]`
- Typography scale: base 16px, line-height 1.5 default, 1.7 for Tamil (`html[lang="ta"]`)

---

## Navigation

**Desktop layout:**
- Logo left, nav links right, language switcher rightmost
- Nav background: solid white at all times (no transparency effect)
- Sticky — stays at top of viewport on scroll
- Bottom border or subtle shadow to separate from page content

**Active link indicator:** Green underline / `border-bottom` using `--color-brand-green`

**Mobile layout:**
- Hamburger icon (`≡`) on the right of the nav bar
- Opens a right-side slide-in drawer with full link list
- Drawer shows all 7 nav links + language switcher (inline pills) at the bottom
- Close button (`×`) visible in the open drawer

**Nav links (7 items from `messages/en.json`):**
home, about, programmes, team, documents, contact, membership

---

## Language Switcher

**Pattern:** Inline pills — 3 always-visible clickable labels
- Labels: `English` | `Bahasa Malaysia` | `தமிழ்`
- Active locale: green-highlighted pill (background or underline)
- Inactive locales: muted text, clickable

**Desktop placement:** Rightmost item in the sticky nav bar

**Mobile placement:** Inside the hamburger drawer, below the nav links — same inline pill layout

**Behaviour:** Navigates to the same page in the new locale (`/en/ → /ms/ → /ta/`) — uses next-intl's `usePathname` + `Link` pattern, not state toggling (satisfies I18N-05)

---

## Footer

**Desktop layout:** 3-column grid
- **Column 1 (left):** Logo + org name "Seputeh HYO" + "Est. 2002" + Privacy Policy link
- **Column 2 (centre):** Quick Links — all 7 nav link items
- **Column 3 (right):** Contact — email address, WhatsApp link, social media icon row (Facebook, Instagram)

**Mobile layout:** Single column, stacked — Col 1 → Col 3 → Col 2 order (contact info before nav links on small screens)

**Footer background:** Dark charcoal (`#1a1a1a` or Tailwind `zinc-900`) with white/light text

**Bottom bar:** Copyright line — `© [year] Seputeh HYO. All rights reserved.`

---

## Code Context

**Existing codebase assets:**
- `src/app/[locale]/layout.tsx` — locale layout shell (has `html lang={locale}`, `body`, `NextIntlClientProvider`); header/footer/nav go inside `body` wrapping `{children}`
- `src/middleware.ts` — next-intl middleware with matcher excluding `/api`, `/_next`, `/_vercel`, `/studio`, static files
- `src/components/ui/button.tsx` — shadcn Button already installed
- `src/lib/utils.ts` — `cn()` helper available
- `messages/en.json` — 7 nav keys populated; BM and Tamil message files exist but are empty/stub
- No existing `Header`, `Footer`, or `Nav` components — build fresh
- Tailwind CSS v4 — no `tailwind.config.ts`; brand tokens go in `src/app/globals.css` inside `@theme {}` block

**Patterns established in Phase 1:**
- `localizedString` schema pattern (Sanity: `{en, ms, ta}` object fields)
- Root layout (`src/app/layout.tsx`) is a minimal pass-through; locale layout owns `html`/`body`
- ISR revalidation via `src/app/api/revalidate/route.ts`

---

## Deferred Ideas

*(Captured but out of scope for Phase 2 — note for future phases)*
- None raised during discussion
