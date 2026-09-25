import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // English is default; Bemba and Nyanja also supported.
  // NOTE: Bemba/Nyanja translations are draft — Dr. Tembo to verify clinical/medical phrasing.
  locales: ['en', 'bem', 'nya'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  bem: 'Icibemba',
  nya: 'Chinyanja',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
