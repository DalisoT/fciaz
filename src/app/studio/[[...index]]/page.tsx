/**
 * Client component that mounts Sanity Studio inside the Next.js app at /studio.
 * Metadata is exported from the parent server layout at /studio/layout.tsx.
 */
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export const dynamic = 'force-static';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
