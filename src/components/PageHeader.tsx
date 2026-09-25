import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: PageHeaderProps) {
  return (
    <section className={cn('hero-pattern border-b border-slate-200 bg-white', className)}>
      <div className="container-wide py-14 sm:py-20">
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
          {eyebrow && <span className="pill mb-4">{eyebrow}</span>}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
