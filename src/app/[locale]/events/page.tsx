import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Calendar } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { DecorationBlob } from '@/components/DecorationBlob';
import { EventCard, type EventItem } from '@/components/EventCard';
import { fetchUpcomingEvents, fetchPastEvents } from '@/lib/sanity/fetch';
import {
  FALLBACK_UPCOMING,
  FALLBACK_PAST,
} from '@/lib/sanity/eventFallback';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('common');

  const [sanityUpcoming, sanityPast] = await Promise.all([
    fetchUpcomingEvents(),
    fetchPastEvents(),
  ]);

  const upcoming: EventItem[] =
    sanityUpcoming && sanityUpcoming.length > 0
      ? (sanityUpcoming as EventItem[])
      : FALLBACK_UPCOMING;
  const past: EventItem[] =
    sanityPast && sanityPast.length > 0
      ? (sanityPast as EventItem[])
      : FALLBACK_PAST;

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title="Events"
        subtitle="Upcoming awareness events, monthly meetings, and partner activities."
      />

      {/* Upcoming */}
      <section className="relative bg-mesh-cool overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="top-left"
          size="24vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-12 sm:py-16">
          <SectionHeading
            title="Upcoming events"
            subtitle="Mark your calendar — we'd love to see you there."
          />
          {upcoming.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-white/70 backdrop-blur-md p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-brand-300" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-600">
                No upcoming events scheduled yet. Subscribe to the newsletter to be notified.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event._id} event={event} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      <section className="relative bg-mesh-rose overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="magenta"
          position="bottom-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 py-12 sm:py-16">
          <SectionHeading
            title="Past highlights"
            subtitle="A record of where FCIAZ has shown up and what we have done."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event._id} event={event} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
