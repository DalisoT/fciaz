/**
 * Static fallback data for the events page, used when Sanity is not
 * configured or returns an empty result. Lives outside of any `page.tsx`
 * because Next.js App Router restricts what a route file may export.
 */
import type { EventItem } from '@/components/EventCard';

export const FALLBACK_UPCOMING: EventItem[] = [
  {
    _id: 'fallback-event-1',
    slug: 'international-day-end-obstetric-fistula-2026',
    title: {
      en: 'International Day to End Obstetric Fistula — 23 May 2026',
      bem: 'Lubilo lwa International Day to End Obstetric Fistula — 23 May 2026',
      nya: 'Tsiku la International Day to End Obstetric Fistula — 23 May 2026',
    },
    summary: {
      en: 'A national awareness day. FCIAZ joins the global community in raising awareness about obstetric fistula and the women affected.',
      bem: 'Lubilo lwa pa nseke. FCIAZ yacita pamo na nseke yonse pa kupwaisha ifya fistula.',
      nya: 'Tsiku la padziko lonse. FCIAZ imagwirizana ndi anthu a pa dziko lonse kuti aphunzitse.',
    },
    startDate: '2026-05-23T09:00:00Z',
    location: { name: 'Lusaka (multiple venues)', city: 'Lusaka' },
    category: 'advocacy',
  },
  {
    _id: 'fallback-event-2',
    slug: 'monthly-executive-committee-meeting-august-2026',
    title: {
      en: 'Monthly Executive Committee meeting',
      bem: 'Monthly Executive Committee meeting',
      nya: 'Msonkhano wa mwezi uliwonse wa Executive Committee',
    },
    summary: {
      en: 'Ordinary ExCo meeting on the last Wednesday of the month. Progress on Fistula Foundation grant, registration, partnerships.',
      bem: 'ExCo ya mwezi pa Wednesday ya kumapeto. Ifya kucita pa grant, kusendama, balundwe.',
      nya: 'Msonkhano wa ExCo wa mwezi pa Lachitatu lomaliza. Zochitika pa grant, kulembetsa, ubwenzi.',
    },
    startDate: '2026-08-26T18:00:00Z',
    location: { name: 'Zoom', city: 'Online' },
    category: 'community',
  },
];

export const FALLBACK_PAST: EventItem[] = [
  {
    _id: 'fallback-event-past-1',
    slug: 'second-executive-committee-meeting-29-july-2026',
    title: {
      en: 'Second Executive Committee meeting',
      bem: 'Executive Committee meeting ya bubili',
      nya: 'Msonkhano wa chipiri wa Executive Committee',
    },
    summary: {
      en: 'Adopted the ZRA/PACRA/bank-account roadmap and resolved to begin the Fistula Foundation grant application.',
      bem: 'Balombele ifya kucita pa ZRA/PACRA/account ya bank na kuyamba kwa Fistula Foundation grant.',
      nya: 'Anavomereza dongosolo la ZRA/PACRA/akaunti ya banki ndi kuyamba kukonza grant ya Fistula Foundation.',
    },
    startDate: '2026-07-29T18:00:00Z',
    location: { name: 'Zoom', city: 'Online' },
    category: 'community',
  },
  {
    _id: 'fallback-event-past-2',
    slug: 'founding-meeting-june-2026',
    title: {
      en: 'Founding meeting of FCIAZ',
      bem: 'Meeting ya kuyamba FCIAZ',
      nya: 'Msonkhano woyambira wa FCIAZ',
    },
    summary: {
      en: 'A group of Zambian clinicians, surgeons, and public health leaders came together to form FCIAZ.',
      bem: 'Ba doctor ba Zambia, ba surgeon, na batungulwa ba mimoneke bacitapo kuyamba FCIAZ.',
      nya: 'Madokotala a Zambia, ma surgeon, ndi atsogoleri azaumoyo adaphatikiza kupanga FCIAZ.',
    },
    startDate: '2026-06-15T15:00:00Z',
    location: { name: 'Lusaka', city: 'Lusaka' },
    category: 'community',
  },
];
