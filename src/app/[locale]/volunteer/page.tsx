import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { VolunteerForm } from '@/components/VolunteerForm';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('volunteer');
  const tCommon = await getTranslations('common');

  const activities = [
    t('whatPoint1'),
    t('whatPoint2'),
    t('whatPoint3'),
    t('whatPoint4'),
    t('whatPoint5'),
  ];

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="relative bg-mesh-cool overflow-hidden">
        <DecorationBlob
          tone="teal"
          position="top-left"
          size="26vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <DecorationBlob
          tone="lavender"
          position="bottom-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading title={t('whatHeading')} />
              <ul className="mt-6 space-y-3">
                {activities.map((a) => (
                  <li
                    key={a}
                    className="flex items-start gap-3 rounded-lg border border-transparent bg-white/60 backdrop-blur-sm p-3 transition-all duration-200
                               hover:border-accent-200 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-transform duration-300 group-hover:rotate-12">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-card relative overflow-hidden">
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-brand-200 to-brand-50 opacity-50" aria-hidden="true" />
                <h2 className="text-xl font-bold text-brand-900 relative">{tCommon('siteName')} — Volunteer application</h2>
                <p className="mt-1 text-sm text-slate-600 relative">{t('subtitle')}</p>
                <div className="mt-6 relative">
                  <VolunteerForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
