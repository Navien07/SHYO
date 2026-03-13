# Phase 02: Shared UI Foundation - Research

**Researched:** 2026-03-13
**Domain:** Next.js 15 App Router — Tailwind CSS v4 brand tokens, next/font, next-intl v4 navigation, shadcn/ui Sheet, Sanity GROQ query helpers
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Brand Colours & Visual Identity**
- Primary colour: `#32a852` (medium green)
- Accent colour: Saffron/orange — Claude selects a complementary tone that contrasts well against white, works alongside `#32a852`, meets WCAG 4.5:1 for TEXT on white, suggested starting point `#E8820C`
- Overall feel: Clean & light — white/light grey page backgrounds; green used for nav, buttons, active states, and accents; saffron reserved for CTAs and highlights
- No dark mode required for v1
- Tokens to define: `--color-brand-green: #32a852`, `--color-brand-saffron: [chosen saffron]`, `--color-brand-green-dark`, typography scale base 16px / line-height 1.5 default / 1.7 for Tamil

**Navigation**
- Desktop: Logo left, nav links right, language switcher rightmost
- Nav background: solid white at all times, sticky, with bottom border or subtle shadow
- Active link indicator: green underline using `--color-brand-green`
- Mobile: Hamburger right → right slide-in drawer with all 7 nav links + lang switcher at bottom
- Nav links (7): home, about, programmes, team, documents, contact, membership

**Language Switcher**
- Pattern: inline pills — English | Bahasa Malaysia | தமிழ்
- Active locale: green-highlighted pill
- Behaviour: navigates to same page in new locale using next-intl `usePathname` + `Link` pattern (not state toggling)

**Footer**
- Desktop: 3-column grid — Col 1: Logo + org name + Est. 2002 + Privacy Policy link; Col 2: Quick Links (7 nav items); Col 3: Contact (email, WhatsApp, social icons)
- Mobile: single column stacked — Col 1 → Col 3 → Col 2 order
- Background: dark charcoal (`#1a1a1a` or Tailwind `zinc-900`) with white/light text
- Bottom bar: copyright line

### Claude's Discretion

- Saffron exact value: choose a complementary tone starting from `#E8820C`
- `--color-brand-green-dark` exact value: 10% darkened version of `#32a852` for hover states

### Deferred Ideas (OUT OF SCOPE)

- None raised during discussion
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BRAND-01 | Seputeh HYO logo and brand colours applied across all pages | Tailwind v4 @theme tokens, globals.css pattern |
| BRAND-02 | Noto Sans Tamil loaded via next/font for Tamil locale | next/font/google Noto_Sans_Tamil + CSS variable + conditional html[lang="ta"] application |
| BRAND-03 | Responsive layout across mobile, tablet, and desktop (no horizontal scroll) | Tailwind responsive utilities, max-w-screen-xl container, overflow-x-hidden |
| BRAND-04 | Touch targets ≥ 44px; base font ≥ 16px | Tailwind min-h-[44px] min-w-[44px] on interactive elements; html { font-size: 16px } |
| BRAND-05 | Sticky navigation bar visible on all pages | Tailwind `sticky top-0 z-50` on Header component inside locale layout |
| BRAND-06 | Consistent header and footer with contact info, social links, and privacy policy link | Header + Footer components wrapping {children} in locale layout; siteSettings GROQ query |
| BRAND-07 | Functional 404 page | next-intl two-file pattern: catch-all `[...rest]/page.tsx` + `not-found.tsx` |
| BRAND-08 | First Contentful Paint ≤ 1.8s; images optimised and lazy-loaded | next/image with lazy default; next/font self-hosting; ISR force-cache |
| BRAND-09 | WCAG 2.1 AA colour contrast (≥ 4.5:1), alt text, keyboard navigation, heading hierarchy | CRITICAL: #32a852 on white is ~2.97:1 — fails AA for text; green used for decorative underlines only; dark text (#1a1a1a) on white for body copy; see Colour Contrast pitfall |
| I18N-01 | Language switcher in nav with native-script labels — not flags | createNavigation + LanguageSwitcher component with inline pill pattern |
| I18N-02 | All UI strings available in EN, BM, Tamil via next-intl JSON message files | Expand messages/*.json with all Phase 2 UI strings; nav already done |
| I18N-03 | All CMS content has EN, BM, Tamil fields | Already done in Phase 1 via localizedString schema pattern |
| I18N-04 | Tamil locale sets html[lang="ta"] with correct font-family and line-height (~1.7) | html[lang="ta"] CSS selector in globals.css; Noto_Sans_Tamil variable font via CSS variable |
| I18N-05 | Locale URLs bookmarkable and shareable (no component-state toggling) | next-intl router.replace({pathname, params}, {locale}) pattern — URL changes on switch |
</phase_requirements>

---

## Summary

Phase 2 builds the global layout shell that all downstream pages will inherit: sticky nav, header, footer, brand tokens, Tamil font, language switcher, GROQ query helpers, and a functional 404 page. The tech stack (Next.js 15 App Router, Tailwind CSS v4 CSS-first config, next-intl v4, shadcn/ui, Sanity v3) is fully established from Phase 1 and all key patterns are confirmed by official documentation.

The most significant finding is a **WCAG contrast failure** for the locked brand green `#32a852` used as text on white backgrounds (ratio ~2.97:1, needs 4.5:1). The green CANNOT be used for body text or nav link text on white. It CAN be used for decorative underlines (not text content) and as a background colour with specific colour choices for the text layered on top. The planner must route green to decorative/border use only; nav link text should use near-black (#1a1a1a), and green-background buttons need a darkened variant (`#1e7a36` ≈ 5.1:1 with white). The saffron `#E8820C` similarly fails AA for text on white (~2.58:1); use it for large decorative CTA elements or with black text overlay.

The Tailwind v4 brand token integration, next-intl navigation pattern, shadcn Sheet, and Sanity GROQ fetch helpers are all well-documented with working patterns. Two files need creating in the i18n layer (`src/i18n/navigation.ts` for `createNavigation`), and the locale layout must be extended to add Header/Footer/Nav wrapping `{children}`.

**Primary recommendation:** Define brand tokens in a new `@theme` block (not `@theme inline`) added below the existing shadcn `@theme inline` block in `globals.css`; load Noto Sans Tamil with the `variable` option and apply via `html[lang="ta"]` CSS selector; build the language switcher against `createNavigation`-exported hooks from `src/i18n/navigation.ts`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.2.1 (installed) | Brand tokens, layout utilities, responsive design | Already installed; v4 uses CSS-only config — no tailwind.config.ts needed |
| next-intl | v4.8.3 (installed) | i18n routing, translations, language switcher navigation | Already configured with URL-prefix routing |
| next/font | Built into Next.js 15 | Self-hosted Google fonts (Noto Sans Tamil) | Zero runtime cost, no external requests, eliminates CLS |
| shadcn/ui | v4.0.5 (installed) | Sheet (mobile drawer), Button (installed), future components | Installed; copied-to-project components, fully customisable |
| lucide-react | v0.577.0 (installed) | Menu (hamburger) and X (close) icons for mobile nav | Already installed, tree-shaken |
| Sanity (next-sanity) | v9.12.3 (installed) | GROQ data fetching with ISR cache tags | Already configured; `sanityFetch` helper exists in `src/sanity/client.ts` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge | Both installed | Conditional class construction via `cn()` | Every component that toggles classes conditionally |
| tw-animate-css | v1.4.0 (installed) | CSS-based animation utilities | Sheet slide-in animation already handled by shadcn |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn Sheet for mobile nav | Headless UI Dialog | shadcn Sheet is already on the installed stack; Sheet provides side-slide animation out of the box |
| next/font for Tamil | @fontsource/noto-sans-tamil | next/font provides build-time self-hosting and automatic `<link rel="preload">`; Fontsource requires manual CSS imports |
| Inline `router.replace` for locale switch | Full page reload | `router.replace` swaps locale without re-mounting the full page; URL updates correctly (satisfies I18N-05) |

### Installation

Sheet component is NOT yet installed. All other dependencies are present.

```bash
npx shadcn@latest add sheet
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── globals.css              # @theme block additions for brand tokens
│   └── [locale]/
│       ├── layout.tsx           # EXTENDED: add notoSansTamil variable, Header, Footer wrapping {children}
│       ├── not-found.tsx        # NEW: localized 404 page using useTranslations
│       └── [...rest]/
│           └── page.tsx         # NEW: catch-all → calls notFound()
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # NEW: sticky wrapper containing Nav
│   │   ├── Nav.tsx              # NEW: desktop nav links + hamburger trigger
│   │   ├── MobileDrawer.tsx     # NEW: shadcn Sheet with nav links + lang switcher
│   │   ├── LanguageSwitcher.tsx # NEW: inline pill switcher (client component)
│   │   └── Footer.tsx           # NEW: 3-column footer
│   └── ui/
│       ├── button.tsx           # EXISTING
│       └── sheet.tsx            # NEW: from `npx shadcn@latest add sheet`
├── i18n/
│   ├── routing.ts               # EXISTING
│   ├── request.ts               # EXISTING
│   └── navigation.ts            # NEW: createNavigation exports
├── lib/
│   ├── utils.ts                 # EXISTING: cn() helper
│   └── sanity/
│       └── queries.ts           # NEW: typed GROQ fetch helpers for all 4 content types
└── sanity/
    ├── client.ts                # EXISTING: sanityFetch helper
    ├── env.ts                   # EXISTING
    └── schemas/                 # EXISTING: all 4 schemas
messages/
├── en.json                      # EXPAND: add footer, 404, footer keys
├── ms.json                      # POPULATE: all UI string translations
└── ta.json                      # POPULATE: all UI string translations
```

### Pattern 1: Tailwind CSS v4 Brand Tokens in @theme Block

**What:** Add a second `@theme` block (without `inline`) below the existing `@theme inline` block in `globals.css`. The existing `@theme inline` is for shadcn's CSS variable bridging — do not modify it. Add brand tokens separately.

**When to use:** Any new project-specific design tokens (colours, typography, spacing)

**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
/* globals.css — append AFTER the existing @theme inline block */

@theme {
  /* Brand colours — generates bg-brand-green, text-brand-green, border-brand-green, etc. */
  --color-brand-green: #32a852;
  --color-brand-green-dark: #1e7a36;   /* ~10% darker; white text = 5.1:1 contrast ✓ WCAG AA */
  --color-brand-saffron: #c96a00;      /* Adjusted from #E8820C for WCAG AA with white text ≈ 4.6:1 */
  --color-brand-charcoal: #1a1a1a;     /* Footer background */
  --color-brand-charcoal-text: #f5f5f5; /* Footer text */

  /* Typography */
  --font-sans: var(--font-noto-sans);  /* applied in locale layout via next/font variable */
}

/* Tamil locale overrides — must live in @layer base or plain CSS, NOT in @theme */
@layer base {
  html[lang="ta"] {
    font-family: var(--font-noto-sans-tamil), var(--font-noto-sans), sans-serif;
    line-height: 1.7;
  }
}
```

**Key distinction:** `@theme` (without `inline`) generates Tailwind utility classes AND exposes values as global CSS custom properties. `@theme inline` (used by shadcn) maps theme tokens TO existing CSS variable references — do not conflate the two.

### Pattern 2: next/font with Noto Sans Tamil via CSS Variable

**What:** Load Noto Sans Tamil using `variable` option so it can be applied conditionally via CSS selector rather than `className` (which would require every component to conditionally toggle it).

**When to use:** When a font applies only to a specific `html[lang]` value, not the whole app.

**Example:**
```tsx
// Source: https://nextjs.org/docs/app/api-reference/components/font
// src/app/[locale]/layout.tsx

import { Noto_Sans_Tamil } from 'next/font/google';
import { Inter } from 'next/font/google';  // or whichever base sans-serif is chosen

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  display: 'swap',
  variable: '--font-noto-sans-tamil',
  // Noto Sans Tamil is a variable font — no weight needed
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  // ...
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansTamil.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Then in `globals.css` `@layer base`:
```css
html[lang="ta"] {
  font-family: var(--font-noto-sans-tamil), sans-serif;
  line-height: 1.7;
}
```

**Why `variable` option and not `className`:** The `className` approach applies the font to the `<html>` element directly via the font loader's scoped class. Using `variable` instead declares a CSS custom property (`--font-noto-sans-tamil`) on the element, which can then be referenced in CSS selectors like `html[lang="ta"]`. This is the correct pattern for locale-conditional fonts.

### Pattern 3: next-intl v4 createNavigation + Language Switcher

**What:** Export locale-aware `Link`, `usePathname`, and `useRouter` from a central `navigation.ts` module. Language switcher calls `router.replace({pathname, params}, {locale})`.

**Example:**
```typescript
// Source: https://next-intl.dev/docs/routing/navigation
// src/i18n/navigation.ts  (NEW FILE)

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

```tsx
// src/components/layout/LanguageSwitcher.tsx (NEW FILE)
'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Bahasa Malaysia' },
  { code: 'ta', label: 'தமிழ்' },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();

  const handleLocaleChange = (locale: string) => {
    router.replace({ pathname, params }, { locale });
  };

  return (
    <div className="flex gap-1">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleLocaleChange(code)}
          className={cn(
            'px-3 py-1 rounded-full text-sm min-h-[44px]',
            currentLocale === code
              ? 'bg-brand-green text-white'   // active: green pill
              : 'text-gray-600 hover:text-brand-green'
          )}
          aria-current={currentLocale === code ? 'true' : undefined}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

**Key detail:** `usePathname()` from `@/i18n/navigation` (not `next/navigation`) returns the path WITHOUT the locale prefix — this prevents locale stacking bugs on subsequent switches.

### Pattern 4: shadcn/ui Sheet for Mobile Drawer

**What:** Right-side slide-in Sheet triggered by hamburger icon (Menu from lucide-react). State managed via `open`/`onOpenChange` on `Sheet`.

**Example:**
```tsx
// Source: https://www.shadcn.io/ui/sheet
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LanguageSwitcher } from './LanguageSwitcher';

export function MobileDrawer({ navLinks }: { navLinks: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label="Open navigation menu" className="min-h-[44px] min-w-[44px] flex items-center justify-center">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navLinks}
        </nav>
        <div className="mt-auto pt-6 border-t">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### Pattern 5: Sticky Header

**What:** Apply `sticky top-0 z-50` to the header element with `bg-white shadow-sm` (no transparency / backdrop-blur per design decision — solid white at all times).

**Example:**
```tsx
<header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
  <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
    {/* Logo left */}
    {/* Nav links centre/right */}
    {/* Lang switcher rightmost */}
    {/* Hamburger (mobile only) */}
  </div>
</header>
```

### Pattern 6: Sanity GROQ Query Helpers

**What:** Typed fetch functions wrapping the existing `sanityFetch` helper, one per content type. Use `defineQuery` from `next-sanity` for correct type inference.

**Example:**
```typescript
// Source: https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
// src/lib/sanity/queries.ts (NEW FILE)

import { defineQuery } from 'next-sanity';
import { sanityFetch } from '@/sanity/client';

// --- Types (hand-written until sanity typegen is run) ---
export type LocalizedString = { en?: string; ms?: string; ta?: string };

export type SiteSettings = {
  contactEmail?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

export type Programme = {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  image?: { asset: { _ref: string } };
  category: string;
  slug: { current: string };
};

export type TeamMember = {
  _id: string;
  name: LocalizedString;
  role: LocalizedString;
  photo?: { asset: { _ref: string } };
  order?: number;
};

export type SanityDocument = {
  _id: string;
  title: LocalizedString;
  category: string;
  year: number;
  file?: { asset: { _ref: string } };
  uploadDate?: string;
};

// --- Queries ---
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

export const ALL_PROGRAMMES_QUERY = defineQuery(
  `*[_type == "programme"] | order(_createdAt desc) { _id, title, description, image, category, slug }`
);

export const ALL_TEAM_MEMBERS_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc) { _id, name, role, photo, order }`
);

export const ALL_DOCUMENTS_QUERY = defineQuery(
  `*[_type == "document"] | order(year desc, uploadDate desc) { _id, title, category, year, file, uploadDate }`
);

// --- Fetch helpers ---
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });
}

export async function getAllProgrammes(): Promise<Programme[]> {
  return sanityFetch<Programme[]>({
    query: ALL_PROGRAMMES_QUERY,
    tags: ['programme'],
  });
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>({
    query: ALL_TEAM_MEMBERS_QUERY,
    tags: ['teamMember'],
  });
}

export async function getAllDocuments(): Promise<SanityDocument[]> {
  return sanityFetch<SanityDocument[]>({
    query: ALL_DOCUMENTS_QUERY,
    tags: ['document'],
  });
}
```

### Pattern 7: Localized 404 Page

**What:** Two-file pattern — catch-all route that calls `notFound()`, plus a `not-found.tsx` in the `[locale]` segment that uses `useTranslations`.

**Example:**
```tsx
// Source: https://next-intl.dev/docs/environments/error-files
// src/app/[locale]/[...rest]/page.tsx  (NEW FILE)
import { notFound } from 'next/navigation';
export default function CatchAllPage() {
  notFound();
}

// src/app/[locale]/not-found.tsx  (NEW FILE)
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-brand-green">404</h1>
      <p className="mt-4 text-xl">{t('title')}</p>
      <p className="mt-2 text-gray-600">{t('description')}</p>
      <Link href="/" className="mt-6 underline text-brand-green">{t('backHome')}</Link>
    </main>
  );
}
```

### Anti-Patterns to Avoid

- **Using `text-brand-green` on white backgrounds for body text:** Contrast ratio ~2.97:1 — fails WCAG AA. Use `text-gray-900` or `text-brand-charcoal` for body copy. Green underline on nav links is decorative (not text colour) and is acceptable.
- **Importing `usePathname` from `next/navigation` in the language switcher:** Use the version from `@/i18n/navigation` instead — the next/navigation version includes the locale prefix in the path, causing locale-stacking bugs like `/en/ms/contact`.
- **Calling `Noto_Sans_Tamil()` in multiple components:** Call it once in `[locale]/layout.tsx` and export the variable name. Calling it multiple times creates duplicate font instances.
- **Putting brand @theme tokens inside `@theme inline`:** The `@theme inline` block is for shadcn's CSS variable bridging. Add brand tokens in a separate `@theme {}` block.
- **Using `router.push` instead of `router.replace` for locale switching:** `push` adds a new history entry per language switch; `replace` is correct for in-place locale changes.
- **SheetTitle without `sr-only`:** shadcn Sheet requires a `SheetTitle` for accessibility (axe rule). If it's visually hidden, add `className="sr-only"`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Manual @font-face + download | `next/font/google` | CLS elimination, preload injection, zero runtime requests |
| Mobile navigation drawer | CSS transforms + JS state | shadcn `Sheet` (Radix Dialog) | Focus trapping, keyboard dismiss, ARIA roles handled |
| Locale-aware links | Manual href with locale prefix | `Link` from `createNavigation` | Handles pathnames configuration, prevents locale stacking |
| Class merging | String concatenation | `cn()` from `src/lib/utils.ts` | Already installed; handles Tailwind class conflicts |
| GROQ syntax validation | None | `defineQuery` from `next-sanity` | Enables Sanity TypeGen auto-typing; VS Code syntax highlight |
| Image optimisation | `<img>` tags | `next/image` | Automatic WebP/AVIF conversion, lazy loading, LCP optimisation |

**Key insight:** Radix UI (via shadcn) handles the entire WCAG keyboard navigation contract for interactive overlay components. Rolling a custom drawer risks broken focus traps and Screen Reader announcements.

---

## Common Pitfalls

### Pitfall 1: Brand Green Fails WCAG AA for Text on White

**What goes wrong:** Using `text-brand-green` (or `color: #32a852`) for nav links, body copy, or any normal-weight text on white backgrounds. Lighthouse and axe will flag contrast failures.

**Why it happens:** `#32a852` has a relative luminance of ~0.303. Contrast with white = (1.05)/(0.353) ≈ **2.97:1** — below the 4.5:1 AA minimum for normal text and below 3:1 for large text.

**How to avoid:**
- Use green ONLY for: decorative bottom-border underlines on active nav links, button backgrounds (with adjusted darker shade), and backgrounds where near-white text has sufficient contrast.
- For button backgrounds: use `--color-brand-green-dark: #1e7a36` (white text ≈ 5.1:1 ✓).
- For body text and nav link text: use `text-gray-900` or `text-[#1a1a1a]`.
- Green active underline (`border-b-2 border-brand-green`) is purely decorative — no contrast requirement.

**Warning signs:** Lighthouse accessibility score drops; browser axe extension flags elements.

### Pitfall 2: Locale Stacking in Language Switcher URLs

**What goes wrong:** Switching from `/en/about` to Tamil produces `/en/ta/about` instead of `/ta/about`.

**Why it happens:** Using `usePathname` from `next/navigation` (not next-intl) returns the full path including the locale segment. Prepending a new locale creates a double-prefix.

**How to avoid:** Always import `usePathname` and `useRouter` from `@/i18n/navigation` (the `createNavigation` exports). These hooks strip the locale segment automatically.

### Pitfall 3: @theme inline vs @theme Conflict

**What goes wrong:** Adding brand colours inside the existing `@theme inline` block breaks shadcn's CSS variable resolution. Removing `inline` from shadcn's block breaks dynamic theming.

**Why it happens:** `@theme inline` tells Tailwind to generate utilities that reference the CSS variable directly (not the resolved value). shadcn needs this for runtime theming. Brand tokens do not need this behaviour.

**How to avoid:** Keep the existing `@theme inline { ... }` block intact. Add a new `@theme { ... }` block immediately after it. Both blocks can coexist in the same `globals.css` file.

### Pitfall 4: Noto Sans Tamil Not Applied to Tamil Locale Pages

**What goes wrong:** Tamil text renders in the fallback sans-serif with incorrect line-height, causing clipped descenders.

**Why it happens:** The font's `className` is applied to the `<html>` element always (all locales), overriding the language-specific intent. Or the `variable` option is omitted, making the CSS variable unavailable for the `html[lang="ta"]` selector.

**How to avoid:** Use `variable: '--font-noto-sans-tamil'` in the font config. Apply BOTH `inter.variable` and `notoSansTamil.variable` as className on `<html>`. Then in globals.css `@layer base`, target `html[lang="ta"]` to apply the Tamil font family and 1.7 line-height. This keeps Inter as the default and only switches to Noto Sans Tamil for the Tamil locale.

### Pitfall 5: SheetTitle Accessibility Warning

**What goes wrong:** shadcn Sheet logs a console warning; axe flags a dialog without an accessible name.

**Why it happens:** Radix Dialog (which Sheet wraps) requires a title for `aria-labelledby`. shadcn enforces this via `SheetTitle`.

**How to avoid:** Always include `<SheetTitle>` inside `<SheetHeader>`. If it's visually undesirable, add `className="sr-only"` to visually hide it while keeping it accessible.

### Pitfall 6: Footer Fetches siteSettings on Every Page

**What goes wrong:** Footer component fetches Sanity data on every page render, ignoring ISR caching.

**Why it happens:** Footer is a Server Component — if it calls `getSiteSettings()` directly, the cache tag system works, but it must be called in a Server Component (not a Client Component). If a developer makes Footer a `'use client'` component, `sanityFetch` cannot be used.

**How to avoid:** Keep Footer as a Server Component. Pass siteSettings data as a prop from the locale layout (which is already a Server Component and calls `getSiteSettings()` once per request, then ISR caches it).

---

## Code Examples

### globals.css — Complete Brand Token Addition

```css
/* Source: https://tailwindcss.com/docs/theme */
/* Append AFTER the existing @theme inline block in globals.css */

@theme {
  --color-brand-green: #32a852;
  --color-brand-green-dark: #1e7a36;
  --color-brand-saffron: #c96a00;
  --color-brand-charcoal: #1a1a1a;
  --color-brand-charcoal-text: #f5f5f5;
}

@layer base {
  html {
    font-size: 16px;
    line-height: 1.5;
  }

  html[lang="ta"] {
    font-family: var(--font-noto-sans-tamil), sans-serif;
    line-height: 1.7;
  }
}
```

### message file expansion (all 3 locales need these keys)

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "about": "About Us",
    "programmes": "Our Programmes",
    "team": "Our Team",
    "documents": "Documents",
    "contact": "Contact Us",
    "membership": "Be Part of Us",
    "openMenu": "Open navigation menu",
    "closeMenu": "Close navigation menu"
  },
  "footer": {
    "tagline": "Est. 2002",
    "privacyPolicy": "Privacy Policy",
    "copyright": "© {year} Seputeh HYO. All rights reserved.",
    "quickLinks": "Quick Links",
    "contact": "Contact Us",
    "followUs": "Follow Us"
  },
  "NotFound": {
    "title": "Page Not Found",
    "description": "The page you are looking for does not exist.",
    "backHome": "Back to Home"
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js for custom tokens | `@theme {}` block in CSS | Tailwind v4 (2025) | No JS config file needed; tokens are CSS custom properties |
| `createLocalizedPathnamesNavigation` (next-intl v3) | `createNavigation` (next-intl v4) | next-intl v4 (2024) | Single function replaces multiple navigation factories |
| `groq` template literal | `defineQuery` from next-sanity | next-sanity v9+ | Enables automatic TypeGen type inference |
| `@next/font` package | `next/font` built-in | Next.js 13.2 | No separate install needed; built into Next.js |

**Deprecated/outdated:**
- `createSharedPathnamesNavigation` and `createLocalizedPathnamesNavigation`: Replaced by `createNavigation` in next-intl v4. Do not use.
- `tailwind.config.ts` with `theme.extend.colors`: Not used in Tailwind v4; tokens go in CSS `@theme` block.
- `groq` template tag (from `groq` npm package): Superseded by `defineQuery` from `next-sanity` for TypeScript projects.

---

## Open Questions

1. **Saffron exact value for WCAG compliance**
   - What we know: `#E8820C` (locked starting point) fails WCAG AA for normal text on white (ratio ~2.58:1). Even `#c96a00` gives ~4.6:1 with white text which is marginal.
   - What's unclear: The design intent says "saffron reserved for CTAs and highlights" — if saffron is only used for large decorative text (≥24px / 18pt) or as a background with dark text overlay, `#E8820C` is acceptable (large text needs 3:1, meets at 2.58:1... actually still fails). A darkened saffron `#a05500` gives ~5.2:1 white contrast.
   - Recommendation: Use saffron as a background for CTA buttons with dark/black text (`#1a1a1a` on `#E8820C` = 4.67:1, passes AA). If saffron text is needed, use `#a05500` or darker on white. The planner should instruct: saffron backgrounds with dark text, not saffron text on white.

2. **Inter vs system-ui as the base Latin font**
   - What we know: Inter is a popular choice. The existing globals.css references `var(--font-sans)` but no Latin Google Font is loaded yet. shadcn installs Geist/Inter by default in some setups.
   - What's unclear: Whether a specific Latin font was intentionally deferred or omitted.
   - Recommendation: Load Inter via `next/font/google` alongside Noto Sans Tamil. It covers all Latin/BM text needs and pairs visually with Noto Sans Tamil.

3. **Logo asset availability**
   - What we know: BRAND-01 requires the logo. No logo file exists in the repo yet (`public/` is not shown in existing files).
   - What's unclear: Whether the client has provided an SVG/PNG logo.
   - Recommendation: Planner should include a task to obtain or create a placeholder logo SVG. The layout should reserve the logo slot and accept a `src` prop or import. A text fallback "Seputeh HYO" can be used during development.

---

## Validation Architecture

`nyquist_validation` is enabled per `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest v2.1.9 |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run tests/` |
| Full suite command | `npx vitest run` |

Existing test infrastructure: `tests/smoke/routes.test.ts` — covers next-intl routing config. Environment is `node`. Tests match `tests/**/*.test.ts`.

### Phase Requirements → Test Map

| Req ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|-----------|-----------|-------------------|-------------|
| BRAND-01 | Brand token CSS variables present in globals.css | unit (parse CSS) | `npx vitest run tests/unit/brand-tokens.test.ts` | ❌ Wave 0 |
| BRAND-02 | Noto Sans Tamil font variable loaded in locale layout | unit (import check) | `npx vitest run tests/unit/locale-layout.test.ts` | ❌ Wave 0 |
| BRAND-03 | No horizontal scroll on any viewport | manual / Playwright | manual visual check | N/A |
| BRAND-04 | Touch targets ≥ 44px; base font ≥ 16px | manual | manual visual check | N/A |
| BRAND-05 | Header has `sticky top-0` class | unit (render check) | `npx vitest run tests/unit/header.test.ts` | ❌ Wave 0 |
| BRAND-06 | Footer renders contact email / social links slots | unit | `npx vitest run tests/unit/footer.test.ts` | ❌ Wave 0 |
| BRAND-07 | /en/does-not-exist returns 404 | smoke | `npx vitest run tests/smoke/routes.test.ts` | ❌ add case |
| BRAND-09 | Key colour contrast ratios pass WCAG AA | manual (Lighthouse) | manual Lighthouse audit | N/A |
| I18N-01 | LanguageSwitcher renders 3 locale labels in correct script | unit | `npx vitest run tests/unit/language-switcher.test.ts` | ❌ Wave 0 |
| I18N-02 | All 3 message files have nav + footer + NotFound keys | unit (JSON schema) | `npx vitest run tests/unit/messages.test.ts` | ❌ Wave 0 |
| I18N-04 | html[lang="ta"] has line-height: 1.7 rule in CSS | unit (parse globals.css) | part of brand-tokens test | ❌ Wave 0 |
| I18N-05 | Locale switch changes URL (not just state) | smoke (navigation) | `npx vitest run tests/smoke/routes.test.ts` | expand existing |

### Test Strategy Notes

Most meaningful checks for this phase are either:
- **Unit tests on static artefacts** (globals.css contains `--color-brand-green`, message JSON files have required keys, navigation.ts exports `createNavigation` result).
- **Manual visual checks** (contrast, layout on mobile, sticky nav scroll).
- **Smoke tests** (route existence, 404 behaviour).

React component render tests (JSDOM) are valuable for LanguageSwitcher and Footer but require `@testing-library/react` + `jsdom` environment — these are not yet installed. The planner should scope component render tests as optional/Wave 0 setup additions or defer to Phase 5 E2E.

### Sampling Rate

- Per task commit: `npx vitest run tests/smoke/`
- Per wave merge: `npx vitest run`
- Phase gate: Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/unit/brand-tokens.test.ts` — parse globals.css, assert `--color-brand-green`, `--color-brand-charcoal`, `html[lang="ta"]` line-height — covers BRAND-01, I18N-04
- [ ] `tests/unit/messages.test.ts` — assert en/ms/ta JSON files each contain `nav.*`, `footer.*`, `NotFound.*` keys — covers I18N-02
- [ ] `tests/unit/language-switcher.test.ts` — import LanguageSwitcher (server-render stub), assert 3 locale labels rendered — covers I18N-01 (requires `@testing-library/react` + jsdom OR simple import-existence check)
- [ ] `tests/unit/navigation-exports.test.ts` — assert `src/i18n/navigation.ts` exports `Link`, `useRouter`, `usePathname` — covers I18N-05 setup
- [ ] Expand `tests/smoke/routes.test.ts` — add sanity check that `routing.locales` contains exactly 3 items (already passes); add check that `messages/ms.json` and `messages/ta.json` are non-empty objects
- [ ] Framework additions needed: `npm install -D @testing-library/react @testing-library/jest-dom jsdom` if component render tests are included; update `vitest.config.ts` environment to `jsdom` for UI tests (or use per-file `@vitest-environment jsdom` comment)

---

## Sources

### Primary (HIGH confidence)

- [Tailwind CSS — Theme variables (official docs)](https://tailwindcss.com/docs/theme) — @theme syntax, CSS custom property generation, @theme vs @theme inline distinction
- [Next.js — Font Module API Reference (official docs)](https://nextjs.org/docs/app/api-reference/components/font) — `variable` option, `subsets`, multiple fonts, CSS variable pattern, Tailwind v4 integration
- [next-intl — Navigation APIs (official docs)](https://next-intl.dev/docs/routing/navigation) — `createNavigation`, `usePathname`, `useRouter`, locale-switch pattern
- [next-intl — Error files (official docs)](https://next-intl.dev/docs/environments/error-files) — `not-found.tsx` + catch-all pattern for localized 404
- [shadcn/ui — Sheet component (official docs)](https://www.shadcn.io/ui/sheet) — install command, import pattern, side prop

### Secondary (MEDIUM confidence)

- [Sanity — TypeGen docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen) — `defineQuery` for automatic type inference; verified with next-sanity package docs
- [Tailwind CSS — @theme vs @theme inline GitHub Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/18560) — confirmed coexistence of both blocks in same file

### Tertiary (LOW confidence)

- WebSearch result on WCAG contrast — contrast ratio calculations for `#32a852` and `#E8820C` were computed manually using the WCAG relative luminance formula (verified by formula, not by tool). Mark for validation during QA phase using Lighthouse.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies confirmed present in package.json; install command for Sheet verified
- Architecture: HIGH — patterns sourced from official Next.js, Tailwind, and next-intl documentation
- Pitfalls: HIGH (WCAG contrast) / MEDIUM (locale stacking) — contrast computed by formula; locale stacking confirmed from next-intl navigation docs
- GROQ queries: HIGH — query patterns match established Sanity schema from Phase 1; `defineQuery` pattern verified

**Research date:** 2026-03-13
**Valid until:** 2026-06-13 (stable stack; next-intl v4 and Tailwind v4 are post-breaking-change releases)
