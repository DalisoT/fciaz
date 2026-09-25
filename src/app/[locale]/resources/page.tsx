import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, FileText, Image as ImageIcon, Download } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DecorationBlob } from '@/components/DecorationBlob';
import { fetchResources } from '@/lib/sanity/fetch';
import { pickFromObject } from '@/lib/sanity/fallback';
import { cn } from '@/lib/utils';

interface Resource {
  _id: string;
  title: { en: string; bem: string; nya: string };
  description?: { en?: string; bem?: string; nya?: string };
  category: 'factsheets' | 'posters' | 'media';
  fileUrl?: string | null;
  publishedAt?: string;
  thumbnail?: any;
}

const FALLBACK_RESOURCES: Resource[] = [
  {
    _id: 'fb-res-1',
    title: {
      en: 'Obstetric fistula — at a glance',
      bem: 'Fistula — ifya pa lubilo',
      nya: 'Fistula — mwachidule',
    },
    description: {
      en: 'One-page introduction: what it is, how it happens, how it is treated.',
      bem: 'Cilonganino ca page imbi: icingi, mwaliba, mwayachirwa.',
      nya: 'Mawu a tsiku limodzi: ndi chiyani, zimachitika bwanji, zimathandizidwa bwanji.',
    },
    category: 'factsheets',
  },
  {
    _id: 'fb-res-2',
    title: {
      en: 'Pregnancy danger signs',
      bem: 'Ifya ukupwaisha pa kufyalwa',
      nya: 'Zizindikiro zoopsa pa mimba',
    },
    description: {
      en: 'For community health workers and expectant mothers.',
      bem: 'Kuli ba health worker na bana bafyalapo.',
      nya: 'Kwa ogwira ntchito zaumoyo ndi amayi oyembekeza.',
    },
    category: 'factsheets',
  },
  {
    _id: 'fb-res-3',
    title: {
      en: 'FCIAZ organisation profile',
      bem: 'Profile ya FCIAZ',
      nya: 'Mbiri ya FCIAZ',
    },
    description: {
      en: 'One-page summary suitable for partner and donor introductions.',
      bem: 'Cilonganino ca page imbi pa balundwe na abapepa.',
      nya: 'Mawu a tsiku limodzi oyenera othandizira ndi opereka.',
    },
    category: 'factsheets',
  },
  {
    _id: 'fb-res-4',
    title: {
      en: 'End fistula — get treated',
      bem: 'Bomya fistula — yambeni kuchingwa',
      nya: 'Malizani fistula — kulandani chithandizo',
    },
    description: {
      en: 'A4 poster for clinics and community noticeboards.',
      bem: 'Poster ya A4 kuli ba cipatala na fyashi.',
      nya: 'Poster ya A4 ya zipatala ndi mabodze a mmudzi.',
    },
    category: 'posters',
  },
  {
    _id: 'fb-res-5',
    title: {
      en: 'Safe motherhood — your rights',
      bem: 'Kufyalwa kwa bwino — ifyenu',
      nya: 'Umayi wotetezeka — ufulu wanu',
    },
    description: {
      en: 'Awareness poster in English, Bemba, and Nyanja.',
      bem: 'Poster mu Ciingelesi, Icibemba, na Chinyanja.',
      nya: 'Poster mu Chingelezi, Icibemba, ndi Chinyanja.',
    },
    category: 'posters',
  },
  {
    _id: 'fb-res-6',
    title: {
      en: 'FCIAZ media kit',
      bem: 'Media kit ya FCIAZ',
      nya: 'Media kit ya FCIAZ',
    },
    description: {
      en: 'Logo, brand colours, fact sheet, and press release template.',
      bem: 'Logo, ifya kwingilamo, fact sheet, na template ya press.',
      nya: 'Logo, mtundu, fact sheet, ndi template ya press.',
    },
    category: 'media',
  },
];

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('resources');
  const tCommon = await getTranslations('common');
  const email = process.env.RESEND_TO_EMAIL || 'info@fciaz.org.zm';

  const sanityResources = await fetchResources();
  const resources: Resource[] =
    sanityResources && sanityResources.length > 0
      ? (sanityResources as any)
      : FALLBACK_RESOURCES;

  const meta: Record<Resource['category'], { icon: any; tone: string }> = {
    factsheets: { icon: FileText, tone: 'text-brand-800 bg-brand-50 ring-brand-200' },
    posters: { icon: ImageIcon, tone: 'text-rose-700 bg-rose-50 ring-rose-200' },
    media: { icon: FileText, tone: 'text-accent-700 bg-accent-50 ring-accent-200' },
  };

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="relative bg-mesh-rose overflow-hidden">
        <DecorationBlob
          tone="magenta"
          position="top-right"
          size="24vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-12">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-8 ring-1 ring-white/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-900/5">
            <h2 className="text-xl font-bold text-brand-900">{t('comingSoonHeading')}</h2>
            <p className="mt-2 text-base text-slate-700 leading-relaxed">{t('comingSoonBody')}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {resources.map((r) => {
              const m = meta[r.category];
              const Icon = m.icon;
              const titleText = pickFromObject(r.title as any, locale);
              const descText = r.description ? pickFromObject(r.description as any, locale) : '';

              return (
                <div
                  key={r._id}
                  className="card card-hover resource-tile group flex flex-col h-full"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn('icon-tile-sm flex h-12 w-12', m.tone)}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-brand-900 group-hover:text-brand-800 transition-colors duration-300">
                        {titleText}
                      </h3>
                      {descText && (
                        <p className="mt-1 text-sm text-slate-600">{descText}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    {r.fileUrl ? (
                      <a
                        href={r.fileUrl}
                        className="btn-secondary text-sm resource-cta"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="icon-arrow h-4 w-4" /> Download
                      </a>
                    ) : (
                      <span className="pill">Coming soon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-mesh-cool overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="teal"
          position="bottom-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-narrow relative z-10 py-16">
          <div className="rounded-2xl glass-card group">
            <div className="flex items-center gap-3">
              <div className="icon-tile-sm text-accent-700 bg-accent-50 ring-accent-200">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-brand-900 group-hover:text-brand-800 transition-colors">
                {t('mediaKitHeading')}
              </h2>
            </div>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">
              {t('mediaKitBody', { email })}
            </p>
            <a href={`mailto:${email}`} className="btn-primary mt-5 inline-flex">
              <Mail className="h-4 w-4" /> {email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
