'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Floating WhatsApp button. Configure NEXT_PUBLIC_WHATSAPP_NUMBER and
 * NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE in .env.local.
 */
export function WhatsAppButton() {
  const t = useTranslations('whatsapp');
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ||
    'Hello FCIAZ, I would like to learn more about your work.';

  if (!number) {
    return null;
  }

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('label')}
      title={t('tooltip')}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 transition hover:scale-105 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
