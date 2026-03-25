import { defineQuery } from 'next-sanity';
import { sanityFetch } from '@/sanity/client';

// --- Shared Types ---
export type LocalizedString = {
  en?: string;
  ms?: string;
  ta?: string;
};

export type SiteSettings = {
  _id: string;
  contactEmail?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  heroImage?: { asset: { _ref: string } };
  aboutImage?: { asset: { _ref: string } };
  memberCount?: number;
  programmesDelivered?: number;
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
  tier?: 'president' | 'senior' | 'committee';
};

export type SanityDocument = {
  _id: string;
  title: LocalizedString;
  category: string;
  year: number;
  file?: { asset: { _ref: string } };
  uploadDate?: string;
};

// --- GROQ Queries (defineQuery enables Sanity TypeGen) ---
export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ _id, contactEmail, whatsappNumber, facebookUrl, instagramUrl, heroImage, aboutImage, memberCount, programmesDelivered }`
);

export const PROGRAMME_HIGHLIGHTS_QUERY = defineQuery(
  `*[_type == "programme"] | order(_createdAt desc)[0..2] { _id, title, image, category, slug }`
);

export const ALL_PROGRAMMES_QUERY = defineQuery(
  `*[_type == "programme"] | order(_createdAt desc) { _id, title, description, image, category, slug }`
);

export const ALL_TEAM_MEMBERS_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc, _createdAt asc) { _id, name, role, photo, order, tier }`
);

export const ALL_DOCUMENTS_QUERY = defineQuery(
  `*[_type == "document"] | order(year desc, uploadDate desc) { _id, title, category, year, file, uploadDate }`
);

// --- Typed Fetch Helpers ---

/** Fetches siteSettings singleton. Cached with ISR tag 'siteSettings'. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });
}

/** Fetches all programmes ordered by creation date desc. Cached with ISR tag 'programme'. */
export async function getAllProgrammes(): Promise<Programme[]> {
  return sanityFetch<Programme[]>({
    query: ALL_PROGRAMMES_QUERY,
    tags: ['programme'],
  });
}

/** Fetches 3 most recent programmes for homepage highlights. */
export async function getProgrammeHighlights(): Promise<Programme[]> {
  return sanityFetch<Programme[]>({
    query: PROGRAMME_HIGHLIGHTS_QUERY,
    tags: ['programme'],
  });
}

/** Fetches all team members ordered by manual order asc. Cached with ISR tag 'teamMember'. */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>({
    query: ALL_TEAM_MEMBERS_QUERY,
    tags: ['teamMember'],
  });
}

/** Fetches all documents ordered by year desc then uploadDate desc. Cached with ISR tag 'document'. */
export async function getAllDocuments(): Promise<SanityDocument[]> {
  return sanityFetch<SanityDocument[]>({
    query: ALL_DOCUMENTS_QUERY,
    tags: ['document'],
  });
}
