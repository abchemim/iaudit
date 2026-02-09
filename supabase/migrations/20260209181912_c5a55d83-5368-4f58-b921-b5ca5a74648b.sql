
-- 1. Add user_id to clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Drop existing restrictive policies on clients
DROP POLICY IF EXISTS "Allow all for service role" ON public.clients;
DROP POLICY IF EXISTS "Permitir tudo para service role" ON public.clients;
DROP POLICY IF EXISTS "Service Role full access clients" ON public.clients;

-- Create proper RLS policies for clients
CREATE POLICY "Users can view their own clients"
  ON public.clients FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON public.clients FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON public.clients FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 2. Add missing columns to logs_automacao
ALTER TABLE public.logs_automacao ADD COLUMN IF NOT EXISTS client_id uuid;
ALTER TABLE public.logs_automacao ADD COLUMN IF NOT EXISTS infosimples_query_id text;
ALTER TABLE public.logs_automacao ADD COLUMN IF NOT EXISTS infosimples_creditos integer DEFAULT 0;
ALTER TABLE public.logs_automacao ADD COLUMN IF NOT EXISTS tempo_execucao numeric;

ALTER TABLE public.logs_automacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access logs" ON public.logs_automacao;
CREATE POLICY "Users can view logs for their clients"
  ON public.logs_automacao FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    OR client_id IS NULL
  );

CREATE POLICY "Service role can insert logs"
  ON public.logs_automacao FOR INSERT
  WITH CHECK (true);

-- 3. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  crc_number text,
  office_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 4. Create notification_settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cnd_alert boolean DEFAULT true,
  tarefas_alert boolean DEFAULT true,
  email_alert boolean DEFAULT true,
  whatsapp_ativo boolean DEFAULT false,
  whatsapp_numero text,
  dias_antecedencia_cnd integer DEFAULT 15,
  dias_antecedencia_tarefas integer DEFAULT 3,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification settings"
  ON public.notification_settings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
  ON public.notification_settings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON public.notification_settings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 5. Create cnd_certidoes table
CREATE TABLE IF NOT EXISTS public.cnd_certidoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  orgao text,
  status text DEFAULT 'pendente',
  situacao text,
  numero_certidao text,
  codigo_controle text,
  data_emissao date,
  data_validade date,
  arquivo_url text,
  pdf_base64 text,
  alertado boolean DEFAULT false,
  obtida_automaticamente boolean DEFAULT false,
  proximo_check date,
  infosimples_query_id text,
  infosimples_status text,
  infosimples_creditos_usados integer DEFAULT 0,
  api_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cnd_certidoes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_cnd_certidoes_client ON public.cnd_certidoes(client_id);
CREATE INDEX IF NOT EXISTS idx_cnd_certidoes_tipo ON public.cnd_certidoes(tipo);
CREATE INDEX IF NOT EXISTS idx_cnd_certidoes_status ON public.cnd_certidoes(status);

CREATE POLICY "Users can view CNDs of their clients"
  ON public.cnd_certidoes FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert CNDs for their clients"
  ON public.cnd_certidoes FOR INSERT TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Users can update CNDs of their clients"
  ON public.cnd_certidoes FOR UPDATE TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete CNDs of their clients"
  ON public.cnd_certidoes FOR DELETE TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Service role full access cnd_certidoes"
  ON public.cnd_certidoes FOR ALL
  USING (true) WITH CHECK (true);

-- 6. Create cnd_consultas_jobs table
CREATE TABLE IF NOT EXISTS public.cnd_consultas_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  status text DEFAULT 'processing',
  progress integer DEFAULT 0,
  result jsonb,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cnd_consultas_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own jobs"
  ON public.cnd_consultas_jobs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access jobs"
  ON public.cnd_consultas_jobs FOR ALL
  USING (true) WITH CHECK (true);

-- 7. Create tarefas table
CREATE TABLE IF NOT EXISTS public.tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  tipo text DEFAULT 'manual',
  relacionado_tipo text,
  relacionado_id uuid,
  prioridade text DEFAULT 'media',
  status text DEFAULT 'pendente',
  vencimento date,
  concluida_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tarefas_user ON public.tarefas(user_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_client ON public.tarefas(client_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);

CREATE POLICY "Users can view their own tarefas"
  ON public.tarefas FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tarefas"
  ON public.tarefas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tarefas"
  ON public.tarefas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tarefas"
  ON public.tarefas FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access tarefas"
  ON public.tarefas FOR ALL
  USING (true) WITH CHECK (true);

-- 8. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access notifications"
  ON public.notifications FOR ALL
  USING (true) WITH CHECK (true);

-- 9. Create configuracoes_alertas table
CREATE TABLE IF NOT EXISTS public.configuracoes_alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  alerta_cnd_vencimento boolean DEFAULT true,
  whatsapp_ativo boolean DEFAULT false,
  whatsapp_numero text,
  email_ativo boolean DEFAULT true,
  dias_antecedencia integer DEFAULT 15,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

ALTER TABLE public.configuracoes_alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alert configs"
  ON public.configuracoes_alertas FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alert configs"
  ON public.configuracoes_alertas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert configs"
  ON public.configuracoes_alertas FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access configuracoes_alertas"
  ON public.configuracoes_alertas FOR ALL
  USING (true) WITH CHECK (true);

-- 10. Create infosimples_creditos table
CREATE TABLE IF NOT EXISTS public.infosimples_creditos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_consulta text NOT NULL,
  creditos_usados integer DEFAULT 0,
  cnpj_consultado text,
  custo_estimado numeric DEFAULT 0,
  sucesso boolean DEFAULT false,
  query_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.infosimples_creditos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON public.infosimples_creditos FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access infosimples_creditos"
  ON public.infosimples_creditos FOR ALL
  USING (true) WITH CHECK (true);

-- 11. Fix cnds table RLS
CREATE POLICY "Users can view their cnds"
  ON public.cnds FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Service role full access cnds"
  ON public.cnds FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE public.cnds ENABLE ROW LEVEL SECURITY;

-- 12. Fix documentos_cnd RLS (drop broken policies referencing cliente_id as user)
DROP POLICY IF EXISTS "Allow all for service role" ON public.documentos_cnd;
DROP POLICY IF EXISTS "Clientes podem ver seus próprios documentos" ON public.documentos_cnd;
DROP POLICY IF EXISTS "Usuários veem suas próprias certidões" ON public.documentos_cnd;

CREATE POLICY "Users can view documentos of their clients"
  ON public.documentos_cnd FOR SELECT TO authenticated
  USING (cliente_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

CREATE POLICY "Service role full access documentos_cnd"
  ON public.documentos_cnd FOR ALL
  USING (true) WITH CHECK (true);

-- 13. Make storage buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('certidoes', 'cnd_documentos');

-- 14. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_cnd_certidoes_updated_at BEFORE UPDATE ON public.cnd_certidoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cnd_consultas_jobs_updated_at BEFORE UPDATE ON public.cnd_consultas_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_alertas_updated_at BEFORE UPDATE ON public.configuracoes_alertas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
