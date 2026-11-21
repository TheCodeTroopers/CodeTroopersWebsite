-- ==============================================================================
-- CodeTroopers: site content tables + image storage bucket
-- ==============================================================================
-- Run once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run (everything is IF NOT EXISTS / ON CONFLICT).
--
-- Security model: Row Level Security is ENABLED with NO policies on every table below.
-- That means the public anon key can read/write NOTHING. Only the backend, using the
-- service_role key (kept secret in Vercel env vars), can touch these tables. The public
-- website reads content through the Express API, never directly from Supabase.
-- ==============================================================================

-- ---- Content collections (one row per item, flexible JSON body) ---------------
-- The existing admin forms save many different fields per item type, so each item's
-- fields live in `data` (jsonb). `id` is the public id used in URLs.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'gallery_items',
    'events',
    'blogs',
    'achievements',
    'team_members',
    'contact_info',
    'contact_submissions'
  ]
  LOOP
    EXECUTE format($f$
      CREATE TABLE IF NOT EXISTS public.%I (
        id          text PRIMARY KEY,
        data        jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      )$f$, t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I (created_at DESC)', t || '_created_idx', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- ---- Users (real columns: email must be unique, password hash never leaves the API) ----
CREATE TABLE IF NOT EXISTS public.site_users (
  id             text PRIMARY KEY,
  name           text NOT NULL,
  email          text NOT NULL,
  password_hash  text,
  role           text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  avatar         text,
  provider       text NOT NULL DEFAULT 'local',
  google_id      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS site_users_email_lower_idx ON public.site_users (lower(email));
ALTER TABLE public.site_users ENABLE ROW LEVEL SECURITY;

-- ---- Image storage bucket -----------------------------------------------------
-- Public READ (so <img src> works from the CDN), WRITE only via the backend service role.
-- Limits: 5 MB per file, images only.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
