-- Add tarefas_alert column to notification_settings
ALTER TABLE public.notification_settings
ADD COLUMN IF NOT EXISTS tarefas_alert boolean DEFAULT true;

-- Add dias_antecedencia_tarefas column to notification_settings  
ALTER TABLE public.notification_settings
ADD COLUMN IF NOT EXISTS dias_antecedencia_tarefas integer DEFAULT 3;

COMMENT ON COLUMN public.notification_settings.tarefas_alert IS 'Enable/disable task due date alerts';
COMMENT ON COLUMN public.notification_settings.dias_antecedencia_tarefas IS 'Days before task due date to send alert';