import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { fetchPostBySlug } from '@/lib/sanity/fetch';
import {
  FALLBACK_POSTS,
  FALLBACK_POST_BODIES,
  pickFromObject,
} from '@/lib/sanity/fallback';

export async function generateStaticParams() {
  return FALLBACK_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  let post = await fetchPostBySlug(slug);

  // Fallback to hardcoded
  if (!post) {
    const fb = FALLBACK_POSTS.find((p) => p.slug === slug);
    if (!fb) {
      notFound();
    }
    post = {
      ...fb,
      body: FALLBACK_POST_BODIES[slug] ?? { en: '', bem: '', nya: '' },
    } as any;
  }

  const title = pickFromObject((post as any).title, locale);
  const excerpt = pickFromObject((post as any).excerpt, locale);
  const author = (post as any).author ?? 'Publicity Secretary';
  const publishedAt = (post as any).publishedAt;
  const tags: string[] = (post as any).tags ?? [];
  const heroImage = (post as any).heroImage;

  // Body may be Portable Text (from Sanity) or a plain string (from fallback)
  const bodyI18n = (post as any).body;
  const bodyLocalized =
    typeof bodyI18n === 'string' ? bodyI18n : pickFromObject(bodyI18n, locale);

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt))
    : '';

  return (
    <article className="bg-mesh-warm min-h-[60vh]">
      <div className="container-narrow py-12 sm:py-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-sm text-brand-800 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to news
        </Link>

        <header className="rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={publishedAt}>{formattedDate}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {author}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-brand-900">
            {title}
          </h1>

          {excerpt && (
            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed border-l-4 border-brand-800 pl-4 italic">
              {excerpt}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="pill">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {heroImage && (
          // TODO: render Sanity image using next/image + urlForImage
          null
        )}

        <div className="mt-8 rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 p-8 sm:p-10 shadow-sm">
          {bodyLocalized ? (
            <div className="prose prose-slate max-w-none">
              {bodyLocalized.split(/\n\n+/).map((para: string, i: number) => (
                <p key={i} className="text-base leading-relaxed text-slate-700 mb-4">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic">No content yet.</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/news" className="btn-secondary inline-flex">
            ← All news
          </Link>
        </div>
      </div>
    </article>
  );
}
