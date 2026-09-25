import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client (server-only).
 * Uses the service-role key to bypass RLS for inserts from trusted server actions.
 * NEVER import this file from a client component.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase env not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
