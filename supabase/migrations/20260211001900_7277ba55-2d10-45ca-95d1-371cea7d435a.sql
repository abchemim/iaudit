
-- =============================================
-- FIX 1: Enable RLS on tables missing it
-- =============================================

-- clientes (business client data with PII)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clientes"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clientes"
  ON public.clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clientes"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete clientes"
  ON public.clientes FOR DELETE
  TO authenticated
  USING (true);

-- caixa_postal_fiscal (confidential tax communications)
ALTER TABLE public.caixa_postal_fiscal ENABLE ROW LEVEL SECURITY;

-- Drop any broken policies referencing non-existent tables
DROP POLICY IF EXISTS "Users can view messages of their companies" ON public.caixa_postal_fiscal;
DROP POLICY IF EXISTS "Users can manage messages of their companies" ON public.caixa_postal_fiscal;

CREATE POLICY "Authenticated users can view caixa_postal_fiscal"
  ON public.caixa_postal_fiscal FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert caixa_postal_fiscal"
  ON public.caixa_postal_fiscal FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update caixa_postal_fiscal"
  ON public.caixa_postal_fiscal FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete caixa_postal_fiscal"
  ON public.caixa_postal_fiscal FOR DELETE
  TO authenticated
  USING (true);

-- consultas_cnd (tax consultation data)
ALTER TABLE public.consultas_cnd ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view consultas_cnd"
  ON public.consultas_cnd FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert consultas_cnd"
  ON public.consultas_cnd FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update consultas_cnd"
  ON public.consultas_cnd FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete consultas_cnd"
  ON public.consultas_cnd FOR DELETE
  TO authenticated
  USING (true);

-- historico_debitos (debt records)
ALTER TABLE public.historico_debitos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view historico_debitos"
  ON public.historico_debitos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert historico_debitos"
  ON public.historico_debitos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update historico_debitos"
  ON public.historico_debitos FOR UPDATE
  TO authenticated
  USING (true);

-- envios (communication logs)
ALTER TABLE public.envios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view envios"
  ON public.envios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert envios"
  ON public.envios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update envios"
  ON public.envios FOR UPDATE
  TO authenticated
  USING (true);

-- configuracoes (system config with sensitive data)
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view configuracoes"
  ON public.configuracoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update configuracoes"
  ON public.configuracoes FOR UPDATE
  TO authenticated
  USING (true);

-- logs_sistema (system logs)
ALTER TABLE public.logs_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view logs_sistema"
  ON public.logs_sistema FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service can insert logs_sistema"
  ON public.logs_sistema FOR INSERT
  WITH CHECK (true);

-- =============================================
-- FIX 2: Fix storage bucket policies - enforce path-based ownership
-- =============================================

-- Drop existing weak policies for documentos bucket
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Drop existing weak policies for certificados bucket
DROP POLICY IF EXISTS "Users can read their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON storage.objects;

-- Documentos bucket - path-based ownership: {user_id}/...
CREATE POLICY "Users can read own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Certificados bucket - path-based ownership: {user_id}/...
CREATE POLICY "Users can read own certificates"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'certificados' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload own certificates"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'certificados' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own certificates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'certificados' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own certificates"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificados' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Also add cnd_documentos bucket policies (exists but may lack proper policies)
DROP POLICY IF EXISTS "Users can read their own cnd documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own cnd documents" ON storage.objects;

CREATE POLICY "Users can read own cnd_documentos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cnd_documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload own cnd_documentos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cnd_documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own cnd_documentos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cnd_documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own cnd_documentos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cnd_documentos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
