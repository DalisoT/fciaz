import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Youtube, Instagram } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { ContactForm } from '@/components/ContactForm';
import { DecorationBlob } from '@/components/DecorationBlob';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tCommon = await getTranslations('common');
  const tFooter = await getTranslations('footer');
  const email = process.env.RESEND_TO_EMAIL || 'info@fciaz.org.zm';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

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
            <div className="lg:col-span-7">
              <div className="glass-card">
                <h2 className="text-xl font-bold text-brand-900">{t('formHeading')}</h2>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <div className="card card-hover group">
                <h3 className="text-lg font-semibold text-brand-900 group-hover:text-brand-800 transition-colors">
                  {t('secretariatHeading')}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{t('secretariatBody')}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1">
                    <Mail className="mt-0.5 h-4 w-4 text-brand-800" aria-hidden="true" />
                    <a href={`mailto:${email}`} className="link-underline">
                      {email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-brand-800" aria-hidden="true" />
                    <span className="text-slate-700">+260 … (to be confirmed)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-brand-800" aria-hidden="true" />
                    <span className="text-slate-700">{t('addressValue')}</span>
                  </li>
                </ul>
              </div>

              {whatsappNumber && (
                <div className="card card-hover bg-emerald-50/70 ring-emerald-200 group">
                  <h3 className="text-lg font-semibold text-emerald-900">WhatsApp</h3>
                  <p className="mt-2 text-sm text-emerald-900/80">
                    Quick chat for media enquiries, partnership, or general questions.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-4 inline-flex !bg-[#25D366] !text-white hover:!bg-[#1ebe5d]"
                  >
                    Open WhatsApp chat
                  </a>
                </div>
              )}

              <div className="card card-hover group">
                <h3 className="text-lg font-semibold text-brand-900 group-hover:text-brand-800 transition-colors">
                  {t('socialHeading')}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{t('socialBody')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SocialLink icon={Facebook}  label={tFooter('socialFacebook')}   href="https://facebook.com" />
                  <SocialLink icon={Twitter}   label={tFooter('socialX')}         href="https://x.com" />
                  <SocialLink icon={Linkedin}  label={tFooter('socialLinkedIn')}   href="https://linkedin.com" />
                  <SocialLink icon={Instagram} label={tFooter('socialInstagram')} href="https://instagram.com" />
                  <SocialLink icon={Youtube}   label={tFooter('socialYouTube')}   href="https://youtube.com" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function SocialLink({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 ring-1 ring-inset ring-slate-200
                 transition-all duration-200 hover:text-brand-800 hover:ring-brand-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
