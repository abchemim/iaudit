-- Recriar view com SECURITY INVOKER para respeitar RLS do usuário que consulta
DROP VIEW IF EXISTS public.relatorio_creditos;

CREATE VIEW public.relatorio_creditos 
WITH (security_invoker = true)
AS
SELECT 
  DATE(created_at) as data,
  tipo_consulta,
  COUNT(*) as total_consultas,
  COALESCE(SUM(creditos_usados), 0) as total_creditos,
  COALESCE(SUM(custo_estimado), 0) as custo_total
FROM public.infosimples_creditos
GROUP BY DATE(created_at), tipo_consulta
ORDER BY data DESC;

-- Adicionar RLS policy para a tabela infosimples_saldo_historico (warning de RLS sem policy)
CREATE POLICY "Usuários autenticados podem visualizar histórico de saldo"
ON public.infosimples_saldo_historico
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Sistema pode inserir histórico de saldo"
ON public.infosimples_saldo_historico
FOR INSERT
WITH CHECK (true);