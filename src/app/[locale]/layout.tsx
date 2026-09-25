import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = messages;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return '';
      }
    }
    return typeof result === 'string' ? result : '';
  };

  const title = `${t('common.siteFullName')} (${t('common.siteName')})`;
  const description = t('home.heroSubtitle');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: {
      default: title,
      template: `%s | ${t('common.siteName')}`,
    },
    description,
    applicationName: t('common.siteName'),
    manifest: '/site.webmanifest',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#240A6D' },
    ],
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: 'any' }],
      shortcut: ['/favicon.ico'],
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: t('common.siteFullName'),
      locale,
      type: 'website',
      images: [`${siteUrl}/og.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og.svg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
      >
        {(messages as any).common?.skipToContent ?? 'Skip to main content'}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </NextIntlClientProvider>
  );
}
