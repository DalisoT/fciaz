/**
 * Server layout for the Sanity Studio route.
 * Exports metadata/viewport since those must live in a server component.
 * Renders children (the [[...index]]/page.tsx) without adding any chrome.
 */
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
