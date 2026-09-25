import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { PillarCard } from '@/components/PillarCard';
import { BoardMemberCard } from '@/components/BoardMemberCard';
import { WaveDivider } from '@/components/WaveDivider';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tBoard = await getTranslations('board');
  const tAbout = await getTranslations('about');

  const boardPreview = [
    { name: tBoard('kasandaName'), role: tAbout('memberRoleChair'), bio: tBoard('kasandaBio') },
    { name: tBoard('kaundaName'), role: tAbout('memberRoleSecretaryGeneral'), bio: tBoard('kaundaBio') },
    { name: tBoard('temboName'), role: tAbout('memberRolePublicity'), bio: tBoard('temboBio') },
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="bg-hero-fciaz relative">
        {/* floating aurora blobs are produced by globals.css `.bg-hero-fciaz::before/::after` */}
        <span className="blob-c" aria-hidden="true" />
        <div className="container-wide relative z-10 py-20 sm:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="pill mb-4 bg-white/80 backdrop-blur ring-brand-200">
                {t('heroEyebrow')}
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-brand-900 leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-700">
                {t('heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/get-involved" className="btn-primary shadow-lg shadow-brand-900/25">
                  {t('heroPrimaryCta')} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/what-we-do" className="btn-secondary">
                  {t('heroSecondaryCta')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4">
                <StatCard
                  value={t('stat1Value')}
                  label={t('stat1Label')}
                  tone="brand"
                />
                <StatCard
                  value={t('stat2Value')}
                  label={t('stat2Label')}
                  tone="rose"
                />
                <StatCard
                  value={t('stat3Value')}
                  label={t('stat3Label')}
                  tone="accent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pillars (warm mesh) ===== */}
      <section className="relative bg-mesh-warm overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-left"
          size="30vmax"
          opacity={0.25}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <SectionHeading
            eyebrow=""
            title={t('pillarsHeading')}
            subtitle={t('pillarsSubheading')}
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <PillarCard
              variant="advocacy"
              title={t('pillarAdvocacyTitle')}
              description={t('pillarAdvocacyDescription')}
            />
            <PillarCard
              variant="treatment"
              title={t('pillarTreatmentTitle')}
              description={t('pillarTreatmentDescription')}
            />
            <PillarCard
              variant="integration"
              title={t('pillarIntegrationTitle')}
              description={t('pillarIntegrationDescription')}
            />
          </div>
        </div>
      </section>

      {/* ===== Mission + Vision (clean with subtle accents) ===== */}
      <section className="relative overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="top-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <DecorationBlob
          tone="magenta"
          position="bottom-left"
          size="22vmax"
          opacity={0.14}
          animationClass="animate-aurora-c"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-brand-100/80 bg-white/70 backdrop-blur-md p-8 shadow-sm">
              <span className="pill mb-3">Mission</span>
              <h2 className="text-2xl font-bold text-brand-900">{t('missionHeading')}</h2>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">{t('missionBody')}</p>
            </div>
            <div className="rounded-2xl border border-rose-100/80 bg-white/70 backdrop-blur-md p-8 shadow-sm">
              <span className="pill mb-3 !bg-rose-50 !text-rose-700 !ring-rose-200">
                Vision
              </span>
              <h2 className="text-2xl font-bold text-brand-900">{t('visionHeading')}</h2>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">{t('visionBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Board snapshot (cool mesh + dots) ===== */}
      <section className="relative bg-mesh-cool overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="bottom-right"
          size="28vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              title={t('boardSnapshotHeading')}
              subtitle={t('boardSnapshotSubheading')}
            />
            <Link href="/about" className="btn-ghost">
              {t('boardSnapshotCta')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {boardPreview.map((m) => (
              <BoardMemberCard key={m.name} name={m.name} role={m.role} bio={m.bio} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA banner (deep navy-magenta-teal aurora) ===== */}
      <section className="py-10 sm:py-16">
        <div className="container-wide">
          <div className="bg-cta-deep overflow-hidden rounded-3xl text-white">
            <div className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {t('ctaHeading')}
                  </h2>
                  <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl">
                    {t('ctaBody')}
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    href="/donate"
                    className="btn bg-accent-400 text-brand-950 hover:bg-accent-300 shadow-lg shadow-accent-500/30"
                  >
                    {t('ctaPrimaryButton')}
                  </Link>
                  <Link
                    href="/volunteer"
                    className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
                  >
                    {t('ctaSecondaryButton')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'brand' | 'rose' | 'accent';
}) {
  const tones = {
    brand: 'bg-white/85 ring-brand-200 text-brand-900 backdrop-blur-md',
    rose: 'bg-rose-50/85 ring-rose-200 text-rose-900 backdrop-blur-md',
    accent: 'bg-accent-50/85 ring-accent-200 text-accent-900 backdrop-blur-md',
  } as const;
  return (
    <div className={`rounded-xl ring-1 ring-inset p-5 shadow-sm ${tones[tone]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <p className="mt-1 text-sm leading-snug opacity-80">{label}</p>
    </div>
  );
}
