/**
 * Minimal Supabase configuration for frontend
 * All sensitive operations are handled by Edge Functions
 */

// Only the project URL is needed for frontend API calls
// All sensitive credentials are kept server-side in Edge Functions
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';

// Validate configuration
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('VITE_SUPABASE_URL not configured. Please set up environment variables.');
}