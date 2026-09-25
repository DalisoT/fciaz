/**
 * Sanity image URL builder.
 * Use for any image asset returned from a GROQ query that has a `url` field.
 */
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { getSanityClient } from './client';

const builder = () =>
  imageUrlBuilder(getSanityClient()).auto('format').fit('max');

/**
 * Build a Sanity CDN URL for an image asset, optionally with dimensions.
 * Returns null if `source` is missing or the URL can't be built.
 */
export function urlForImage(
  source: SanityImageSource | null | undefined,
  options: { width?: number; height?: number; quality?: number } = {},
): string | null {
  if (!source) return null;
  let url = builder().image(source);
  if (options.width) url = url.width(options.width);
  if (options.height) url = url.height(options.height);
  if (options.quality) url = url.quality(options.quality);
  return url.url();
}
