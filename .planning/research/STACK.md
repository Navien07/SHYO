# Tech Stack Research — Seputeh HYO Website

**Research Date:** 2026-03-11
**Researcher:** Claude Code (claude-sonnet-4-6)
**Project:** Trilingual NGO website for Seputeh Hindu Youth Organisation

---

## Executive Summary

The recommended stack is **Next.js 15 + Sanity CMS + Tailwind CSS v4 + Vercel**, with `next-intl` for i18n, Sanity Assets for PDF storage, and Resend for email. This combination offers:

- A non-technical admin interface (Sanity Studio) that requires zero code to manage content
- Native trilingual routing with type-safe translation keys
- Free tier costs that match an NGO budget
- Strong Malaysian mobile performance via Vercel's edge network (Singapore region)
- An active 2025 ecosystem with long-term support

---

## 1. Framework

### Recommendation: Next.js 15 (App Router)

**Version:** `next@15.x` (current stable as of late 2024; 15.x line active in 2026)
**Install:** `npx create-next-app@latest --typescript --tailwind --app`

**Rationale:**
- The App Router model (introduced in Next.js 13, matured in 15) enables Server Components by default, which means translation dictionaries and CMS content never ship to the client unnecessarily — critical for Tamil font loading performance on mobile.
- `generateStaticParams` allows all three language variants of each page to be pre-rendered at build time, giving near-instant load speeds on Malaysian mobile networks (4G/5G variability).
- Native `next/form` component for membership and contact forms with progressive enhancement — works even if JS is slow to load.
- `next/image` with automatic WebP/AVIF conversion is essential for committee photo pages served to mobile users.
- React 19 support included; React Compiler (experimental) can reduce re-renders without manual memoization.
- Turbopack dev server is now stable, making development ~76% faster on cold start.
- Largest ecosystem of i18n libraries, CMS integrations, and UI component libraries.
- Vercel (Next.js creator) offers the most seamless deployment experience for this framework.

**Key Next.js 15 features used in this project:**
- `app/[lang]/` directory structure for locale-prefixed routing (`/en/`, `/ms/`, `/ta/`)
- Server Components for CMS data fetching (zero client JS overhead)
- `generateStaticParams` for SSG across all locale/route combinations
- `next/image` for responsive member photos
- Route Handlers for form submission API endpoints
- `instrumentation.js` for error monitoring (optional but recommended)

**Confidence: HIGH**

---

### What NOT to Use

| Framework | Reason to Avoid |
|-----------|----------------|
| **WordPress** | PHP-based; requires server with PHP/MySQL; admin is for WordPress content, not headless; plugin ecosystem is bloated and security-prone; poor developer experience in 2025 |
| **Webflow** | No Tamil script support in their i18n offering; vendor lock-in; expensive at scale; limited custom form logic; CMS seats are expensive for NGOs |
| **Astro 5** | Excellent for pure content sites but weaker for dynamic form handling and Server Actions; smaller CMS integration ecosystem; adds complexity for team unfamiliar with islands architecture |
| **Remix** | Solid framework but smaller ecosystem; Vercel deployment less optimised than Next.js; less relevant CMS tooling |
| **Gatsby** | Effectively deprecated for new projects; long build times; GraphQL data layer is overkill for this scope |
| **plain React (Vite/CRA)** | No SSG/SSR out of the box; SEO would suffer; no file-based routing; no image optimisation |

---

## 2. CMS

### Recommendation: Sanity (v3, Sanity Studio)

**Version:** `sanity@^3.x`, `@sanity/client@^6.x`
**Install:** `npm create sanity@latest`
**Sanity Studio:** Deployed separately (can be embedded at `/studio` in Next.js, or hosted at `your-project.sanity.studio`)

**Rationale:**
- **Free tier is genuinely sufficient for Seputeh HYO:** 20 user seats, 100 GB assets and bandwidth, 10,000 documents, 250k API requests/month — all at $0 forever.
- **Sanity has a documented non-profit program** — organisations can apply for discounted Growth plan access if they outgrow the free tier.
- **Studio UI is non-technical-friendly:** Admins get a visual interface with rich text editors, image uploaders, and PDF asset uploading without any code. Document types like "Programme" and "PDF Document" appear as simple forms.
- **`@sanity/document-internationalization` plugin** handles multilingual content at the document level — admin creates one "Programme" per language variant, linked by a shared key. This is the most admin-friendly pattern (edit English, then Tamil, then Malay as separate documents in a structured panel).
- **GROQ query language** is simple and fast; Next.js fetches content server-side at build time via `createClient`.
- **Asset pipeline:** PDFs are uploaded directly in Sanity Studio and served via Sanity's CDN — no separate S3 setup needed for document library.
- **Real-time collaboration** — multiple admins can work simultaneously on Studio.
- **Portable Text** (Sanity's rich text format) renders to React cleanly.

**Key Sanity packages for this project:**
```
sanity@^3
@sanity/client@^6
@sanity/image-url@^1
@sanity/document-internationalization@^3
next-sanity@^9
```

**Admin workflow for non-technical staff:**
1. Log in to Sanity Studio (can be at `/studio` route or a separate URL)
2. Click "Programmes" → "Add Programme" → fill in title, description, image, language
3. Click "Documents" → "Upload PDF" → drag file → set title and category → publish
4. All changes appear on the website after Next.js revalidates (on-demand via webhook, or ISR)

**Confidence: HIGH**

---

### CMS Alternatives Considered

| CMS | Assessment |
|-----|-----------|
| **Contentful** | Free tier limits 2 locales (need 3 for EN/BM/Tamil) — immediately requires paid plan at $300/month. Eliminated. |
| **Strapi v5** | Self-hosted; requires a VPS/server ($5-20/month on Railway or Render); higher operational complexity for an NGO with no dev on-call; admin UI is good but requires more setup |
| **Payload CMS v3** | Excellent developer experience, built on Next.js; however requires self-hosting and a database (MongoDB or Postgres); adds infrastructure burden inappropriate for a small NGO |
| **WordPress (headless)** | Familiar to some admins but REST API requires developer setup; plugin dependencies introduce security risk; not recommended |
| **Netlify CMS / Decap CMS** | Git-based CMS; admin must understand Git commits concept; no good binary/PDF asset workflow |
| **Tina CMS** | Interesting but smaller ecosystem; PDF upload workflow requires custom configuration |

---

## 3. Multilingual (i18n) Approach

### Recommendation: `next-intl` v4 + Sanity document-level localization

**Package:** `next-intl@^4`
**Install:** `npm install next-intl`

**Architecture — Two-layer i18n:**

**Layer 1: UI strings** (navigation, button labels, form labels, error messages)
Managed via `next-intl` JSON translation files:
```
/messages/
  en.json
  ms.json
  ta.json
```

**Layer 2: Content** (programme descriptions, About Us text, team member bios)
Managed via Sanity's `@sanity/document-internationalization` plugin — each piece of content exists as a separate language document linked by a `_id` reference convention.

**Routing pattern (URL-prefixed):**
```
/en/programmes       → English
/ms/programmes       → Bahasa Malaysia
/ta/programmes       → Tamil
```

Default locale (`en`) can redirect from root `/` via middleware.

**Why `next-intl` over alternatives:**
- Native App Router support with Server Component translation fetching (zero client bundle impact)
- Type-safe message keys with TypeScript autocomplete
- ICU message format for plurals and variable interpolation (e.g., "Showing {count} programmes")
- Localized routing built in (locale-prefix per route)
- Used by Node.js, Uber, Todoist — production-proven at scale
- v4 is the latest stable version as of research date

**Tamil script specifics:**
- Tamil Unicode (U+0B80–U+0BFF) renders in all modern browsers including Android Chrome (dominant in Malaysia)
- Specify `<html lang="ta">` per locale for correct screen reader behaviour
- Use Google Fonts `Noto Sans Tamil` or `Latha` for reliable Tamil rendering — load via `next/font/google` with `display: 'swap'` and `preload: true`
- Sanity Studio text fields accept any Unicode input natively — Tamil can be typed or pasted without special configuration
- **No RTL concern:** Tamil is left-to-right like English and Malay

**Why NOT WordPress i18n plugins (WPML/Polylang):**
- Tied to WordPress; WPML costs $99/year minimum
- Complex database structure for multilingual posts
- Admin must manage translation pairs in a confusing UI

**Why NOT Google Translate widget:**
- Machine-translated Tamil is unreliable and culturally inappropriate for an NGO serving the Tamil community
- No control over translation quality
- Does not produce URL-prefixed routes for SEO

**Confidence: HIGH**

---

## 4. PDF Storage and Serving

### Recommendation: Sanity Assets (native)

**Rationale:**
- Sanity's free tier includes 100 GB of asset storage and CDN bandwidth — more than sufficient for a document library of annual reports, event programmes, and policy documents.
- PDFs uploaded in Sanity Studio are immediately accessible via Sanity's CDN URL.
- The admin workflow is unified: same Studio interface for content and documents.
- Sanity provides direct download URLs that can be served to the public with zero additional configuration.
- No separate storage service, credentials, or bucket management needed.

**Implementation in Next.js:**
```typescript
// Fetch PDF documents from Sanity
const query = `*[_type == "pdfDocument"] | order(publishedAt desc) {
  title,
  description,
  category,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename,
  publishedAt
}`
```

**Frontend PDF display:**
- Inline PDF viewer: Use `react-pdf@^9` (PDF.js wrapper) for in-browser viewing
- Fallback: Direct download link for all PDFs
- Mobile: On mobile, browsers handle PDFs natively; link to `fileUrl` with `target="_blank"`

**Confidence: HIGH**

---

### PDF Storage Alternatives Considered

| Service | Assessment |
|---------|-----------|
| **Cloudinary** | Good for images/video; PDF handling exists but is not the core use case; free tier is ~25 GB storage with transformations but pricing page is opaque; adds a second service unnecessarily |
| **Supabase Storage** | Excellent option if you were already using Supabase for auth/database; overkill for this project (no auth needed, Sanity already covers CMS); free tier is 1 GB storage (too small) |
| **AWS S3** | Industry standard but requires AWS account, IAM, bucket policy configuration — too complex for NGO admin; adds cost and maintenance burden |
| **Google Drive (embed)** | Tempting but embed is fragile; sharing permissions are confusing; file URLs change; no programmatic control; not professional |
| **Netlify Large Media** | Deprecated |

---

## 5. Form Handling

### Recommendation: React Hook Form v7 + Zod v4 + Resend

**Packages:**
```
react-hook-form@^7
@hookform/resolvers@^3
zod@^4
resend@^4
```

**Architecture:**

**Frontend validation:** `react-hook-form` + `zod`
- React Hook Form v7 with Zod v4 resolver for runtime + type-safe validation
- Handles both the **Contact form** and the **Membership application form**
- Minimal re-renders; performant on low-end Android devices common in Malaysia
- Zod v4 is now stable (replaced v3); 2kb core bundle gzipped

**Backend email sending:** `resend` via Next.js Route Handler
- Resend free tier: 3,000 emails/month, 100/day — more than sufficient for NGO contact form volumes
- API key stored in Vercel environment variables
- Route Handler at `POST /api/contact` and `POST /api/membership`
- Resend supports custom `from` addresses with custom domain (e.g., `hello@seputehhyo.org.my`)

**WhatsApp integration:**
- WhatsApp link is a simple `href="https://wa.me/601XXXXXXXX?text=Hello%20Seputeh%20HYO"` — no API required for v1
- Display as a floating button or within the Contact page
- wa.me links work on mobile (opens WhatsApp app) and desktop (opens WhatsApp Web)

**Membership form fields (based on PROJECT.md):**
- Full name, IC/MyKad number, age (15–40 validation), phone, email, area within Seputeh
- Zod schema enforces age range, validates Malaysian phone number format, email format
- On submit: Route Handler sends admin notification email via Resend + confirmation email to applicant

**Why NOT alternatives:**

| Service | Reason to Avoid |
|---------|----------------|
| **Formspree** | Good service but adds a third-party dependency with a free tier of only 50 submissions/month; paid plans from $10/month; less control over email templates |
| **EmailJS** | Client-side API key exposure is a security risk; API key visible in browser |
| **Netlify Forms** | Only works if hosted on Netlify; creates vendor lock-in |
| **SendGrid** | 100 emails/day free is similar to Resend but Resend has better React Email integration and a cleaner API |
| **Nodemailer + SMTP** | Requires managing SMTP credentials; Gmail SMTP has sending limits and is unreliable; adds operational complexity |

**Confidence: HIGH**

---

## 6. Hosting

### Recommendation: Vercel (Hobby plan → Pro if needed)

**Rationale:**
- Vercel is built by the Next.js team — deepest integration, zero configuration deployment
- **Hobby plan (free):** 100 GB bandwidth/month, unlimited deployments, global CDN with Singapore edge (iad1 + sin1 regions), automatic HTTPS, Web Application Firewall
- A low-traffic NGO website will stay within Hobby limits indefinitely
- Preview deployments for every `git push` — useful for reviewing content changes before going live
- Environment variable management built in (Resend API key, Sanity project ID, etc.)
- `vercel.json` allows custom redirects (e.g., `/ms` → `/ms/home`)
- If traffic grows (e.g., event announcement goes viral), upgrade to Pro at $20/month — pay-as-you-go overage protection

**Singapore edge node matters for Malaysia:**
- Vercel's Singapore PoP (Point of Presence) means Malaysian visitors get edge-cached responses from the nearest server, not one in the US
- Latency difference: ~10ms (Singapore) vs. ~200ms (US East) for the initial HTML

**Custom domain:**
- `.my` domain (e.g., `seputehhyo.my` or `seputehhyo.org.my`) registered via MyNIC or a registrar like Exabytes (Malaysia)
- Connect to Vercel via CNAME record; auto-provisioned SSL via Let's Encrypt

**Confidence: HIGH**

---

### Hosting Alternatives Considered

| Host | Assessment |
|------|-----------|
| **Netlify** | Comparable to Vercel; free tier uses a credit system (300 credits/month) that is less transparent; Next.js support is good but not as deep as Vercel; valid alternative if Vercel restrictions arise |
| **Shared hosting (Exabytes, Shinjiru)** | Designed for PHP/WordPress; cannot run Next.js server-side features (Route Handlers, ISR); would require exporting purely static HTML which eliminates Server Actions and dynamic revalidation |
| **DigitalOcean App Platform** | Good for self-hosted Next.js; $5/month minimum; adds server management complexity; no automatic SSL or edge CDN without extra cost |
| **Railway** | Good for self-hosted; $5/month free tier; better if using Payload/Strapi CMS that needs a database |
| **Cloudflare Pages** | Free and fast; good CDN but Next.js Edge Runtime compatibility issues with some features (Server Actions, on-demand ISR); not recommended without careful testing |

---

## 7. UI Component Library

### Recommendation: Tailwind CSS v4 + shadcn/ui

**Packages:**
```
tailwindcss@^4
@tailwindcss/postcss@^4
shadcn/ui (installed per-component via CLI)
```

**Rationale:**
- **Tailwind CSS v4** (released January 2025) is 3-8x faster to build than v3; CSS-first configuration; built-in container queries for component-level responsive design; no `tailwind.config.js` needed for common setups
- **Mobile-first:** Tailwind's responsive prefix system (`sm:`, `md:`, `lg:`) is inherently mobile-first; default styles apply to mobile, larger screens opt in
- **shadcn/ui** is not a package you install — it's a component code registry. You copy accessible, customisable components (Button, Dialog, Form, Card, etc.) into your project. You own the code. No version conflicts, no opaque abstractions.
- shadcn/ui uses Radix UI primitives for accessibility compliance (WCAG 2.1 AA) — important for a public-facing site
- 109k GitHub stars; used by Vercel, Linear, and thousands of production apps
- Works with Next.js, has a first-class CLI: `npx shadcn@latest add button card form`

**Typography for Tamil:**
```css
/* Add to globals.css */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap');

/* Or use next/font/google */
```
Use `next/font/google` for `Noto_Sans_Tamil` — self-hosted by Next.js, zero layout shift, preloaded.

**Confidence: HIGH**

---

## 8. TypeScript

### Recommendation: TypeScript 5.x (strict mode)

All source files should be `.ts` / `.tsx`. `tsconfig.json` with `"strict": true`.

Rationale:
- Sanity generates TypeScript types from your schema (`npx sanity typegen generate`)
- `next-intl` provides type-safe message key autocomplete
- Zod schemas produce inferred TypeScript types for form data
- Catches bugs at compile time, especially important for multilingual string handling

---

## 9. Complete Recommended Stack Summary

| Layer | Technology | Version | Cost |
|-------|-----------|---------|------|
| Framework | Next.js (App Router) | `^15` | Free |
| Language | TypeScript | `^5` | Free |
| CMS | Sanity | Studio v3, Client v6 | Free (Hobby) |
| i18n | next-intl | `^4` | Free |
| Styling | Tailwind CSS | `^4` | Free |
| UI Components | shadcn/ui | Latest CLI | Free |
| Tamil Font | Noto Sans Tamil (Google Fonts via next/font) | — | Free |
| Forms (client) | React Hook Form + Zod | `^7` + `^4` | Free |
| Email (server) | Resend | `^4` | Free (3k/mo) |
| PDF Storage | Sanity Assets (CDN) | — | Free (100 GB) |
| PDF Viewer | react-pdf | `^9` | Free |
| Hosting | Vercel | Hobby | Free |
| Domain | .my / .org.my (MyNIC via Exabytes) | — | ~RM 50-80/year |

**Estimated monthly cost for v1: RM 0–7/month** (domain amortised; all services on free tiers)

---

## 10. Installation Reference

```bash
# Bootstrap project
npx create-next-app@latest seputeh-hyo --typescript --tailwind --app --src-dir

# Install core dependencies
npm install next-intl@^4 sanity@^3 next-sanity@^9 @sanity/client@^6 @sanity/image-url@^1
npm install @sanity/document-internationalization@^3
npm install react-hook-form@^7 @hookform/resolvers@^3 zod@^4
npm install resend@^4
npm install react-pdf@^9

# Install Tailwind v4 (if not in create-next-app output already)
npm install tailwindcss@^4 @tailwindcss/postcss@^4

# Initialise shadcn/ui
npx shadcn@latest init

# Add shadcn components as needed
npx shadcn@latest add button card form input textarea select dialog sheet navigation-menu

# Initialise Sanity project
npm create sanity@latest -- --project <projectId> --dataset production --template clean

# Generate Sanity TypeScript types
npx sanity typegen generate
```

---

## 11. What to Avoid — Summary

| Technology | Verdict | Reason |
|-----------|---------|--------|
| WordPress | Avoid | PHP hosting complexity; security burden; not a modern stack |
| Webflow | Avoid | No Tamil i18n; vendor lock-in; expensive CMS seats |
| Contentful | Avoid | Free tier limits 2 locales — fails this project's 3-locale requirement |
| EmailJS | Avoid | Client-side API key exposure |
| Google Translate widget | Avoid | Machine translation of Tamil is culturally inappropriate |
| AWS S3 (standalone) | Avoid | Unnecessary operational complexity; Sanity Assets covers the use case |
| Shared PHP hosting | Avoid | Cannot run Next.js; no edge CDN |
| Strapi / Payload (self-hosted) | Defer | Valid technically but adds infrastructure management; reconsider if NGO gets a paid developer on retainer |
| Google Fonts `<link>` tag | Avoid | Use `next/font/google` instead for self-hosting, preloading, and zero layout shift |
| Bootstrap / Material UI | Avoid | Tailwind + shadcn is more performant and customisable; Material UI imposes Google's design language on a culturally distinct NGO brand |

---

## 12. Confidence Summary

| Decision | Confidence | Notes |
|----------|-----------|-------|
| Next.js 15 as framework | HIGH | Industry standard; best i18n + CMS ecosystem |
| Sanity as CMS | HIGH | Free tier fits; non-technical Studio; PDF assets included |
| next-intl v4 for i18n | HIGH | Best App Router integration; type-safe |
| Tamil via Unicode + Noto Sans Tamil | HIGH | Standard approach; no special tooling needed |
| Sanity Assets for PDFs | HIGH | Eliminates need for separate storage service |
| Resend for email | HIGH | Best React/Next.js integration; generous free tier |
| Vercel (Hobby) for hosting | HIGH | Zero-config Next.js; Singapore edge; free |
| Tailwind v4 + shadcn/ui | HIGH | Most productive UI stack for small teams in 2025 |
| React Hook Form + Zod v4 | HIGH | De facto standard for React forms |
| WhatsApp via wa.me link | HIGH | No API key needed; works on all devices |

---

*Research completed: 2026-03-11*
*Sources: Next.js docs, Sanity pricing page, Vercel pricing page, next-intl docs, Resend pricing, Netlify pricing, Zod docs, Tailwind CSS blog, shadcn/ui docs*
