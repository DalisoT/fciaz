import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  title: string;
  date: string;
  excerpt: string;
  locale?: string;
  href?: string;
}

export function NewsCard({ title, date, excerpt, locale = 'en', href }: NewsCardProps) {
  const formatted = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

  const inner = (
    <>
      <div className="news-date flex items-center gap-2 text-xs font-medium text-rose-700">
        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
        <time dateTime={date}>{formatted}</time>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-brand-900 group-hover:text-brand-800 transition-colors duration-300">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{excerpt}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-800 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
        Read more
        <span aria-hidden="true">→</span>
      </div>
    </>
  );

  if (href) {
    return (
      <article className="card card-hover news-tile group">
        <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md">
          {inner}
        </Link>
      </article>
    );
  }

  return <article className={cn('card card-hover news-tile group')}>{inner}</article>;
}
