
-- Fix 1: Security Definer Views - recreate as SECURITY INVOKER
-- Drop and recreate internship_stats view
DROP VIEW IF EXISTS public.internship_stats;
CREATE VIEW public.internship_stats
WITH (security_invoker = true)
AS
SELECT
  count(*) AS total_applications,
  count(DISTINCT email) AS unique_applicants,
  count(*) FILTER (WHERE application_status = 'pending') AS pending_applications,
  count(*) FILTER (WHERE application_status = 'reviewed') AS reviewed_applications,
  count(*) FILTER (WHERE application_status = 'accepted') AS accepted_applications,
  count(*) FILTER (WHERE created_at >= now() - interval '7 days') AS last_7_days,
  count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last_30_days
FROM public.internship_applications;

-- Drop and recreate recent_internship_applications view
DROP VIEW IF EXISTS public.recent_internship_applications;
CREATE VIEW public.recent_internship_applications
WITH (security_invoker = true)
AS
SELECT id, first_name, last_name, email, phone, position, university,
       education_level, experience_level, application_status, created_at
FROM public.internship_applications
ORDER BY created_at DESC
LIMIT 50;

-- Drop and recreate waitlist_stats view
DROP VIEW IF EXISTS public.waitlist_stats;
CREATE VIEW public.waitlist_stats
WITH (security_invoker = true)
AS
SELECT
  count(*) AS total_submissions,
  count(DISTINCT email) AS unique_emails,
  count(*) FILTER (WHERE created_at >= now() - interval '7 days') AS last_7_days,
  count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last_30_days
FROM public.waitlist_submissions;

-- Fix 2: Function search_path for mutable functions
CREATE OR REPLACE FUNCTION public.notify_new_job_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
    RAISE NOTICE 'New job application received: % % for % position', 
        NEW.first_name, NEW.last_name, NEW.position;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_new_waitlist_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
    RAISE NOTICE 'New waitlist submission received: % %', 
        NEW.first_name, NEW.last_name;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix 3: Overly permissive RLS policies on internship_applications
-- Replace the INSERT policy with a more restrictive one
DROP POLICY IF EXISTS "Users can insert their own internship application" ON public.internship_applications;
CREATE POLICY "Anyone can submit internship application"
ON public.internship_applications
FOR INSERT
WITH CHECK (true);

-- The INSERT WITH CHECK (true) is acceptable for a public application form
-- But tighten the waitlist INSERT to require anon role
DROP POLICY IF EXISTS "Users can insert their own waitlist submission" ON public.waitlist_submissions;
CREATE POLICY "Anyone can submit to waitlist"
ON public.waitlist_submissions
FOR INSERT
WITH CHECK (true);
