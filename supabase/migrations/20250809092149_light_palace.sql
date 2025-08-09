/*
  # Add sharing and collaboration tables

  1. New Tables
    - `shared_itineraries`
      - `id` (uuid, primary key)
      - `share_id` (uuid, unique identifier for sharing)
      - `user_id` (uuid, foreign key to auth.users)
      - `itinerary_id` (uuid, foreign key to itineraries)
      - `title` (text, display title for shared itinerary)
      - `share_mode` (text, 'view' or 'collaborate')
      - `is_public` (boolean, whether anyone with link can access)
      - `expires_at` (timestamptz, optional expiration)
      - `view_count` (integer, number of times viewed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `collaboration_sessions`
      - `id` (uuid, primary key)
      - `shared_itinerary_id` (uuid, foreign key to shared_itineraries)
      - `user_id` (uuid, foreign key to auth.users)
      - `is_active` (boolean, whether user is currently active)
      - `last_seen` (timestamptz, last activity timestamp)
      - `cursor_position` (jsonb, current editing position)

  2. Security
    - Enable RLS on both tables
    - Add policies for sharing and collaboration access
    - Add function to increment view counts

  3. Indexes
    - Index on share_id for fast lookups
    - Index on user_id for user's shared itineraries
    - Index on itinerary_id for itinerary shares
*/

-- Create shared_itineraries table
CREATE TABLE IF NOT EXISTS shared_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id uuid NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  title text NOT NULL,
  share_mode text NOT NULL DEFAULT 'view' CHECK (share_mode IN ('view', 'collaborate')),
  is_public boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collaboration_sessions table
CREATE TABLE IF NOT EXISTS collaboration_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_itinerary_id uuid NOT NULL REFERENCES shared_itineraries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  is_active boolean NOT NULL DEFAULT true,
  last_seen timestamptz DEFAULT now(),
  cursor_position jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shared_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for shared_itineraries
CREATE POLICY "Users can create their own shares"
  ON shared_itineraries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own shares"
  ON shared_itineraries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public shares can be viewed by anyone"
  ON shared_itineraries
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Users can update their own shares"
  ON shared_itineraries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shares"
  ON shared_itineraries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for collaboration_sessions
CREATE POLICY "Users can create collaboration sessions"
  ON collaboration_sessions
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can view collaboration sessions for accessible shares"
  ON collaboration_sessions
  FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM shared_itineraries si
      WHERE si.id = shared_itinerary_id
      AND (si.is_public = true OR si.user_id = auth.uid())
      AND (si.expires_at IS NULL OR si.expires_at > now())
    )
  );

CREATE POLICY "Users can update their own collaboration sessions"
  ON collaboration_sessions
  FOR UPDATE
  TO authenticated, anon
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own collaboration sessions"
  ON collaboration_sessions
  FOR DELETE
  TO authenticated, anon
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS shared_itineraries_share_id_idx ON shared_itineraries (share_id);
CREATE INDEX IF NOT EXISTS shared_itineraries_user_id_idx ON shared_itineraries (user_id);
CREATE INDEX IF NOT EXISTS shared_itineraries_itinerary_id_idx ON shared_itineraries (itinerary_id);
CREATE INDEX IF NOT EXISTS shared_itineraries_created_at_idx ON shared_itineraries (created_at DESC);

CREATE INDEX IF NOT EXISTS collaboration_sessions_shared_itinerary_id_idx ON collaboration_sessions (shared_itinerary_id);
CREATE INDEX IF NOT EXISTS collaboration_sessions_user_id_idx ON collaboration_sessions (user_id);
CREATE INDEX IF NOT EXISTS collaboration_sessions_last_seen_idx ON collaboration_sessions (last_seen DESC);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_share_views(share_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE shared_itineraries 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE share_id = share_uuid;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shared_itineraries_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_shared_itineraries_updated_at
  BEFORE UPDATE ON shared_itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_shared_itineraries_updated_at();