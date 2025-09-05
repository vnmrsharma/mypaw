/*
  # MyPaw Database Schema

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - dog, cat, bird, etc.
      - `breed` (text, optional) - specific breed
      - `description` (text) - AI-generated description
      - `personality` (jsonb) - characteristics and care tips
      - `image_url` (text) - pet image URL
      - `user_id` (uuid, optional) - for future user auth
      - `created_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `message` (text)
      - `is_from_pet` (boolean) - true if from AI pet, false if from user
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since no auth initially)
*/

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  breed text,
  description text NOT NULL,
  personality jsonb DEFAULT '{}',
  image_url text NOT NULL,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_from_pet boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required initially)
CREATE POLICY "Allow public access to pets"
  ON pets
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to chat messages"
  ON chat_messages
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pets_created_at_idx ON pets(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_pet_id_idx ON chat_messages(pet_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);