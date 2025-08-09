/*
  # Add comments table for shared itineraries

  1. New Tables
    - `itinerary_comments`
      - `id` (uuid, primary key)
      - `share_id` (uuid, foreign key to shared_itineraries.share_id)
      - `user_email` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `itinerary_comments` table
    - Add policy for public read access on comments for public shares
    - Add policy for authenticated users to create comments
*/

CREATE TABLE IF NOT EXISTS itinerary_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id uuid NOT NULL,
  user_email text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE itinerary_comments 
ADD CONSTRAINT itinerary_comments_share_id_fkey 
FOREIGN KEY (share_id) REFERENCES shared_itineraries(share_id) ON DELETE CASCADE;

-- Add indexes
CREATE INDEX IF NOT EXISTS itinerary_comments_share_id_idx ON itinerary_comments(share_id);
CREATE INDEX IF NOT EXISTS itinerary_comments_created_at_idx ON itinerary_comments(created_at DESC);

-- Enable RLS
ALTER TABLE itinerary_comments ENABLE ROW LEVEL SECURITY;

-- Policy for reading comments on public shares
CREATE POLICY "Comments can be read on accessible shares"
  ON itinerary_comments
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shared_itineraries si
      WHERE si.share_id = itinerary_comments.share_id
      AND si.is_public = true
      AND (si.expires_at IS NULL OR si.expires_at > now())
    )
  );

-- Policy for creating comments (authenticated users only)
CREATE POLICY "Authenticated users can create comments"
  ON itinerary_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shared_itineraries si
      WHERE si.share_id = itinerary_comments.share_id
      AND si.share_mode = 'collaborate'
      AND si.is_public = true
      AND (si.expires_at IS NULL OR si.expires_at > now())
    )
  );

-- Policy for deleting comments (comment author or share owner)
CREATE POLICY "Users can delete their own comments or share owners can delete any"
  ON itinerary_comments
  FOR DELETE
  TO authenticated
  USING (
    user_email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM shared_itineraries si
      WHERE si.share_id = itinerary_comments.share_id
      AND si.user_id = auth.uid()
    )
  );