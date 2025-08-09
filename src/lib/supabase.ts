/**
 * Supabase client configuration
 * Handles database connection and authentication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
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
      };
      user_personas: {
        Row: {
          id: string;
          user_id: string;
          time_preference: string;
          social_style: string;
          cultural_interest: string;
          food_adventure: string;
          planning_style: string;
          interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          time_preference?: string;
          social_style?: string;
          cultural_interest?: string;
          food_adventure?: string;
          planning_style?: string;
          interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          time_preference?: string;
          social_style?: string;
          cultural_interest?: string;
          food_adventure?: string;
          planning_style?: string;
          interests?: string[];
          created_at?: string;
          updated_at?: string;
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