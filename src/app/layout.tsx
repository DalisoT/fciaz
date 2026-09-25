/**
 * Root layout. Provides the <html> and <body> tags so every top-level route
 * (including /studio, which doesn't sit under [locale]) renders inside a
 * valid HTML document. Per-page <html lang="..."> is set by the locale layout.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
