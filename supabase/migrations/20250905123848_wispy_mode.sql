/*
  # Add reasoning column to chat_messages table

  1. Changes
    - Add `reasoning` column to `chat_messages` table
    - Column is nullable text type to store AI response explanations
    - This enables the reasoning dropdown feature in chat interface

  2. Notes
    - Column is optional (nullable) as existing messages won't have reasoning
    - New messages from AI will include reasoning explanations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'reasoning'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN reasoning text;
  END IF;
END $$;