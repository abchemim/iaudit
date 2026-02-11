
-- Remove unnecessary service role bypass policies
-- Service role already bypasses RLS by default
DROP POLICY IF EXISTS "Service role full access cnd_certidoes" ON public.cnd_certidoes;
DROP POLICY IF EXISTS "Service role full access jobs" ON public.cnd_consultas_jobs;
DROP POLICY IF EXISTS "Service role full access tarefas" ON public.tarefas;
DROP POLICY IF EXISTS "Service role full access notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role full access configuracoes_alertas" ON public.configuracoes_alertas;
DROP POLICY IF EXISTS "Service role full access infosimples_creditos" ON public.infosimples_creditos;
DROP POLICY IF EXISTS "Service role full access cnds" ON public.cnds;
DROP POLICY IF EXISTS "Service role full access documentos_cnd" ON public.documentos_cnd;
DROP POLICY IF EXISTS "Service role can insert logs" ON public.logs_automacao;
