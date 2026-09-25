'use server';

import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  getResendClient,
  getResendFromAddress,
  getResendToAddress,
} from '@/lib/resend';
import { routing } from '@/i18n/routing';

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email(),
  subject: z.string().trim().max(300).optional().or(z.literal('')),
  message: z.string().trim().min(1).max(5000),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v)),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'server' };

export async function sendContactMessageAction(
  formData: FormData,
): Promise<ContactResult> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    message: String(formData.get('message') ?? ''),
    locale: String(formData.get('locale') ?? 'en'),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        locale: parsed.data.locale,
      });

    if (dbError) {
      console.error('Contact DB insert error:', dbError);
      // Continue to try email even if DB fails
    }

    // Try sending email — but don't block on email failure if at least DB worked
    let emailSent = false;
    try {
      const resend = getResendClient();
      const subjectLine = parsed.data.subject
        ? `[FCIAZ Website] ${parsed.data.subject}`
        : `[FCIAZ Website] New message from ${parsed.data.name}`;
      const { error: emailError } = await resend.emails.send({
        from: getResendFromAddress(),
        to: getResendToAddress(),
        replyTo: parsed.data.email,
        subject: subjectLine,
        text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nLocale: ${parsed.data.locale}\n\n${parsed.data.message}`,
        html: `
          <p><strong>From:</strong> ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p>
          <p><strong>Locale:</strong> ${escapeHtml(parsed.data.locale)}</p>
          ${parsed.data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(parsed.data.subject)}</p>` : ''}
          <hr />
          <p style="white-space: pre-wrap">${escapeHtml(parsed.data.message)}</p>
        `,
      });
      if (!emailError) emailSent = true;
      else console.error('Contact email error:', emailError);
    } catch (err) {
      // No Resend configured — that's fine, DB insert is enough for audit
      console.warn('Resend not configured for contact form:', err);
    }

    if (dbError && !emailSent) {
      return { ok: false, reason: 'server' };
    }

    return { ok: true };
  } catch (err) {
    console.error('Contact unexpected error:', err);
    return { ok: false, reason: 'server' };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
