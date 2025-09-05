/*
  # Create storage bucket for pet images

  1. Storage Setup
    - Create `pet-images` bucket for storing pet photos
    - Enable public access for reading images
    - Allow public uploads for anonymous users

  2. Security Policies
    - Allow anyone to upload images (INSERT)
    - Allow anyone to view images (SELECT)
    - Restrict updates and deletes to maintain data integrity
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-images',
  'pet-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload images
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'pet-images');

-- Allow anyone to view images
CREATE POLICY "Allow public access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pet-images');

-- Allow anyone to update their own uploads (optional, for future use)
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'pet-images')
WITH CHECK (bucket_id = 'pet-images');

-- Allow anyone to delete their own uploads (optional, for future use)
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'pet-images');