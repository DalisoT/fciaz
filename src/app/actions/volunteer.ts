'use server';

import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  getResendClient,
  getResendFromAddress,
  getResendToAddress,
} from '@/lib/resend';
import { routing } from '@/i18n/routing';

const VolunteerSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  location: z.string().trim().max(200).optional().or(z.literal('')),
  skills: z.string().trim().max(2000).optional().or(z.literal('')),
  availability: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v)),
});

export type VolunteerResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'server' };

export async function submitVolunteerApplicationAction(
  formData: FormData,
): Promise<VolunteerResult> {
  const raw = {
    full_name: String(formData.get('full_name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    location: String(formData.get('location') ?? ''),
    skills: String(formData.get('skills') ?? ''),
    availability: String(formData.get('availability') ?? ''),
    message: String(formData.get('message') ?? ''),
    locale: String(formData.get('locale') ?? 'en'),
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
      console.error('Volunteer DB insert error:', dbError);
    }

    let emailSent = false;
    try {
      const resend = getResendClient();

      // Notify secretariat
      const notify = await resend.emails.send({
        from: getResendFromAddress(),
        to: getResendToAddress(),
        subject: `[FCIAZ Website] New volunteer application — ${parsed.data.full_name}`,
        text: `New volunteer application received.\n\nName: ${parsed.data.full_name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone || '-'}\nLocation: ${parsed.data.location || '-'}\nSkills: ${parsed.data.skills || '-'}\nAvailability: ${parsed.data.availability || '-'}\n\nMessage:\n${parsed.data.message || '-'}`,
      });
      if (!notify.error) emailSent = true;
      else console.error('Volunteer notify error:', notify.error);

      // Acknowledge applicant (best-effort)
      await resend.emails.send({
        from: getResendFromAddress(),
        to: parsed.data.email,
        subject: 'Thank you for volunteering with FCIAZ',
        text: `Dear ${parsed.data.full_name},\n\nThank you for applying to volunteer with the Fistula and Childbirth Injuries Association of Zambia. We have received your details and will be in touch within ten working days.\n\nIn the meantime, you can learn more about our work at https://fciaz.org.zm.\n\nWith gratitude,\nFCIAZ Secretariat`,
      });
    } catch (err) {
      console.warn('Resend not configured for volunteer form:', err);
    }

    if (dbError && !emailSent) {
      return { ok: false, reason: 'server' };
    }

    return { ok: true };
  } catch (err) {
    console.error('Volunteer unexpected error:', err);
    return { ok: false, reason: 'server' };
  }
}
