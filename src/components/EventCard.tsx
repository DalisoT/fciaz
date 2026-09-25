import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { pickFromObject } from '@/lib/sanity/fallback';

export interface EventItem {
  _id: string;
  title: { en: string; bem: string; nya: string };
  slug: string;
  summary?: { en?: string; bem?: string; nya?: string };
  startDate: string;
  endDate?: string;
  location?: { name?: string; address?: string; city?: string };
  category?: string;
}

interface EventCardProps {
  event: EventItem;
  locale?: string;
}

export function EventCard({ event, locale = 'en' }: EventCardProps) {
  const title = pickFromObject(event.title, locale);
  const summary = event.summary ? pickFromObject(event.summary, locale) : '';

  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(event.startDate));

  const startTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.startDate));

  return (
    <Link
      href={`/events/${event.slug}`}
      className="card card-hover group block"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-brand-800 to-brand-950 text-white shadow-md ring-1 ring-brand-200">
          <span className="text-[10px] uppercase tracking-wider opacity-80">
            {new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(event.startDate))}
          </span>
          <span className="text-xl font-bold leading-none">
            {new Date(event.startDate).getDate()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          {event.category && (
            <span className="pill capitalize">{event.category}</span>
          )}
          <h3 className="mt-1 text-base font-semibold text-brand-900 group-hover:text-brand-800 transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3 w-3" /> {formatted} · {startTime}
          </p>
          {event.location?.name && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3 w-3" /> {event.location.name}
            </p>
          )}
          {summary && (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{summary}</p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-800" aria-hidden="true" />
      </div>
    </Link>
  );
}
