# Brooklite Premier School — Website & Admin CMS

A full-stack marketing website and content-management system for **Brooklite Premier School**
(Daycare – Grade 4, Lurambi Roundabout, Kakamega, Kenya).

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Supabase
(Postgres + Auth + Storage + Row-Level Security).

## Features

**Public website**
- Homepage with hero, animated statistics counters, curriculum, classes, facilities and about sections
- Facilities, Fees, School Calendar, and Admissions pages — all database-driven
- Admissions form with client + server validation (Zod), Kenyan phone normalization, and rate limiting
- SEO: metadata, Open Graph, JSON-LD (EducationalOrganization/LocalBusiness), `sitemap.xml`, `robots.txt`, semantic HTML, accessibility (skip link, ARIA, reduced-motion support)
- WhatsApp floating contact button and social links in the footer

**Admin CMS** (`/admin`)
- Separate admin login (Supabase Auth), session guard, and audit log of every change
- Dashboard with live counts (admissions, published content, upcoming events)
- Manage: hero, about, statistics, classes, facilities, fees, calendar, admissions (status + notes + search + filters), and school settings (contact info, social links)
- Publish/draft toggles and drag-free reorder controls for every sortable entity
- Browser image uploads to Supabase Storage with validation, alt-text, and a media audit trail
- `robots: noindex` across the admin area

## Tech Stack

- **Next.js 16.3** — App Router, Turbopack, server components and server actions (React 19)
- **Tailwind CSS v4** — CSS-first config in `app/globals.css` (`@theme` tokens for brand colors)
- **Supabase** — `@supabase/ssr` session cookies, service-role client for admin ops, anon client + RLS for public reads
- **react-hook-form + zod** — validated forms shared between client and server
- **framer-motion + lucide-react** — animations and icons

## Getting Started

Requirements: Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (public reads via RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (**server-only**, powers the admin CMS) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for sitemap/OG/JSON-LD) |

> Without env vars the site is **not static-blank**: the public pages render sensible
> default content (see `lib/data/defaults.ts`) so you can develop locally first.

## Supabase Setup

1. Create a project on [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`.
   This creates all 13 tables, indexes, functions, Row-Level Security policies,
   the `school-images` storage bucket + policies, and seed content
   (default hero, classes, statistics, fees placeholders, calendar events, social links).
3. Create your first admin user in SQL:

   ```sql
   select services.crypto_uid();
   -- use the returned UUID below; this is just an example:
   insert into auth.users (id, email, encrypted_password, email_confirmed_at)
   values (
     '<uuid-from-above>',
     'admin@brooklitepremier.co.ke',
     crypt('ChangeMe123!', gen_salt('bf')),
     now()
   );

   insert into public.admin_profiles (id, email, full_name, role)
   values ('<uuid-from-above>', 'admin@brooklitepremier.co.ke', 'School Admin', 'admin');
   ```

   (Alternatively create the user through Supabase Auth in the dashboard and then insert
   the matching row into `admin_profiles` with the same `id`.)
4. Log in at `/admin`, then publish the seeded content you want live.

## Commands

```bash
npm run dev          # development server
npm run build        # production build (typechecks + prerenders public routes)
npm run start        # serve the production build
npm run lint         # ESLint (flat config)
npx tsc --noEmit     # typecheck
```

## Project Structure

```
app/
  (root pages)             # /, /facilities, /fees, /calendar, /admissions
  admin/login/             # admin sign-in (not wrapped by the panel guard)
  admin/(panel)/           # guarded admin area: layout + pages for every manager
  admin/actions/           # server actions (auth, content, library, calendar-fees, …)
  api/admissions/          # public admissions POST endpoint
components/
  shared/                  # button, section, motion primitives, smart image
  admin/                   # shell, sidebar, ui primitives, managers, image uploader
lib/
  supabase/                # env/client/server/service/public clients
  admin/session.ts         # getCurrentAdmin / requireAdmin / writeAudit
  data/                    # public + admin data access with fallbacks
  validation/              # Zod schemas (shared client/server)
  types/                   # domain + database types
  utils.ts                 # currency, phone, date helpers, cn()
supabase/schema.sql        # canonical schema + seeds + storage
```

## Notes for Maintainers

- **Next.js 16 breaking changes** are intentional in this codebase: `middleware.ts` is
  `proxy.ts`; `params`/`searchParams` are Promises; `cookies()` is async; Image `priority`
  was replaced by `preload`; layout/page global types come from the generated
  `next typegen` output. Read `node_modules/next/dist/docs/` before "modernizing".
- Admin routes are `force-dynamic` (they depend on session cookies); public pages are
  statically prerendered with `revalidate = 300`.
- Public reads use the anon client and are limited to `published` rows by RLS. Admin
  mutations use the **service-role** client server-side only — never in components.
- Fee entries with all-zero amounts display as “on request” on the public site.