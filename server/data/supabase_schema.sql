-- ==============================================================================
-- CodeTroopers Official Recruitment & Applications Table Schema for Supabase
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- to create the applications table, indexes, and Row Level Security (RLS) policies.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    college_email TEXT NOT NULL,
    usn TEXT,
    phone TEXT,
    semester TEXT,
    branch TEXT,
    domains TEXT[] DEFAULT '{}',
    skills_experience TEXT,
    github TEXT,
    linkedin TEXT,
    portfolio TEXT,
    motivation TEXT,
    resume_url TEXT,
    resume_file_id TEXT,
    resume_metadata JSONB,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'accepted', 'rejected')),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_college_email ON public.applications (college_email);
CREATE INDEX IF NOT EXISTS idx_applications_usn ON public.applications (usn);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.applications (applied_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for student candidates submitting via the Join Us portal)
CREATE POLICY "Allow public recruitment submissions"
ON public.applications
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- Allow backend service role full access (used by server backend APIs with JWT admin authentication)
CREATE POLICY "Allow backend service role full access"
ON public.applications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Allow authenticated users to view
CREATE POLICY "Allow authenticated read"
ON public.applications
FOR SELECT
TO authenticated
USING (true);

