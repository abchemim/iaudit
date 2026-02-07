-- Fix overly permissive RLS policy - drop and recreate with proper restrictions
DROP POLICY IF EXISTS "Service role can manage all jobs" ON public.cnd_consultas_jobs;

-- Note: Service role bypasses RLS automatically, so we don't need an explicit policy for it
-- The existing "Users can view their own jobs" SELECT policy is sufficient for frontend