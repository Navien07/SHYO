# Research Summary — Seputeh HYO Website

*Synthesised from STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md — 2026-03-11*
*Reference document for roadmap creation. Not a full report.*

---

## Recommended Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | ISR + Server Components eliminate client JS overhead; native locale routing; SSG across all 3 locale/route combos |
| **CMS** | Sanity v3 (Studio) | Free tier covers 20 users, 100 GB assets, 10k docs; non-technical Studio UI; PDF uploads + CDN built in |
| **i18n** | next-intl v4 | Best-in-class App Router integration; type-safe message keys; locale-prefixed URLs out of the box |
| **PDF handling** | Sanity Asset CDN | PDFs uploaded in Studio, served from cdn.sanity.io — no separate storage service needed |
| **Forms** | React Hook Form v7 + Zod v4 + Resend | Type-safe validation; Resend free tier (3k/month) handles email delivery; no client-side API key exposure |
| **Hosting** | Vercel (Hobby) | Zero-config Next.js; Singapore edge node (~10ms to Malaysia); free tier sufficient for NGO traffic |
| **UI** | Tailwind CSS v4 + shadcn/ui | Mobile-first utility classes; accessible Radix UI primitives; organisation owns the component code |
| **Tamil font** | Noto Sans Tamil via next/font | Full Unicode coverage; self-hosted by Next.js; zero layout shift; works on budget Android devices |

**Estimated monthly cost at launch: RM 0–7 (domain only, all services on free tiers)**

---

## Table Stakes Features

- Sticky navigation bar visible on all pages
- Mission statement above the fold (homepage hero)
- All core pages reachable within 1–2 clicks
- Consistent header and footer with contact info, social links, privacy policy
- Functional 404 page
- Fully responsive layout — mobile, tablet, desktop
- Touch targets ≥ 44px; base font ≥ 16px; no horizontal scroll on mobile
- First Contentful Paint ≤ 1.8s; optimised and lazy-loaded images
- Organisation name, founding date (est. 16 Sep 2002), and registration number visible
- Real team photos (no stock photography)
- Active social media links (Facebook, Instagram)
- Privacy policy page (required under Malaysia PDPA 2010)
- HTTPS / SSL
- WCAG 2.1 AA colour contrast (≥ 4.5:1), alt text, keyboard navigation, heading hierarchy
- Contact form (email delivery)
- WhatsApp deep link with pre-filled message
- Trilingual UI: English / Bahasa Malaysia / தமிழ் (URL-prefixed: `/en/`, `/ms/`, `/ta/`)
- Language switcher using native-script labels — never flags
- PDF document library with category filters and download links
- Membership application form with PDPA consent checkbox
- Automated confirmation email to membership applicants
- SEO: unique title/meta per page, Open Graph tags, sitemap, robots.txt
- `siteSettings` CMS type for contact email, WhatsApp number, social URLs (nothing hardcoded)

---

## Architecture Overview

The site follows a **headless CMS + static frontend** pattern: Sanity holds all structured content and file assets; Next.js fetches that content at build time via GROQ queries and serves pre-rendered HTML from Vercel's edge CDN. Pages use ISR (Incremental Static Regeneration) with Sanity webhook-triggered revalidation so admin publishes propagate in seconds without a full redeploy. i18n is implemented in two layers — `next-intl` JSON files for UI strings, and Sanity field-level locale objects for content — both resolved at build time with zero client bundle impact. Forms are the only dynamic surface: they POST to Next.js Server Actions which validate with Zod and deliver email via Resend, keeping API keys server-side only.

**Build phases:**

| Phase | Focus | When |
|---|---|---|
| 0 | Infrastructure: Next.js + Sanity + next-intl + Vercel + Resend wired together | Day 1–2 |
| 1 | CMS schemas: `programme`, `teamMember`, `document`, `siteSettings` | Day 2–3 |
| 2 | Shared UI foundation: layout shell, Navbar (language switcher), Tailwind brand tokens, GROQ query library, i18n message files | Day 3–4 |
| 3 | Static/low-dependency pages: Homepage, About Us, Contact Us + contact form server action | Day 4–5 |
| 4 | CMS-driven pages: Our Team, Our Programmes, PDF Document Library | Day 5–7 |
| 5 | Membership form: multi-field UI in 3 locales, server action, spam protection, confirmation email | Day 7–8 |
| 6 | Polish: responsive QA across all locales, Tamil rendering check, Sanity webhooks, accessibility audit, SEO metadata, admin handover guide | Day 8–10 |

---

## Top Pitfalls to Avoid

1. **Tamil font not loaded on Android** — Budget Android devices (Redmi, Galaxy A-series) used widely by Malaysian youth do not carry Noto Sans Tamil as a system font. Load it explicitly via `next/font/google` and set `html[lang="ta"] { font-family: 'Noto Sans Tamil', sans-serif; }`. Test on real mid-range Android hardware before launch, not just the developer's Mac.

2. **Translation drift after launch** — English content will be updated post-launch; BM and Tamil translations will lag unless there is a named owner and a documented protocol. Assign a Tamil and a BM reviewer from the committee before handover; configure `next-intl` to surface missing keys visibly during development rather than silently falling back to English.

3. **Site abandonment when developer leaves** — The most common NGO web project failure mode. Prevent it by: (a) putting all frequently-changed content (email, WhatsApp, social links, hero text) into Sanity `siteSettings` — nothing hardcoded; (b) delivering a one-page CMS quick-reference guide; (c) creating at least two admin accounts tied to the organisation's email, not any individual's.

4. **Form data going nowhere / PDPA exposure** — Membership submissions sent to a personal committee inbox go unread; submissions with IC numbers stored without consent create legal exposure under PDPA 2010. Send to the org's official email, mirror to a Google Sheet for the committee, include a consent checkbox, and do not collect IC numbers unless strictly necessary.

5. **PDF library becoming unusable** — Without enforced metadata, the library accumulates files named `doc_final_v3.pdf` with no category, no year, and no stable URL. Design the Sanity `document` schema with required fields (display title in all 3 locales, category dropdown, year, upload date) and a stable CMS-assigned slug from day one. Show file size next to every download link.

---

## Key Decisions Made

These decisions are implied by the research and must be honoured by the roadmap:

- **URL-based locale routing** (`/en/`, `/ms/`, `/ta/`) is non-negotiable — component-state language toggling breaks bookmarking, sharing, SEO, and screen readers.
- **Tamil is LTR** — no RTL layout work required; but Tamil glyphs need more line-height (~1.7) and explicit font loading.
- **No Google Translate widget** — machine-translated Tamil is culturally inappropriate for a Tamil community NGO; all three locales must be human-translated.
- **All three locale fields in every CMS schema from day one** — retrofitting locale fields after 50+ content entries is a painful migration.
- **ISR + Sanity webhooks, not pure SSG** — full-rebuild-on-every-publish is too slow for non-technical admins; ISR with on-demand revalidation gives static performance with near-realtime content updates.
- **Sanity accounts registered under org email** — all hosting, domain, CMS, and email accounts must be owned by the organisation before handover; credentials stored in a shared password manager accessible to at least the chair and secretary.
- **Dependabot enabled from day one** — no developer will be on-call post-launch; automated dependency PRs are the only realistic path to keeping the site secure long-term.
- **UptimeRobot monitoring set up at launch** — alerts to the org's official email so site outages are caught without a developer actively watching.
