/**
 * Service for managing itinerary storage via secure backend API
 * All database operations are handled server-side to keep credentials secure
 */

import { GeneratedItinerary, TravelPreferences } from '../types';
import { itineraryApi } from '../lib/api';

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
    const result = await itineraryApi.create(userId, {
      title: itinerary.title,
      destination: itinerary.destination,
      origin: preferences.origin,
      start_date: preferences.startDate,
      end_date: preferences.endDate,
      duration: itinerary.duration,
      total_budget: itinerary.totalBudget,
      overview: itinerary.overview,
      days: itinerary.days,
      tips: itinerary.tips,
      preferences: preferences,
    });

    if (result.success && result.data) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error || 'Failed to save itinerary' };
    }
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
    const result = await itineraryApi.list(userId);
    
    if (result.success) {
      return { success: true, data: result.data || [] };
    } else {
      return { success: false, error: result.error || 'Failed to fetch itineraries' };
    }
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
    const result = await itineraryApi.get(userId, id);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error || 'Failed to fetch itinerary' };
    }
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
    const result = await itineraryApi.delete(userId, id);
    
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Failed to delete itinerary' };
    }
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
    const result = await itineraryApi.update(userId, id, updates);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error || 'Failed to update itinerary' };
    }
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update itinerary' 
    };
  }
}