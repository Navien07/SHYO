# Architecture Research: Seputeh HYO Website

**Project:** Seputeh Hindu Youth Organisation — Trilingual NGO Website
**Researched:** 2026-03-11
**Scope:** Architecture decisions for EN/BM/Tamil CMS-managed public site

---

## 1. NGO/CMS Site Architecture — Structure and Data Flow

### Dominant Pattern: Headless CMS + Static Frontend

The industry-standard pattern for content-driven NGO and non-profit websites in 2025–2026 is a **headless CMS paired with a React/Next.js frontend**. The CMS holds all structured content (programmes, team bios, PDFs, page copy) and exposes it via API. The frontend fetches that content at build time or on demand and renders it as HTML.

This decoupling gives non-technical admins a clean, purpose-built editing interface (no code, no FTP) while giving developers full control over the public-facing UI.

```
┌─────────────────────────────────────────────────────────────┐
│                        ADMIN LAYER                          │
│                                                             │
│   ┌──────────────────────────────────────────────────┐      │
│   │              Sanity Studio (CMS)                 │      │
│   │  - Programme editor     - PDF file uploader      │      │
│   │  - Team member manager  - Page copy fields       │      │
│   │  - i18n field pairs     - Document library       │      │
│   └──────────────────┬───────────────────────────────┘      │
│                      │  Content Lake API (GROQ / REST)      │
└──────────────────────┼──────────────────────────────────────┘
                       │
          ┌────────────▼──────────────┐
          │     Build / ISR Layer     │
          │  Next.js fetches content  │
          │  at build time + revalidates on change  │
          └────────────┬──────────────┘
                       │
┌──────────────────────┼──────────────────────────────────────┐
│                 PUBLIC-FACING LAYER                         │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Homepage │  │ About    │  │ Programmes│  │  Team    │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ PDF Docs │  │Membership│  │ Contact  │  │ [locale] │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│          Served from CDN (Vercel Edge Network)              │
└─────────────────────────────────────────────────────────────┘
```

### Component Boundary Model

| Boundary | What lives here | Technology |
|---|---|---|
| CMS / Content Store | Structured content, file assets, translations | Sanity |
| API / Data Layer | GROQ queries, data-fetching functions | Next.js `lib/` |
| Page Layer | Route definitions, data fetching per page | Next.js App Router |
| UI Component Layer | Presentational components (reusable) | React + Tailwind |
| Form Handler Layer | Server Actions / API Routes for form POST | Next.js Server Actions |
| Email Delivery | Transactional email on form submit | Resend |
| File Delivery | PDF streaming from Sanity CDN | cdn.sanity.io |

---

## 2. Internationalisation (i18n) — EN / BM / Tamil

### Tamil Is LTR, Not RTL

**Critical finding:** Tamil script is written **left-to-right**. Unlike Arabic or Hebrew, Tamil does not require RTL layout handling. This significantly simplifies the i18n implementation — no `dir="rtl"` flipping, no mirrored layouts, no logical property overrides are needed.

What Tamil *does* require:
- A font that includes Tamil Unicode characters (e.g. **Noto Sans Tamil**, freely available via Google Fonts)
- Correct `lang` attribute on the `<html>` element per locale (e.g. `lang="ta"`, `lang="ms"`, `lang="en"`)
- Slightly larger base font-size or line-height for Tamil — it is a complex script with stacked glyphs that can clip at standard sizes

### Recommended i18n Library: `next-intl`

`next-intl` is the de facto standard for App Router i18n in 2025–2026. It provides:
- Locale-based routing: `/en/about`, `/ms/about`, `/ta/about`
- Type-safe translation keys
- Works with both Server and Client Components
- SSG/ISR compatible — no server overhead at runtime for static pages

### Locale Routing Architecture

```
app/
  [locale]/            ← dynamic segment: "en" | "ms" | "ta"
    layout.tsx         ← sets <html lang={locale}>, loads locale font
    page.tsx           ← Homepage
    about/
      page.tsx
    programmes/
      page.tsx
      [slug]/
        page.tsx
    team/
      page.tsx
    documents/
      page.tsx
    membership/
      page.tsx
    contact/
      page.tsx
```

### Translation File Structure

```
messages/
  en.json     ← English strings for all UI, nav, labels, CTAs
  ms.json     ← Bahasa Malaysia equivalents
  ta.json     ← Tamil equivalents
```

### CMS Content Strategy for i18n

Two approaches exist; the recommended one for this project is **field-level i18n in Sanity**:

Each content document (e.g. a Programme) stores translated fields inline:

```json
{
  "title": {
    "en": "Youth Leadership Camp",
    "ms": "Kem Kepimpinan Belia",
    "ta": "இளைஞர் தலைமைத்துவ முகாம்"
  },
  "description": {
    "en": "...",
    "ms": "...",
    "ta": "..."
  }
}
```

This keeps all translations for a single record together, making it easy for admins to see and edit without switching documents. The Sanity `internationalizedArray` plugin or custom object types support this pattern.

### Font Loading Strategy

```css
/* Load Tamil font only when locale is "ta" */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil&display=swap');

/* Applied via layout.tsx when locale === "ta" */
html[lang="ta"] {
  font-family: 'Noto Sans Tamil', sans-serif;
  font-size: 16px;
  line-height: 1.7; /* Tamil glyphs need more vertical space */
}
```

---

## 3. Admin / CMS Layer vs Public-Facing Layer

### Recommended CMS: Sanity

Sanity is the strongest fit for this project for several reasons:

| Criterion | Sanity | WordPress | Contentful |
|---|---|---|---|
| Non-technical admin UX | Good (Studio is clean and purpose-built) | Excellent | Moderate |
| PDF/file upload support | Yes (native file type) | Yes (Media Library) | Yes (Assets) |
| i18n support | Excellent (plugin ecosystem) | Requires plugins | Good |
| Free tier for small NGO | Yes (Free tier: 2 users, 10GB bandwidth) | Self-host cost | Limited |
| Dev experience | Excellent (GROQ, TypeScript) | Poor (REST/WP-JSON) | Good |
| Deployment independence | Yes — backend is Sanity-hosted | Requires WP host | Yes |
| Real-time preview | Yes | Yes (with plugins) | Yes |

**Why not WordPress:** While WordPress is easier for non-technical users, it couples the CMS to the hosting server, requires security maintenance (plugins, PHP updates), and produces inconsistent APIs. The headless Sanity approach gives cleaner separation of concerns and avoids plugin sprawl.

### Admin Layer Architecture

```
Sanity Studio (hosted at yourstudio.sanity.studio OR /studio route)
│
├── Content schemas defined in code (sanity/schemas/)
│   ├── programme.ts    (title[i18n], description[i18n], image, date, slug)
│   ├── teamMember.ts   (name, role, photo, displayOrder)
│   ├── document.ts     (title[i18n], file, category, uploadDate, description[i18n])
│   └── siteSettings.ts (contact email, social links, WhatsApp number)
│
└── Non-technical admin can:
    ├── Add / edit / remove programmes
    ├── Upload team member photos and update names/roles
    ├── Upload PDFs and set their display title in 3 languages
    └── Edit page-level content (mission text, about copy)
```

The Studio can be deployed to `studio.seputehhyo.org` or embedded at `/studio` in the Next.js app (Sanity supports both). For non-technical users, a separate subdomain is cleaner to bookmark.

---

## 4. PDF Storage and Delivery Architecture

### Storage: Sanity Asset CDN

Sanity's built-in file handling is the cleanest fit for this project. When an admin uploads a PDF through Sanity Studio:

1. The file is uploaded to **Sanity Content Lake** (backed by cloud blob storage)
2. Sanity assigns a permanent, content-hashed URL: `https://cdn.sanity.io/files/{projectId}/{dataset}/{hash}.pdf`
3. The URL is stored as a reference in the document record
4. The Next.js frontend fetches the document list (title, description, URL) from the Sanity API
5. Each PDF link in the public library points directly to the Sanity CDN URL

```
Admin uploads PDF
       │
       ▼
Sanity Content Lake (blob storage)
       │
       ▼
cdn.sanity.io/{projectId}/{dataset}/{sha1hash}.pdf
       │
       ▼  (stored as asset reference in document record)
Sanity GROQ Query ──► Next.js Page ──► Public Document Library UI
                                              │
                                    User clicks "Download"
                                              │
                                    Browser fetches directly
                                    from cdn.sanity.io (?dl=filename.pdf)
```

**Key properties of this approach:**
- CDN is global (Google Cloud backbone) — fast delivery in Malaysia
- Content-hashed URLs mean the same file at the same URL never changes; updates generate a new URL automatically (cache-safe)
- The `?dl=filename.pdf` query parameter forces browser download rather than in-browser preview
- No separate S3 bucket or Cloudinary account needed — reduces infrastructure complexity
- Free tier includes 20GB asset storage, sufficient for a document library of hundreds of PDFs

### Public PDF Library Page Structure

```
/[locale]/documents
│
├── Fetches: all document records from Sanity (title[locale], description[locale], file.asset.url, uploadDate)
├── Groups or filters by category if needed
├── Renders a card/list per document with Download button
└── Download links to: cdn.sanity.io URL with ?dl parameter
```

---

## 5. Form Submission Architecture

### Two Forms, Two Purposes

| Form | Goal | Destination |
|---|---|---|
| Contact Form | Visitor message → Organisation receives email | Email to HYO inbox |
| Membership Application | Youth applies to join → Organisation receives structured data | Email to HYO inbox + optional spreadsheet backup |

### Recommended Stack: Next.js Server Actions + Resend

**Resend** is the recommended email delivery service for 2025–2026 Next.js projects. It replaces older SMTP-relay approaches (Nodemailer + Gmail) with a developer-first API, better deliverability, and React Email template support.

```
User submits form (browser)
       │
       ▼
Next.js Server Action (runs on server, never exposed to client)
       │
       ├── Validates input with Zod schema
       ├── Rate limiting check (optional: Upstash Redis or simple IP check)
       │
       ▼
Resend API  ──► Delivers HTML email to HYO admin inbox
       │
       ▼
Server Action returns success/error to UI
       │
       ▼
React state updates: show success message / field errors
```

### Contact Form Email Flow

```
Server Action: /app/[locale]/contact/actions.ts
  Input: { name, email, message, phone? }
  Validation: Zod
  Output: Resend email to hyo@seputehhyo.org
  Template: React Email component (HTML email)
```

### Membership Application Flow

The membership form captures more structured data (name, IC number, age, address, area of interest). Two recommended destinations:

**Option A — Email only (simplest, v1 recommended):**
```
Server Action validates → Resend delivers formatted HTML email
                        → Admin manually enters into member register
```

**Option B — Email + Google Sheets (v1.5 enhancement):**
```
Server Action validates
  → Resend delivers email (admin notification)
  → Google Sheets API appends row to membership register spreadsheet
```

Option A is appropriate for v1 given the low initial volume. Option B can be added later without changing the form UI — only the server action changes.

### Spam Protection

Both forms should include:
- **Honeypot field** (hidden field that bots fill in; humans don't) — zero friction, effective
- **Zod validation** on the server (never trust client-side only)
- Optional: Cloudflare Turnstile (free CAPTCHA alternative, less friction than reCAPTCHA)

---

## 6. Build and Rendering Strategy

### Recommendation: ISR with Short Revalidation Windows

For this NGO site, the content profile is:

| Page | Update frequency | Rendering strategy |
|---|---|---|
| Homepage | Rarely (hero text, highlights) | ISR — revalidate: 3600s (1 hour) |
| About Us | Very rarely | ISR — revalidate: 86400s (daily) |
| Team | Occasional (committee changes) | ISR — revalidate: 3600s |
| Programmes | Occasional (new programmes added) | ISR — revalidate: 1800s (30 min) |
| Documents / PDF Library | Occasional (new PDFs uploaded) | ISR — revalidate: 1800s |
| Contact / Membership | Static form UI (no CMS data) | SSG — fully static |

**Why ISR over pure SSG:**
Pure SSG requires a full site rebuild every time an admin uploads a new PDF or adds a programme. For non-technical admins this creates a frustrating lag. ISR allows pages to regenerate automatically after the revalidation window without a manual deploy.

Sanity also supports **webhook-triggered revalidation** via `next/cache revalidateTag()` — the CMS pings the Next.js app on publish, forcing immediate regeneration. This is the best of both worlds: static-level performance with near-realtime content updates.

**Why not SSR:**
Full server-side rendering on every request is unnecessary and expensive for content that changes at most hourly. SSR adds server latency and compute cost with no benefit for this use case.

### Hosting: Vercel

Vercel is the natural deployment target for Next.js with ISR. The free/hobby tier supports:
- Unlimited deployments
- Edge CDN globally (including Asia-Pacific edge nodes near Malaysia)
- Environment variable management (for Sanity API keys, Resend API key)
- Automatic HTTPS

For production, the Pro tier ($20/month) adds team collaboration, higher function limits, and analytics — appropriate once the organisation is past initial launch.

---

## 7. Suggested Build Order

Dependencies must be respected: infrastructure and data layer before UI, shared components before pages, CMS schema before data-fetching, static pages before dynamic ones.

### Phase 0 — Infrastructure (Day 1–2)

1. **Create Next.js 15 App Router project** (`npx create-next-app@latest --typescript --tailwind --app`)
2. **Create Sanity project** (free tier, `npm create sanity@latest`)
3. **Connect Sanity to Next.js** (install `next-sanity`, configure client, add env vars)
4. **Set up next-intl** with 3 locales (en, ms, ta), locale routing, and placeholder message files
5. **Configure Vercel deployment** — connect git repo, add env vars, verify preview deploys work
6. **Install Resend** and verify email delivery to test inbox

### Phase 1 — CMS Schemas (Day 2–3)

Define all Sanity schemas before building any page that uses CMS data:
1. `programme` schema (title[i18n], description[i18n], image, date, status, slug)
2. `teamMember` schema (name, role[i18n], photo, displayOrder)
3. `document` schema (title[i18n], description[i18n], file, category, uploadDate)
4. `siteSettings` singleton (contact email, WhatsApp, social links)
5. Seed each schema with at least one test record for development

### Phase 2 — Shared UI Foundation (Day 3–4)

Build before any page component:
1. **Layout shell** — `app/[locale]/layout.tsx` with Navbar, Footer, locale font loading
2. **Navbar component** — language switcher (EN / BM / Tamil toggle), navigation links
3. **Tailwind config** — brand colours from HYO logo, typography scale
4. **Data-fetching library** — `lib/sanity/queries.ts` with GROQ queries for each content type
5. **i18n message files** — populate `messages/en.json`, `ms.json`, `ta.json` with nav/UI strings

### Phase 3 — Static / Low-Dependency Pages (Day 4–5)

Pages with no or minimal CMS dependency:
1. **Homepage** — hero, mission summary, programme highlights teaser, CTA
2. **About Us** — history, mission, vision, focus areas (static content or simple CMS fields)
3. **Contact Us page** — contact info, WhatsApp link, social links, embedded contact form
4. **Contact form server action** — Zod validation + Resend email delivery

### Phase 4 — CMS-Driven Pages (Day 5–7)

Pages that fetch and display Sanity content:
1. **Our Team** — fetches `teamMember` records, renders grid
2. **Our Programmes** — fetches `programme` records, renders cards + detail pages
3. **Documents / PDF Library** — fetches `document` records, renders download list

### Phase 5 — Membership Form (Day 7–8)

1. **Membership form UI** — multi-field form in 3 languages
2. **Membership server action** — validate, format, send via Resend
3. **Honeypot + basic spam protection**
4. **Success/error state handling** in UI

### Phase 6 — Polish and Validation (Day 8–10)

1. **Responsive QA** — mobile, tablet, desktop across all pages and all 3 locales
2. **Tamil rendering check** — verify Noto Sans Tamil loads, glyphs render correctly
3. **Sanity webhook setup** — on-publish revalidation for Programmes and Documents pages
4. **Accessibility audit** — keyboard nav, sufficient colour contrast, alt text on all images
5. **SEO metadata** — `generateMetadata()` per page, locale-aware `<html lang>`, OG tags
6. **Admin handover** — document CMS usage for non-technical admin (simple guide)

---

## Summary: Recommended Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | Next.js 15 (App Router) | ISR, Server Actions, RSC, industry standard |
| UI styling | Tailwind CSS | Rapid development, consistent design system |
| Headless CMS | Sanity (free tier) | Non-technical admin UX, PDF support, i18n, CDN assets |
| i18n | next-intl | App Router native, type-safe, SSG/ISR compatible |
| Tamil font | Noto Sans Tamil (Google Fonts) | Full Unicode coverage, free, web-optimised |
| Form email delivery | Resend + React Email | Modern API, great deliverability, React templates |
| PDF storage | Sanity Asset CDN (cdn.sanity.io) | Integrated, content-hashed URLs, global CDN |
| Hosting | Vercel | Native Next.js support, Edge CDN, ISR support |
| Language | TypeScript | Type safety across CMS schemas and UI |

---

*Research compiled 2026-03-11. Sources: Sanity docs, Next.js docs, next-intl docs, Resend docs, MDN Web Docs, Vercel knowledge base.*
