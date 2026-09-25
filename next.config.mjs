import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Helps with stable vendor-chunk generation for next-intl + @formatjs
  // and reduces the "Cannot find module './vendor-chunks/@formatjs.js'"
  // race when `npm run dev` and `next build` artefacts coexist.
  transpilePackages: ['next-intl'],
};

export default withNextIntl(nextConfig);
