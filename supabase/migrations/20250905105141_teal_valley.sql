/*
  # Create storage bucket for pet images

  1. Storage
    - Create `pet-images` bucket for storing pet photos
    - Enable public access for image retrieval
    - Set up RLS policies for bucket access

  2. Security
    - Allow public read access to images
    - Allow authenticated users to upload images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pet-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images');