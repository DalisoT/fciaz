import { Building2, GraduationCap, Users, Heart, Newspaper, HandHeart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StakeholderCardProps {
  name: string;
  category:
    | 'government'
    | 'professional'
    | 'donors'
    | 'academic'
    | 'media'
    | 'community';
}

const meta: Record<
  StakeholderCardProps['category'],
  { icon: LucideIcon; label: string; tone: string; tilt: 'left' | 'right' }
> = {
  government:   { icon: Building2,  label: 'Government',         tone: 'text-brand-800 bg-brand-50 ring-brand-200',     tilt: 'left' },
  professional: { icon: Heart,      label: 'Professional body',  tone: 'text-rose-700 bg-rose-50 ring-rose-200',         tilt: 'right' },
  donors:       { icon: HandHeart,  label: 'Development partner', tone: 'text-accent-700 bg-accent-50 ring-accent-200', tilt: 'left' },
  academic:     { icon: GraduationCap, label: 'Academic',        tone: 'text-brand-800 bg-brand-50 ring-brand-200',     tilt: 'right' },
  media:        { icon: Newspaper,  label: 'Media',              tone: 'text-slate-700 bg-slate-50 ring-slate-200',     tilt: 'left' },
  community:    { icon: Users,      label: 'Community',          tone: 'text-emerald-700 bg-emerald-50 ring-emerald-200', tilt: 'right' },
};

export function StakeholderCard({ name, category }: StakeholderCardProps) {
  const m = meta[category];
  const Icon = m.icon;
  return (
    <div className="card card-hover group">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'icon-tile-sm',
            m.tilt === 'right' && 'icon-tile-tilt-right',
            m.tone,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 transition-colors duration-300 group-hover:text-brand-700">
            {m.label}
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-brand-900">{name}</p>
        </div>
      </div>
    </div>
  );
}
