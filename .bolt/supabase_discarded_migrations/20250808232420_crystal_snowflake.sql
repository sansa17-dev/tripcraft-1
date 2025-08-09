/*
  # Disable email confirmation for simple authentication

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow users to sign in immediately after signup
  
  2. Security
    - Keep RLS policies intact
    - Maintain user authentication requirements
*/

-- Update auth configuration to disable email confirmation
UPDATE auth.config 
SET email_confirm_required = false 
WHERE true;

-- Alternative approach using auth settings
INSERT INTO auth.config (email_confirm_required) 
VALUES (false) 
ON CONFLICT DO UPDATE SET email_confirm_required = false;