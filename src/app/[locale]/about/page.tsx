import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ShieldCheck, Scale, Sparkles, Microscope, HandHeart, Quote } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { BoardMemberCard } from '@/components/BoardMemberCard';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const tBoard = await getTranslations('board');
  const tCommon = await getTranslations('common');

  const members = [
    { name: tBoard('kasandaName'), role: t('memberRoleChair'), bio: tBoard('kasandaBio') },
    { name: tBoard('kaundaName'), role: t('memberRoleSecretaryGeneral'), bio: tBoard('kaundaBio') },
    { name: tBoard('temboName'), role: t('memberRolePublicity'), bio: tBoard('temboBio') },
    { name: tBoard('kawimbeName'), role: t('memberRoleCommittee'), bio: tBoard('kawimbeBio') },
    { name: tBoard('zuluName'), role: t('memberRoleCommittee'), bio: tBoard('zuluBio') },
    { name: tBoard('silwimbaName'), role: t('memberRoleCommittee'), bio: tBoard('silwimbaBio') },
    { name: tBoard('sichalweName'), role: t('memberRoleCommittee'), bio: tBoard('sichalweBio') },
    { name: tBoard('muwemeName'), role: t('memberRoleCommittee'), bio: tBoard('muwemeBio') },
    { name: tBoard('ngosaName'), role: t('memberRoleCommittee'), bio: tBoard('ngosaBio') },
    { name: tBoard('nondeName'), role: t('memberRoleCommittee'), bio: tBoard('nondeBio') },
  ];

  const values = [
    { icon: ShieldCheck, titleKey: 'valueDignityTitle', descKey: 'valueDignityDescription', tone: 'brand' },
    { icon: Scale, titleKey: 'valueIntegrityTitle', descKey: 'valueIntegrityDescription', tone: 'rose' },
    { icon: Sparkles, titleKey: 'valueEquityTitle', descKey: 'valueEquityDescription', tone: 'accent' },
    { icon: Microscope, titleKey: 'valueEvidenceTitle', descKey: 'valueEvidenceDescription', tone: 'brand' },
    { icon: HandHeart, titleKey: 'valuePartnershipTitle', descKey: 'valuePartnershipDescription', tone: 'rose' },
  ];

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* History — soft rose mesh */}
      <section className="relative bg-mesh-rose overflow-hidden">
        <DecorationBlob
          tone="magenta"
          position="top-right"
          size="26vmax"
          opacity={0.16}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading title={t('historyHeading')} />
            </div>
            <div className="lg:col-span-7">
              <div className="prose prose-slate max-w-none">
                <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                  {t('historyBody')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission + Vision — clean white with floating accents */}
      <section className="relative overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-left"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-white/80 backdrop-blur-md p-8 shadow-sm">
              <Quote className="h-8 w-8 text-brand-300" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold text-brand-900">{t('missionHeading')}</h2>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">{t('missionBody')}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white/80 backdrop-blur-md p-8 shadow-sm">
              <Quote className="h-8 w-8 text-rose-300" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold text-brand-900">{t('visionHeading')}</h2>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">{t('visionBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values — subtle warm mesh */}
      <section className="relative bg-mesh-warm overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="bottom-right"
          size="26vmax"
          opacity={0.22}
          animationClass="animate-aurora-c"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <SectionHeading
            title={t('valuesHeading')}
            subtitle={t('valuesSubheading')}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.titleKey} className="glass-card">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-brand-900">{t(v.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(v.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Board — cool mesh */}
      <section className="relative bg-mesh-cool overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="top-left"
          size="28vmax"
          opacity={0.18}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <SectionHeading title={t('boardHeading')} subtitle={t('boardSubheading')} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <BoardMemberCard key={m.name} name={m.name} role={m.role} bio={m.bio} />
            ))}
          </div>
        </div>
      </section>

      {/* Registration — clean cream */}
      <section className="py-16 sm:py-20 bg-dots-light">
        <div className="container-narrow">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 backdrop-blur-md p-8 shadow-sm">
            <span className="pill mb-3 !bg-amber-100 !text-amber-800 !ring-amber-200">
              {t('registrationPending')}
            </span>
            <h2 className="text-2xl font-bold text-brand-900">{t('registrationHeading')}</h2>
            <p className="mt-3 text-base text-slate-700 leading-relaxed">{t('registrationBody')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
