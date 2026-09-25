import { FileText, Image as ImageIcon, Download } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  title: string;
  description?: string;
  category: 'factsheets' | 'posters' | 'media';
  comingSoon?: boolean;
  href?: string;
}

const meta: Record<ResourceCardProps['category'], { icon: LucideIcon; tone: string }> = {
  factsheets: { icon: FileText,   tone: 'text-brand-800 bg-brand-50 ring-brand-200' },
  posters:    { icon: ImageIcon,  tone: 'text-rose-700 bg-rose-50 ring-rose-200' },
  media:      { icon: FileText,   tone: 'text-accent-700 bg-accent-50 ring-accent-200' },
};

export function ResourceCard({
  title,
  description,
  category,
  comingSoon,
  href,
}: ResourceCardProps) {
  const m = meta[category];
  const Icon = m.icon;

  return (
    <div className="card card-hover resource-tile group flex flex-col h-full">
      <div className="flex items-start gap-4 flex-1">
        <div className={cn('icon-tile-sm flex h-12 w-12', m.tone)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-brand-900 group-hover:text-brand-800 transition-colors duration-300">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {comingSoon ? (
          <span className="pill">Coming soon</span>
        ) : (
          <a
            href={href || '#'}
            className="btn-secondary text-sm resource-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="icon-arrow h-4 w-4" /> Download
          </a>
        )}
      </div>
    </div>
  );
}
