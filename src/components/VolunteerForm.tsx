'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Check, AlertCircle, Send } from 'lucide-react';
import { submitVolunteerApplicationAction } from '@/app/actions/volunteer';

export function VolunteerForm() {
  const t = useTranslations('volunteer');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pending, startTransition] = useTransition();
  const email = 'info@fciaz.org.zm';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const locale = document.documentElement.lang || 'en';
    fd.set('locale', locale);

    startTransition(async () => {
      const result = await submitVolunteerApplicationAction(fd);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="vol-name" className="label">
            {t('formName')} <span className="text-rose-600">*</span>
          </label>
          <input id="vol-name" name="full_name" required className="input" />
        </div>
        <div>
          <label htmlFor="vol-email" className="label">
            {t('formEmail')} <span className="text-rose-600">*</span>
          </label>
          <input id="vol-email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label htmlFor="vol-phone" className="label">
            {t('formPhone')}
          </label>
          <input id="vol-phone" name="phone" type="tel" className="input" placeholder="+260…" />
        </div>
        <div>
          <label htmlFor="vol-location" className="label">
            {t('formLocation')}
          </label>
          <input id="vol-location" name="location" className="input" />
        </div>
      </div>

      <div>
        <label htmlFor="vol-skills" className="label">
          {t('formSkills')}
        </label>
        <textarea
          id="vol-skills"
          name="skills"
          rows={3}
          className="input"
          placeholder={t('formSkillsPlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="vol-availability" className="label">
          {t('formAvailability')}
        </label>
        <input
          id="vol-availability"
          name="availability"
          className="input"
          placeholder={t('formAvailabilityPlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="vol-message" className="label">
          {t('formMessage')}
        </label>
        <textarea
          id="vol-message"
          name="message"
          rows={4}
          className="input"
          placeholder={t('formMessagePlaceholder')}
        />
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-1 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" /> {t('formError', { email })}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? (
          <>{tCommon('sending')}</>
        ) : (
          <>
            <Send className="h-4 w-4" /> {t('formSubmit')}
          </>
        )}
      </button>
    </form>
  );
}

function tCommon(key: string): string {
  // tiny local helper that maps known common keys; could be replaced
  // by useTranslations('common') but kept inline to keep the form file focused.
  const map: Record<string, string> = {
    sending: 'Sending…',
  };
  return map[key] ?? key;
}
