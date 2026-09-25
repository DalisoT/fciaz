import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Building2, Smartphone, Gift, ShieldCheck, Heart, Handshake } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('donate');
  const tCommon = await getTranslations('common');
  const email = process.env.RESEND_TO_EMAIL || 'info@fciaz.org.zm';

  const bank = {
    name: process.env.NEXT_PUBLIC_DONATE_BANK_NAME || '',
    accountName: process.env.NEXT_PUBLIC_DONATE_BANK_ACCOUNT_NAME || '',
    accountNumber: process.env.NEXT_PUBLIC_DONATE_BANK_ACCOUNT_NUMBER || '',
    branch: process.env.NEXT_PUBLIC_DONATE_BANK_BRANCH || '',
    swift: process.env.NEXT_PUBLIC_DONATE_BANK_SWIFT || '',
  };

  const mobileProviders = [
    {
      key: 'mtn',
      name: process.env.NEXT_PUBLIC_DONATE_MTN_MOMO_NAME || '',
      number: process.env.NEXT_PUBLIC_DONATE_MTN_MOMO_NUMBER || '',
      nameLabel: t('mtnNameLabel'),
      numberLabel: t('mtnNumberLabel'),
      stepsHeading: t('mtnStepsHeading'),
      steps: [t('mtnStep1'), t('mtnStep2'), t('mtnStep3'), t('mtnStep4'), t('mtnStep5', { email })],
    },
    {
      key: 'airtel',
      name: process.env.NEXT_PUBLIC_DONATE_AIRTEL_MONEY_NAME || '',
      number: process.env.NEXT_PUBLIC_DONATE_AIRTEL_MONEY_NUMBER || '',
      nameLabel: t('airtelNameLabel'),
      numberLabel: t('airtelNumberLabel'),
      stepsHeading: t('airtelStepsHeading'),
      steps: [
        t('airtelStep1'),
        t('airtelStep2'),
        t('airtelStep3'),
        t('airtelStep4'),
        t('airtelStep5', { email }),
      ],
    },
    {
      key: 'zamtel',
      name: process.env.NEXT_PUBLIC_DONATE_ZAMTEL_MONEY_NAME || '',
      number: process.env.NEXT_PUBLIC_DONATE_ZAMTEL_MONEY_NUMBER || '',
      nameLabel: t('zamtelNameLabel'),
      numberLabel: t('zamtelNumberLabel'),
      stepsHeading: t('zamtelStepsHeading'),
      steps: [
        t('zamtelStep1'),
        t('zamtelStep2'),
        t('zamtelStep3'),
        t('zamtelStep4'),
        t('zamtelStep5', { email }),
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

      <section className="relative bg-mesh-warm overflow-hidden">
        <DecorationBlob
          tone="lavender"
          position="top-left"
          size="26vmax"
          opacity={0.20}
          animationClass="animate-aurora-a"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Bank transfer */}
            <article className="card card-hover lg:col-span-7 group">
              <div className="flex items-center gap-3">
                <div className="icon-tile-sm text-brand-800 bg-brand-50 ring-brand-200">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-brand-900 group-hover:text-brand-800 transition-colors">
                  {t('sectionBankHeading')}
                </h2>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t('sectionBankBody', { email })}
              </p>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <Field label={t('bankNameLabel')} value={bank.name} mono />
                <Field label={t('bankAccountNameLabel')} value={bank.accountName} />
                <Field label={t('bankAccountNumberLabel')} value={bank.accountNumber} mono />
                <Field label={t('bankBranchLabel')} value={bank.branch} />
                <Field label={t('bankSwiftLabel')} value={bank.swift} mono />
              </dl>
              {!bank.accountNumber && (
                <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
                  Bank details pending — bank account opens after PACRA/ZRA registration. Final details will be updated on this page.
                </p>
              )}
            </article>

            {/* Mobile money — intro card */}
            <article className="card card-hover lg:col-span-5 group">
              <div className="flex items-center gap-3">
                <div className="icon-tile-sm icon-tile-tilt-right text-accent-700 bg-accent-50 ring-accent-200">
                  <Smartphone className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-brand-900 group-hover:text-brand-800 transition-colors">
                  {t('sectionMobileHeading')}
                </h2>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t('sectionMobileBody')}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {tCommon('siteName')} accepts MTN MoMo, Airtel Money, and Zamtel Money.
              </p>
            </article>
          </div>

          {/* Mobile money providers — three full cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {mobileProviders.map((provider, idx) => (
              <article
                key={provider.key}
                className="card card-feature group"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="pill">Provider {idx + 1}</span>
                  <ProviderBadge name={provider.name || provider.key.toUpperCase()} />
                </div>

                <h3 className="mt-3 text-base font-semibold text-brand-900">
                  {provider.nameLabel}
                </h3>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {provider.numberLabel}
                </p>
                <p className="mt-1 font-mono text-lg text-brand-900">
                  {provider.number || '—'}
                </p>

                <h4 className="mt-5 text-sm font-semibold text-brand-900">
                  {provider.stepsHeading}
                </h4>
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {provider.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 transition-all duration-200 hover:translate-x-1">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-800">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-mesh-cool overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="teal"
          position="top-right"
          size="22vmax"
          opacity={0.20}
          animationClass="animate-aurora-b"
        />
        <div className="container-wide relative z-10 py-16 sm:py-20">
          <SectionHeading title={t('sectionOtherHeading')} />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <OtherCard icon={Gift} text={t('otherInKind')} />
            <OtherCard icon={Heart} text={t('otherLegacy')} />
            <OtherCard icon={Handshake} text={t('otherCorporate')} />
          </div>
          <p className="mt-6 text-sm text-slate-600 text-center max-w-2xl mx-auto">
            {t('otherContact')}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/40">
        <DecorationBlob
          tone="lavender"
          position="bottom-right"
          size="22vmax"
          opacity={0.16}
          animationClass="animate-aurora-c"
        />
        <div className="container-narrow relative z-10 py-16 sm:py-20">
          <div className="rounded-2xl bg-emerald-50/80 backdrop-blur-md p-8 ring-1 ring-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/10">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200 transition-transform duration-300 hover:scale-110">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">{t('transparencyHeading')}</h3>
                <p className="mt-2 text-sm text-emerald-900/80 leading-relaxed">{t('transparencyBody')}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-brand-900">{t('thankYouHeading')}</h2>
            <p className="mt-3 text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
              {t('thankYouBody')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={`mt-1 text-sm text-brand-900 ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || '—'}
      </dd>
    </div>
  );
}

function OtherCard({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="card card-hover text-center group">
      <Icon className="mx-auto h-6 w-6 text-brand-800 transition-all duration-300 group-hover:scale-110 group-hover:text-rose-700" aria-hidden="true" />
      <p className="mt-3 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function ProviderBadge({ name }: { name: string }) {
  const upper = name.toUpperCase();
  let tone = 'bg-slate-100 text-slate-700 ring-slate-200';
  if (upper.includes('MTN'))    tone = 'bg-yellow-50 text-yellow-800 ring-yellow-200';
  else if (upper.includes('AIRTEL')) tone = 'bg-red-50 text-red-700 ring-red-200';
  else if (upper.includes('ZAMTEL')) tone = 'bg-emerald-50 text-emerald-800 ring-emerald-200';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ring-1 ring-inset ${tone}`}>
      {upper.split(' ')[0]}
    </span>
  );
}
