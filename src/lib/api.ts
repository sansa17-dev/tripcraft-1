/**
 * API client for secure backend communication
 * All operations go through Edge Functions where secrets are managed
 */
import { supabase } from './supabase';

// Hardcoded API base URL - update with your actual Supabase project URL
const API_BASE_URL = 'https://your-project-id.supabase.co/functions/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
    
    // Get the current session for authorization
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if user is authenticated
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log(`✅ Response: ${endpoint}`, { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${endpoint}`, { status: response.status, error: errorText });
      
      // Handle specific Edge Function deployment issues
      if (response.status === 404) {
        throw new Error(`Edge Function '${endpoint}' not found. Please ensure Supabase Edge Functions are deployed.`);
      } else if (response.status === 500) {
        throw new Error(`Edge Function '${endpoint}' error. Check Supabase dashboard for function logs.`);
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
    }
    
    const result = await response.json();
    console.log(`📦 API Success: ${endpoint}`, result);
    return result;
  } catch (error) {
    console.error(`💥 API Exception: ${endpoint}`, error);
    
    // Handle network errors that might indicate Edge Functions aren't accessible
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        error: `Unable to connect to Supabase Edge Functions. Please check:\n1. Supabase project is active\n2. Edge Functions are deployed with secrets configured\n3. Network connectivity`
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
}

/**
 * Itinerary API calls
 */
export const itineraryApi = {
  create: async (userId: string, itineraryData: any) => {
    return apiCall('itineraries', { 
      action: 'create', 
      userId, 
      data: itineraryData 
    });
  },

  list: async (userId: string) => {
    return apiCall('itineraries', { 
      action: 'list', 
      userId 
    });
  },

  get: async (userId: string, itineraryId: string) => {
    return apiCall('itineraries', { 
      action: 'read', 
      userId, 
      itineraryId 
    });
  },

  update: async (userId: string, itineraryId: string, updates: any) => {
    return apiCall('itineraries', { 
      action: 'update', 
      userId, 
      itineraryId, 
      data: updates 
    });
  },

  delete: async (userId: string, itineraryId: string) => {
    return apiCall('itineraries', { 
      action: 'delete', 
      userId, 
      itineraryId 
    });
  }
};

/**
 * AI Itinerary Generation API
 */
export const generateItineraryApi = {
  generate: async (preferences: any) => {
    return apiCall('generate-itinerary', { preferences });
  }
};

/**
 * Sharing API calls
 */
export const shareApi = {
  create: async (userId: string, shareData: any) => {
    return apiCall('share', {
      action: 'create',
      userId,
      data: shareData
    });
  },

  get: async (shareId: string) => {
    return apiCall('share', {
      action: 'get',
      shareId
    });
  },

  update: async (userId: string, shareId: string, updates: any) => {
    return apiCall('share', {
      action: 'update',
      userId,
      shareId,
      data: updates
    });
  },

  delete: async (userId: string, shareId: string) => {
    return apiCall('share', {
      action: 'delete',
      userId,
      shareId
    });
  },

  list: async (userId: string) => {
    return apiCall('share', {
      action: 'list',
      userId
    });
  },

  incrementView: async (shareId: string) => {
    return apiCall('share', {
      action: 'view',
      shareId
    });
  }
};

/**
 * Comments API calls
 */
export const commentsApi = {
  create: async (shareId: string, commentData: any, dayIndex?: number | null) => {
    return apiCall('comments', {
      action: 'create',
      shareId,
      data: {
        ...commentData,
        day_index: dayIndex
      }
    });
  },

  list: async (shareId: string, dayIndex?: number | null) => {
    return apiCall('comments', {
      action: 'list',
      shareId,
      dayIndex
    });
  },

  delete: async (shareId: string, commentId: string, userId?: string) => {
    return apiCall('comments', {
      action: 'delete',
      shareId,
      commentId,
      userId
    });
  },

  resolve: async (shareId: string, commentId: string, userId: string) => {
    return apiCall('comments', {
      action: 'resolve',
      shareId,
      commentId,
      userId
    });
  }
};