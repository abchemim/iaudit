-- View para relatório de créditos InfoSimples
CREATE OR REPLACE VIEW public.relatorio_creditos AS
SELECT 
  DATE(created_at) as data,
  tipo_consulta,
  COUNT(*) as total_consultas,
  COALESCE(SUM(creditos_usados), 0) as total_creditos,
  COALESCE(SUM(custo_estimado), 0) as custo_total
FROM public.infosimples_creditos
GROUP BY DATE(created_at), tipo_consulta
ORDER BY data DESC;

-- Buckets adicionais mencionados no prompt
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('certificados', 'certificados', true),
  ('temp', 'temp', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies para o bucket certificados
CREATE POLICY "Certificados são públicos para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificados');

CREATE POLICY "Usuários autenticados podem fazer upload em certificados"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificados' AND auth.role() = 'authenticated');

-- RLS policies para o bucket temp
CREATE POLICY "Apenas usuários autenticados podem acessar temp"
ON storage.objects FOR SELECT
USING (bucket_id = 'temp' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem fazer upload em temp"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'temp' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários podem deletar seus arquivos temp"
ON storage.objects FOR DELETE
USING (bucket_id = 'temp' AND auth.role() = 'authenticated');