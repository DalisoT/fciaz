/**
 * Tiny in-memory IP rate limiter for server actions.
 *
 * - Bucket per (action, IP) key.
 * - Sliding 60-second window.
 * - On the serverless edge, in-memory state doesn't survive cold starts —
 *   that's fine for a small NGO site (it just means cold instances allow
 *   fresh bursts). Swap for Upstash Redis when traffic grows.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export function rateLimit(
  key: string,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetIn: windowMs };
  }

  b.count += 1;
  if (b.count > limit) {
    return { ok: false, remaining: 0, resetIn: b.resetAt - now };
  }
  return { ok: true, remaining: limit - b.count, resetIn: b.resetAt - now };
}

/**
 * Extract a best-effort client identifier from headers.
 * Falls back to a constant on serverless when no IP is forwarded.
 */
export function clientKey(headers: Headers, fallback = 'unknown'): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = headers.get('x-real-ip');
  if (real) return real;
  return fallback;
}
