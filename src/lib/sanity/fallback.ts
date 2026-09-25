/**
 * Hardcoded fallback content for when Sanity is not configured.
 * Mirrors the shape returned by the GROQ queries so consumers don't
 * have to special-case anything.
 */
import type { SupportedLocale } from '../../../sanity/schemas/i18n';

export interface FallbackPostCard {
  _id: string;
  title: { en: string; bem: string; nya: string };
  slug: string;
  excerpt: { en: string; bem: string; nya: string };
  publishedAt: string;
  heroImage?: null;
  author?: string;
  tags?: string[];
}

export const FALLBACK_POSTS: FallbackPostCard[] = [
  {
    _id: 'fallback-1',
    slug: 'second-executive-committee-meeting',
    title: {
      en: 'Second Executive Committee meeting held',
      bem: 'Executive Committee meeting ya bubili ya citwa',
      nya: 'Msonkhano wa chipiri wa Executive Committee wachitika',
    },
    excerpt: {
      en: 'The ExCo adopted the roadmap for ZRA, PACRA, and bank account opening, and resolved to begin the Fistula Foundation grant application immediately.',
      bem: 'Ba ExCo balombele pa ZRA, PACRA, na account ya bank, kabili balombele pa Fistula Foundation grant.',
      nya: 'ExCo yavomereza dongosolo la ZRA, PACRA, ndi kutsegula akaunti ya banki, ndipo yavomereza kuyamba kukonza grant ya Fistula Foundation.',
    },
    publishedAt: '2026-07-29',
  },
  {
    _id: 'fallback-2',
    slug: 'registration-documents-submitted',
    title: {
      en: 'FCIAZ submits registration documents to the Registrar',
      bem: 'FCIAZ yatumine ifya kusendama ku Registrar',
      nya: 'FCIAZ yatumiza zikalata za kulembetsa ku Registrar',
    },
    excerpt: {
      en: 'Following initial feedback on NRC copies, certified copies were re-uploaded. Feedback from the Registrar is expected by end of week.',
      bem: 'Apo ifya kupwaisha pa NRC, ifya kupwaisha fya bwaikwa pa portal.',
      nya: 'Pambuyo pa ndemanga zoyambirira pa NRC, zikalata zovomerezeka zatumulidwanso. Mayankho a Registrar akuyembekezeka kumapeto kwa sabata.',
    },
    publishedAt: '2026-07-22',
  },
  {
    _id: 'fallback-3',
    slug: 'founding-of-fciaz',
    title: {
      en: 'Founding of the Fistula and Childbirth Injuries Association of Zambia',
      bem: 'FCIAZ yapangwa',
      nya: 'Kupangidwa kwa Bungwe la Fistula ndi Mavuto pa Kubadwa mu Zambia',
    },
    excerpt: {
      en: 'A group of Zambian clinicians, surgeons, and public health leaders come together to create a national association dedicated to advocacy, treatment, and reintegration for women affected by obstetric fistula and childbirth injuries.',
      bem: 'Ba doctor ba Zambia, ba surgeon, na batungulwa ba mimoneke bacitapo umukuni wakwe wa kubomya fistula na ifya kupwaisha pa kufyalwa.',
      nya: 'Madokotala a Zambia, ma surgeon, ndi atsogoleri azaumoyo aphatikiza kuti apange bungwe la dziko lodzipereka ku kuthandiza, chithandizo, ndi kuyambitsidwa kwa amayi amoyo ndi fistula ndi mavuto pa kubadwa.',
    },
    publishedAt: '2026-06-15',
  },
];

export const FALLBACK_POST_BODIES: Record<string, { en: string; bem: string; nya: string }> = {
  'second-executive-committee-meeting': {
    en: 'The second FCIAZ Executive Committee meeting took place on 29 July 2026 via Zoom. Members present included Dr Goshon Kasanda (Chairperson), Dr Eugine Kaunda (Secretary General), Dr Lucas Tembo (Publicity Secretary), Dr Alexander Kawimbe, and Dr Paul Zulu. Apologies were received from Dr Willies Silwimba, Dr Ngao Sichalwe, Ms Natalia Muweme, Dr Chanda Ngosa, and Dr Royd Nonde. The Committee adopted the roadmap for ZRA and PACRA registration, opening of the official FCIAZ bank account, and immediate preparation of the Fistula Foundation grant application.',
    bem: 'Executive Committee meeting ya bubili ya FCIAZ yacitwa pa 29 July 2026 pa Zoom. Bamembala abaliipo bakeba Dr Goshon Kasanda (Mwine lubilo), Dr Eugine Kaunda (Secretary General), Dr Lucas Tembo (Publicity Secretary), Dr Alexander Kawimbe, na Dr Paul Zulu. Ifya ukupwaisha fya yaisila kufuma kuli ba Dr Willies Silwimba, Dr Ngao Sichalwe, Ms Natalia Muweme, Dr Chanda Ngosa, na Dr Royd Nonde. Ba Committee balombele ifya kucita pa ZRA na PACRA, ukubula kwa account ya bank ya FCIAZ, na kuyamba kwa Fistula Foundation grant application.',
    nya: 'Msonkhano wa chipiri wa Executive Committee wa FCIAZ wachitika pa 29 July 2026 kudzera pa Zoom. Mamembala amene analipo ndi Dr Goshon Kasanda (Mtsogoleri), Dr Eugine Kaunda (Secretary General), Dr Lucas Tembo (Publicity Secretary), Dr Alexander Kawimbe, ndi Dr Paul Zulu. Olomedwa anali Dr Willies Silwimba, Dr Ngao Sichalwe, Ms Natalia Muweme, Dr Chanda Ngosa, ndi Dr Royd Nonde. Komiti yavomereza dongosolo la kulembetsa kwa ZRA ndi PACRA, kutsegulira akaunti ya banki ya FCIAZ, ndi kukonzekera grant ya Fistula Foundation.',
  },
  'registration-documents-submitted': {
    en: 'FCIAZ submitted the initial registration application to the Registrar of Societies. After feedback that the NRC copies needed certification, certified copies were obtained and re-uploaded through the registration portal. Feedback from the Registrar is expected by the end of the week.',
    bem: 'FCIAZ yatumine application ya kusendama ku Registrar wa Societies. Pa kufumya ifya kupwaisha pa NRC ifya kwendesha, ifya kwendesha fya bwaikwa pa portal. Ifya kufumya ku Registrar tulefwa kumapeto kwa sabata.',
    nya: 'FCIAZ yatumiza pempho loyambirira la kulembetsa ku Registrar of Societies. Pambuyo pa ndemanga kuti zikalata za NRC zinkafuna kusindikizidwa, zikalata zovomerezeka zinatengedwa ndi kutumizidwanso kudzera pa portal. Mayankho a Registrar akuyembekezeka kumapeto kwa sabata.',
  },
  'founding-of-fciaz': {
    en: 'The Fistula and Childbirth Injuries Association of Zambia was founded in 2026 by a group of Zambian clinicians, surgeons, and public health leaders who recognised that obstetric fistula and related childbirth injuries — though preventable and treatable — continued to affect thousands of women in silence. FCIAZ was created to give the issue a national voice and to coordinate the actors best placed to respond: government, professional societies, teaching hospitals, cooperating partners, civil society, and affected communities themselves.',
    bem: 'FCIAZ yapangwa mu 2026 na ba doctor ba Zambia, ba surgeon, na batungulwa ba mimoneke abao baebele ukuti fistula na ifya kupwaisha pa kufyalwa — nokula yafwa kupwaisha — yaleindila abanakashi bafwa bwino pa bumwa. FCIAZ yapangwa kuti ifya yafwa mashi pa nseke yonse.',
    nya: 'Bungwe la Fistula ndi Mavuto pa Kubadwa mu Zambia linapangidwa mu 2026 ndi madokotala a Zambia, ma surgeon, ndi atsogoleri azaumoyo amene anaona kuti fistula ndi mavuto pa kubadwa — ngakhale amatha kupewedwa ndi kuchiritsidwa — akupitiriza kuvutitsa amayi ambiri mwakachetechete. FCIAZ inapangidwa kuti mavutowa apeze mawu pa dziko lonse ndi kuyanjanitsa anthu omwe angathandize: boma, ma bungwe a akatswiri, zipatala zazikulu, othandizira, ndi anthu okhudzidwa.',
  },
};

export function pickFromObject<T = string>(
  obj: { en?: T; bem?: T; nya?: T } | undefined | null,
  locale: string,
): T {
  if (!obj) return '' as unknown as T;
  const safeLocale = (['en', 'bem', 'nya'] as const).includes(locale as any)
    ? locale
    : 'en';
  return (obj[safeLocale as 'en' | 'bem' | 'nya'] ?? obj.en ?? '') as T;
}

export type { SupportedLocale };
