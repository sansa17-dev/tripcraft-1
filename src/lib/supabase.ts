/**
 * Supabase client configuration for frontend authentication
 * Uses public anon key for secure client-side authentication
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL not configured. Please set up environment variables.');
}

if (!SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_ANON_KEY not configured. Please set up environment variables.');
}

// Create and export Supabase client
export const supabase = createClient(
  SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY || ''
);