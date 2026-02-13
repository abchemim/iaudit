
-- 1. Create storage bucket for CND documents
INSERT INTO storage.buckets (id, name, public) VALUES ('cnd-documentos', 'cnd-documentos', true);

-- Storage policies for cnd-documentos bucket
CREATE POLICY "Authenticated users can read CND documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'cnd-documentos');

CREATE POLICY "Service role can upload CND documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cnd-documentos');

CREATE POLICY "Service role can update CND documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cnd-documentos');

CREATE POLICY "Service role can delete CND documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'cnd-documentos');

-- 2. Fix logs_automacao: add missing columns used by edge functions
ALTER TABLE public.logs_automacao 
  ADD COLUMN IF NOT EXISTS mensagem text,
  ADD COLUMN IF NOT EXISTS dados_retorno jsonb,
  ADD COLUMN IF NOT EXISTS tempo_execucao numeric,
  ADD COLUMN IF NOT EXISTS infosimples_query_id text,
  ADD COLUMN IF NOT EXISTS infosimples_creditos integer;

-- Make 'tipo' column have a default so edge functions don't fail
ALTER TABLE public.logs_automacao ALTER COLUMN tipo SET DEFAULT 'cnd';

-- 3. Remove pdf_base64 from cnd_certidoes (files should be in storage)
ALTER TABLE public.cnd_certidoes DROP COLUMN IF EXISTS pdf_base64;
