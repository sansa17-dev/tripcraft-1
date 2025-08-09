/**
 * API client for direct Supabase operations
 * Uses Supabase client directly instead of Edge Functions
 */
import { supabase } from './supabase';
import { TravelPreferences, GeneratedItinerary } from '../types';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Itinerary API calls - Direct Supabase operations
 */
export const itineraryApi = {
  create: async (userId: string, itineraryData: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          user_id: userId,
          ...itineraryData
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create itinerary'
      };
    }
  },

  list: async (userId: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error listing itineraries:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list itineraries'
      };
    }
  },

  get: async (userId: string, itineraryId: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', itineraryId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error getting itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get itinerary'
      };
    }
  },

  update: async (userId: string, itineraryId: string, updates: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .update(updates)
        .eq('id', itineraryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update itinerary'
      };
    }
  },

  delete: async (userId: string, itineraryId: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', itineraryId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete itinerary'
      };
    }
  }
};

/**
 * AI Itinerary Generation - Demo implementation
 */
export const generateItineraryApi = {
  generate: async (preferences: TravelPreferences): Promise<ApiResponse<GeneratedItinerary>> => {
    try {
      // Generate demo itinerary since we're not using Edge Functions
      const duration = Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      const demoItinerary: GeneratedItinerary = {
        title: `${duration}-Day Journey from ${preferences.origin} to ${preferences.destination}`,
        destination: preferences.destination,
        duration: `${duration} days`,
        totalBudget: preferences.budget === 'budget' ? '₹15,000-25,000' : preferences.budget === 'mid-range' ? '₹30,000-50,000' : '₹60,000-1,00,000',
        overview: `A carefully crafted ${duration}-day journey from ${preferences.origin} to ${preferences.destination}, featuring the best ${preferences.interests.join(' and ')} experiences tailored to your ${preferences.budget} budget and ${preferences.vacationPace} pace.`,
        days: Array.from({ length: duration }, (_, index) => {
          const dayDate = new Date(preferences.startDate);
          dayDate.setDate(dayDate.getDate() + index);
          
          return {
            day: index + 1,
            date: dayDate.toISOString().split('T')[0],
            activities: [
              `Morning: Explore local ${preferences.interests[0] || 'attractions'}`,
              `Afternoon: Visit popular ${preferences.interests[1] || 'landmarks'}`,
              `Evening: Experience local ${preferences.interests[2] || 'culture'}`
            ],
            meals: {
              breakfast: "Local café recommendation",
              lunch: "Traditional restaurant",
              dinner: "Highly-rated local dining"
            },
            accommodation: preferences.accommodationType === 'hotel' ? 'Recommended hotel' : 
                         preferences.accommodationType === 'hostel' ? 'Top-rated hostel' :
                         preferences.accommodationType === 'airbnb' ? 'Unique local Airbnb' : 
                         preferences.accommodationType === 'resort' ? 'Luxury resort' :
                         preferences.accommodationType === 'villa' ? 'Private villa' :
                         preferences.accommodationType === 'mix' ? 'Mix of accommodations' : 'Best local accommodation',
            estimatedCost: preferences.budget === 'budget' ? '₹2,500-3,500' : preferences.budget === 'mid-range' ? '₹4,500-6,500' : '₹8,500-12,000',
            notes: index === 0 ? "Arrival day - lighter schedule recommended" : 
                   index === duration - 1 ? "Departure day - plan for travel time" : `Full day of ${preferences.vacationPace} exploration`
          };
        }),
        tips: [
          `Best time to visit ${preferences.destination} is during your planned dates`,
          "Book accommodations in advance for better rates",
          "Try local transportation to save money and experience authentic culture",
          "Keep copies of important documents in separate locations"
        ]
      };

      return { success: true, data: demoItinerary };
    } catch (error) {
      console.error('Error generating itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate itinerary'
      };
    }
  }
};

/**
 * Sharing API calls - Direct Supabase operations
 */
export const shareApi = {
  create: async (userId: string, shareData: any): Promise<ApiResponse> => {
    try {
      const shareId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('shared_itineraries')
        .insert({
          share_id: shareId,
          user_id: userId,
          itinerary_id: shareData.itinerary_id,
          title: shareData.title,
          share_mode: shareData.share_mode || 'view',
          is_public: shareData.is_public || false,
          expires_at: shareData.expires_at,
          view_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating share:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create share'
      };
    }
  },

  get: async (shareId: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('shared_itineraries')
        .select(`
          *,
          itineraries (*)
        `)
        .eq('share_id', shareId);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: 'Shared itinerary not found'
        };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error getting shared itinerary:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Shared itinerary not found'
      };
    }
  },

  update: async (userId: string, shareId: string, updates: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('shared_itineraries')
        .update(updates)
        .eq('share_id', shareId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating share:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update share'
      };
    }
  },

  delete: async (userId: string, shareId: string): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('shared_itineraries')
        .delete()
        .eq('share_id', shareId)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting share:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete share'
      };
    }
  },

  list: async (userId: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('shared_itineraries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error listing shares:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list shares'
      };
    }
  },

  incrementView: async (shareId: string): Promise<ApiResponse> => {
    try {
      // First get the current view count
      const { data: currentData, error: fetchError } = await supabase
        .from('shared_itineraries')
        .select('view_count')
        .eq('share_id', shareId)
        .single();

      if (fetchError) throw fetchError;

      // Then increment it
      const { error } = await supabase
        .from('shared_itineraries')
        .update({ view_count: (currentData?.view_count || 0) + 1 })
        .eq('share_id', shareId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment view count'
      };
    }
  }
};

/**
 * Comments API calls - Direct Supabase operations
 */
export const commentsApi = {
  create: async (shareId: string, commentData: any): Promise<ApiResponse> => {
    try {
      // First verify the shared itinerary exists and allows comments
      const { data: sharedItinerary, error: shareError } = await supabase
        .from('shared_itineraries')
        .select('share_mode')
        .eq('share_id', shareId)
        .single();

      if (shareError) throw shareError;

      if (!sharedItinerary || sharedItinerary.share_mode !== 'collaborate') {
        throw new Error('Comments not allowed on this shared itinerary');
      }

      const { data, error } = await supabase
        .from('itinerary_comments')
        .insert({
          share_id: shareId,
          user_email: commentData.user_email,
          content: commentData.content
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating comment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create comment'
      };
    }
  },

  list: async (shareId: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('itinerary_comments')
        .select('*')
        .eq('share_id', shareId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error listing comments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list comments'
      };
    }
  },

  delete: async (shareId: string, commentId: string, userId?: string): Promise<ApiResponse> => {
    try {
      let deleteQuery = supabase
        .from('itinerary_comments')
        .delete()
        .eq('id', commentId)
        .eq('share_id', shareId);

      if (userId) {
        // Check if user is the share owner
        const { data: sharedItinerary } = await supabase
          .from('shared_itineraries')
          .select('user_id')
          .eq('share_id', shareId)
          .single();

        if (sharedItinerary?.user_id === userId) {
          // Share owner can delete any comment
          deleteQuery = supabase
            .from('itinerary_comments')
            .delete()
            .eq('id', commentId)
            .eq('share_id', shareId);
        }
      }

      const { error } = await deleteQuery;

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete comment'
      };
    }
  }
};