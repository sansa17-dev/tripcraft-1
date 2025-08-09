/*
  # Create user personas table

  1. New Tables
    - `user_personas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `time_preference` (text)
      - `social_style` (text)
      - `cultural_interest` (text)
      - `food_adventure` (text)
      - `planning_style` (text)
      - `interests` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_personas` table
    - Add policies for authenticated users to manage their own personas
*/

CREATE TABLE IF NOT EXISTS user_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_preference text DEFAULT '',
  social_style text DEFAULT '',
  cultural_interest text DEFAULT '',
  food_adventure text DEFAULT '',
  planning_style text DEFAULT '',
  interests jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_personas ENABLE ROW LEVEL SECURITY;

-- Users can read their own persona
CREATE POLICY "Users can read own persona"
  ON user_personas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own persona
CREATE POLICY "Users can create own persona"
  ON user_personas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own persona
CREATE POLICY "Users can update own persona"
  ON user_personas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own persona
CREATE POLICY "Users can delete own persona"
  ON user_personas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX user_personas_user_id_idx ON user_personas(user_id);
CREATE INDEX user_personas_created_at_idx ON user_personas(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_personas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_personas_updated_at
  BEFORE UPDATE ON user_personas
  FOR EACH ROW
  EXECUTE FUNCTION update_user_personas_updated_at();