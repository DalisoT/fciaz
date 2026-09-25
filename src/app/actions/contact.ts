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

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.string().trim().max(300).optional().or(z.literal('')),
  message: z.string().trim().min(1).max(5000),
  locale: z.string().refine((v) => (routing.locales as readonly string[]).includes(v)),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'rate-limited' | 'server' };

export async function sendContactMessageAction(
  formData: FormData,
): Promise<ContactResult> {
  // 3 per minute per IP — stricter than newsletter because contact emails the secretariat
  const ip = clientKey(await headers());
  const limit = rateLimit(`contact:${ip}`, 3, 60_000);
  if (!limit.ok) {
    return { ok: false, reason: 'rate-limited' };
  }

  const raw = {
    name: String(formData.get('name') ?? '').slice(0, 200),
    email: String(formData.get('email') ?? '').slice(0, 320),
    subject: String(formData.get('subject') ?? '').slice(0, 300),
    message: String(formData.get('message') ?? '').slice(0, 5000),
    locale: String(formData.get('locale') ?? 'en').slice(0, 8),
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
      console.error('[contact] DB insert failed:', dbError.code ?? 'unknown');
      // Continue to try email even if DB fails
    }

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
      else console.error('[contact] email send failed:', emailError.name ?? 'error');
    } catch {
      // Resend not configured — DB insert is enough for audit
    }

    if (dbError && !emailSent) {
      return { ok: false, reason: 'server' };
    }

    return { ok: true };
  } catch {
    console.error('[contact] unexpected error');
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
