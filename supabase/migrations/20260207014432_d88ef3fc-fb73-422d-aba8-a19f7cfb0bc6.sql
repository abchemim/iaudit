-- Tabela: tarefas (para gerenciamento de tarefas de renovação de CNDs e outras ações)
CREATE TABLE public.tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'verificacao',
  relacionado_tipo TEXT,
  relacionado_id UUID,
  prioridade TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  vencimento DATE,
  concluido_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_tarefas_client_id ON public.tarefas(client_id);
CREATE INDEX idx_tarefas_user_id ON public.tarefas(user_id);
CREATE INDEX idx_tarefas_status ON public.tarefas(status);
CREATE INDEX idx_tarefas_prioridade ON public.tarefas(prioridade);

-- Enable RLS
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Policies para tarefas
CREATE POLICY "Users can view their own tasks" 
ON public.tarefas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create tasks for their clients" 
ON public.tarefas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND EXISTS (
  SELECT 1 FROM clients WHERE clients.id = tarefas.client_id AND clients.user_id = auth.uid()
));

CREATE POLICY "Users can update their own tasks" 
ON public.tarefas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tarefas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tarefas_updated_at
BEFORE UPDATE ON public.tarefas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela: infosimples_saldo_historico (histórico de saldo de créditos InfoSimples)
CREATE TABLE public.infosimples_saldo_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  saldo_creditos NUMERIC NOT NULL,
  saldo_reais NUMERIC,
  data_verificacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  alerta_enviado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para performance
CREATE INDEX idx_infosimples_saldo_data ON public.infosimples_saldo_historico(data_verificacao);

-- Enable RLS
ALTER TABLE public.infosimples_saldo_historico ENABLE ROW LEVEL SECURITY;

-- Policies para saldo historico (admins podem ver tudo)
CREATE POLICY "Users can view saldo historico" 
ON public.infosimples_saldo_historico 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert saldo historico" 
ON public.infosimples_saldo_historico 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);