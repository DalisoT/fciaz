import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Home } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="hero-pattern min-h-[60vh] flex items-center">
      <div className="container-narrow text-center py-20">
        <p className="text-6xl font-bold text-brand-800">404</p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-brand-900">{t('title')}</h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">{t('body')}</p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          <Home className="h-4 w-4" /> {t('cta')}
        </Link>
      </div>
    </section>
  );
}
