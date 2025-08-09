/**
 * Service for managing itinerary storage in Supabase
 * Handles CRUD operations for saved itineraries
 */

import { supabase } from '../lib/supabase';
import { GeneratedItinerary, TravelPreferences } from '../types';

export interface SavedItinerary {
  id: string;
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
  preferences: TravelPreferences;
  created_at: string;
  updated_at: string;
}

/**
 * Save a generated itinerary to the database
 */
export async function saveItinerary(
  itinerary: GeneratedItinerary,
  preferences: TravelPreferences,
  userId: string
): Promise<{ success: boolean; error?: string; data?: SavedItinerary }> {
  try {
    // Ensure interests from persona are included in main preferences
    const preferencesToSave = {
      ...preferences,
      interests: preferences.travelPersona?.interests || preferences.interests || []
    };

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userId,
        title: itinerary.title,
        destination: itinerary.destination,
        origin: preferencesToSave.origin,
        start_date: preferencesToSave.startDate,
        end_date: preferencesToSave.endDate,
        duration: itinerary.duration,
        total_budget: itinerary.totalBudget,
        overview: itinerary.overview,
        days: itinerary.days,
        tips: itinerary.tips,
        preferences: preferencesToSave,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving itinerary:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save itinerary' 
    };
  }
}

/**
 * Get all saved itineraries for a user
 */
export async function getUserItineraries(userId: string): Promise<{
  success: boolean;
  error?: string;
  data?: SavedItinerary[];
}> {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching itineraries:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch itineraries' 
    };
  }
}

/**
 * Get a specific itinerary by ID
 */
export async function getItinerary(id: string, userId: string): Promise<{
  success: boolean;
  error?: string;
  data?: SavedItinerary;
}> {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching itinerary:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch itinerary' 
    };
  }
}

/**
 * Delete an itinerary
 */
export async function deleteItinerary(id: string, userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting itinerary:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete itinerary' 
    };
  }
}

/**
 * Update an existing itinerary
 */
export async function updateItinerary(
  id: string,
  updates: Partial<SavedItinerary>,
  userId: string
): Promise<{ success: boolean; error?: string; data?: SavedItinerary }> {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating itinerary:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update itinerary' 
    };
  }
}