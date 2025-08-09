/*
  # Add day-specific comments support

  1. Schema Changes
    - Add `day_index` column to `itinerary_comments` table
    - `day_index` will be NULL for general comments
    - `day_index` will be 1, 2, 3, etc. for day-specific comments
    
  2. Updated Policies
    - Maintain existing RLS policies
    - Comments can be filtered by day_index for better organization
*/

-- Add day_index column to itinerary_comments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itinerary_comments' AND column_name = 'day_index'
  ) THEN
    ALTER TABLE itinerary_comments ADD COLUMN day_index integer DEFAULT NULL;
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS itinerary_comments_day_index_idx 
ON itinerary_comments (share_id, day_index);

-- Add comment to explain the day_index column
COMMENT ON COLUMN itinerary_comments.day_index IS 'Day number for day-specific comments (1, 2, 3, etc.). NULL for general comments.';