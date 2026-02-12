
-- =============================================
-- 1. CLIENTS (âncora multitenant)
-- =============================================
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  cnpj TEXT NOT NULL,
  tax_regime TEXT NOT NULL DEFAULT 'simples_nacional',
  state_registration TEXT,
  municipal_registration TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own clients" ON public.clients FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 2. CND_CERTIDOES
-- =============================================
CREATE TABLE public.cnd_certidoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  orgao TEXT NOT NULL DEFAULT '',
  numero_certidao TEXT,
  codigo_controle TEXT,
  data_emissao DATE,
  data_validade DATE,
  situacao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  arquivo_url TEXT,
  arquivo_nome TEXT,
  pdf_base64 TEXT,
  infosimples_query_id TEXT,
  infosimples_status TEXT,
  infosimples_creditos_usados INTEGER,
  obtida_automaticamente BOOLEAN NOT NULL DEFAULT false,
  proximo_check TIMESTAMPTZ,
  alertado BOOLEAN NOT NULL DEFAULT false,
  api_response JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cnd_certidoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cnd_certidoes" ON public.cnd_certidoes FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 3. CND_CONSULTAS_JOBS
-- =============================================
CREATE TABLE public.cnd_consultas_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  progress INTEGER NOT NULL DEFAULT 0,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cnd_consultas_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cnd_jobs" ON public.cnd_consultas_jobs FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 4. TAREFAS
-- =============================================
CREATE TABLE public.tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  responsavel_id UUID,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'outro',
  relacionado_tipo TEXT,
  relacionado_id UUID,
  prioridade TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  data_vencimento DATE,
  data_conclusao DATE,
  concluido_em TIMESTAMPTZ,
  concluida_automaticamente BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tarefas" ON public.tarefas FOR ALL TO authenticated
  USING (
    company_id IS NULL OR company_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    OR responsavel_id = auth.uid()
  )
  WITH CHECK (
    company_id IS NULL OR company_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    OR responsavel_id = auth.uid()
  );

-- =============================================
-- 5. NOTIFICATIONS
-- =============================================
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. TAX_DECLARATIONS
-- =============================================
CREATE TABLE public.tax_declarations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  competence_month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  submitted_at TIMESTAMPTZ,
  receipt_number TEXT,
  tax_amount NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tax_declarations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own declarations" ON public.tax_declarations FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 7. INSTALLMENTS
-- =============================================
CREATE TABLE public.installments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  installment_count INTEGER NOT NULL DEFAULT 1,
  current_installment INTEGER DEFAULT 1,
  monthly_amount NUMERIC,
  start_date DATE,
  next_due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own installments" ON public.installments FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 8. FGTS_RECORDS
-- =============================================
CREATE TABLE public.fgts_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  competence_month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  amount NUMERIC,
  paid_amount NUMERIC,
  paid_at TIMESTAMPTZ,
  guide_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fgts_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own fgts" ON public.fgts_records FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 9. SIMPLES_LIMITS
-- =============================================
CREATE TABLE public.simples_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  limit_amount NUMERIC NOT NULL DEFAULT 0,
  accumulated_revenue NUMERIC NOT NULL DEFAULT 0,
  percentage_used NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ok',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.simples_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own simples" ON public.simples_limits FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 10. MAILBOX_MESSAGES
-- =============================================
CREATE TABLE public.mailbox_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  message_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'unread',
  priority TEXT NOT NULL DEFAULT 'medium',
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mailbox_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own mailbox" ON public.mailbox_messages FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- =============================================
-- 11. USER_PROFILES
-- =============================================
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'accountant',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.user_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 12. NOTIFICATION_SETTINGS
-- =============================================
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  cert_expiry_alert BOOLEAN NOT NULL DEFAULT true,
  declarations_alert BOOLEAN NOT NULL DEFAULT true,
  fgts_alert BOOLEAN NOT NULL DEFAULT true,
  tarefas_alert BOOLEAN NOT NULL DEFAULT true,
  dias_antecedencia_tarefas INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notif settings" ON public.notification_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 13. COMPANY_SETTINGS
-- =============================================
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  company_cnpj TEXT,
  crc TEXT,
  company_phone TEXT,
  company_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own company settings" ON public.company_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 14. INFOSIMPLES_CREDITOS
-- =============================================
CREATE TABLE public.infosimples_creditos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_consulta TEXT NOT NULL,
  creditos_usados INTEGER NOT NULL DEFAULT 0,
  cnpj_consultado TEXT,
  custo_estimado NUMERIC DEFAULT 0,
  sucesso BOOLEAN DEFAULT true,
  query_id TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.infosimples_creditos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own creditos" ON public.infosimples_creditos FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Service insert creditos" ON public.infosimples_creditos FOR INSERT TO authenticated
  WITH CHECK (true);

-- =============================================
-- 15. INFOSIMPLES_SALDO_HISTORICO
-- =============================================
CREATE TABLE public.infosimples_saldo_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_consulta DATE,
  saldo NUMERIC,
  saldo_creditos NUMERIC,
  plano TEXT,
  saldo_atual NUMERIC,
  creditos_usados_mes NUMERIC,
  api_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.infosimples_saldo_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read saldo" ON public.infosimples_saldo_historico FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service insert saldo" ON public.infosimples_saldo_historico FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================
-- 16. LOGS_AUTOMACAO
-- =============================================
CREATE TABLE public.logs_automacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  acao TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sucesso',
  detalhes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.logs_automacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own logs" ON public.logs_automacao FOR SELECT TO authenticated
  USING (client_id IS NULL OR client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
CREATE POLICY "Service insert logs" ON public.logs_automacao FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================
-- 17. RELATORIO_CREDITOS (view)
-- =============================================
CREATE VIEW public.relatorio_creditos WITH (security_invoker = on) AS
SELECT
  DATE(created_at) AS data,
  tipo_consulta,
  COUNT(*)::INTEGER AS total_consultas,
  SUM(creditos_usados)::INTEGER AS total_creditos,
  SUM(custo_estimado)::NUMERIC AS custo_total
FROM public.infosimples_creditos
GROUP BY DATE(created_at), tipo_consulta
ORDER BY data DESC;

-- =============================================
-- TRIGGERS: updated_at automático
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cnd_certidoes_updated_at BEFORE UPDATE ON public.cnd_certidoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cnd_jobs_updated_at BEFORE UPDATE ON public.cnd_consultas_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_declarations_updated_at BEFORE UPDATE ON public.tax_declarations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON public.installments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fgts_updated_at BEFORE UPDATE ON public.fgts_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_simples_updated_at BEFORE UPDATE ON public.simples_limits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mailbox_updated_at BEFORE UPDATE ON public.mailbox_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notif_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- REALTIME: habilitar para tabelas chave
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.cnd_certidoes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
