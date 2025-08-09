/**
 * Service for managing user personas in Supabase
 * Handles CRUD operations for user travel personas
 */

import { supabase } from '../lib/supabase';
import { TravelPersona } from '../types';

export interface SavedUserPersona {
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
}

/**
 * Save or update user persona
 */
export async function saveUserPersona(
  persona: TravelPersona,
  userId: string
): Promise<{ success: boolean; error?: string; data?: SavedUserPersona }> {
  try {
    // First, check if user already has a persona
    const { data: existing } = await supabase
      .from('user_personas')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const personaData = {
      user_id: userId,
      time_preference: persona.timePreference || '',
      social_style: persona.socialStyle || '',
      cultural_interest: persona.culturalInterest || '',
      food_adventure: persona.foodAdventure || '',
      planning_style: persona.planningStyle || '',
      interests: persona.interests || [],
    };

    let result;
    if (existing) {
      // Update existing persona
      result = await supabase
        .from('user_personas')
        .update(personaData)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Create new persona
      result = await supabase
        .from('user_personas')
        .insert(personaData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving user persona:', result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error saving user persona:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save persona' 
    };
  }
}

/**
 * Get user persona
 */
export async function getUserPersona(userId: string): Promise<{
  success: boolean;
  error?: string;
  data?: TravelPersona;
}> {
  try {
    const { data, error } = await supabase
      .from('user_personas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user persona:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      // No persona found - return empty persona
      return { 
        success: true, 
        data: {
          timePreference: '',
          socialStyle: '',
          culturalInterest: '',
          foodAdventure: '',
          planningStyle: '',
          interests: []
        }
      };
    }

    const persona: TravelPersona = {
      timePreference: data.time_preference || '',
      socialStyle: data.social_style || '',
      culturalInterest: data.cultural_interest || '',
      foodAdventure: data.food_adventure || '',
      planningStyle: data.planning_style || '',
      interests: data.interests || []
    };

    return { success: true, data: persona };
  } catch (error) {
    console.error('Error fetching user persona:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch persona' 
    };
  }
}

/**
 * Delete user persona
 */
export async function deleteUserPersona(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('user_personas')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user persona:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user persona:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete persona' 
    };
  }
}