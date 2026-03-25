# Phase 4: CMS-Driven Pages — Research

**Researched:** 2026-03-25
**Domain:** Next.js 15 App Router, Sanity v3 GROQ, next-intl v4, @portabletext/react, client-side filtering
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Our Team — Visual Layout:**
- Role-tier grouping with three tiers: President (featured top), Senior Officers (row), Committee Members (grid)
- Tier determined by new `tier` field on `teamMember` schema (required, string enum: president / senior / committee)
- Within each tier, cards ordered by existing `order` number field ascending
- Card content: photo, name (active locale), role (active locale)

**Our Team — Schema:**
- Add `tier` field to `teamMember` schema (see CONTEXT.md for exact field definition)
- Update `ALL_TEAM_MEMBERS_QUERY` to include `tier`
- Update `TeamMember` TypeScript type to include `tier?: string`

**Our Programmes — Listing:**
- Grid of cards: title (active locale), photo, category badge — no category filter on listing page
- Each card links to `/[locale]/programmes/[slug]`
- `description` localizedString used as card subtitle/summary

**Our Programmes — Detail Pages:**
- Phase 4 builds `/[locale]/programmes/[slug]` — makes Phase 3 homepage slug links live
- Page: hero image, title, category badge, description summary, full `body` rich text
- Rich text rendered with `@portabletext/react`

**Our Programmes — Schema:**
- Add `body` localised rich text to `programme` schema (object with en/ms/ta PortableText arrays)
- `description` localizedString stays for listing card summaries
- Add `PROGRAMME_DETAIL_QUERY` to `queries.ts` (fetch single programme by slug, include `body`)
- Update `Programme` TypeScript type to include `body?: { en?: PortableTextBlock[]; ms?: PortableTextBlock[]; ta?: PortableTextBlock[] }`

**PDF Document Library:**
- Columns: title (active locale), category, year, upload date, file size, download link
- File size from Sanity asset metadata: `file { asset->{ size } }`; formatted as human-readable (e.g. "1.2 MB")
- Download link: opens PDF in new tab (`target="_blank"`, `rel="noopener noreferrer"`) using Sanity asset URL
- Category filter: client-side, instant — tabs/buttons above list; no page reload, no URL param change
- Categories: `['Annual Report', 'Constitution', 'Minutes', 'Policy', 'Other']`
- Default state: "All" tab shows every document

**Document Library — Query:**
```ts
`*[_type == "pdfDocument"] | order(year desc, uploadDate desc) {
  _id, title, category, year, uploadDate,
  file { asset->{ url, size } }
}`
```
- Update `SanityDocument` TypeScript type: `file?: { asset?: { url?: string; size?: number } }`

**i18n:**
- All three pages need EN/BM/Tamil strings under new namespaces: `team`, `programmes`, `documents`
- Approximate BM/Tamil translations consistent with Phase 3 (native-speaker review before launch, already noted)

**Empty States:**
- Team: "Team details coming soon"
- Programmes: "Our programmes are being updated"
- Documents: "No documents available yet"

### Claude's Discretion

- Card visual design (grid columns, image aspect ratio, shadow/border treatment)
- Team photo placeholder when no photo uploaded (initials avatar or silhouette icon)
- Programme listing grid layout (2-col mobile, 3-col desktop recommended)
- Document library: table vs card list view (choose cleanest for data density)
- Filter tab component design (underline tabs, pill buttons, etc.)
- File size formatting helper (bytes to "X.X MB")
- `@portabletext/react` component mapping for programme body
- Responsive behaviour of each page
- Skeleton/loading states

### Deferred Ideas (OUT OF SCOPE)

- Document category filter reflected in URL params (bookmarkable) — user chose client-side; URL param deferred
- Programme category filter on the listing page — not requested for Phase 4
- Team member bio/detail modal or page — card only
- Programme application/signup from detail page — Phase 5 membership form
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TEAM-01 | Committee member cards showing name, role, and photo | teamMember schema + imageUrlBuilder pattern confirmed in codebase |
| TEAM-02 | Team members managed via Sanity CMS (admin can add/edit/remove without code) | Existing schema + ISR revalidation pattern from Phase 1 |
| TEAM-03 | Committee structure visible (President, VP, Secretary, etc.) | New `tier` field on teamMember schema — tier grouping logic in page component |
| PROG-01 | Programme listing page showing all programmes from CMS | `getAllProgrammes()` fetch helper already exists; page at `/[locale]/programmes` needed |
| PROG-02 | Each programme has title, description, and photo | Existing `programme` schema has all fields; `body` rich text to be added |
| PROG-03 | Programmes managed via Sanity CMS | ISR + webhook revalidation already live from Phase 1 |
| PROG-04 | Programmes categorised | Existing `category` field with enum; category badge on card |
| DOCS-01 | PDF document library listing all uploaded documents | `getAllDocuments()` exists; page at `/[locale]/documents` needed |
| DOCS-02 | Each document shows title, category, year, upload date, file size, download link | Query update needed to fetch `file { asset->{ url, size } }` |
| DOCS-03 | Documents filterable by category | Client-side filter; no server changes; needs client component |
| DOCS-04 | PDFs uploaded and managed via Sanity Studio | Already supported by existing `pdfDocument` schema with `file` field |
| DOCS-05 | Document schema enforces required metadata fields | `category` and `year` already have `validation: Rule.required()`; `title` localizedString currently lacks required validation |
</phase_requirements>

---

## Summary

Phase 4 is a data-display phase — no new infrastructure or auth required. All three content types (teamMember, programme, pdfDocument) already exist in Sanity with established schemas and fetch helpers. The phase adds three new Next.js page routes, one dynamic slug route, targeted schema mutations, and a client-side filtering component.

The primary pattern is identical to pages already built in Phase 3: Server Component page fetches CMS data via `sanityFetch()` with ISR tags, passes data down to a mix of server and client sub-components, and uses `getTranslations()` for UI strings. The only novel element is `@portabletext/react` for programme detail body rendering and a `'use client'` filter component for the document library.

**Critical finding:** `@portabletext/react` is already installed in `node_modules` (confirmed at runtime) but absent from `package.json` — it arrives as a transitive dependency of `sanity`. It must be explicitly added to `package.json` dependencies to avoid silent breakage on clean installs.

**Critical finding:** An existing test bug in `tests/sanity/schemas.test.ts` imports `{ document }` from the schema file, but the export is named `pdfDocument`. This causes 6 test failures currently. The schema test file must be fixed in Wave 0 of this phase (rename import to `pdfDocument`, fix the `'document'` name assertion to `'pdfDocument'`, fix the schema registry count if it changes).

**Primary recommendation:** Follow the Phase 3 Server Component + ISR pattern for all three pages; isolate client interactivity (document filter) into a leaf `'use client'` component; fix schema test import bug in Wave 0.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-sanity | ^9.12.3 | `sanityFetch()`, ISR tagging, `defineQuery()` | Already installed; established project pattern |
| @sanity/image-url | ^1.2.0 | Build CDN image URLs from Sanity image refs | Established pattern: instantiated locally per component |
| @portabletext/react | (transitive via sanity ^3.99.0) | Render Sanity PortableText (rich text) to React | Only library for this; must be added to package.json explicitly |
| next-intl | ^4.8.3 | `getTranslations()` server, `useTranslations()` client | Already installed; all pages use this pattern |
| lucide-react | ^0.577.0 | Icons (download icon, filter clear, placeholder avatar) | Already installed project-wide |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx / cn() | via tailwind-merge | Conditional className | Filter tab active/inactive state |
| shadcn Button | src/components/ui/button.tsx | Filter tab buttons | Already in project for consistent styling |

### Not Needed (confirm no install required)

| Skip | Reason |
|------|--------|
| react-query / SWR | All fetching is server-side; client filter is purely in-memory |
| Framer Motion | Out of scope per deferred ideas |
| Any PDF viewer library | Download link only, not inline viewer |

### Installation

```bash
# Explicit dependency — already in node_modules but not package.json
npm install @portabletext/react
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/app/[locale]/
├── team/
│   └── page.tsx                      # Server Component — fetches + renders tier groups
├── programmes/
│   ├── page.tsx                      # Server Component — listing grid
│   └── [slug]/
│       └── page.tsx                  # Server Component — detail page + PortableText
└── documents/
    ├── page.tsx                      # Server Component — fetches docs, renders DocumentLibrary
    └── DocumentLibrary.tsx           # 'use client' — holds filter state

src/components/
└── (no new shared components needed — page-level components sufficient)

src/lib/sanity/
└── queries.ts                        # Add PROGRAMME_DETAIL_QUERY; update ALL_DOCUMENTS_QUERY, ALL_TEAM_MEMBERS_QUERY
```

### Pattern 1: Server Component Page with ISR

All three listing pages follow the Phase 3 pattern exactly.

```typescript
// src/app/[locale]/team/page.tsx
import { getAllTeamMembers } from '@/lib/sanity/queries';
import { getTranslations } from 'next-intl/server';

export default async function TeamPage() {
  const [members, t] = await Promise.all([
    getAllTeamMembers(),
    getTranslations('team'),
  ]);
  // group by tier, render
}
```

### Pattern 2: Dynamic Slug Route with generateStaticParams

Programme detail pages must be statically generated at build time and ISR-updated.

```typescript
// src/app/[locale]/programmes/[slug]/page.tsx
import { getProgrammeBySlug, getAllProgrammes } from '@/lib/sanity/queries';

export async function generateStaticParams() {
  const programmes = await getAllProgrammes();
  return programmes.map((p) => ({ slug: p.slug.current }));
}

export default async function ProgrammeDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();
  // render
}
```

**Note:** `params` is a Promise in Next.js 15 App Router — must be `await`ed. This is confirmed by the existing `HomePage` and locale `layout.tsx` pattern in this project.

### Pattern 3: PortableText Rendering

```typescript
// src/app/[locale]/programmes/[slug]/page.tsx
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

const bodyContent = programme.body?.[locale as 'en' | 'ms' | 'ta'] ?? programme.body?.en ?? [];

<PortableText value={bodyContent} />
```

Custom component mapping (Claude's discretion) for headings, links, blockquote, etc. can be passed via `components` prop.

### Pattern 4: Client-Side Category Filter

The document library filter is the only client-interactive element. Isolate to a leaf component.

```typescript
// src/app/[locale]/documents/DocumentLibrary.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Annual Report', 'Constitution', 'Minutes', 'Policy', 'Other'];

export function DocumentLibrary({ documents }: { documents: SanityDocument[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const filtered = activeCategory === 'All'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
      {/* Document rows */}
      {filtered.map(doc => (/* ... */))}
    </>
  );
}
```

**Page component stays Server Component** — fetches data, passes to `<DocumentLibrary documents={docs} />`.

### Pattern 5: Tier Grouping Logic

```typescript
const president = members.filter(m => m.tier === 'president').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
const senior    = members.filter(m => m.tier === 'senior').sort(...);
const committee = members.filter(m => m.tier === 'committee').sort(...);
```

Members without a `tier` field (migrated from before schema change) should be treated as `committee` to avoid empty sections.

### Pattern 6: File Size Formatting

Pure utility function — no library needed.

```typescript
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

### Pattern 7: imageUrlBuilder — Local Instantiation

Confirmed established project pattern (Phase 3 decision in STATE.md):

```typescript
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

const builder = imageUrlBuilder(client);
// usage: builder.image(member.photo).width(400).url()
```

### Anti-Patterns to Avoid

- **Shared imageUrlBuilder singleton:** Don't export from a shared file — local instantiation per component is the project standard (STATE.md decision).
- **'use client' on page.tsx:** Keep `page.tsx` files as Server Components. All client state goes in leaf components like `DocumentLibrary.tsx`.
- **Hardcoded `locale` in GROQ queries:** All locale selection happens in TypeScript after fetch, not in GROQ (`programme.title[locale]` is NOT valid GROQ for localizedString object — always fetch full object and select in TS).
- **Awaiting `params` without destructuring:** In Next.js 15, `params` is a `Promise<{ locale: string; slug: string }>` — must `await params` before accessing properties.
- **Importing `document` from schema file:** The export is `pdfDocument`. The test file currently has this bug and it must be fixed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PortableText rendering | Custom HTML serialiser | `@portabletext/react` | Handles marks, annotations, custom block types, nested lists — edge cases are severe |
| Image URL construction | String concatenation of Sanity CDN URLs | `@sanity/image-url` | CDN URL format can change; builder handles transforms, crop, hotspot |
| ISR cache invalidation | Manual `revalidatePath` calls in code | `sanityFetch()` with `tags` + existing webhook | Webhook + tag revalidation already wired from Phase 1 |
| Locale-aware `<Link>` | `href="/en/programmes/..."` hardcoded | `Link` from `@/i18n/navigation` | Auto-prepends locale prefix; avoids locale-stacking bug (Phase 2 decision) |

**Key insight:** The filter and grouping logic are simple enough to hand-roll (array `.filter()`, `.sort()`). Everything else touching Sanity data or locale routing should use established project utilities.

---

## Common Pitfalls

### Pitfall 1: Schema Test Import Bug (Pre-existing Failure)

**What goes wrong:** `tests/sanity/schemas.test.ts` imports `{ document }` but `document.ts` exports `pdfDocument`. This causes 6 test failures on the current branch that must be resolved in Wave 0, not left to accumulate.
**Why it happens:** Schema was named `pdfDocument` to avoid collision with browser's `document` global, but the test was written expecting `document`.
**How to avoid:** Fix the import to `{ pdfDocument as document }` or restructure assertions. Also check that the `'document'` name assertion (`expect(document.name).toBe('document')`) is consistent — the actual schema name is `'pdfDocument'`.
**Warning signs:** Any `vitest run` showing 6 failures before Phase 4 code is touched.

### Pitfall 2: params Is a Promise in Next.js 15

**What goes wrong:** Accessing `params.locale` or `params.slug` directly throws a runtime error.
**Why it happens:** Next.js 15 changed route params to be async Promises.
**How to avoid:** Always `const { locale, slug } = await params;` — same pattern as existing `page.tsx` files in this project.
**Warning signs:** `TypeError: Cannot destructure property 'locale' of 'params'`

### Pitfall 3: PortableText `value` Must Not Be Undefined

**What goes wrong:** `<PortableText value={undefined} />` throws.
**Why it happens:** When a programme has no `body` content yet, `programme.body?.en` is `undefined`.
**How to avoid:** Always provide a fallback: `programme.body?.[locale] ?? programme.body?.en ?? []`.
**Warning signs:** White screen on programme detail page for entries with empty body.

### Pitfall 4: `generateStaticParams` Must Cover All Locales

**What goes wrong:** Only one locale builds static pages; other locales 404 at build time.
**Why it happens:** `generateStaticParams` is called once per route segment. For `[locale]/programmes/[slug]`, both `locale` and `slug` segments are dynamic.
**How to avoid:** The `[locale]` segment already has `generateStaticParams` in `locale/layout.tsx` via `routing.locales.map(...)`. The `[slug]` segment's `generateStaticParams` only needs to return `{ slug }` objects — Next.js combines them. Verify this does not require returning `{ locale, slug }` cross-products (in App Router with nested dynamic segments, inner `generateStaticParams` receives outer params automatically).
**Warning signs:** Tamil/BM programme detail pages returning 404 in production.

### Pitfall 5: File Size Is in Bytes from Sanity Asset

**What goes wrong:** Displaying raw byte count (e.g. "1234567") instead of "1.2 MB".
**Why it happens:** Sanity `asset.size` is an integer byte count.
**How to avoid:** Apply `formatBytes()` helper at render time; never store formatted strings in state.

### Pitfall 6: Sanity Asset URL vs _ref

**What goes wrong:** Using `file.asset._ref` for a download link — `_ref` is a document ID, not a URL.
**Why it happens:** Other fields (image) use `_ref` with `imageUrlBuilder`. The `file` asset works differently — must use `asset->{ url }` dereference in GROQ to get the actual CDN URL.
**How to avoid:** The `ALL_DOCUMENTS_QUERY` in CONTEXT.md already uses `file { asset->{ url, size } }` — this is correct. Update `SanityDocument` type accordingly.

### Pitfall 7: DOCS-05 — title localizedString Has No required Validation

**What goes wrong:** Admin can publish a document without filling in all three locale titles.
**Why it happens:** The `localizedString` helper in `document.ts` does not set `validation: Rule.required()` on sub-fields.
**How to avoid:** The Sanity schema's `localizedString` for `title` should add validation on at least the English sub-field, or the outer field should be marked required. CONTEXT.md does not specify exact validation syntax — use `Rule.required()` on the `title` field's inner `en` sub-field at minimum.

---

## Code Examples

### GROQ Query — Programme Detail

```typescript
// Source: CONTEXT.md + next-sanity defineQuery pattern
export const PROGRAMME_DETAIL_QUERY = defineQuery(
  `*[_type == "programme" && slug.current == $slug][0] {
    _id, title, description, image, category, slug, body
  }`
);

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return sanityFetch<Programme | null>({
    query: PROGRAMME_DETAIL_QUERY,
    params: { slug },
    tags: ['programme'],
  });
}
```

### GROQ Query — Documents with File Size

```typescript
// Source: CONTEXT.md
export const ALL_DOCUMENTS_QUERY = defineQuery(
  `*[_type == "pdfDocument"] | order(year desc, uploadDate desc) {
    _id, title, category, year, uploadDate,
    file { asset->{ url, size } }
  }`
);
```

### TypeScript Types — Updated

```typescript
// queries.ts additions
import type { PortableTextBlock } from '@portabletext/types';

export type Programme = {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  image?: { asset: { _ref: string } };
  category: string;
  slug: { current: string };
  body?: { en?: PortableTextBlock[]; ms?: PortableTextBlock[]; ta?: PortableTextBlock[] };
};

export type TeamMember = {
  _id: string;
  name: LocalizedString;
  role: LocalizedString;
  photo?: { asset: { _ref: string } };
  order?: number;
  tier?: 'president' | 'senior' | 'committee';
};

export type SanityDocument = {
  _id: string;
  title: LocalizedString;
  category: string;
  year: number;
  file?: { asset?: { url?: string; size?: number } };
  uploadDate?: string;
};
```

### i18n Message Keys Required

All three locale files (`en.json`, `ms.json`, `ta.json`) must gain:

```json
{
  "team": {
    "title": "Our Team",
    "presidentSection": "President",
    "seniorSection": "Senior Officers",
    "committeeSection": "Committee Members",
    "emptyState": "Team details coming soon"
  },
  "programmes": {
    "title": "Our Programmes",
    "emptyState": "Our programmes are being updated",
    "readMore": "Read More",
    "backToList": "Back to Programmes"
  },
  "documents": {
    "title": "Documents",
    "colTitle": "Title",
    "colCategory": "Category",
    "colYear": "Year",
    "colDate": "Upload Date",
    "colSize": "Size",
    "download": "Download",
    "filterAll": "All",
    "emptyState": "No documents available yet"
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params` as plain object in page props | `params` is `Promise<{...}>` — must `await` | Next.js 15 | All page `params` access in this project already follow the new pattern |
| Default fetch caching (auto) | Must explicitly set `cache: 'force-cache'` in Next.js 15 | Next.js 15 | `sanityFetch()` already handles this — no action needed |
| `@portabletext/react` v2 | v3 API (same `PortableText` component, same `value` prop) | 2023 | No breaking changes from project perspective |

**Deprecated/outdated:**

- `getStaticProps` / `getServerSideProps`: This is App Router — use Server Components and `generateStaticParams`.
- `useRouter().query` for slug: Not available in App Router — use `params` from component props.

---

## Open Questions

1. **`@portabletext/types` package for `PortableTextBlock` type**
   - What we know: `@portabletext/react` is installed. The `PortableTextBlock` type is exported from `@portabletext/types`, which is a peer dependency.
   - What's unclear: Whether `@portabletext/types` is also transitively installed.
   - Recommendation: Add `import type { PortableTextBlock } from 'sanity'` — Sanity v3 re-exports this type, avoiding an extra package. Verify at implementation time.

2. **Schema migration for existing teamMember documents**
   - What we know: Adding `tier` as a required field means any existing Sanity documents without `tier` will fail studio validation.
   - What's unclear: Whether the client has any existing team member documents in the dataset.
   - Recommendation: The Sanity `validation: Rule.required()` on `tier` only prevents publishing — it does not delete existing documents. Wave 0 test should assert `tier` field exists in schema without requiring existing data migration. Planner should note that existing documents need tier assigned via Studio before re-publishing.

3. **`generateStaticParams` for nested `[locale]/programmes/[slug]`**
   - What we know: Next.js App Router nested dynamic segments combine `generateStaticParams` outputs.
   - What's unclear: Whether the inner `[slug]` `generateStaticParams` needs to return `{ slug }` alone or `{ locale, slug }` pairs.
   - Recommendation: Return `{ slug }` only from the inner segment — Next.js provides outer params automatically. If build fails, fall back to returning cross-product `{ locale, slug }` pairs.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEAM-01 | `src/app/[locale]/team/page.tsx` exists | unit/smoke | `npx vitest run tests/pages/team.test.ts` | ❌ Wave 0 |
| TEAM-02 | `teamMember` schema has all required fields including `tier` | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ (needs update) |
| TEAM-03 | `tier` field present in `teamMember` schema with correct enum | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ (needs tier assertions) |
| PROG-01 | `src/app/[locale]/programmes/page.tsx` exists | unit/smoke | `npx vitest run tests/pages/programmes.test.ts` | ❌ Wave 0 |
| PROG-02 | Programme detail page exists at `[slug]/page.tsx` | unit/smoke | `npx vitest run tests/pages/programmes.test.ts` | ❌ Wave 0 |
| PROG-03 | `PROGRAMME_DETAIL_QUERY` present in queries.ts | unit | `npx vitest run tests/pages/programmes.test.ts` | ❌ Wave 0 |
| PROG-04 | Category badge appears in listing (content check) | unit | `npx vitest run tests/pages/programmes.test.ts` | ❌ Wave 0 |
| DOCS-01 | `src/app/[locale]/documents/page.tsx` exists | unit/smoke | `npx vitest run tests/pages/documents.test.ts` | ❌ Wave 0 |
| DOCS-02 | `ALL_DOCUMENTS_QUERY` includes `file { asset->{ url, size } }` | unit | `npx vitest run tests/pages/documents.test.ts` | ❌ Wave 0 |
| DOCS-03 | `DocumentLibrary.tsx` exists with `'use client'` | unit | `npx vitest run tests/pages/documents.test.ts` | ❌ Wave 0 |
| DOCS-04 | `pdfDocument` schema has `file` field (already passing once bug fixed) | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ (needs bug fix) |
| DOCS-05 | `pdfDocument` schema title/category/year have required validation | unit | `npx vitest run tests/sanity/schemas.test.ts` | ✅ (needs validation assertion) |
| I18N-03 | `team`, `programmes`, `documents` namespaces present in all 3 locale files | unit | `npx vitest run tests/ui/i18n-messages.test.ts` | ✅ (needs new key assertions) |

### Sampling Rate

- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/pages/team.test.ts` — covers TEAM-01, TEAM-02, TEAM-03
- [ ] `tests/pages/programmes.test.ts` — covers PROG-01, PROG-02, PROG-03, PROG-04
- [ ] `tests/pages/documents.test.ts` — covers DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
- [ ] Fix `tests/sanity/schemas.test.ts` — rename `document` import to `pdfDocument`; fix `name === 'document'` assertion to `'pdfDocument'`; add `tier` field assertions for `teamMember`; add validation assertions for `pdfDocument`
- [ ] Update `tests/ui/i18n-messages.test.ts` — add `team`, `programmes`, `documents` namespace key checks

---

## Sources

### Primary (HIGH confidence)

- Codebase direct inspection — `src/sanity/schemas/`, `src/lib/sanity/queries.ts`, `src/app/[locale]/`, `messages/en.json`
- `package.json` — confirmed installed packages and versions
- `vitest.config.ts` — confirmed test framework setup
- `.planning/STATE.md` — confirmed all established decisions (imageUrlBuilder local pattern, params awaiting pattern, ISR tags pattern)
- `.planning/phases/04-cms-driven-pages/04-CONTEXT.md` — locked user decisions

### Secondary (MEDIUM confidence)

- `@portabletext/react` runtime resolution confirmed present in `node_modules` despite missing from `package.json`
- Next.js 15 App Router `params` as Promise — confirmed by existing project code pattern in `page.tsx` and `layout.tsx`

### Tertiary (LOW confidence)

- `generateStaticParams` nested segment behaviour — standard Next.js 15 App Router docs pattern; not verified against this specific project's locale layout combination

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries already installed and used; `@portabletext/react` runtime-confirmed
- Architecture: HIGH — patterns directly derived from existing Phase 3 code in the same project
- Pitfalls: HIGH for schema bug (test output confirmed) and params pattern (codebase confirmed); MEDIUM for generateStaticParams nesting
- Test gaps: HIGH — test file list verified via glob

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable stack; next-sanity and next-intl are pinned in package.json)
