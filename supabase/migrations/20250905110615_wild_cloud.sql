/*
  # Create diet plans table

  1. New Tables
    - `diet_plans`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets table)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_data` (jsonb, stores the complete diet plan)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `diet_plans` table
    - Add policy for authenticated users to manage their own diet plans
*/

CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS diet_plans_pet_id_idx ON diet_plans(pet_id);
CREATE INDEX IF NOT EXISTS diet_plans_user_id_idx ON diet_plans(user_id);
CREATE INDEX IF NOT EXISTS diet_plans_created_at_idx ON diet_plans(created_at DESC);

-- Enable Row Level Security
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage their own diet plans
CREATE POLICY "Users can manage their own diet plans"
  ON diet_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);