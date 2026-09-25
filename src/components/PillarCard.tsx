import { cn } from '@/lib/utils';
import { HeartHandshake, Stethoscope, HeartPulse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PillarCardProps {
  variant: 'advocacy' | 'treatment' | 'integration';
  title: string;
  description: string;
}

const variants: Record<
  PillarCardProps['variant'],
  { icon: LucideIcon; ring: string; bg: string; text: string }
> = {
  // Advocacy → navy/purple (matches logo's "ADVOCACY" colour)
  advocacy: {
    icon: HeartHandshake,
    ring: 'ring-brand-200',
    bg: 'bg-brand-50',
    text: 'text-brand-800',
  },
  // Treatment → magenta (matches logo's "TREATMENT" colour)
  treatment: {
    icon: Stethoscope,
    ring: 'ring-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
  // Reintegration → teal (matches logo's "REINTEGRATION" colour)
  integration: {
    icon: HeartPulse,
    ring: 'ring-accent-200',
    bg: 'bg-accent-50',
    text: 'text-accent-700',
  },
};

export function PillarCard({ variant, title, description }: PillarCardProps) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div className="card card-feature pillar-tile group">
      {/* Decorative orb that fades in on hover */}
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full',
          'bg-gradient-to-br opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-50',
          variant === 'advocacy' && 'from-brand-200 to-brand-50',
          variant === 'treatment' && 'from-rose-200 to-rose-50',
          variant === 'integration' && 'from-accent-200 to-accent-50',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'pillar-icon inline-flex h-12 w-12 items-center justify-center rounded-lg ring-1 ring-inset',
          v.bg,
          v.ring,
          v.text,
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-brand-900 group-hover:text-brand-800 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
