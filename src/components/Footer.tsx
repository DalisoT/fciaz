'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Facebook, Linkedin, Twitter, Youtube, Instagram, Check, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Logo } from './Logo';
import { subscribeNewsletterAction } from '@/app/actions/newsletter';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tSite = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container-wide py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-3 text-sm text-slate-600 max-w-sm">
              {tCommon('tagline')}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {tCommon('siteFullName')}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-600 hover:text-brand-800">{tNav('about')}</Link></li>
              <li><Link href="/what-we-do" className="text-slate-600 hover:text-brand-800">{tNav('whatWeDo')}</Link></li>
              <li><Link href="/stakeholders" className="text-slate-600 hover:text-brand-800">{tNav('stakeholders')}</Link></li>
              <li><Link href="/news" className="text-slate-600 hover:text-brand-800">{tNav('news')}</Link></li>
              <li><Link href="/resources" className="text-slate-600 hover:text-brand-800">{tNav('resources')}</Link></li>
              <li><Link href="/get-involved" className="text-slate-600 hover:text-brand-800">{tNav('getInvolved')}</Link></li>
              <li><Link href="/volunteer" className="text-slate-600 hover:text-brand-800">{tNav('volunteer')}</Link></li>
              <li><Link href="/donate" className="text-slate-600 hover:text-brand-800">{tNav('donate')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">{t('addressHeading')}</h3>
            <p className="text-sm text-slate-600">{t('addressPlaceholder')}</p>
            <p className="mt-3 text-xs text-slate-500">{t('contactUs')}: info@fciaz.org.zm</p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              {t('newsletterHeading')}
            </h3>
            <p className="text-sm text-slate-600 mb-3">{t('newsletterDescription')}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-6 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {year} {tSite('siteName')}. {t('rights')}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-1">{t('followUs')}:</span>
            <SocialIcon href="https://facebook.com" label={t('socialFacebook')}>
              <Facebook className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://x.com" label={t('socialX')}>
              <Twitter className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" label={t('socialLinkedIn')}>
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" label={t('socialInstagram')}>
              <Instagram className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" label={t('socialYouTube')}>
              <Youtube className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:text-brand-800 hover:bg-white"
    >
      {children}
    </a>
  );
}

function NewsletterForm() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'invalid' | 'duplicate'>('idle');
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const locale = (document.documentElement.lang || 'en') as string;
    fd.set('locale', locale);

    startTransition(async () => {
      const result = await subscribeNewsletterAction(fd);
      if (result.ok) {
        setStatus(result.duplicate ? 'duplicate' : 'success');
        setEmail('');
      } else {
        setStatus(result.reason === 'invalid' ? 'invalid' : 'error');
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2" aria-label={t('newsletterHeading')}>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletterEmailPlaceholder')}
          aria-label={t('newsletterEmailPlaceholder')}
          className="input flex-1"
        />
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? '…' : t('newsletterSubmit')}
        </button>
      </div>
      {status === 'success' && (
        <p className="flex items-center gap-1 text-xs text-emerald-700">
          <Check className="h-3.5 w-3.5" /> {t('newsletterSuccess')}
        </p>
      )}
      {status === 'duplicate' && (
        <p className="flex items-center gap-1 text-xs text-amber-700">
          <Check className="h-3.5 w-3.5" /> {t('newsletterAlreadySubscribed')}
        </p>
      )}
      {status === 'invalid' && (
        <p className="flex items-center gap-1 text-xs text-rose-700">
          <AlertCircle className="h-3.5 w-3.5" /> {t('newsletterInvalidEmail')}
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-1 text-xs text-rose-700">
          <AlertCircle className="h-3.5 w-3.5" /> {t('newsletterError')}
        </p>
      )}
    </form>
  );
}
