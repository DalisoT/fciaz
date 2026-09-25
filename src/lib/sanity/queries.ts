/**
 * GROQ queries + helpers for the FCIAZ public website.
 *
 * All translatable fields are returned as objects:
 *     { en: "…", bem: "…", nya: "…" }
 * Use `pickLocale(value, locale)` at render time to select the right one,
 * falling back to English if the requested locale is missing.
 */
import { SUPPORTED_LOCALES, type SupportedLocale } from '../../../sanity/schemas/i18n';

/** Pick the localised value for `locale` from an object { en, bem, nya }. */
export function pickLocale<T>(
  value: { en?: T; bem?: T; nya?: T } | null | undefined,
  locale: string,
  fallback: T | null = null as T | null,
): T | null {
  if (!value) return fallback;
  const supported = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  return (value[supported] ?? value.en ?? fallback) as T | null;
}

/** ----------------- Shared fragments -------------------------------- */

const IMAGE_FRAGMENT = `{
  _id,
  asset,
  alt
}`;

const POST_CARD_FRAGMENT = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  heroImage ${IMAGE_FRAGMENT},
  author,
  tags
`;

/** ----------------- Posts ------------------------------------------- */

export const POSTS_LIST_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${POST_CARD_FRAGMENT}
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_CARD_FRAGMENT},
    body,
    seoTitle,
    seoDescription
  }
`;

export const FEATURED_POSTS_QUERY = `
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...$limit] {
    ${POST_CARD_FRAGMENT}
  }
`;

/** ----------------- Events ------------------------------------------- */

const EVENT_FRAGMENT = `
  _id,
  title,
  "slug": slug.current,
  summary,
  startDate,
  endDate,
  location,
  category,
  heroImage ${IMAGE_FRAGMENT},
  featured,
  rsvpLink
`;

export const UPCOMING_EVENTS_QUERY = `
  *[_type == "event" && startDate > now()] | order(startDate asc) {
    ${EVENT_FRAGMENT}
  }
`;

export const PAST_EVENTS_QUERY = `
  *[_type == "event" && startDate < now()] | order(startDate desc)[0...12] {
    ${EVENT_FRAGMENT}
  }
`;

export const FEATURED_EVENTS_QUERY = `
  *[_type == "event" && featured == true] | order(startDate asc)[0...$limit] {
    ${EVENT_FRAGMENT}
  }
`;

export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug][0] {
    ${EVENT_FRAGMENT},
    body
  }
`;

/** ----------------- Resources --------------------------------------- */

export const RESOURCES_QUERY = `
  *[_type == "resource"] | order(publishedAt desc) {
    _id,
    title,
    description,
    "slug": slug.current,
    category,
    publishedAt,
    "fileUrl": file.asset->url,
    "fileMimeType": file.asset->mimeType,
    "fileSize": file.asset->size,
    thumbnail ${IMAGE_FRAGMENT}
  }
`;

/** ----------------- Site settings ---------------------------------- */

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    orgName,
    tagline,
    footerBlurb,
    address,
    email,
    phone,
    whatsapp,
    social
  }
`;
