'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  getResendClient,
  getResendFromAddress,
  getResendToAddress,
} from '@/lib/resend';
import { routing } from '@/i18n/routing';
import { rateLimit, clientKey } from '@/lib/rateLimit';

const VolunteerSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  location: z.string().trim().max(200).optional().or(z.literal('')),
  skills: z.string().trim().max(2000).optional().or(z.literal('')),
  availability: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v)),
});

export type VolunteerResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'rate-limited' | 'server' };

export async function submitVolunteerApplicationAction(
  formData: FormData,
): Promise<VolunteerResult> {
  // 2 per hour per IP — strict, but volunteer applications are deliberate acts
  const ip = clientKey(await headers());
  const limit = rateLimit(`volunteer:${ip}`, 2, 60 * 60_000);
  if (!limit.ok) {
    return { ok: false, reason: 'rate-limited' };
  }

  const raw = {
    full_name: String(formData.get('full_name') ?? '').slice(0, 200),
    email: String(formData.get('email') ?? '').slice(0, 320),
    phone: String(formData.get('phone') ?? '').slice(0, 50),
    location: String(formData.get('location') ?? '').slice(0, 200),
    skills: String(formData.get('skills') ?? '').slice(0, 2000),
    availability: String(formData.get('availability') ?? '').slice(0, 500),
    message: String(formData.get('message') ?? '').slice(0, 5000),
    locale: String(formData.get('locale') ?? 'en').slice(0, 8),
  };

  const parsed = VolunteerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const supabase = getSupabaseAdmin();

    const { error: dbError } = await supabase
      .from('volunteer_signups')
      .insert({
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        location: parsed.data.location || null,
        skills: parsed.data.skills || null,
        availability: parsed.data.availability || null,
        message: parsed.data.message || null,
        locale: parsed.data.locale,
      });

    if (dbError) {
      console.error('[volunteer] DB insert failed:', dbError.code ?? 'unknown');
    }

    let emailSent = false;
    try {
      const resend = getResendClient();

      const notify = await resend.emails.send({
        from: getResendFromAddress(),
        to: getResendToAddress(),
        subject: `[FCIAZ Website] New volunteer application — ${parsed.data.full_name}`,
        text: `New volunteer application received.\n\nName: ${parsed.data.full_name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || '-'}\nLocation: ${parsed.data.location || '-'}\nSkills: ${parsed.data.skills || '-'}\nAvailability: ${parsed.data.availability || '-'}\n\nMessage:\n${parsed.data.message || '-'}`,
      });
      if (!notify.error) emailSent = true;
      else console.error('[volunteer] notify failed:', notify.error.name ?? 'error');

      await resend.emails.send({
        from: getResendFromAddress(),
        to: parsed.data.email,
        subject: 'Thank you for volunteering with FCIAZ',
        text: `Dear ${parsed.data.full_name},\n\nThank you for applying to volunteer with the Fistula and Childbirth Injuries Association of Zambia. We have received your details and will be in touch within ten working days.\n\nIn the meantime, you can learn more about our work at https://fciaz.org.zm.\n\nWith gratitude,\nFCIAZ Secretariat`,
      });
    } catch {
      // Resend not configured — DB insert is enough
    }

    if (dbError && !emailSent) {
      return { ok: false, reason: 'server' };
    }

    return { ok: true };
  } catch {
    console.error('[volunteer] unexpected error');
    return { ok: false, reason: 'server' };
  }
}
