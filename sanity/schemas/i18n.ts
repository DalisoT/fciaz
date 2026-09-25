/**
 * Reusable i18n field builders for the FCIAZ Sanity schemas.
 *
 * Every translatable string is stored as an object with three locale keys
 * (en, bem, nya). At render time the appropriate locale is selected.
 */
import type { FieldDefinition } from 'sanity';

export const SUPPORTED_LOCALES = ['en', 'bem', 'nya'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  bem: 'Icibemba',
  nya: 'Chinyanja',
};

/** Build an object field with one key per locale. */
export function localizedStringField(
  name: string,
  title: string,
  options: { required?: boolean } = {},
): FieldDefinition {
  return {
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: SUPPORTED_LOCALES.map((locale) => ({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'string',
      validation: options.required
        ? (Rule: any) => Rule.required().min(1)
        : undefined,
    })),
  };
}

export function localizedTextField(
  name: string,
  title: string,
  options: { required?: boolean; rows?: number } = {},
): FieldDefinition {
  return {
    name,
    title,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: SUPPORTED_LOCALES.map((locale) => ({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'text',
      rows: options.rows ?? 4,
      validation: options.required
        ? (Rule: any) => Rule.required().min(1)
        : undefined,
    })),
  };
}
