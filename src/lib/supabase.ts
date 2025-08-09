/**
 * Supabase client configuration for frontend authentication
 * Uses hardcoded configuration since all secrets are in Edge Functions
 */

import { createClient } from '@supabase/supabase-js';

// Hardcoded configuration - all secrets are managed in Edge Functions
export const SUPABASE_URL = 'https://ymjfseyxwlxvolhzfpuz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamZzZXl4d2x4dm9saHpmcHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTAyMzgsImV4cCI6MjA3MDI2NjIzOH0.GWdCw2zKHktWoG7fOUMJV09NzyKeBZxEOQJOO2hMzMA';

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);