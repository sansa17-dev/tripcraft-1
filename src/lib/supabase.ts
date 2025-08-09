/**
 * Supabase client configuration for frontend authentication
 * Uses hardcoded configuration since all secrets are in Edge Functions
 */

import { createClient } from '@supabase/supabase-js';

// Hardcoded configuration - all secrets are managed in Edge Functions
export const SUPABASE_URL = 'https://your-project-id.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);