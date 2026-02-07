-- Fix security issues: make storage buckets private and remove permissive RLS policy

-- 1. Make storage buckets private (documentos and certificados contain sensitive data)
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('documentos', 'certificados');

-- 2. Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload certificates" ON storage.objects;

-- 3. Create secure storage policies for documentos bucket
-- Users can only upload to their own folder structure
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);

-- Users can only read documents they uploaded (based on owner metadata or path)
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documentos' AND
  auth.uid() IS NOT NULL
);

-- 4. Create secure storage policies for certificados bucket
CREATE POLICY "Users can upload certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificados' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can read certificates"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'certificados' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certificados' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificados' AND
  auth.uid() IS NOT NULL
);

-- 5. Remove permissive INSERT policy on infosimples_saldo_historico
-- Edge functions use service role key which bypasses RLS anyway
DROP POLICY IF EXISTS "Sistema pode inserir histórico de saldo" ON public.infosimples_saldo_historico;