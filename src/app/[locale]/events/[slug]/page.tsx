import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Calendar, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';
import { DecorationBlob } from '@/components/DecorationBlob';
import { fetchEventBySlug } from '@/lib/sanity/fetch';
import { pickFromObject } from '@/lib/sanity/fallback';
import { FALLBACK_UPCOMING, FALLBACK_PAST } from '@/lib/sanity/eventFallback';

export async function generateStaticParams() {
  const all = [...FALLBACK_UPCOMING, ...FALLBACK_PAST];
  return all.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('common');

  let event = await fetchEventBySlug(slug);
  if (!event) {
    const fb = [...FALLBACK_UPCOMING, ...FALLBACK_PAST].find(
      (e) => e.slug === slug,
    );
    if (!fb) {
      notFound();
    }
    event = fb as any;
  }

  const title = pickFromObject((event as any).title, locale);
  const summary = (event as any).summary
    ? pickFromObject((event as any).summary, locale)
    : '';
  const bodyLocalized = (event as any).body
    ? pickFromObject((event as any).body, locale)
    : '';

  const formattedDate = (event as any).startDate
    ? new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date((event as any).startDate))
    : '';
  const startTime = (event as any).startDate
    ? new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date((event as any).startDate))
    : '';
  const endTime = (event as any).endDate
    ? new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date((event as any).endDate))
    : '';

  const location = (event as any).location ?? {};
  const category = (event as any).category ?? 'event';

  return (
    <article className="bg-mesh-cool min-h-[60vh]">
      <DecorationBlob
        tone="teal"
        position="top-right"
        size="26vmax"
        opacity={0.18}
        animationClass="animate-aurora-a"
      />
      <div className="container-narrow relative z-10 py-12 sm:py-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-brand-800 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>

        <header className="rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 p-8 sm:p-10 shadow-sm">
          <span className="pill capitalize">{category}</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-brand-900">
            {title}
          </h1>

          {summary && (
            <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed border-l-4 border-brand-800 pl-4 italic">
              {summary}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">When</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-brand-900">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {startTime}
                {endTime && ` – ${endTime}`}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Where</p>
              {location.name ? (
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-brand-900">
                  <MapPin className="h-4 w-4" />
                  {location.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500 italic">To be announced</p>
              )}
              {location.address && (
                <p className="mt-1 text-sm text-slate-600">{location.address}</p>
              )}
            </div>
          </div>

          {(event as any).rsvpLink && (
            <a
              href={(event as any).rsvpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex"
            >
              Register / RSVP <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

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
            <p className="text-slate-500 italic">More details coming soon.</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/events" className="btn-secondary inline-flex">
            ← All events
          </Link>
        </div>
      </div>
    </article>
  );
}
