'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { routing, localeNames, type Locale } from '@/i18n/routing';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-brand-900 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
      </button>

      {open && (
        <>
          {/* Click-outside catcher */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"
          >
            {routing.locales.map((loc) => {
              const isCurrent = loc === currentLocale;
              return (
                <li key={loc}>
                  <button
                    type="button"
                    onClick={() => switchTo(loc)}
                    disabled={isCurrent || isPending}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-800 hover:bg-brand-50 disabled:opacity-60"
                    role="option"
                    aria-selected={isCurrent}
                  >
                    <span>{localeNames[loc]}</span>
                    {isCurrent && <Check className="h-4 w-4 text-brand-800" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
