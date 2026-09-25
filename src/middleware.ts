import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip:
  // - api, _next, _vercel (framework internals)
  // - studio (Sanity Studio — admin UI, not localised)
  // - files with extensions (images, fonts, etc.)
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};
