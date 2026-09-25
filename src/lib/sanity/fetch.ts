/**
 * Server-side fetchers for Sanity content.
 * Each function returns null if Sanity isn't configured or the query fails —
 * callers should fall back to hardcoded content rather than crash.
 */
import { getSanityClient, isSanityConfigured } from './client';
import {
  POSTS_LIST_QUERY,
  POST_BY_SLUG_QUERY,
  FEATURED_POSTS_QUERY,
  UPCOMING_EVENTS_QUERY,
  PAST_EVENTS_QUERY,
  FEATURED_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  RESOURCES_QUERY,
  SITE_SETTINGS_QUERY,
} from './queries';

async function safeFetch<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isSanityConfigured()) return fallback;
  try {
    return await fetcher();
  } catch (err) {
    console.warn('[sanity] fetch failed, returning fallback:', err);
    return fallback;
  }
}

export async function fetchPosts() {
  return safeFetch(() => getSanityClient().fetch(POSTS_LIST_QUERY, {}, { next: { tags: ['post'] } }), []);
}

export async function fetchPostBySlug(slug: string) {
  return safeFetch(
    () => getSanityClient().fetch(POST_BY_SLUG_QUERY, { slug }, { next: { tags: [`post:${slug}`] } }),
    null,
  );
}

export async function fetchFeaturedPosts(limit = 3) {
  return safeFetch(
    () => getSanityClient().fetch(FEATURED_POSTS_QUERY, { limit }, { next: { tags: ['post'] } }),
    [],
  );
}

export async function fetchUpcomingEvents() {
  return safeFetch(() => getSanityClient().fetch(UPCOMING_EVENTS_QUERY, {}, { next: { tags: ['event'] } }), []);
}

export async function fetchPastEvents() {
  return safeFetch(() => getSanityClient().fetch(PAST_EVENTS_QUERY, {}, { next: { tags: ['event'] } }), []);
}

export async function fetchFeaturedEvents(limit = 3) {
  return safeFetch(
    () => getSanityClient().fetch(FEATURED_EVENTS_QUERY, { limit }, { next: { tags: ['event'] } }),
    [],
  );
}

export async function fetchEventBySlug(slug: string) {
  return safeFetch(
    () => getSanityClient().fetch(EVENT_BY_SLUG_QUERY, { slug }, { next: { tags: [`event:${slug}`] } }),
    null,
  );
}

export async function fetchResources() {
  return safeFetch(() => getSanityClient().fetch(RESOURCES_QUERY, {}, { next: { tags: ['resource'] } }), []);
}

export async function fetchSiteSettings() {
  return safeFetch(() => getSanityClient().fetch(SITE_SETTINGS_QUERY, {}, { next: { tags: ['site'] } }), null);
}
