-- Fix 1: Restrict infosimples_saldo_historico to admins only
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar histórico de saldo" ON public.infosimples_saldo_historico;

CREATE POLICY "Only admins can view balance history"
  ON public.infosimples_saldo_historico FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- Fix 2: Restrict system logs - remove access to NULL client_id logs for non-admins
DROP POLICY IF EXISTS "Users can view logs of their clients" ON public.logs_automacao;

CREATE POLICY "Users can view logs of their clients"
  ON public.logs_automacao FOR SELECT
  USING (
    client_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM clients 
      WHERE clients.id = logs_automacao.client_id 
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all logs"
  ON public.logs_automacao FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- Fix 3: Add RLS policies for caixa_postal_fiscal
CREATE POLICY "Users can view messages of their companies"
  ON public.caixa_postal_fiscal FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = caixa_postal_fiscal.company_id 
    AND companies.responsavel_id = auth.uid()
  ));

CREATE POLICY "Users can manage messages of their companies"
  ON public.caixa_postal_fiscal FOR ALL
  USING (EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = caixa_postal_fiscal.company_id 
    AND companies.responsavel_id = auth.uid()
  ));

-- Fix 4: Restrict storage bucket policies to user-specific folders
DROP POLICY IF EXISTS "Users can read certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can update certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete documents" ON storage.objects;

-- Restrict certificados bucket to user-specific folders: certificados/{user_id}/*
CREATE POLICY "Users can manage their certificates"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'certificados' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'certificados' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Restrict documentos bucket to user-specific folders: documentos/{user_id}/*
CREATE POLICY "Users can manage their documents"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'documentos' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'documentos' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );