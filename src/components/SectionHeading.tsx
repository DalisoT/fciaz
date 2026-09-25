import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <span className="pill mb-3">{eyebrow}</span>}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-600">{subtitle}</p>
      )}
    </div>
  );
}
