# FCIAZ Web

A multilingual (English · Icibemba · Chinyanja) public-facing website for the **Fistula and Childbirth Injuries Association of Zambia (FCIAZ)**.

Built with Next.js 14 (App Router), Tailwind CSS, next-intl, Supabase, Resend, and **Sanity CMS** for content management.

---

## Content management (Sanity)

The FCIAZ website ships with a **Sanity Studio** embedded at `/studio`. The Publicity Secretary can publish news, events, and downloadable resources without touching code.

### First-time setup

1. Create a free Sanity account at <https://www.sanity.io>.
2. Create a new project (name it "FCIAZ"). Note the **Project ID**.
3. Add a token at **API → Tokens → Add API token**, name it `FCIAZ Web (read-only)`, permission **Viewer**. Copy the token.
4. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=...
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
   SANITY_API_READ_TOKEN=sk...
   ```
5. Invite the Publicity Secretary as a project member (Sanity dashboard → Members → Invite).

### Daily workflow

1. Go to `https://fciaz.org.zm/studio` and log in with the Sanity credentials.
2. Pick a content type in the sidebar:
   - **Site settings** — singleton for org name, address, phone, social links
   - **News posts** — articles with title, slug, excerpt, body, hero image, locale fields
   - **Events** — title, slug, date/time, location, category, RSVP link
   - **Resources** — title, category, file upload (PDF, DOCX, image)
3. Fill the fields. **Every translatable string has three inputs** — English, Icibemba, Chinyanja — side-by-side. You can leave a translation blank and it will fall back to English on the public site.
4. Upload images by dragging into the image field — they go to Sanity's CDN and are served at optimal sizes automatically.
5. Click **Publish**. The page is live on the public site within ~60 seconds (the public site revalidates via Next.js cache tags).

### Content type cheat sheet

| Type | Use for | URL pattern |
| --- | --- | --- |
| News post | Articles, announcements, awareness stories | `/news/[slug]` |
| Event | Upcoming and past events, meetings | `/events/[slug]` |
| Resource | PDFs (factsheets, posters, media kit) | shown on `/resources` |
| Site settings | Org name, address, phone, social, WhatsApp | footer + contact + donate |

### Customising the schemas

Schemas live in `sanity/schemas/`. To add a new field, edit the appropriate schema file (e.g. `sanity/schemas/post.ts`) and redeploy. The Studio will pick up the change on next reload.

### Adding more languages

Edit `sanity/schemas/i18n.ts` and add the locale to the `SUPPORTED_LOCALES` tuple. Then update `src/lib/sanity/queries.ts` (`pickLocale`) and add a translation file under `messages/`. Refresh the Studio.

### Hardcoded fallback

When Sanity is not configured (no env vars), every CMS-backed page falls back to a hardcoded list — `src/lib/sanity/fallback.ts` and `src/lib/sanity/eventFallback.ts`. Edit those files to update the fallback content.

---

## What's in the box

### Pages (per locale)

| Path | Purpose |
| --- | --- |
| `/` | Hero, mission, three pillars, board snapshot, CTA |
| `/about` | History, mission, vision, values, full board, legal status |
| `/what-we-do` | Detailed Advocacy · Treatment · Rehabilitation + Research |
| `/stakeholders` | Partners grouped by Government, Professional bodies, Donors, Academic, Media, Community |
| `/get-involved` | Donate / Volunteer / Partner / Advocate tiles + Featured campaigns |
| `/donate` | Bank transfer + **MTN MoMo · Airtel Money · Zamtel Money** + other ways to give |
| `/resources` | Factsheets, posters, media kit (placeholders for v1) |
| `/volunteer` | Volunteer signup form (writes to Supabase + emails secretariat) |
| `/news` | News archive (Sanity CMS, with hardcoded fallback) |
| `/news/[slug]` | Individual article page |
| `/events` | Events archive (Sanity CMS, with hardcoded fallback) |
| `/events/[slug]` | Individual event page |
| `/studio` | Sanity content studio (login required) |
| `/contact` | Contact form (writes to Supabase + emails secretariat) + social links |

### Features

- **Three-language switcher** (English · Icibemba · Chinyanja) — locale-aware routing under `/en`, `/bem`, `/nya` with SEO-ready metadata and OG image per locale.
- **Donations** — manual page showing bank account + all three mobile money providers with provider-specific steps.
- **Newsletter** — collects email into Supabase `newsletter_subscribers` (self-hosted, free, no third-party ESP).
- **Contact form** — saves to Supabase and emails via Resend.
- **Volunteer form** — saves to Supabase, emails secretariat, sends acknowledgement to applicant.
- **WhatsApp floating button** — links to `wa.me/<number>` with configurable default message.
- **SEO-ready** — per-page metadata, OG image (`public/og.svg`), `robots.txt`, semantic HTML, skip-to-content link, sticky accessible header.
- **Responsive** — mobile-first, sticky header with hamburger menu.

### Translating

All UI strings live in `messages/{en,bem,nya}.json`. To update copy, edit the JSON files and re-deploy. The Bemba and Nyanja translations are AI-assisted drafts and **should be reviewed by Dr. Tembo** before public launch — clinical and culturally-sensitive phrasing needs local verification.

Files:

- `messages/en.json` — reference copy (primary)
- `messages/bem.json` — draft
- `messages/nya.json` — draft

---

## Local development

### Prerequisites

- Node.js 20+ (tested on v24)
- npm 10+

### Install

```bash
cd C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` and fill in the values you have. For local development you can leave Supabase and Resend unset — the site will render, but forms will return a clear "server not configured" message instead of saving.

```bash
copy .env.example .env.local
```

Minimum for site to render: `NEXT_PUBLIC_SITE_URL`. Everything else is optional and falls back to safe defaults.

### Run

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to http://localhost:3000/en.

To preview Bemba: http://localhost:3000/bem
To preview Nyanja: http://localhost:3000/nya

### Type-check and build

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm run start       # run production build
```

---

## Deployment

### Recommended: Vercel (free tier)

1. Push this folder to a Git repo (e.g. `DalisoT/fciaz`).
2. Go to https://vercel.com/new and import the repo.
3. Project root: this folder (`fciaz`).
4. Add environment variables from `.env.example` in the Vercel dashboard.
5. Deploy. The site builds to static HTML for all 33 routes and runs server actions on the Edge runtime.

### Domain

Once registered (e.g. `fciaz.org.zm`):

- Point an A record to Vercel and CNAME `www` to the apex.
- Update `NEXT_PUBLIC_SITE_URL` to the production URL.
- In Resend, verify the sending domain (`fciaz.org.zm`) and set `RESEND_FROM_EMAIL` to a verified address (e.g. `noreply@fciaz.org.zm`).
- Update social links in the Footer and Contact page to your real FCIAZ accounts.

---

## External service setup

### 1. Supabase (newsletter + volunteer + contact)

1. Create a project at https://supabase.com.
2. Open the SQL editor and run `supabase/schema.sql` (idempotent — safe to re-run).
3. Copy the project URL and **service role key** (Settings → API) into:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. The anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is configured but not currently used by server actions — all writes go via the service role to bypass RLS.

Tables created by `schema.sql`:

- `newsletter_subscribers`
- `volunteer_signups`
- `contact_submissions`
- View: `v_signup_summary`

### 2. Resend (contact + volunteer transactional email)

1. Create a Resend account at https://resend.com.
2. Add and verify your sending domain (e.g. `fciaz.org.zm`).
3. Create an API key and copy it to `RESEND_API_KEY`.
4. Set `RESEND_FROM_EMAIL` to a verified address on that domain.
5. Set `RESEND_TO_EMAIL` to the inbox that should receive enquiries (e.g. `info@fciaz.org.zm`).

Resend's free tier: 100 emails/day, 3,000/month — enough for FCIAZ's first year of operation.

### 3. WhatsApp Business

1. Set up a WhatsApp Business account.
2. Get the international phone number with country code, no `+` and no spaces (e.g. `260971234567` for `+260 97 123 4567`).
3. Set `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. (Optional) Customise `NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE` to pre-fill the chat.

If unset, the floating WhatsApp button is hidden automatically.

---

## Customisation

### Brand colours

Edit `tailwind.config.ts` → `theme.extend.colors`. The current palette was sampled from the official FCIAZ emblem (`public/fciaz-logo.png`) and matches the wordmark:

- **brand** — navy / deep purple `#240A6D` → "Advocacy"
- **rose** — magenta `#C40591` → "Treatment"
- **accent** — teal `#1A6B7B` → "Reintegration"
- **lavender** — soft purple `#6736CD` → highlights (baby silhouette)

If the Executive Committee approves a revised palette, replace the four colour scales in `theme.extend.colors`; the rest of the site inherits automatically.

### Logo

`public/fciaz-logo.png` is the approved FCIAZ emblem + wordmark + tagline. It is rendered by `src/components/Logo.tsx` via `next/image`. The displayed height defaults to 56 px; pass a `height` prop to override.

`public/og.svg` and `public/favicon.svg` are SVG approximations of the same palette for places where the PNG can't be used (favicon, social previews).

### Donations

All bank and mobile-money details live in env vars (`NEXT_PUBLIC_DONATE_*`). Update them in Vercel whenever the official bank account or MoMo numbers change. A "pending details" notice appears automatically on `/donate` if the bank account number is not set.

---

## Project structure

```
fciaz/
├── messages/                # translation files
│   ├── en.json
│   ├── bem.json
│   └── nya.json
├── public/                  # static assets
│   ├── favicon.svg
│   ├── logo.svg
│   ├── og.svg               # 1200×630 OG image
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── actions/         # server actions
│   │   │   ├── newsletter.ts
│   │   │   ├── contact.ts
│   │   │   └── volunteer.ts
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── donate/page.tsx
│   │   │   ├── get-involved/page.tsx
│   │   │   ├── news/page.tsx
│   │   │   ├── resources/page.tsx
│   │   │   ├── stakeholders/page.tsx
│   │   │   ├── volunteer/page.tsx
│   │   │   └── what-we-do/page.tsx
│   │   ├── layout.tsx       # minimal root
│   │   └── globals.css
│   ├── components/
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── request.ts
│   ├── lib/
│   │   ├── resend.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── middleware.ts        # next-intl locale routing
├── supabase/
│   └── schema.sql           # tables + RLS policies
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Known follow-ups

- **Next.js 14.2.15 security advisory** (matching ZedPrep's pinned version). When ready, upgrade both projects to a patched 14.x release together.
- **Translation review.** Bemba and Nyanja copy needs Dr. Tembo review with a clinical/Bemba/Nyanja speaker before public launch — especially clinical terms and culturally-sensitive survivor language.
- **Medical bank details.** The bank account number and SWIFT will only become real after the official FCIAZ bank account opens (post-PACRA). Until then, `/donate` shows a "bank details pending" notice and the placeholder mobile numbers can be temporarily displayed.
- **Final logo and OG image.** Currently placeholder SVGs.
- **Real resources/POSTers.** Cards are placeholders — drop PDFs in `public/resources/` and link them from `src/app/[locale]/resources/page.tsx`.
- **CMS for news.** For v1 news is hand-edited in the translation files. A real CMS (e.g. Sanity, MDX, or Supabase-backed) can be added later.

---

## License

© FCIAZ. All rights reserved. Code can be tailored to FCIAZ's needs.
