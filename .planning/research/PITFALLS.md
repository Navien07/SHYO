# Common Pitfalls: NGO Multilingual Websites with CMS

**Project:** Seputeh HYO — Trilingual (EN/BM/Tamil) website
**Researched:** 2026-03-11
**Scope:** Pitfalls specific to Malaysian Hindu youth NGO context

---

## 1. Multilingual / i18n Pitfalls

### 1.1 Tamil Font Rendering Failures

**What goes wrong:** Tamil script requires specific Unicode-compliant fonts (e.g., Noto Sans Tamil, Latha). Without explicit font loading, browsers on Windows and Android fall back to system fonts that may render Tamil glyphs incorrectly — broken conjuncts, missing vowel marks (matras), or boxes instead of characters. This is especially common on budget Android phones widely used by Malaysian youth.

**Warning signs:**
- Tamil text looks correct on developer's Mac but breaks on testers' Android devices
- Characters appear as squares or question marks in screenshots from field testers
- CMS preview looks fine but live site shows garbled text

**Prevention strategy:**
- Load Noto Sans Tamil (or Noto Serif Tamil) from Google Fonts or self-host it — do not rely on system fonts
- Declare `font-family` explicitly in CSS for the Tamil locale: `html[lang="ta"] { font-family: 'Noto Sans Tamil', sans-serif; }`
- Test on real Android mid-range devices (Samsung Galaxy A-series, Redmi) and Windows 10/11 Chrome early in development
- Use BrowserStack or a physical device pool for Tamil rendering QA

**Build phase:** Design system setup (before any Tamil content is added)

---

### 1.2 Missing or Partial Translations (Translation Drift)

**What goes wrong:** English content gets updated post-launch but BM and Tamil translations are never updated. Over time, the site is 100% complete in English, 70% in BM, and 40% in Tamil. This signals to Tamil-speaking visitors that their language is an afterthought, undermining trust.

**Warning signs:**
- Translation strings are managed as free-text in a spreadsheet without a change-tracking process
- No one on the committee is designated as a Tamil content owner
- Post-launch content updates happen in English only because "we'll translate later"

**Prevention strategy:**
- Use a translation key system (e.g., i18n JSON files or a CMS locale field) so missing keys are visible as `[MISSING]` rather than silently falling back to English
- Assign a named Tamil and BM reviewer from Seputeh HYO's committee before launch
- Document a "content update protocol" — any change to English content triggers a translation task assigned to a named person
- If budget allows, use a managed translation service (Lokalise, Crowdin) with missing-key alerts

**Build phase:** Architecture/CMS setup; content governance documented before handover

---

### 1.3 Right-to-Left / Bidirectional Layout Assumptions

**What goes wrong:** Tamil is left-to-right, but some CSS utilities (particularly CSS frameworks like Tailwind without LTR/RTL consideration) embed direction assumptions. This is less critical for Tamil but still affects text alignment, list markers, and padding when mixing Tamil with English inline.

**Warning signs:**
- Numbers inside Tamil sentences appear on wrong side
- List bullet alignment breaks when Tamil text wraps to multiple lines

**Prevention strategy:**
- Set `lang="ta"` on the `<html>` element when Tamil is active (not just on `<body>`)
- Use logical CSS properties (`padding-inline-start` not `padding-left`) for layout that adapts to locale
- Test all UI components (navigation, cards, forms) with long Tamil strings — Tamil text is often visually longer than its English equivalent

**Build phase:** Component development

---

### 1.4 Language Toggle State Not Persisting

**What goes wrong:** User selects Tamil, navigates to another page, and the language resets to English. This forces users to re-select their language on every page, which is especially frustrating for mobile users.

**Warning signs:**
- Language stored only in component state (React `useState`) without persistence
- URL does not include a locale segment (e.g., `/ta/about` vs `/about`)

**Prevention strategy:**
- Persist language choice in `localStorage` or via URL locale prefix (e.g., `/en/`, `/bm/`, `/ta/`)
- URL-based locale is preferred: it is bookmarkable, shareable, and works across sessions without cookies
- If using Next.js, configure `i18n` routing in `next.config.js` — this handles locale persistence natively

**Build phase:** Routing architecture (early, before pages are built)

---

### 1.5 Transliteration vs. True Translation

**What goes wrong:** Non-native translators produce Tamil text that is technically readable but culturally awkward — either overly formal, using archaic vocabulary, or transliterating English terms instead of using natural Tamil equivalents. For a youth NGO, this reads as stiff and alienating.

**Warning signs:**
- Translations are done by a single person without community review
- Organisation names, taglines, and calls-to-action are literally translated word-for-word

**Prevention strategy:**
- Have at least two Tamil speakers from the youth community review all copy before launch
- Prioritise natural, conversational Tamil for CTAs ("Join Us", "Learn More") over literal translations
- Maintain a glossary of key terms (organisation name, programme names) with their agreed Tamil equivalents

**Build phase:** Content strategy / pre-launch content review

---

## 2. CMS Pitfalls

### 2.1 Vendor Lock-in and Pricing Surprises

**What goes wrong:** CMS chosen for its free tier (Sanity, Contentful, Strapi Cloud) imposes usage limits that a growing NGO will eventually hit — number of users, API calls, asset storage, or locale count. When the bill arrives, there is no developer to renegotiate and no budget to pay.

**Warning signs:**
- CMS chosen based on free tier without reading what triggers paid tiers
- No one from the NGO understands what "API calls" or "bandwidth" mean in cost terms
- CMS account is registered to the developer's personal email, not the organisation

**Prevention strategy:**
- For a small NGO, prefer self-hostable open-source CMS (Payload CMS, Directus, or a Git-based CMS like Tina/Keystatic) deployed on the organisation's own hosting to avoid per-user or per-API pricing
- If using a managed CMS, document exactly what free-tier limits are and what would trigger upgrade — leave this in the handover notes
- Register all accounts (CMS, hosting, domain) under the organisation's own email address (e.g., info@seputehhyo.org), not the developer's
- Store data in an open format (JSON, Markdown) so migration is possible if the vendor changes pricing

**Build phase:** Technology selection (before any content modelling)

---

### 2.2 Content Model Mistakes

**What goes wrong:** The initial content model is too rigid (e.g., a "Programme" type with exactly five hardcoded fields) or too loose (everything is one rich-text blob). When the NGO needs to add a new field (e.g., programme date, registration link), it requires a developer.

**Warning signs:**
- Content types modelled after the current website design rather than the underlying data
- No consideration for future fields: "We'll add that later"
- Rich text used where structured fields would enable better filtering and display

**Prevention strategy:**
- Model content around the real-world entity, not the current design: a Programme has a name, description, date, status, an optional image, and an optional external link — even if today's design only shows three of these
- Include a free-text "notes" or "additional info" field in every content type as a safety valve for unexpected content
- Build content types with all three locales (EN/BM/Tamil) as fields from day one, even if Tamil content is empty initially — retrofitting locale fields after 50 entries is painful

**Build phase:** CMS content modelling (before admin training)

---

### 2.3 Admin Interface Too Complex for Non-Technical Users

**What goes wrong:** CMS admin interface exposes too many options (draft/publish states, revisions, webhooks, API tokens) that confuse non-technical committee members. They are afraid to make changes and stop using the CMS entirely. The site becomes static.

**Warning signs:**
- Admin user has to ask the developer "which button do I press?" for basic tasks
- CMS has more than 5 top-level navigation items in the admin panel
- User roles not configured — admins see developer-level settings

**Prevention strategy:**
- Use role-based access control (RBAC) to show committee members only the content types they manage
- Create a one-page "Admin Quick Reference" with screenshots showing exactly: how to upload a PDF, how to add a programme, how to edit contact info
- Conduct a live walkthrough session with the actual committee members who will use the CMS, not just whoever built it
- Choose a CMS with a simple, opinionated UI — Sanity Studio's custom desk, Payload's admin panel, or even Notion-based systems (Super.so) are easier than complex headless CMS setups

**Build phase:** Admin setup + handover preparation

---

### 2.4 No Backup or Recovery Process

**What goes wrong:** Admin accidentally deletes all programmes or PDFs. No backup exists. Restoring requires the developer.

**Warning signs:**
- No automated backup policy for CMS database and asset storage
- "Undo" is not available for bulk delete operations in the chosen CMS

**Prevention strategy:**
- Enable automated daily backups of the CMS database and asset storage (most managed platforms offer this)
- For self-hosted CMS, set up a cron job to back up to an S3-compatible bucket or Google Drive
- Document the restore process in plain language for the developer who comes after you
- Consider enabling soft-delete (trash bin) in the CMS so content can be recovered without a database restore

**Build phase:** Infrastructure setup + handover

---

## 3. NGO-Specific Pitfalls

### 3.1 Site Abandonment After Launch

**What goes wrong:** Developer builds the site, launches it, and departs. Six months later: the "Our Team" page shows committee members from the previous term, programmes from 2024 are still listed as "upcoming", and the homepage hero still says "Join our upcoming AGM 2025". The site becomes an embarrassment rather than an asset.

**Warning signs:**
- No named person in the organisation owns content updates
- CMS training was a one-time session with only one person attending
- No recurring reminder or process for content review

**Prevention strategy:**
- Before handover, document a "Content Maintenance Calendar" — quarterly at minimum: review team page, check programme dates, audit PDFs
- Assign a "Digital Content Officer" role within the committee (doesn't need to be a new role — attach it to an existing secretary or comms role)
- Set up a shared reminder (Google Calendar event, WhatsApp reminder) for quarterly content audits
- Design the CMS so updating team members and programmes takes less than 10 minutes — if it is hard, it will not happen

**Build phase:** Handover and documentation

---

### 3.2 No Content Update Process After Developer Leaves

**What goes wrong:** Non-trivial changes (e.g., changing a colour, adding a new section, changing the email address in a footer) require developer access. Committee members feel helpless and the site stagnates.

**Warning signs:**
- Contact email is hardcoded in the template, not in the CMS
- Footer social media links are not editable via CMS
- Developer is the only person with hosting/DNS access

**Prevention strategy:**
- Move all frequently-changing content into the CMS: contact email, WhatsApp number, social media URLs, hero text, footer text — not just programmes and PDFs
- Create a "Site Settings" content type in the CMS for global values
- Hand over all credentials (hosting, domain registrar, CMS, email) to the organisation's own accounts with a password manager entry
- Write a "How to change X" guide for the top 5 most likely change requests: update email, add team member, remove programme, upload PDF, change phone number

**Build phase:** CMS content modelling + handover

---

### 3.3 Committee Turnover Breaking Content Ownership

**What goes wrong:** The one committee member who knew how to use the CMS is elected out of the committee. Their account is the only admin account. No one knows the password. The site is effectively locked.

**Warning signs:**
- Only one person has CMS admin credentials
- CMS account tied to that person's personal email

**Prevention strategy:**
- Create at least two admin accounts: one for the current Digital Content Officer and one "break-glass" account tied to the organisation's official email
- Store credentials in a shared password manager accessible to at least the chairperson and secretary
- Document "CMS Admin Succession" — what to do when the content officer changes roles

**Build phase:** Handover

---

## 4. PDF Library Pitfalls

### 4.1 Large File Sizes Blocking Mobile Users

**What goes wrong:** Annual reports and event programmes are uploaded as unoptimised PDFs (20MB+). On Malaysian mobile data (Maxis, Celcom prepaid plans), a 20MB PDF takes over a minute to load on 3G. Users abandon before the file opens.

**Warning signs:**
- PDFs uploaded directly from design tools (Canva, InDesign) without compression
- No file size limit enforced on CMS upload
- No progress indicator shown to users while PDF loads

**Prevention strategy:**
- Set a 5MB soft limit and 15MB hard limit on PDF uploads in the CMS
- Provide admin documentation on compressing PDFs before upload: Adobe Acrobat's "Reduce File Size", Smallpdf, or ilovepdf.com
- Serve PDFs through a CDN so downloads are fast for Malaysian users regardless of origin server location
- Display file size next to each PDF link so users can make an informed choice before downloading

**Build phase:** CMS setup (upload validation) + admin training

---

### 4.2 No Categorisation or Search

**What goes wrong:** After two years, the PDF library has 40+ documents with names like "doc_final_v3.pdf" and "AGM_2023_REVISED.pdf". Visitors cannot find what they need. The library becomes unusable without a search or filter.

**Warning signs:**
- CMS PDF type has only a file upload field and no metadata fields
- Documents are displayed in upload order with no sorting or filtering
- Document names are whatever the uploader named their file on their computer

**Prevention strategy:**
- Design the PDF content type with: title (all three languages), description, category (dropdown: Annual Report, Programme, Policy, Press Release, Other), year, and upload date
- Build the public library UI with filter by category and year from day one — even if there are only 5 documents at launch
- Enforce a display name field in the CMS so admin must set a human-readable title separate from the filename
- Consider tagging: even 3–5 tags per document dramatically improves findability

**Build phase:** CMS content modelling + frontend library UI

---

### 4.3 Broken Links to PDFs

**What goes wrong:** A PDF is deleted and re-uploaded with a different filename, but the old URL was shared in a WhatsApp group or posted on Facebook. Visitors clicking the old link get a 404. This is especially damaging for official documents (constitutions, AGM minutes) that are referenced in email threads or printed materials.

**Warning signs:**
- No permanent URL strategy for documents — URLs change on re-upload
- No 404 monitoring in place
- Admin can delete PDFs without being warned that links exist

**Prevention strategy:**
- Assign each document a stable slug or ID in the CMS that is independent of the filename (e.g., `/docs/constitution` not `/uploads/HYO_Constitution_2023_v2.pdf`)
- Set up 301 redirects when documents are replaced — or use a "replace file" function in the CMS that preserves the URL
- Monitor for 404 errors using a free tool (Google Search Console, Cloudflare Analytics, Sentry) and get alerts
- For the most critical documents (constitution, registration certificate), create a permanent "pinned" entry in the CMS that cannot be deleted — only replaced

**Build phase:** CMS setup + URL routing design

---

### 4.4 PDF Accessibility

**What goes wrong:** PDFs are scanned images or design exports with no text layer. Screen readers cannot read them. Tamil PDFs may have text but use a non-Unicode Tamil font (e.g., TAM/TAB fonts common in older Malaysian Tamil documents), making the text invisible to search engines and screen readers.

**Warning signs:**
- PDFs are scans from a photocopier
- Tamil text in PDFs uses TAM/TAB encoding instead of Unicode
- No alt-text or document title set in PDF metadata

**Prevention strategy:**
- Document upload checklist for admins: is this a scanned image? If yes, run OCR before uploading (Adobe Acrobat, Google Drive auto-OCR)
- Recommend that Tamil documents be produced in Unicode-compliant fonts (Noto Sans Tamil, Latha) going forward
- Set PDF title metadata before upload — this is what screen readers announce when a PDF is opened
- Do not require PDFs for simple text content — if the content can be a web page, make it a web page

**Build phase:** Admin training + content guidelines

---

## 5. Membership Form Pitfalls

### 5.1 Spam and Bot Submissions

**What goes wrong:** Without bot protection, membership forms receive hundreds of spam submissions within days of launch. Admin is overwhelmed, real applications are lost in spam, and the email inbox fills with junk.

**Warning signs:**
- No CAPTCHA or bot protection on the form
- Form accepts any email address without validation
- Form has no rate limiting

**Prevention strategy:**
- Add Cloudflare Turnstile (free, privacy-friendly, no image puzzles) or hCaptcha — avoid reCAPTCHA v2 which is intrusive on mobile
- Implement honeypot fields (hidden fields that bots fill in, humans do not)
- Add server-side rate limiting: maximum 5 submissions per IP per hour
- Validate email format and Malaysian phone number format on the server side (not just client side)

**Build phase:** Form implementation

---

### 5.2 No Confirmation Email to Applicant

**What goes wrong:** Youth submit the membership form and receive no acknowledgment. They do not know if the form was received. They submit multiple times, creating duplicates. When the committee does not follow up for weeks (typical for volunteer-run NGOs), the applicant assumes the organisation is disorganised or their application was lost.

**Warning signs:**
- Form submission goes to a database or email with no automated reply
- Committee reviews applications manually at monthly meetings with no interim communication

**Prevention strategy:**
- Send an automated confirmation email to the applicant immediately on submission: "Thank you [Name], we have received your application. Our team will contact you within [X] days."
- Include a reference number in the confirmation email so applicants can quote it in follow-up
- Set up an automated reminder to the committee email if an application has not been acknowledged within 7 days
- Use a transactional email service (Resend, Brevo free tier) — do not rely on the server's mail() function, which often ends up in spam

**Build phase:** Form implementation + email integration

---

### 5.3 Form Data Going Nowhere

**What goes wrong:** Submissions are emailed to a shared committee inbox that nobody monitors regularly. Or they are stored in a database that no one knows how to access. Weeks later, a committee member remembers "we had a form" and tries to find the submissions, but the email is buried or the database access is lost.

**Warning signs:**
- Submissions sent to a single email address that belongs to the current chairperson (who may change)
- No CRM or organised tracking of applications
- Developer is the only one who can access the submission database

**Prevention strategy:**
- Send submissions to the organisation's official email (info@seputehhyo.org) rather than a personal email
- Mirror submissions to a Google Sheet via a webhook (Zapier free tier, Make.com, or a direct Google Sheets API call) — committee members can view a live spreadsheet of all applications without developer help
- Clearly label each column in the Google Sheet so the data is self-explanatory
- Back up the Google Sheet monthly to a local file

**Build phase:** Form implementation + data flow design

---

### 5.4 Collecting More Data Than Needed (PDPA Risk)

**What goes wrong:** The form collects IC number, full address, date of birth, religion, and other sensitive personal data "just in case". Under Malaysia's Personal Data Protection Act 2010 (PDPA), collecting data without a stated purpose and without consent notice is a compliance violation. For an NGO, this creates legal exposure.

**Warning signs:**
- Form has more than 8–10 fields
- No privacy notice or consent checkbox on the form
- IC numbers or passport numbers collected and stored in plain text

**Prevention strategy:**
- Collect only what is needed to process membership: full name, email, phone, age range (not exact DOB), area of residence (not full address), areas of interest
- Add a consent checkbox: "I agree to my information being processed by Seputeh HYO for membership purposes" — this is required under PDPA
- Link to a simple Privacy Policy page (even a one-pager)
- Do not store Malaysian IC numbers unless legally required and properly secured

**Build phase:** Form design / requirements phase

---

## 6. Performance Pitfalls on Malaysian Mobile Networks

### 6.1 Oversized Images and No Optimisation Pipeline

**What goes wrong:** Committee members upload 5MB JPEG photos of events directly to the CMS. These are served full-size to mobile users. On Maxis/Celcom prepaid 4G (which frequently drops to 3G in indoor venues), a gallery page takes 30+ seconds to load. Mobile users bounce.

**Warning signs:**
- No image transformation or CDN in the stack
- CMS serves original uploaded files directly
- Lighthouse mobile performance score below 50

**Prevention strategy:**
- Use a CMS or hosting platform that provides automatic image transformation (Cloudinary free tier, Imgix, or Next.js Image component with a cloud provider)
- Serve images in WebP format with JPEG fallback — WebP is 25–35% smaller than JPEG at the same quality
- Set explicit width and height on all images to prevent layout shift (CLS)
- Lazy-load images below the fold
- Set a maximum upload resolution in the CMS (e.g., 2000px wide) — no event photo needs to be 6000px wide

**Build phase:** Image handling architecture + CMS upload validation

---

### 6.2 Blocking JavaScript and CSS

**What goes wrong:** A heavy JavaScript framework loads 500KB+ of JS before any content is visible. On a slow 3G connection this means 4–6 seconds of blank white screen before the site appears. Tamil users in rural areas near Seputeh or in areas with weak signal suffer most.

**Warning signs:**
- Framework bundle size not measured during development
- Third-party scripts (analytics, chat widgets, social embeds) added without auditing their weight
- Time to First Contentful Paint (FCP) above 3 seconds on simulated 3G in Lighthouse

**Prevention strategy:**
- Use a static-site generator or server-side rendering framework (Next.js, Astro) so HTML is delivered immediately — not after JS hydration
- Keep total JavaScript under 150KB gzipped for the initial page load
- Defer or lazy-load non-critical scripts (analytics, social share buttons)
- Self-host fonts rather than loading from Google Fonts (one fewer DNS lookup; also ensures Tamil font loads even if Google is throttled)
- Run Lighthouse on mobile simulation (not desktop) at every major milestone

**Build phase:** Architecture selection + performance budgeting early in development

---

### 6.3 No Offline / Poor Network Resilience

**What goes wrong:** Youth attending HYO events try to pull up the website for information but have intermittent connectivity. The site shows nothing or an error instead of cached content.

**Warning signs:**
- Site has no service worker or caching strategy
- All pages require a live network request to render

**Prevention strategy:**
- Implement a simple service worker with a "stale-while-revalidate" strategy so previously visited pages load offline or on poor connections
- If using Next.js, `next-pwa` adds this with minimal configuration
- Cache the homepage, about page, and PDF list so the most useful content is available offline
- This is a nice-to-have for v1 but should be considered if the site is to be used during events in venues with poor connectivity

**Build phase:** v1.5 or post-launch enhancement

---

## 7. Maintenance Pitfalls

### 7.1 Developer Knowledge Silos

**What goes wrong:** The developer who built the site is the only person who knows: where the site is hosted, what the domain registrar is, how to deploy changes, how to renew SSL, and where the CMS API keys are. When that developer moves on (common in youth volunteer projects), the site becomes an unmaintainable black box.

**Warning signs:**
- All infrastructure accounts registered under the developer's personal email
- No README or handover documentation
- Deployment process is manual and undocumented

**Prevention strategy:**
- Write a HANDOVER.md document covering: hosting provider, domain registrar, CMS platform, deployment process (step-by-step), environment variables and where they are stored, who to contact for each service
- Transfer all account ownership to the organisation's email before handover
- Set up automated deployments (Vercel/Netlify CI/CD connected to a GitHub repo) so future code changes can be deployed by anyone with repository access — not just the original developer
- Store all secrets in a password manager (Bitwarden free tier) shared with at least two organisation leaders

**Build phase:** Handover documentation (built throughout, finalised at launch)

---

### 7.2 SSL / Domain Expiry

**What goes wrong:** The domain or SSL certificate expires. The site shows a "Not Secure" warning or goes offline entirely. Users lose trust. Recovering requires tracking down whoever registered the domain and paid with their personal card.

**Warning signs:**
- Domain registered under the developer's personal account with auto-renew off
- SSL managed manually (not via Let's Encrypt auto-renewal)
- No expiry monitoring in place

**Prevention strategy:**
- Register the domain under the organisation's own registrar account with auto-renew enabled and a credit card belonging to the organisation
- Use a hosting platform that handles SSL automatically (Vercel, Netlify, Cloudflare Pages all do this)
- Set up expiry monitoring (UptimeRobot free tier monitors domain and SSL expiry and sends email alerts)
- Document domain renewal cost and date in the handover document so it can be budgeted for

**Build phase:** Infrastructure setup at project start

---

### 7.3 Dependency Rot and Security Vulnerabilities

**What goes wrong:** The site is built with npm packages that have known security vulnerabilities after 12 months. No one updates them because the developer has left and the committee members do not know what npm is. Eventually, the hosting provider flags the site or a bad actor exploits a known vulnerability.

**Warning signs:**
- No automated dependency update process (Dependabot, Renovate)
- No one in the organisation has development skills after the builder leaves
- `npm audit` shows high-severity vulnerabilities at launch that were deferred

**Prevention strategy:**
- Enable GitHub Dependabot on the repository — it automatically opens PRs for dependency updates
- Use a hosting platform with built-in security scanning (Vercel has some; Snyk free tier adds more)
- At launch, run `npm audit` and fix all CRITICAL and HIGH vulnerabilities — do not ship known high-severity issues
- Prefer minimal dependencies: every npm package is a future maintenance burden. Use platform APIs and browser APIs before reaching for a library
- Document the annual "maintenance checklist" for whoever takes over: run `npm audit`, check for dependency updates, verify SSL, review content

**Build phase:** Development (dependency hygiene) + handover (maintenance documentation)

---

### 7.4 No Uptime Monitoring

**What goes wrong:** The site goes down — hosting payment lapses, a bad deploy breaks production, or the CMS API is down — and no one knows for days because no one is monitoring it.

**Warning signs:**
- No uptime monitoring configured
- No alert channel (email, WhatsApp) for the current maintainer

**Prevention strategy:**
- Set up UptimeRobot (free tier) to check the site every 5 minutes and send an email alert if it goes down
- Add the organisation's official email and at least one committee leader's personal email as alert recipients
- Check uptime history quarterly as part of the content audit

**Build phase:** Infrastructure setup at launch

---

## Summary: Pitfalls by Build Phase

| Build Phase | Key Pitfalls to Address |
|-------------|------------------------|
| Technology selection | CMS vendor lock-in, pricing surprises, hosting/domain ownership |
| Architecture/routing | Language toggle persistence (URL-based locale), static vs. SSR decision |
| Design system | Tamil font loading, logical CSS properties for multilingual layouts |
| CMS content modelling | All three locales from day one, PDF metadata fields, Site Settings type, missing-key visibility |
| Component development | Image optimisation pipeline, form bot protection, performance budget |
| Form implementation | Confirmation emails, data routing to Google Sheet, PDPA consent, rate limiting |
| Admin setup | RBAC for non-technical users, PDF size limits, category enforcement |
| Admin training | PDF compression process, translation update protocol, quick reference guide |
| Infrastructure setup | SSL auto-renewal, domain under org account, uptime monitoring, automated deploys |
| Handover | HANDOVER.md, credential transfer, maintenance calendar, content governance |
| Post-launch | Dependency updates (Dependabot), 404 monitoring, quarterly content audit |

---

*Research based on: common patterns in Malaysian NGO web projects, multilingual web development best practices, Malaysian PDPA 2010 requirements, and performance characteristics of Malaysian mobile networks.*
