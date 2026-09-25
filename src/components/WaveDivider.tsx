/**
 * WaveDivider — soft SVG transition between two section background tones.
 *
 * `from` is the colour that the section ABOVE renders as;
 * `to`   is the colour the section BELOW renders as.
 *
 * The wave is filled with `to` so it visually becomes part of the next section.
 */
import { cn } from '@/lib/utils';

interface WaveDividerProps {
  from?: string; // hex/colour of the previous section
  to?: string;   // hex/colour of the next section
  flip?: boolean; // flip the curve vertically
  className?: string;
}

export function WaveDivider({
  from = '#ffffff',
  to = '#f7f3fb',
  flip = false,
  className,
}: WaveDividerProps) {
  return (
    <div
      className={cn('wave-divider h-12 sm:h-16 w-full', className)}
      aria-hidden="true"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,32 C240,80 480,80 720,52 C960,24 1200,16 1440,40 L1440,80 L0,80 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
