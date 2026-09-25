import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Microscope } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { PillarCard } from '@/components/PillarCard';
import { Check } from 'lucide-react';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function WhatWeDoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('whatWeDo');
  const tCommon = await getTranslations('common');

  const pillars = [
    {
      variant: 'advocacy' as const,
      title: t('advocacyTitle'),
      tagline: t('advocacyTagline'),
      body: t('advocacyBody'),
      points: [
        t('advocacyPoint1'),
        t('advocacyPoint2'),
        t('advocacyPoint3'),
        t('advocacyPoint4'),
      ],
    },
    {
      variant: 'treatment' as const,
      title: t('treatmentTitle'),
      tagline: t('treatmentTagline'),
      body: t('treatmentBody'),
      points: [
        t('treatmentPoint1'),
        t('treatmentPoint2'),
        t('treatmentPoint3'),
        t('treatmentPoint4'),
      ],
    },
    {
      variant: 'integration' as const,
      title: t('integrationTitle'),
      tagline: t('integrationTagline'),
      body: t('integrationBody'),
      points: [
        t('integrationPoint1'),
        t('integrationPoint2'),
        t('integrationPoint3'),
        t('integrationPoint4'),
      ],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Three pillars summary — warm mesh */}
      <section className="relative bg-mesh-warm overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-left"
          size="26vmax"
          opacity={0.22}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <PillarCard
              variant="advocacy"
              title={t('advocacyTitle')}
              description={t('advocacyTagline')}
            />
            <PillarCard
              variant="treatment"
              title={t('treatmentTitle')}
              description={t('treatmentTagline')}
            />
            <PillarCard
              variant="integration"
              title={t('integrationTitle')}
              description={t('integrationTagline')}
            />
          </div>
        </div>
      </section>

      {/* Detailed pillars — clean white with floating accents */}
      <section className="relative overflow-hidden">
        <DecorationBlob
          tone="magenta"
          position="top-right"
          size="22vmax"
          opacity={0.16}
          animationClass="animate-aurora-b"
        />
        <DecorationBlob
          tone="lavender"
          position="bottom-left"
          size="22vmax"
          opacity={0.14}
          animationClass="animate-aurora-c"
        />
        <div className="container-wide relative z-10 pb-16 sm:pb-20">
          <div className="space-y-8">
            {pillars.map((p, idx) => (
              <article
                key={p.title}
                className="group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-8 sm:p-10 shadow-sm
                           transition-all duration-300 ease-out
                           hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 hover:border-brand-200
                           lg:grid lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-5">
                  <span className="pill mb-3 transition-colors group-hover:bg-brand-100">
                    0{idx + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">{p.title}</h2>
                  <p className="mt-2 text-base font-medium text-rose-700">{p.tagline}</p>
                  <p className="mt-4 text-base text-slate-600 leading-relaxed">{p.body}</p>
                </div>
                <div className="lg:col-span-7 mt-6 lg:mt-0">
                  <ul className="space-y-3">
                    {p.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Research — cool mesh */}
      <section className="relative bg-mesh-cool overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="bottom-right"
          size="26vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading title={t('researchTitle')} subtitle={t('researchTagline')} />
            </div>
            <div className="lg:col-span-7">
              <p className="text-base text-slate-700 leading-relaxed">{t('researchBody')}</p>
              <ul className="mt-5 space-y-3">
                {[t('researchPoint1'), t('researchPoint2'), t('researchPoint3')].map((p, i) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-lg border border-transparent bg-white/60 backdrop-blur-sm p-3 transition-all duration-200
                               hover:border-accent-200 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                      <Microscope className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
