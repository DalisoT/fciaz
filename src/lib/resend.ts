import { Resend } from 'resend';

/**
 * Server-only Resend client for transactional email.
 * Used by server actions to send contact messages and volunteer confirmations.
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Resend env not configured. Set RESEND_API_KEY in .env.local',
    );
  }
  return new Resend(apiKey);
}

export function getResendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || 'FCIAZ <noreply@fciaz.org.zm>';
}

export function getResendToAddress(): string {
  return process.env.RESEND_TO_EMAIL || 'info@fciaz.org.zm';
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
