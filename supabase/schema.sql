-- ============================================================================
-- Brooklite Premier School — Database Schema
-- Run this in the Supabase SQL Editor.
-- ----------------------------------------------------------------------------
-- Tables: school_settings, hero_content, about_content, statistics, classes,
-- facilities, fees, calendar_events, admissions, admin_profiles, media,
-- social_links, audit_log
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. admin_profiles
--    Links a Supabase auth user to an administrator role.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text not null default '',
  email         text not null,
  role          text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Shared helper used by RLS policies
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.is_active = true
      and ap.role in ('admin', 'editor')
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. school_settings  (single row of identity/contact information)
-- ---------------------------------------------------------------------------
create table if not exists public.school_settings (
  id             int primary key default 1 check (id = 1),
  school_name    text not null default 'Brooklite Premier School',
  tagline        text not null default 'Nurturing Excellence from the Very First Step.',
  phone          text not null default '',
  whatsapp       text not null default '',
  email          text not null default '',
  address        text not null default '',
  opening_hours  text not null default '',
  maps_url       text not null default '',
  logo_url       text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- 3. hero_content  (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.hero_content (
  id                 int primary key default 1 check (id = 1),
  badge              text not null default '',
  headline           text not null default '',
  subheading         text not null default '',
  primary_cta_text   text not null default 'Explore Admissions',
  primary_cta_link   text not null default '/admissions',
  secondary_cta_text text not null default 'View Fees',
  secondary_cta_link text not null default '/fees',
  image_url          text not null default '',
  image_alt          text not null default '',
  published          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  updated_by         uuid references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- 4. about_content  (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.about_content (
  id          int primary key default 1 check (id = 1),
  heading     text not null default '',
  description text not null default '',
  mission     text not null default '',
  vision      text not null default '',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

-- ---------------------------------------------------------------------------
-- 5. statistics
-- ---------------------------------------------------------------------------
create table if not exists public.statistics (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  value         text not null,
  description   text not null default '',
  icon          text not null default 'sparkles',
  display_order int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. classes  (curriculum / class levels)
-- ---------------------------------------------------------------------------
create table if not exists public.classes (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  short_description text not null default '',
  learning_focus   text not null default '',
  age_range        text not null default '',
  image_url        text not null default '',
  image_alt        text not null default '',
  icon             text not null default 'graduation-cap',
  display_order    int not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. facilities
-- ---------------------------------------------------------------------------
create table if not exists public.facilities (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  image_url     text not null default '',
  image_alt     text not null default '',
  icon          text not null default 'building-2',
  featured      boolean not null default false,
  display_order int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 8. fees
-- ---------------------------------------------------------------------------
create table if not exists public.fees (
  id                uuid primary key default gen_random_uuid(),
  academic_year     int not null,
  term              int not null check (term between 1 and 3),
  class_name        text not null,
  tuition           numeric(12,2) not null default 0,
  administrative_fee numeric(12,2) not null default 0,
  activity_fee      numeric(12,2) not null default 0,
  transport_fee     numeric(12,2) not null default 0,
  other_fees        numeric(12,2) not null default 0,
  notes             text not null default '',
  display_order     int not null default 0,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. calendar_events
-- ---------------------------------------------------------------------------
create table if not exists public.calendar_events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  event_type    text not null default 'School event',
  start_date    date not null,
  end_date      date not null default '1970-01-01',
  location      text not null default '',
  display_order int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 10. admissions
-- ---------------------------------------------------------------------------
create table if not exists public.admissions (
  id                  uuid primary key default gen_random_uuid(),
  parent_name         text not null,
  phone               text not null,
  email               text not null default '',
  child_name          text not null default '',
  target_class        text not null,
  preferred_transport boolean not null default false,
  message             text not null default '',
  status              text not null default 'New' check (status in ('New', 'Contacted', 'Processing', 'Enrolled', 'Closed')),
  notes               text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 11. media  (metadata for uploaded assets)
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text not null,
  bucket      text not null default 'school-images',
  path        text not null,
  alt_text    text not null default '',
  content_type text not null default '',
  size        bigint not null default 0,
  width       int,
  height      int,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 12. social_links
-- ---------------------------------------------------------------------------
create table if not exists public.social_links (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null,
  url           text not null default '',
  label         text not null default '',
  display_order int not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 13. audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users (id) on delete set null,
  admin_email   text not null default '',
  action        text not null,
  content_type  text not null default '',
  content_id    text not null default '',
  details       text not null default '',
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================
create index if not exists idx_statistics_order      on public.statistics (display_order);
create index if not exists idx_classes_order         on public.classes (display_order);
create index if not exists idx_facilities_order      on public.facilities (display_order, featured);
create index if not exists idx_fees_year_term_class  on public.fees (academic_year, term, class_name);
create index if not exists idx_events_start_date     on public.calendar_events (start_date);
create index if not exists idx_events_order          on public.calendar_events (display_order);
create index if not exists idx_admissions_status     on public.admissions (status);
create index if not exists idx_admissions_created    on public.admissions (created_at desc);
create index if not exists idx_media_created         on public.media (created_at desc);
create index if not exists idx_audit_created         on public.audit_log (created_at desc);

-- ============================================================================
-- Row Level Security — enable on every table
-- ============================================================================
alter table public.admin_profiles   enable row level security;
alter table public.school_settings  enable row level security;
alter table public.hero_content     enable row level security;
alter table public.about_content    enable row level security;
alter table public.statistics       enable row level security;
alter table public.classes          enable row level security;
alter table public.facilities       enable row level security;
alter table public.fees             enable row level security;
alter table public.calendar_events  enable row level security;
alter table public.admissions       enable row level security;
alter table public.media            enable row level security;
alter table public.social_links     enable row level security;
alter table public.audit_log        enable row level security;

-- ============================================================================
-- RLS Policies
-- ----------------------------------------------------------------------------
-- Public (anon): SELECT only rows where published = true on content tables.
-- Admins (authenticated + is_admin()): full CRUD.
-- Admissions: never public; admin only.
-- ============================================================================

-- --- admin_profiles ---------------------------------------------------------
drop policy if exists "admin_profiles_select_own" on public.admin_profiles;
create policy "admin_profiles_select_own"
  on public.admin_profiles for select
  using (auth.uid() = id);

drop policy if exists "admin_profiles_select_admin" on public.admin_profiles;
create policy "admin_profiles_select_admin"
  on public.admin_profiles for select
  using (public.is_admin());

drop policy if exists "admin_profiles_update_own" on public.admin_profiles;
create policy "admin_profiles_update_own"
  on public.admin_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --- school_settings --------------------------------------------------------
drop policy if exists "school_settings_select_public" on public.school_settings;
create policy "school_settings_select_public"
  on public.school_settings for select
  using (true);

drop policy if exists "school_settings_admin_all" on public.school_settings;
create policy "school_settings_admin_all"
  on public.school_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- hero_content -----------------------------------------------------------
drop policy if exists "hero_select_public" on public.hero_content;
create policy "hero_select_public"
  on public.hero_content for select
  using (published = true);

drop policy if exists "hero_admin_all" on public.hero_content;
create policy "hero_admin_all"
  on public.hero_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- about_content ----------------------------------------------------------
drop policy if exists "about_select_public" on public.about_content;
create policy "about_select_public"
  on public.about_content for select
  using (published = true);

drop policy if exists "about_admin_all" on public.about_content;
create policy "about_admin_all"
  on public.about_content for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- statistics -------------------------------------------------------------
drop policy if exists "statistics_select_public" on public.statistics;
create policy "statistics_select_public"
  on public.statistics for select
  using (published = true);

drop policy if exists "statistics_admin_all" on public.statistics;
create policy "statistics_admin_all"
  on public.statistics for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- classes ----------------------------------------------------------------
drop policy if exists "classes_select_public" on public.classes;
create policy "classes_select_public"
  on public.classes for select
  using (published = true);

drop policy if exists "classes_admin_all" on public.classes;
create policy "classes_admin_all"
  on public.classes for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- facilities -------------------------------------------------------------
drop policy if exists "facilities_select_public" on public.facilities;
create policy "facilities_select_public"
  on public.facilities for select
  using (published = true);

drop policy if exists "facilities_admin_all" on public.facilities;
create policy "facilities_admin_all"
  on public.facilities for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- fees -------------------------------------------------------------------
drop policy if exists "fees_select_public" on public.fees;
create policy "fees_select_public"
  on public.fees for select
  using (published = true);

drop policy if exists "fees_admin_all" on public.fees;
create policy "fees_admin_all"
  on public.fees for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- calendar_events --------------------------------------------------------
drop policy if exists "events_select_public" on public.calendar_events;
create policy "events_select_public"
  on public.calendar_events for select
  using (published = true);

drop policy if exists "events_admin_all" on public.calendar_events;
create policy "events_admin_all"
  on public.calendar_events for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- admissions (never public) ---------------------------------------------
drop policy if exists "admissions_admin_all" on public.admissions;
create policy "admissions_admin_all"
  on public.admissions for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- media ------------------------------------------------------------------
drop policy if exists "media_select_public" on public.media;
create policy "media_select_public"
  on public.media for select
  using (true);

drop policy if exists "media_admin_insert" on public.media;
create policy "media_admin_insert"
  on public.media for insert
  with check (public.is_admin());

drop policy if exists "media_admin_update_delete" on public.media;
create policy "media_admin_update_delete"
  on public.media for update
  using (public.is_admin())
  with check (public.is_admin());

-- --- social_links -----------------------------------------------------------
drop policy if exists "social_select_public" on public.social_links;
create policy "social_select_public"
  on public.social_links for select
  using (published = true);

drop policy if exists "social_admin_all" on public.social_links;
create policy "social_admin_all"
  on public.social_links for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- audit_log --------------------------------------------------------------
drop policy if exists "audit_select_admin" on public.audit_log;
create policy "audit_select_admin"
  on public.audit_log for select
  using (public.is_admin());

drop policy if exists "audit_insert_admin" on public.audit_log;
create policy "audit_insert_admin"
  on public.audit_log for insert
  with check (public.is_admin());

-- ============================================================================
-- Storage
-- ----------------------------------------------------------------------------
-- Create the public "school-images" bucket and storage policies.
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('school-images', 'school-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "school_images_public_select" on storage.objects;
create policy "school_images_public_select"
  on storage.objects for select
  using (bucket_id = 'school-images');

drop policy if exists "school_images_admin_insert" on storage.objects;
create policy "school_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'school-images' and public.is_admin());

drop policy if exists "school_images_admin_update" on storage.objects;
create policy "school_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'school-images' and public.is_admin());

drop policy if exists "school_images_admin_delete" on storage.objects;
create policy "school_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'school-images' and public.is_admin());

-- ============================================================================
-- Seed data
-- ============================================================================
insert into public.school_settings (id, school_name, tagline, phone, whatsapp, email, address, opening_hours, maps_url, logo_url)
values (1,
  'Brooklite Premier School',
  'Nurturing Excellence from the Very First Step.',
  '0722 723 066',
  '0722 723 066',
  'info@brooklitepremier.co.ke',
  'Lurambi Roundabout Turn, next to Diamond Rock Restaurant, Kakamega, Kenya',
  'Monday – Friday: 7:00 AM – 5:00 PM',
  'https://maps.google.com/?q=Lurambi+Roundabout,+Kakamega,+Kenya',
  '')
on conflict (id) do nothing;

insert into public.hero_content (id, badge, headline, subheading, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, image_url, image_alt, published)
values (1,
  'Daycare – Grade 4 · Kakamega, Kenya',
  'Nurturing Excellence from the Very First Step.',
  'Premium Daycare, Pre-Primary, and Junior School learning in Kakamega Town.',
  'Explore Admissions',
  '/admissions',
  'View Fees',
  '/fees',
  '/images/hero-student-culture.jpg',
  'Brooklite Premier School learners in cultural attire',
  true)
on conflict (id) do nothing;

insert into public.about_content (id, heading, description, mission, vision, published)
values (1,
  'A Premier Start for Every Child',
  'Brooklite Premier School is a private, CBC-focused school in Kakamega Town offering a safe, loving and academically excellent learning environment from Daycare through Grade 4. Our small class sizes, dedicated teachers and modern facilities help every child discover, grow and shine.',
  'To nurture every child''s unique potential through caring guidance, quality teaching and a safe, joyful learning environment.',
  'To be Kakamega''s leading early-childhood and junior-school institution, producing confident, curious and well-rounded young learners.',
  true)
on conflict (id) do nothing;

insert into public.statistics (id, title, value, description, icon, display_order, published) values
('10000000-0000-0000-0000-000000000001', 'Grade Levels', 'Daycare to Grade 4', 'A complete early-learning and junior school journey under one roof.', 'graduation-cap', 1, true),
('10000000-0000-0000-0000-000000000002', 'Curriculum', 'CBC Integrated', 'Learner-centred Competency Based Curriculum delivered by trained teachers.', 'book-open', 2, true),
('10000000-0000-0000-0000-000000000003', 'Transport', 'Reliable Student Transport', 'Safe, supervised daily transport that brings your child to and from school.', 'bus', 3, true),
('10000000-0000-0000-0000-000000000004', 'Environment', 'International-Level', 'Modern classrooms, guided swimming and structured co-curricular activities.', 'globe', 4, true)
on conflict (id) do nothing;

insert into public.classes (id, name, short_description, learning_focus, age_range, image_url, image_alt, icon, display_order, published) values
('20000000-0000-0000-0000-000000000001', 'Daycare', 'A warm, nurturing introduction to school life for our youngest learners.', 'Sensory play, early stimulation, routines and social skills.', '6 months – 3 years', '', 'Daycare play area', 'baby', 1, true),
('20000000-0000-0000-0000-000000000002', 'Playgroup', 'Play-based discovery that builds confidence, curiosity and language.', 'Language development, motor skills, creativity and sharing.', '3 – 4 years', '', 'Playgroup learners', 'puzzle', 2, true),
('20000000-0000-0000-0000-000000000003', 'PP1', 'Pre-Primary learning that prepares learners for formal schooling.', 'Numeracy, literacy foundations, environmental awareness and arts.', '4 – 5 years', '/images/classroom-learning.jpg', 'PP1 learners in a classroom activity', 'backpack', 3, true),
('20000000-0000-0000-0000-000000000004', 'PP2', 'Confident pre-primary learners ready for the primary transition.', 'Reading readiness, writing, numeracy, and independence skills.', '5 – 6 years', '', 'PP2 learners', 'pencil', 4, true),
('20000000-0000-0000-0000-000000000005', 'Grade 1', 'The foundation year of primary school with strong basics in CBC.', 'Literacy, numeracy, science basics and personal growth.', '6 – 7 years', '/images/flag-ceremony.jpg', 'Grade 1 learners during a school event', 'book-open', 5, true),
('20000000-0000-0000-0000-000000000006', 'Grade 2', 'Growing readers and thinkers explore the world with confidence.', 'Reading comprehension, problem solving, and creative expression.', '7 – 8 years', '', 'Grade 2 learners', 'books', 6, true),
('20000000-0000-0000-0000-000000000007', 'Grade 3', 'Building independent learners through richer CBC activities.', 'Research skills, projects, technology basics and teamwork.', '8 – 9 years', '', 'Grade 3 learners', 'lightbulb', 7, true),
('20000000-0000-0000-0000-000000000008', 'Grade 4', 'Upper-primary readiness with leadership and critical thinking.', 'Advanced projects, leadership, digital literacy and assessment prep.', '9 – 11 years', '/images/graduation.jpg', 'Grade 4 learners celebrating achievement', 'graduation-cap', 8, true)
on conflict (id) do nothing;

insert into public.facilities (id, title, description, image_url, image_alt, icon, featured, display_order, published) values
('30000000-0000-0000-0000-000000000001', 'Modern Classrooms', 'Bright, well-equipped and child-friendly classrooms designed around the CBC learning experience. Our learning spaces encourage collaboration, creativity and concentration in a safe and organised environment.', '/images/classrooms.jpg', 'A bright Brooklite Premier School classroom', 'door-open', true, 1, true),
('30000000-0000-0000-0000-000000000002', 'Swimming', 'Guided swimming sessions and structured physical activity that support fitness, water safety and confidence in a supervised, fun environment.', '', '', 'waves', false, 2, true),
('30000000-0000-0000-0000-000000000003', 'Nutritious Meals', 'A thoughtful meal programme that keeps learners energised and focused throughout the school day, with balanced, child-friendly menus served in a clean dining environment.', '/images/meals.jpg', 'A nutritious meal served at Brooklite Premier School', 'utensils', false, 3, true),
('30000000-0000-0000-0000-000000000004', 'Student Transport', 'Reliable daily school van transportation that safely brings learners to and from school, with responsible supervision at every step of the journey.', '', '', 'bus', false, 4, true)
on conflict (id) do nothing;

-- Fee placeholders — replace with official figures before going live.
insert into public.fees (id, academic_year, term, class_name, tuition, administrative_fee, activity_fee, transport_fee, other_fees, notes, display_order, published) values
('40000000-0000-0000-0000-000000000001', 2026, 1, 'Daycare',   0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 1, true),
('40000000-0000-0000-0000-000000000002', 2026, 1, 'Playgroup', 0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 2, true),
('40000000-0000-0000-0000-000000000003', 2026, 1, 'PP1',       0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 3, true),
('40000000-0000-0000-0000-000000000004', 2026, 1, 'PP2',       0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 4, true),
('40000000-0000-0000-0000-000000000005', 2026, 1, 'Grade 1',   0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 5, true),
('40000000-0000-0000-0000-000000000006', 2026, 1, 'Grade 2',   0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 6, true),
('40000000-0000-0000-0000-000000000007', 2026, 1, 'Grade 3',   0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 7, true),
('40000000-0000-0000-0000-000000000008', 2026, 1, 'Grade 4',   0, 0, 0, 0, 0, 'Fees are subject to confirmation by the school administration.', 8, true)
on conflict (id) do nothing;

insert into public.calendar_events (id, title, description, event_type, start_date, end_date, location, display_order, published) values
('50000000-0000-0000-0000-000000000001', 'Term 3 Opener', 'Third term of the 2026 academic year begins.', 'Term opening', '2026-09-01', '2026-09-01', 'Brooklite Premier School', 1, true),
('50000000-0000-0000-0000-000000000002', 'Parents'' Meeting', 'Termly meeting for parents and guardians to review learner progress.', 'Parents'' meeting', '2026-10-16', '2026-10-16', 'School Hall', 2, true),
('50000000-0000-0000-0000-000000000003', 'Mid-Term Assessments', 'Mid-term continuous assessment period for all classes.', 'Assessment period', '2026-10-19', '2026-10-23', 'Brooklite Premier School', 3, true),
('50000000-0000-0000-0000-000000000004', 'Sports Day', 'A day of games, athletics and cultural performances.', 'Sports day', '2026-11-20', '2026-11-20', 'School Grounds', 4, true),
('50000000-0000-0000-0000-000000000005', 'Term 3 Closing', 'End of the 2026 academic year and Christmas break begins.', 'Term closing', '2026-11-27', '2026-11-27', 'Brooklite Premier School', 5, true)
on conflict (id) do nothing;

insert into public.social_links (id, platform, url, label, display_order, published) values
('60000000-0000-0000-0000-000000000001', 'Facebook', '', 'Facebook', 1, false),
('60000000-0000-0000-0000-000000000002', 'WhatsApp', '', 'WhatsApp', 2, false),
('60000000-0000-0000-0000-000000000003', 'Instagram', '', 'Instagram', 3, false)
on conflict (id) do nothing;