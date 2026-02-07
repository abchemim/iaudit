-- Drop existing foreign keys and recreate with ON DELETE CASCADE
-- This ensures all related data is deleted when a client is removed

-- certificates
ALTER TABLE public.certificates 
DROP CONSTRAINT IF EXISTS certificates_client_id_fkey;

ALTER TABLE public.certificates 
ADD CONSTRAINT certificates_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- cnd_certidoes
ALTER TABLE public.cnd_certidoes 
DROP CONSTRAINT IF EXISTS cnd_certidoes_client_id_fkey;

ALTER TABLE public.cnd_certidoes 
ADD CONSTRAINT cnd_certidoes_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- fgts_records
ALTER TABLE public.fgts_records 
DROP CONSTRAINT IF EXISTS fgts_records_client_id_fkey;

ALTER TABLE public.fgts_records 
ADD CONSTRAINT fgts_records_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- installments
ALTER TABLE public.installments 
DROP CONSTRAINT IF EXISTS installments_client_id_fkey;

ALTER TABLE public.installments 
ADD CONSTRAINT installments_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- mailbox_messages
ALTER TABLE public.mailbox_messages 
DROP CONSTRAINT IF EXISTS mailbox_messages_client_id_fkey;

ALTER TABLE public.mailbox_messages 
ADD CONSTRAINT mailbox_messages_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- simples_limits
ALTER TABLE public.simples_limits 
DROP CONSTRAINT IF EXISTS simples_limits_client_id_fkey;

ALTER TABLE public.simples_limits 
ADD CONSTRAINT simples_limits_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- tax_declarations
ALTER TABLE public.tax_declarations 
DROP CONSTRAINT IF EXISTS tax_declarations_client_id_fkey;

ALTER TABLE public.tax_declarations 
ADD CONSTRAINT tax_declarations_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- debitos_fiscais
ALTER TABLE public.debitos_fiscais 
DROP CONSTRAINT IF EXISTS debitos_fiscais_client_id_fkey;

ALTER TABLE public.debitos_fiscais 
ADD CONSTRAINT debitos_fiscais_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

-- configuracoes_alertas (client_id is optional, so use ON DELETE SET NULL)
ALTER TABLE public.configuracoes_alertas 
DROP CONSTRAINT IF EXISTS configuracoes_alertas_client_id_fkey;

ALTER TABLE public.configuracoes_alertas 
ADD CONSTRAINT configuracoes_alertas_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- tarefas (client_id is optional)
ALTER TABLE public.tarefas 
DROP CONSTRAINT IF EXISTS tarefas_client_id_fkey;

ALTER TABLE public.tarefas 
ADD CONSTRAINT tarefas_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- logs_automacao (client_id is optional)
ALTER TABLE public.logs_automacao 
DROP CONSTRAINT IF EXISTS logs_automacao_client_id_fkey;

ALTER TABLE public.logs_automacao 
ADD CONSTRAINT logs_automacao_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- notifications (client_id is optional)
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_client_id_fkey;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;