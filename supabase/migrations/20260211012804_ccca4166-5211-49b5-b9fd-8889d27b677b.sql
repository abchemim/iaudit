
-- ================================================
-- FIX 1: Add user_id to clientes for ownership
-- ================================================
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- ================================================
-- FIX 2: Replace weak RLS on clientes
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can delete clientes" ON public.clientes;

CREATE POLICY "Users can view own clientes" ON public.clientes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own clientes" ON public.clientes FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own clientes" ON public.clientes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ================================================
-- FIX 3: Replace weak RLS on caixa_postal_fiscal
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view caixa_postal_fiscal" ON public.caixa_postal_fiscal;
DROP POLICY IF EXISTS "Authenticated users can insert caixa_postal_fiscal" ON public.caixa_postal_fiscal;
DROP POLICY IF EXISTS "Authenticated users can update caixa_postal_fiscal" ON public.caixa_postal_fiscal;
DROP POLICY IF EXISTS "Authenticated users can delete caixa_postal_fiscal" ON public.caixa_postal_fiscal;

CREATE POLICY "Users can view own caixa_postal" ON public.caixa_postal_fiscal FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own caixa_postal" ON public.caixa_postal_fiscal FOR INSERT TO authenticated
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own caixa_postal" ON public.caixa_postal_fiscal FOR UPDATE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own caixa_postal" ON public.caixa_postal_fiscal FOR DELETE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- ================================================
-- FIX 4: Replace weak RLS on consultas_cnd
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view consultas_cnd" ON public.consultas_cnd;
DROP POLICY IF EXISTS "Authenticated users can insert consultas_cnd" ON public.consultas_cnd;
DROP POLICY IF EXISTS "Authenticated users can update consultas_cnd" ON public.consultas_cnd;
DROP POLICY IF EXISTS "Authenticated users can delete consultas_cnd" ON public.consultas_cnd;

CREATE POLICY "Users can view own consultas_cnd" ON public.consultas_cnd FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own consultas_cnd" ON public.consultas_cnd FOR INSERT TO authenticated
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own consultas_cnd" ON public.consultas_cnd FOR UPDATE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own consultas_cnd" ON public.consultas_cnd FOR DELETE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- ================================================
-- FIX 5: Replace weak RLS on historico_debitos
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view historico_debitos" ON public.historico_debitos;
DROP POLICY IF EXISTS "Authenticated users can insert historico_debitos" ON public.historico_debitos;
DROP POLICY IF EXISTS "Authenticated users can update historico_debitos" ON public.historico_debitos;

CREATE POLICY "Users can view own historico_debitos" ON public.historico_debitos FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own historico_debitos" ON public.historico_debitos FOR INSERT TO authenticated
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own historico_debitos" ON public.historico_debitos FOR UPDATE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- ================================================
-- FIX 6: Replace weak RLS on envios
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view envios" ON public.envios;
DROP POLICY IF EXISTS "Authenticated users can insert envios" ON public.envios;
DROP POLICY IF EXISTS "Authenticated users can update envios" ON public.envios;

CREATE POLICY "Users can view own envios" ON public.envios FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own envios" ON public.envios FOR INSERT TO authenticated
  WITH CHECK (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own envios" ON public.envios FOR UPDATE TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()));

-- ================================================
-- FIX 7: Replace weak RLS on configuracoes (system config - read-only for authenticated)
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view configuracoes" ON public.configuracoes;
DROP POLICY IF EXISTS "Authenticated users can update configuracoes" ON public.configuracoes;

-- Add responsavel as user_id scope
CREATE POLICY "Users can view own configuracoes" ON public.configuracoes FOR SELECT TO authenticated
  USING (responsavel = auth.uid()::text OR responsavel IS NULL);
CREATE POLICY "Users can update own configuracoes" ON public.configuracoes FOR UPDATE TO authenticated
  USING (responsavel = auth.uid()::text);

-- ================================================
-- FIX 8: Replace weak RLS on logs_sistema
-- ================================================
DROP POLICY IF EXISTS "Authenticated users can view logs_sistema" ON public.logs_sistema;
DROP POLICY IF EXISTS "Service can insert logs_sistema" ON public.logs_sistema;

CREATE POLICY "Users can view own logs_sistema" ON public.logs_sistema FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clientes WHERE user_id = auth.uid()) OR responsavel = auth.uid()::text);
-- Service role bypasses RLS, no explicit insert policy needed for service

-- ================================================
-- FIX 9: Fix old storage policies from migration 20260207140711
-- Drop weak policies that only check auth.uid() IS NOT NULL
-- ================================================
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON storage.objects;

-- Re-create with path-based ownership (if not already created by previous migration)
-- For documentos bucket
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;

CREATE POLICY "Users can read own documents" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documentos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documentos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own documents" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documentos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documentos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- For certificados bucket
DROP POLICY IF EXISTS "Users can read own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own certificates" ON storage.objects;

CREATE POLICY "Users can read own certificates" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'certificados' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can upload own certificates" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certificados' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own certificates" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'certificados' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own certificates" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'certificados' AND (storage.foldername(name))[1] = auth.uid()::text);
