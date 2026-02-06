-- =====================================================
-- MIGRAÇÃO PARA SISTEMA DE CNDs AUTOMATIZADO
-- =====================================================

-- 1. Criar nova tabela cnd_certidoes com estrutura completa
CREATE TABLE public.cnd_certidoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('federal', 'estadual', 'fgts', 'municipal', 'trabalhista')),
  orgao TEXT NOT NULL DEFAULT 'receita_federal',
  numero_certidao TEXT,
  codigo_controle TEXT,
  data_emissao DATE,
  data_validade DATE,
  situacao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('valida', 'vencendo', 'vencida', 'pendente', 'erro')),
  arquivo_url TEXT,
  arquivo_nome TEXT,
  pdf_base64 TEXT,
  infosimples_query_id TEXT,
  infosimples_status TEXT,
  infosimples_creditos_usados NUMERIC,
  obtida_automaticamente BOOLEAN DEFAULT false,
  proximo_check DATE,
  alertado BOOLEAN DEFAULT false,
  api_response JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Criar tabela de logs de créditos InfoSimples
CREATE TABLE public.infosimples_creditos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_consulta TEXT NOT NULL,
  creditos_usados NUMERIC NOT NULL DEFAULT 0,
  cnpj_consultado TEXT,
  custo_estimado NUMERIC DEFAULT 1.50,
  sucesso BOOLEAN DEFAULT true,
  query_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Criar tabela de logs de automação
CREATE TABLE public.logs_automacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  workflow_n8n TEXT,
  acao TEXT NOT NULL,
  infosimples_query_id TEXT,
  infosimples_creditos NUMERIC,
  status TEXT NOT NULL DEFAULT 'sucesso' CHECK (status IN ('sucesso', 'erro', 'pendente')),
  mensagem TEXT,
  dados_retorno JSONB,
  erro_detalhes TEXT,
  stack_trace TEXT,
  tempo_execucao NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Criar tabela de configurações de alertas
CREATE TABLE public.configuracoes_alertas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  alerta_cnd_vencimento BOOLEAN DEFAULT true,
  dias_antecedencia_alerta INTEGER DEFAULT 15,
  whatsapp_ativo BOOLEAN DEFAULT false,
  whatsapp_numero TEXT,
  email_ativo BOOLEAN DEFAULT true,
  email_endereco TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

-- 5. Criar tabela de débitos fiscais detectados
CREATE TABLE public.debitos_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  origem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'regularizado', 'parcelado', 'contestado')),
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
  descricao TEXT,
  valor NUMERIC,
  detectado_via TEXT,
  api_response JSONB,
  resolvido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Migrar dados existentes de certificates para cnd_certidoes
INSERT INTO public.cnd_certidoes (
  client_id,
  tipo,
  orgao,
  numero_certidao,
  data_emissao,
  data_validade,
  situacao,
  status,
  arquivo_url,
  notes,
  created_at,
  updated_at
)
SELECT 
  client_id,
  CASE type 
    WHEN 'cnd_federal' THEN 'federal'
    WHEN 'cnd_estadual' THEN 'estadual'
    WHEN 'cnd_fgts' THEN 'fgts'
    WHEN 'cnd_municipal' THEN 'municipal'
    WHEN 'cnd_trabalhista' THEN 'trabalhista'
    ELSE 'federal'
  END,
  CASE type 
    WHEN 'cnd_federal' THEN 'receita_federal'
    WHEN 'cnd_estadual' THEN 'sefaz'
    WHEN 'cnd_fgts' THEN 'caixa'
    WHEN 'cnd_municipal' THEN 'prefeitura'
    WHEN 'cnd_trabalhista' THEN 'tst'
    ELSE 'receita_federal'
  END,
  certificate_number,
  issue_date,
  expiry_date,
  notes,
  CASE status 
    WHEN 'ok' THEN 'valida'
    WHEN 'pending' THEN 'pendente'
    WHEN 'attention' THEN 'vencendo'
    WHEN 'expired' THEN 'vencida'
    ELSE 'pendente'
  END,
  document_url,
  notes,
  created_at,
  updated_at
FROM public.certificates;

-- 7. Enable RLS em todas as novas tabelas
ALTER TABLE public.cnd_certidoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infosimples_creditos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_automacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debitos_fiscais ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para cnd_certidoes
CREATE POLICY "Users can view CNDs of their clients" ON public.cnd_certidoes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = cnd_certidoes.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Users can create CNDs for their clients" ON public.cnd_certidoes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = cnd_certidoes.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Users can update CNDs of their clients" ON public.cnd_certidoes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = cnd_certidoes.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Users can delete CNDs of their clients" ON public.cnd_certidoes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = cnd_certidoes.client_id AND clients.user_id = auth.uid())
  );

-- 9. Políticas RLS para infosimples_creditos
CREATE POLICY "Users can view their own credits" ON public.infosimples_creditos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits" ON public.infosimples_creditos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Políticas RLS para logs_automacao
CREATE POLICY "Users can view logs of their clients" ON public.logs_automacao
  FOR SELECT USING (
    client_id IS NULL OR
    EXISTS (SELECT 1 FROM clients WHERE clients.id = logs_automacao.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Users can create logs for their clients" ON public.logs_automacao
  FOR INSERT WITH CHECK (
    client_id IS NULL OR
    EXISTS (SELECT 1 FROM clients WHERE clients.id = logs_automacao.client_id AND clients.user_id = auth.uid())
  );

-- 11. Políticas RLS para configuracoes_alertas
CREATE POLICY "Users can manage their own alert configs" ON public.configuracoes_alertas
  FOR ALL USING (auth.uid() = user_id);

-- 12. Políticas RLS para debitos_fiscais
CREATE POLICY "Users can view debts of their clients" ON public.debitos_fiscais
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = debitos_fiscais.client_id AND clients.user_id = auth.uid())
  );

CREATE POLICY "Users can manage debts of their clients" ON public.debitos_fiscais
  FOR ALL USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = debitos_fiscais.client_id AND clients.user_id = auth.uid())
  );

-- 13. Triggers para updated_at
CREATE TRIGGER update_cnd_certidoes_updated_at
  BEFORE UPDATE ON public.cnd_certidoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuracoes_alertas_updated_at
  BEFORE UPDATE ON public.configuracoes_alertas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debitos_fiscais_updated_at
  BEFORE UPDATE ON public.debitos_fiscais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Criar Storage bucket para documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documentos', 'documentos', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- 15. Políticas de Storage
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documentos' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documentos');

CREATE POLICY "Users can update their documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documentos' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete their documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documentos' AND 
    auth.uid() IS NOT NULL
  );

-- 16. Índices para performance
CREATE INDEX idx_cnd_certidoes_client_id ON public.cnd_certidoes(client_id);
CREATE INDEX idx_cnd_certidoes_tipo ON public.cnd_certidoes(tipo);
CREATE INDEX idx_cnd_certidoes_status ON public.cnd_certidoes(status);
CREATE INDEX idx_cnd_certidoes_data_validade ON public.cnd_certidoes(data_validade);
CREATE INDEX idx_logs_automacao_client_id ON public.logs_automacao(client_id);
CREATE INDEX idx_debitos_fiscais_client_id ON public.debitos_fiscais(client_id);