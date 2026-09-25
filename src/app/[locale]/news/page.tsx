import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Mail } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { NewsCard } from '@/components/NewsCard';
import { DecorationBlob } from '@/components/DecorationBlob';
import { fetchPosts } from '@/lib/sanity/fetch';
import { FALLBACK_POSTS, pickFromObject } from '@/lib/sanity/fallback';

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  // Fetch from Sanity; fall back to hardcoded posts if not configured.
  const sanityPosts = await fetchPosts();
  const posts =
    sanityPosts && sanityPosts.length > 0 ? sanityPosts : FALLBACK_POSTS;

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="relative overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-12">
          <div className="rounded-2xl border border-dashed border-brand-200 bg-white/70 backdrop-blur-md p-8 text-center transition-all duration-300 hover:border-brand-300 hover:shadow-lg">
            <h2 className="text-lg font-semibold text-brand-900">{t('comingSoonHeading')}</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">{t('comingSoonBody')}</p>
            <Link href="/#newsletter" className="btn-accent mt-5 inline-flex">
              <Mail className="h-4 w-4" /> {t('subscribeCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-mesh-rose overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="magenta"
          position="bottom-left"
          size="26vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 pb-16 sm:pb-20 pt-16">
          <SectionHeading title={t('archiveHeading')} />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(posts as any[]).map((p) => (
              <NewsCard
                key={p._id}
                title={pickFromObject(p.title, locale)}
                date={p.publishedAt}
                excerpt={pickFromObject(p.excerpt, locale)}
                locale={locale}
                href={`/news/${p.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
