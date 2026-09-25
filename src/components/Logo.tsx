import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Render compact emblem-only (no wordmark) — useful in tight header contexts. */
  compact?: boolean;
  /** Adapt colours for placement on a dark background. */
  variant?: 'light' | 'dark' | 'auto';
  /** Pixel height of the rendered image. Width is auto from aspect ratio. */
  height?: number;
}

/**
 * FCIAZ official logo.
 * Source: `public/fciaz-logo.png` (the approved emblem + wordmark + tagline).
 *
 * The PNG already contains the navy → magenta → teal gradient and the
 * "Advocacy · Treatment · Reintegration" tagline, so we render it as-is
 * via next/image with the brand palette taken from `tailwind.config.ts`.
 */
export function Logo({
  className,
  compact = false,
  height = 56,
}: LogoProps) {
  // Official PNG aspect ratio: 1624 × 969 ≈ 1.676 : 1
  const ASPECT = 1624 / 969;
  const width = Math.round(height * ASPECT);

  if (compact) {
    // Tight variant: link only, minimal alt text.
    return (
      <Link href="/" className={cn('inline-flex items-center', className)} aria-label="FCIAZ Home">
        <Image
          src="/fciaz-logo.png"
          alt="FCIAZ — Fistula and Childbirth Injuries Association of Zambia"
          width={width}
          height={height}
          priority
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn('inline-flex items-center', className)} aria-label="FCIAZ Home">
      <Image
        src="/fciaz-logo.png"
        alt="FCIAZ — Fistula and Childbirth Injuries Association of Zambia"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
