-- =============================================================================
-- FCIAZ Web — Supabase schema
-- Run this in the Supabase SQL editor (Database > SQL Editor > New query).
-- =============================================================================

-- Newsletter subscribers ---------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  locale text not null default 'en',
  source text default 'website',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  confirmed boolean not null default true
);

create index if not exists idx_newsletter_email on public.newsletter_subscribers (email);

-- Volunteer signups ---------------------------------------------------------
create table if not exists public.volunteer_signups (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  location text,
  skills text,
  availability text,
  message text,
  locale text default 'en',
  status text not null default 'pending',
  submitted_at timestamptz not null default now()
);

create index if not exists idx_volunteer_email on public.volunteer_signups (email);
create index if not exists idx_volunteer_status on public.volunteer_signups (status);

-- Contact submissions (audit log of messages sent to FCIAZ inbox) -----------
create table if not exists public.contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  locale text default 'en',
  submitted_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security — public can INSERT, only service role can SELECT.
-- Server actions use the service-role key (SUPABASE_SERVICE_ROLE_KEY) for
-- inserts so we keep RLS tight.
-- =============================================================================
alter table public.newsletter_subscribers enable row level security;
alter table public.volunteer_signups       enable row level security;
alter table public.contact_submissions     enable row level security;

-- Drop existing policies so this script is idempotent.
drop policy if exists "anon insert newsletter" on public.newsletter_subscribers;
drop policy if exists "anon insert volunteer" on public.volunteer_signups;
drop policy if exists "anon insert contact"   on public.contact_submissions;

create policy "anon insert newsletter"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

create policy "anon insert volunteer"
  on public.volunteer_signups
  for insert
  to anon, authenticated
  with check (true);

create policy "anon insert contact"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- =============================================================================
-- Optional: a simple view for the admin/secretariat to monitor signups
-- (only accessible via service role).
-- =============================================================================
create or replace view public.v_signup_summary as
select
  (select count(*) from public.newsletter_subscribers where unsubscribed_at is null) as active_subscribers,
  (select count(*) from public.newsletter_subscribers) as total_subscribers,
  (select count(*) from public.volunteer_signups) as total_volunteers,
  (select count(*) from public.volunteer_signups where status = 'pending') as pending_volunteers,
  (select count(*) from public.contact_submissions) as total_contact_messages;
