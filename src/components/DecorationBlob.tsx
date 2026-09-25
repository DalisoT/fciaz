/**
 * DecorationBlob — single decorative blob layer used to enrich page sections.
 *
 * Place inside a `relative` parent. Use sparingly; one or two per section is plenty.
 */
import { cn } from '@/lib/utils';

type BlobTone = 'navy' | 'magenta' | 'teal' | 'lavender';

interface DecorationBlobProps {
  tone?: BlobTone;
  size?: string; // e.g. "32vmax"
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'top-center'
    | 'bottom-center';
  opacity?: number; // 0..1
  animationClass?: string;
  className?: string;
}

const toneColor: Record<BlobTone, string> = {
  navy: '#240A6D',
  magenta: '#C40591',
  teal: '#1A6B7B',
  lavender: '#6736CD',
};

const positionClasses = {
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
};

export function DecorationBlob({
  tone = 'lavender',
  size = '36vmax',
  position = 'top-right',
  opacity = 0.35,
  animationClass,
  className,
}: DecorationBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full blur-3xl',
        positionClasses[position],
        animationClass,
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${toneColor[tone]}, transparent 65%)`,
        opacity,
        zIndex: 0,
      }}
    />
  );
}
