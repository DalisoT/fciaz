import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { StakeholderCard } from '@/components/StakeholderCard';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function StakeholdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stakeholders');
  const tList = await getTranslations('stakeholdersList');
  const tCommon = await getTranslations('common');

  const groups = [
    {
      heading: t('governmentHeading'),
      intro: t('governmentIntro'),
      category: 'government' as const,
      items: ['ministryOfHealth', 'provincialHealth', 'uth'],
      bg: 'bg-mesh-warm',
      blob: 'lavender',
    },
    {
      heading: t('professionalHeading'),
      intro: t('professionalIntro'),
      category: 'professional' as const,
      items: ['ogsz', 'medicalCouncil', 'nursingCouncil'],
      bg: 'bg-mesh-rose',
      blob: 'magenta',
    },
    {
      heading: t('donorsHeading'),
      intro: t('donorsIntro'),
      category: 'donors' as const,
      items: ['fistulaFoundation', 'unfpa', 'who', 'unicef', 'jhpiego'],
      bg: 'bg-mesh-cool',
      blob: 'teal',
    },
    {
      heading: t('academicHeading'),
      intro: t('academicIntro'),
      category: 'academic' as const,
      items: ['lmmu', 'unza', 'cbu'],
      bg: 'bg-mesh-lavender',
      blob: 'lavender',
    },
    {
      heading: t('mediaHeading'),
      intro: t('mediaIntro'),
      category: 'media' as const,
      items: ['znbc', 'muvi', 'prime', 'diamond', 'dailyMail', 'timesOfZambia'],
      bg: 'bg-mesh-warm',
      blob: 'magenta',
    },
    {
      heading: t('communityHeading'),
      intro: t('communityIntro'),
      category: 'community' as const,
      items: ['traditionalLeaders', 'churches', 'womensGroups', 'chw'],
      bg: 'bg-mesh-cool',
      blob: 'teal',
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {groups.map((g, idx) => (
        <section
          key={g.heading}
          className={`relative ${g.bg} overflow-hidden ${idx === 0 ? '' : 'border-t border-white/40'}`}
        >
          <DecorationBlob
            tone={g.blob as 'lavender' | 'magenta' | 'teal'}
            position={idx % 2 === 0 ? 'top-right' : 'bottom-left'}
            size="24vmax"
            opacity={0.18}
            animationClass={idx % 2 === 0 ? 'animate-aurora-a' : 'animate-aurora-b'}
          />
          <div className="container-wide relative z-10 py-12 sm:py-16">
            <SectionHeading title={g.heading} subtitle={g.intro} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((key) => (
                <StakeholderCard
                  key={key}
                  name={tList(`${key}.name`)}
                  category={g.category}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-mesh-rose relative overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="magenta"
          position="bottom-right"
          size="22vmax"
          opacity={0.20}
          animationClass="animate-aurora-c"
        />
        <div className="container-narrow relative z-10 py-16">
          <div className="rounded-2xl glass-card text-center">
            <h2 className="text-2xl font-bold text-brand-900">{t('engagementHeading')}</h2>
            <p className="mt-3 text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
              {t('engagementBody')}
            </p>
            <a
              href="mailto:info@fciaz.org.zm"
              className="btn-primary mt-5 inline-flex"
            >
              <Mail className="h-4 w-4" /> info@fciaz.org.zm
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
