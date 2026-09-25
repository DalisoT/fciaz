'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routing } from '@/i18n/routing';
import { rateLimit, clientKey } from '@/lib/rateLimit';

const NewsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v), {
    message: 'invalid locale',
  }),
});

export type NewsletterResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; reason: 'invalid' | 'rate-limited' | 'server' };

export async function subscribeNewsletterAction(
  formData: FormData,
): Promise<NewsletterResult> {
  // 5 attempts per IP per minute — generous for humans, blocks bot spray
  const ip = clientKey(await headers());
  const limit = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return { ok: false, reason: 'rate-limited' };
  }

  const raw = {
    email: String(formData.get('email') ?? '').slice(0, 320),
    locale: String(formData.get('locale') ?? 'en').slice(0, 8),
  };

  const parsed = NewsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const supabase = getSupabaseAdmin();

    // Check for duplicate
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, unsubscribed_at')
      .eq('email', parsed.data.email)
      .maybeSingle();

    if (existing) {
      // Re-subscribe if previously unsubscribed
      if (existing.unsubscribed_at) {
        await supabase
          .from('newsletter_subscribers')
          .update({
            unsubscribed_at: null,
            locale: parsed.data.locale,
            confirmed: true,
          })
          .eq('id', existing.id);
      }
      return { ok: true, duplicate: true };
    }

    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: parsed.data.email,
      locale: parsed.data.locale,
      source: 'website',
      confirmed: true,
    });

    if (error) {
      // Log only the error code/message — never include user-supplied data
      console.error('[newsletter] subscribe failed:', error.code ?? 'unknown');
      return { ok: false, reason: 'server' };
    }

    return { ok: true, duplicate: false };
  } catch (err) {
    // Generic message — do not echo raw exception (could contain email)
    console.error('[newsletter] unexpected error');
    return { ok: false, reason: 'server' };
  }
}
