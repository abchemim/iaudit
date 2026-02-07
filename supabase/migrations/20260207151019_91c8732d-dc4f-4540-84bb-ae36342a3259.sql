-- Create table for tracking async CND query jobs
CREATE TABLE public.cnd_consultas_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  progress INTEGER DEFAULT 0,
  result JSONB,
  error TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cnd_consultas_jobs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own jobs
CREATE POLICY "Users can view their own jobs"
ON public.cnd_consultas_jobs
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role can manage all jobs"
ON public.cnd_consultas_jobs
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_cnd_consultas_jobs_updated_at
BEFORE UPDATE ON public.cnd_consultas_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_cnd_consultas_jobs_user_status ON public.cnd_consultas_jobs(user_id, status);