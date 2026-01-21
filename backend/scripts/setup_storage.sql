-- Supabase Storage Setup Script
-- This script sets up the storage bucket for material uploads
-- Requirements: 4.1, 13.1

-- Create storage bucket for materials
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  false, -- Not public, requires authentication
  52428800, -- 50MB in bytes (50 * 1024 * 1024)
  ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Create storage policy: Users can upload to their own folder
CREATE POLICY "Users can upload materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy: Users can read their own files
CREATE POLICY "Users can read own materials"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy: Users can update their own files
CREATE POLICY "Users can update own materials"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy: Users can delete their own files
CREATE POLICY "Users can delete own materials"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
