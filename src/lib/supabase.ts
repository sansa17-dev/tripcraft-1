/**
 * Supabase client configuration
 * Handles database connection and authentication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Some features may not work.');
}

// Only create client if we have valid credentials
const supabaseClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabase = supabaseClient || {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
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