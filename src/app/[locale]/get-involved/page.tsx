import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Heart, HandHeart, Users, Megaphone, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function GetInvolvedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('getInvolved');
  const tCommon = await getTranslations('common');

  const cards = [
    {
      icon: Heart,
      titleKey: 'donateTitle',
      bodyKey: 'donateBody',
      ctaKey: 'donateCta',
      href: '/donate',
      tone: 'rose' as const,
    },
    {
      icon: HandHeart,
      titleKey: 'volunteerTitle',
      bodyKey: 'volunteerBody',
      ctaKey: 'volunteerCta',
      href: '/volunteer',
      tone: 'brand' as const,
    },
    {
      icon: Users,
      titleKey: 'partnerTitle',
      bodyKey: 'partnerBody',
      ctaKey: 'partnerCta',
      href: '/contact',
      tone: 'accent' as const,
    },
    {
      icon: Megaphone,
      titleKey: 'advocateTitle',
      bodyKey: 'advocateBody',
      ctaKey: 'advocateCta',
      href: '/resources',
      tone: 'brand' as const,
    },
  ];

  const tones: Record<typeof cards[number]['tone'], string> = {
    brand: 'bg-brand-50 text-brand-800 ring-brand-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  };

  return (
    <>
      <PageHeader
        eyebrow={tCommon('siteName')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Cards — clean white */}
      <section className="relative overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-right"
          size="22vmax"
          opacity={0.18}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.titleKey}
                  href={c.href}
                  className="glass-card group block hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-900/10 transition"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ring-1 ring-inset ${tones[c.tone]}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-brand-900">
                    {t(c.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t(c.bodyKey)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-800 group-hover:underline">
                    {t(c.ctaKey)} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campaigns — aurora glow */}
      <section className="relative bg-mesh-rose overflow-hidden">
        <DecorationBlob
          tone="magenta"
          position="top-right"
          size="32vmax"
          opacity={0.18}
          animationClass="animate-aurora-a"
        />
        <DecorationBlob
          tone="teal"
          position="bottom-left"
          size="28vmax"
          opacity={0.18}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <SectionHeading
            eyebrow={
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            }
            title={t('campaignsHeading')}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-8 text-white shadow-xl shadow-brand-900/25 overflow-hidden relative">
              <span className="pill mb-3 !bg-white/10 !text-white !ring-white/30">
                Campaign
              </span>
              <h3 className="text-xl font-bold">{t('campaignFacesTitle')}</h3>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">{t('campaignFacesBody')}</p>
            </article>
            <article className="rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 p-8 text-white shadow-xl shadow-rose-900/25 overflow-hidden relative">
              <span className="pill mb-3 !bg-white/10 !text-white !ring-white/30">
                23 May
              </span>
              <h3 className="text-xl font-bold">{t('campaignDayTitle')}</h3>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">{t('campaignDayBody')}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
