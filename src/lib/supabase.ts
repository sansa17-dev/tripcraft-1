/**
 * Supabase client configuration
 * Handles database connection and authentication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging to help identify the issue
console.log('Supabase config check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0
});

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key-here') {
  console.warn('Supabase environment variables not configured properly. Using fallback mode.');
}

// Only create client if we have valid, non-placeholder credentials
const supabaseClient = supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key-here'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create a mock client that prevents crashes but shows helpful errors
const mockSupabaseClient = {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly. Please check your API key.' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly. Please check your API key.' } }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured properly' } }),
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly' } })
      })
    }),
    insert: () => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly' } })
      })
    }),
    update: () => ({ 
      eq: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly' } })
        })
      })
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured properly' } })
    })
  })
};

export type Database = {
  public: {
    Tables: {
      itineraries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          origin: string;
          start_date: string;
          end_date: string;
          duration: string;
          total_budget: string;
          overview: string;
          days: any[];
          tips: string[];
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          origin: string;
          start_date: string;
          end_date: string;
          duration: string;
          total_budget: string;
          overview: string;
          days: any[];
          tips: string[];
          preferences: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          origin?: string;
          start_date?: string;
          end_date?: string;
          duration?: string;
          total_budget?: string;
          overview?: string;
          days?: any[];
          tips?: string[];
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};