/**
 * Sanity client for the FCIAZ public website.
 *
 * - `client` is the bare read client (no token). Used for published content.
 * - `writeClient` is for server actions that need to mutate Sanity (not used
 *   in v1 but kept here for future use).
 *
 * If Sanity env vars are missing or the request fails, callers should
 * fall back to hardcoded content. Both clients are lazy so the absence
 * of credentials doesn't break the build.
 */
import { createClient, type SanityClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

let _client: SanityClient | null = null;
let _writeClient: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (_client) return _client;
  if (!projectId || projectId === 'your_project_id_here') {
    throw new Error('Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing).');
  }
  _client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  });
  return _client;
}

export function getSanityWriteClient(): SanityClient {
  if (_writeClient) return _writeClient;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error('SANITY_API_WRITE_TOKEN not set.');
  }
  _writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
  return _writeClient;
}

export function isSanityConfigured(): boolean {
  return (
    !!projectId &&
    projectId !== 'your_project_id_here' &&
    !!process.env.SANITY_API_READ_TOKEN
  );
}
