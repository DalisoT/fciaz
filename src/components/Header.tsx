'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nav = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/what-we-do', label: t('whatWeDo') },
    { href: '/stakeholders', label: t('stakeholders') },
    { href: '/news', label: t('news') },
    { href: '/events', label: t('events') },
    { href: '/resources', label: t('resources') },
    { href: '/get-involved', label: t('getInvolved') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {nav.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'text-brand-900 bg-brand-50'
                    : 'text-slate-700 hover:text-brand-900 hover:bg-brand-50/60',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/donate"
            className="hidden md:inline-flex btn-accent"
          >
            {t('donate')}
          </Link>
          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-900 hover:bg-brand-50"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('closeMenu') : t('openMenu')}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="container-wide py-3 flex flex-col" aria-label="Mobile">
            {nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2.5 text-sm font-medium',
                    active
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 btn-accent"
            >
              {t('donate')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
