/**
 * Supabase client configuration
 * Handles database connection and authentication for team collaboration
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these can be shared publicly as they're designed for client-side use
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Validate configuration
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' || 
    !supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  console.warn('Supabase not configured. Please set up environment variables or update the configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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