import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Security headers applied to every response.
 *
 * - HSTS: enforce HTTPS for two years, include subdomains, preload-ready
 * - X-Frame-Options: DENY — prevent clickjacking
 * - X-Content-Type-Options: nosniff — stop MIME sniffing
 * - Referrer-Policy: strict-origin-when-cross-origin — don't leak full URLs
 * - Permissions-Policy: disable unused powerful features by default
 * - CSP: a moderate policy that allows Sanity CDN images + Supabase + Resend.
 *   Adjust as new third-party integrations are added.
 * - Strict transport security only takes effect over HTTPS — Vercel sets
 *   this automatically when serving.
 */
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js hydration
      "style-src 'self' 'unsafe-inline'",                  // Tailwind + inline styles
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.sanity.io https://api.resend.com https://*.sanity-cdn.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-intl'],

  async headers() {
    return [
      {
        // Apply to every route
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Disable powered-by header (information leak)
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
