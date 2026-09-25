'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Check, AlertCircle, Send } from 'lucide-react';
import { sendContactMessageAction } from '@/app/actions/contact';

export function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pending, startTransition] = useTransition();
  const email = 'info@fciaz.org.zm';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const locale = document.documentElement.lang || 'en';
    fd.set('locale', locale);

    startTransition(async () => {
      const result = await sendContactMessageAction(fd);
      if (result.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    });
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-emerald-900">{t('formSuccess')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="c-name" className="label">
          {t('formName')} <span className="text-rose-600">*</span>
        </label>
        <input id="c-name" name="name" required className="input" />
      </div>
      <div>
        <label htmlFor="c-email" className="label">
          {t('formEmail')} <span className="text-rose-600">*</span>
        </label>
        <input id="c-email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label htmlFor="c-subject" className="label">
          {t('formSubject')}
        </label>
        <input
          id="c-subject"
          name="subject"
          className="input"
          placeholder={t('formSubjectPlaceholder')}
        />
      </div>
      <div>
        <label htmlFor="c-message" className="label">
          {t('formMessage')} <span className="text-rose-600">*</span>
        </label>
        <textarea id="c-message" name="message" required rows={5} className="input" />
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-1 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" /> {t('formError', { email })}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? (
          <>{t('sending') ?? 'Sending…'}</>
        ) : (
          <>
            <Send className="h-4 w-4" /> {t('formSubmit')}
          </>
        )}
      </button>
    </form>
  );
}
