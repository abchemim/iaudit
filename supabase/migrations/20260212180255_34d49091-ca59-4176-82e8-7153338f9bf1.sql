
-- Fix permissive INSERT policies: these tables should only be inserted by edge functions (service_role)
-- Drop the overly permissive policies
DROP POLICY "Service insert creditos" ON public.infosimples_creditos;
DROP POLICY "Service insert saldo" ON public.infosimples_saldo_historico;
DROP POLICY "Service insert logs" ON public.logs_automacao;

-- Recreate with service_role only (no INSERT for anon/authenticated directly)
-- Edge functions use service_role key, so they bypass RLS.
-- No INSERT policy needed for authenticated users on these tables.
