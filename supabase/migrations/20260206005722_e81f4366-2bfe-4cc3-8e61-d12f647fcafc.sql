-- Enum para tipos de regime tributário
CREATE TYPE public.tax_regime AS ENUM ('simples_nacional', 'lucro_presumido', 'lucro_real', 'mei');

-- Enum para status geral
CREATE TYPE public.status_type AS ENUM ('ok', 'pending', 'attention', 'expired');

-- Enum para tipos de certidão
CREATE TYPE public.certificate_type AS ENUM ('cnd_federal', 'cnd_estadual', 'cnd_municipal', 'cnd_trabalhista', 'cnd_fgts');

-- Enum para tipos de declaração
CREATE TYPE public.declaration_type AS ENUM ('pgdas', 'pgmei', 'dctfweb', 'sped_fiscal', 'sped_contabil', 'ecd', 'ecf');

-- Tabela de clientes/empresas monitoradas
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_name TEXT NOT NULL,
    trade_name TEXT,
    cnpj TEXT NOT NULL UNIQUE,
    tax_regime tax_regime NOT NULL DEFAULT 'simples_nacional',
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

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Users can view their own clients"
    ON public.clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients"
    ON public.clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
    ON public.clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
    ON public.clients FOR DELETE
    USING (auth.uid() = user_id);

-- Tabela de certidões (CNDs)
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type certificate_type NOT NULL,
    status status_type NOT NULL DEFAULT 'pending',
    issue_date DATE,
    expiry_date DATE,
    certificate_number TEXT,
    document_url TEXT,
    notes TEXT,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certificates (access through client ownership)
CREATE POLICY "Users can view certificates of their clients"
    ON public.certificates FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = certificates.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can create certificates for their clients"
    ON public.certificates FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = certificates.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can update certificates of their clients"
    ON public.certificates FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = certificates.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete certificates of their clients"
    ON public.certificates FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = certificates.client_id 
        AND clients.user_id = auth.uid()
    ));

-- Tabela de FGTS Digital
CREATE TABLE public.fgts_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    competence_month DATE NOT NULL,
    status status_type NOT NULL DEFAULT 'pending',
    due_date DATE,
    amount DECIMAL(15,2),
    paid_amount DECIMAL(15,2),
    paid_at DATE,
    guide_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fgts_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for FGTS
CREATE POLICY "Users can view FGTS of their clients"
    ON public.fgts_records FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = fgts_records.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can create FGTS for their clients"
    ON public.fgts_records FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = fgts_records.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can update FGTS of their clients"
    ON public.fgts_records FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = fgts_records.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete FGTS of their clients"
    ON public.fgts_records FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = fgts_records.client_id 
        AND clients.user_id = auth.uid()
    ));

-- Tabela de parcelamentos
CREATE TABLE public.installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    program_name TEXT NOT NULL,
    status status_type NOT NULL DEFAULT 'ok',
    total_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    installment_count INTEGER NOT NULL,
    current_installment INTEGER DEFAULT 1,
    monthly_amount DECIMAL(15,2),
    start_date DATE,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for installments
CREATE POLICY "Users can view installments of their clients"
    ON public.installments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = installments.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can create installments for their clients"
    ON public.installments FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = installments.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can update installments of their clients"
    ON public.installments FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = installments.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete installments of their clients"
    ON public.installments FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = installments.client_id 
        AND clients.user_id = auth.uid()
    ));

-- Tabela de declarações fiscais
CREATE TABLE public.tax_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    type declaration_type NOT NULL,
    status status_type NOT NULL DEFAULT 'pending',
    competence_month DATE NOT NULL,
    due_date DATE,
    submitted_at TIMESTAMPTZ,
    receipt_number TEXT,
    tax_amount DECIMAL(15,2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_declarations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tax declarations
CREATE POLICY "Users can view declarations of their clients"
    ON public.tax_declarations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = tax_declarations.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can create declarations for their clients"
    ON public.tax_declarations FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = tax_declarations.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can update declarations of their clients"
    ON public.tax_declarations FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = tax_declarations.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete declarations of their clients"
    ON public.tax_declarations FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = tax_declarations.client_id 
        AND clients.user_id = auth.uid()
    ));

-- Tabela de notificações do sistema
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Tabela de sublimites do Simples Nacional
CREATE TABLE public.simples_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    accumulated_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
    limit_amount DECIMAL(15,2) NOT NULL DEFAULT 4800000,
    percentage_used DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN limit_amount > 0 THEN (accumulated_revenue / limit_amount) * 100 ELSE 0 END
    ) STORED,
    status status_type NOT NULL DEFAULT 'ok',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (client_id, year)
);

-- Enable RLS
ALTER TABLE public.simples_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for simples_limits
CREATE POLICY "Users can view simples limits of their clients"
    ON public.simples_limits FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = simples_limits.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can create simples limits for their clients"
    ON public.simples_limits FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = simples_limits.client_id 
        AND clients.user_id = auth.uid()
    ));

CREATE POLICY "Users can update simples limits of their clients"
    ON public.simples_limits FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = simples_limits.client_id 
        AND clients.user_id = auth.uid()
    ));

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fgts_records_updated_at
    BEFORE UPDATE ON public.fgts_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_installments_updated_at
    BEFORE UPDATE ON public.installments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tax_declarations_updated_at
    BEFORE UPDATE ON public.tax_declarations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_cnpj ON public.clients(cnpj);
CREATE INDEX idx_certificates_client_id ON public.certificates(client_id);
CREATE INDEX idx_certificates_expiry_date ON public.certificates(expiry_date);
CREATE INDEX idx_fgts_client_id ON public.fgts_records(client_id);
CREATE INDEX idx_fgts_competence ON public.fgts_records(competence_month);
CREATE INDEX idx_installments_client_id ON public.installments(client_id);
CREATE INDEX idx_tax_declarations_client_id ON public.tax_declarations(client_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_simples_limits_client_id ON public.simples_limits(client_id);