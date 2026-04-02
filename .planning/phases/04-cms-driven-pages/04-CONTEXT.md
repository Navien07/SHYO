---
phase: "04"
phase_name: CMS-Driven Pages
created: "2026-03-25"
status: ready_for_planning
---

# Phase 04: CMS-Driven Pages — Context

Decisions captured from user discussion. Downstream researcher and planner must treat these as locked choices — do not re-ask or override.

---

## Phase Boundary

Our Team, Our Programmes (listing + detail), and PDF Document Library pages are live and fully admin-editable via Sanity Studio. This phase also builds individual programme detail pages (`/[locale]/programmes/[slug]`) — Phase 3 wired the homepage highlights to those slug URLs; Phase 4 makes them live.

---

## Our Team Page

### Visual Layout
- **Role-tier grouping** — not a flat grid. Three visual tiers on the page:
  1. **President** — featured prominently at the top (single card, larger or centred)
  2. **Senior Officers** — displayed as a row below (VP, Secretary, Treasurer, etc.)
  3. **Committee Members** — remaining members in a standard grid below
- Tier is determined by a **new `tier` field** added to the `teamMember` Sanity schema (see Schema Changes below)
- Within each tier, cards are ordered by the existing `order` number field (ascending)
- Card content: photo, name (active locale), role (active locale)

### Schema Changes Required
- **Add `tier` to `teamMember` schema:**
  ```ts
  defineField({
    name: 'tier',
    title: 'Committee Tier',
    type: 'string',
    options: {
      list: [
        { title: 'President', value: 'president' },
        { title: 'Senior Officer', value: 'senior' },
        { title: 'Committee Member', value: 'committee' },
      ],
    },
    validation: (Rule) => Rule.required(),
  })
  ```
- Update `ALL_TEAM_MEMBERS_QUERY` to include `tier` field
- Update `TeamMember` TypeScript type to include `tier?: string`

---

## Our Programmes Page

### Listing Page (`/[locale]/programmes`)
- Grid of programme cards — title (active locale), photo, category badge
- No category filter on listing page (filter is on Documents only)
- Each card links to `/[locale]/programmes/[slug]` (detail page — see below)
- `description` string (existing field) used as card subtitle/summary

### Programme Detail Pages (`/[locale]/programmes/[slug]`)
- **Phase 4 builds these** — Phase 3 slug links on homepage highlight cards become live
- Page content: hero image (programme photo), title, category badge, `description` summary, full `body` rich text
- Rich text rendered with Sanity's `@portabletext/react` (or equivalent)

### Schema Changes Required
- **Add `body` localised rich text to `programme` schema:**
  ```ts
  defineField({
    name: 'body',
    title: 'Body Content',
    type: 'object',
    fields: [
      { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
      { name: 'ms', title: 'Bahasa Malaysia', type: 'array', of: [{ type: 'block' }] },
      { name: 'ta', title: 'Tamil', type: 'array', of: [{ type: 'block' }] },
    ],
  })
  ```
- The existing `description` `localizedString` field stays — used for listing card summaries
- Add `PROGRAMME_DETAIL_QUERY` to `queries.ts` for fetching a single programme by slug (include `body`)
- Update `Programme` TypeScript type to include `body?: { en?: PortableTextBlock[]; ms?: PortableTextBlock[]; ta?: PortableTextBlock[] }`

---

## PDF Document Library

### Library Page (`/[locale]/documents`)
- **Columns shown per document row:** title (active locale), category, year, upload date, file size, download link
- **File size:** Fetched from Sanity asset metadata — update `ALL_DOCUMENTS_QUERY` to include `file { asset->{ size } }`; format for display as human-readable (e.g. "1.2 MB")
- **Download link:** Opens PDF in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) using the Sanity asset URL
- **Category filter:** Client-side, instant — filter tabs/buttons above the list; clicking narrows the visible rows immediately, no page reload, no URL param change
- Categories: `['Annual Report', 'Constitution', 'Minutes', 'Policy', 'Other']` (from existing schema)
- Default state: "All" tab shows every document

### Query Update Required
- Update `ALL_DOCUMENTS_QUERY` to fetch file size:
  ```ts
  `*[_type == "pdfDocument"] | order(year desc, uploadDate desc) {
    _id, title, category, year, uploadDate,
    file { asset->{ url, size } }
  }`
  ```
- Update `SanityDocument` TypeScript type: `file?: { asset?: { url?: string; size?: number } }`

---

## Cross-Cutting Decisions

### i18n
- All three pages need EN/BM/Tamil strings for UI labels (page titles, column headers, filter buttons, empty states, download button text, etc.)
- Approach: approximate translations consistent with Phase 3 (BM and Tamil are reasonable approximations — native-speaker review before launch, already noted in STATE.md)
- Add message keys under new namespaces: `team`, `programmes`, `documents`

### Empty States
- **Our Team:** If no team members in Sanity — show a placeholder message ("Team details coming soon") — Claude's discretion on layout
- **Our Programmes:** If no programmes — show placeholder ("Our programmes are being updated") — Claude's discretion
- **Documents:** If no documents — show placeholder with guidance ("No documents available yet")

### Reusable Assets Available
- `getAllTeamMembers()`, `getAllProgrammes()`, `getAllDocuments()` — all in `src/lib/sanity/queries.ts`
- `sanityFetch()` with ISR tags — established pattern from Phase 1
- `localizedString` schema helper — defined in each schema file locally (not shared utility)
- `imageUrlBuilder` — instantiated locally per component (per Sanity docs pattern)
- `src/components/ui/button.tsx` — shadcn Button for filter tabs
- `cn()` from `src/lib/utils.ts`
- Layout shell, Header, Footer, Nav — all automatic via locale layout
- Brand tokens: `--color-brand-green: #32a852`, saffron accent — defined in `globals.css`

---

## Claude's Discretion

The planner/executor decides these without asking the user:

- Card visual design (grid columns, image aspect ratio, shadow/border treatment)
- Team photo placeholder when no photo uploaded (initials avatar or silhouette icon)
- Programme listing grid layout (2-col mobile, 3-col desktop — standard responsive)
- Document library: table vs card list view — choose whichever is cleaner for data density
- Filter tab component design (underline tabs, pill buttons, etc.)
- File size formatting helper (bytes → "X.X MB")
- `@portabletext/react` component mapping for rendering programme body
- Responsive behaviour of each page
- Skeleton/loading states

---

## Deferred Ideas

*(Captured but out of scope for Phase 4)*

- Document category filter reflected in URL params (bookmarkable) — user chose client-side; URL param deferred
- Programme category filter on the listing page — not requested for Phase 4
- Team member bio/detail modal or page — current scope is card only
- Programme application/signup from detail page — Phase 5 membership form handles this

---

## Canonical References

- ROADMAP.md Phase 4: requirements TEAM-01–03, PROG-01–04, DOCS-01–05
- Existing schemas: `src/sanity/schemas/teamMember.ts`, `programme.ts`, `document.ts`
- Existing queries: `src/lib/sanity/queries.ts` — `getAllTeamMembers`, `getAllProgrammes`, `getAllDocuments`
- Phase 2 CONTEXT.md: brand tokens, layout shell, shadcn components
- Phase 3 CONTEXT.md: ISR pattern, `localizedString` usage, imageUrlBuilder pattern

---

*Phase: 04-cms-driven-pages*
*Context gathered: 2026-03-25*
