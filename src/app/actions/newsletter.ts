'use server';

import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routing } from '@/i18n/routing';

const NewsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v), {
    message: 'invalid locale',
  }),
});

export type NewsletterResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; reason: 'invalid' | 'server' };

export async function subscribeNewsletterAction(
  formData: FormData,
): Promise<NewsletterResult> {
  const raw = {
    email: String(formData.get('email') ?? ''),
    locale: String(formData.get('locale') ?? 'en'),
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
      console.error('Newsletter subscribe error:', error);
      return { ok: false, reason: 'server' };
    }

    return { ok: true, duplicate: false };
  } catch (err) {
    console.error('Newsletter subscribe unexpected error:', err);
    return { ok: false, reason: 'server' };
  }
}
