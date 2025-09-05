/*
  # Update tables for authentication

  1. Changes
    - Add user_id column to pets table
    - Add user_id column to chat_messages table
    - Update RLS policies to be user-specific
    - Add foreign key constraints

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to access only their own data
*/

-- Add user_id to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to chat_messages table  
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for pets table
DROP POLICY IF EXISTS "Allow public access to pets" ON pets;

CREATE POLICY "Users can manage their own pets"
  ON pets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for chat_messages table
DROP POLICY IF EXISTS "Allow public access to chat messages" ON chat_messages;

CREATE POLICY "Users can manage their own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS pets_user_id_idx ON pets(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);