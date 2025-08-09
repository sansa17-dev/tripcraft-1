/**
 * API client for secure backend communication
 * All non-auth Supabase operations go through Edge Functions to keep credentials secure
 */
import { supabase } from './supabase';

const getApiBaseUrl = (): string => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  console.log('Environment check:', {
    VITE_SUPABASE_URL: supabaseUrl,
    hostname: window.location.hostname,
    env: import.meta.env
  });
  
  if (supabaseUrl && supabaseUrl.trim()) {
    const baseUrl = `${supabaseUrl.trim()}/functions/v1`;
    console.log('Using Supabase URL:', baseUrl);
    return baseUrl;
  }
  
  // Fallback for local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const localUrl = 'http://localhost:54321/functions/v1';
    console.log('Using local development URL:', localUrl);
    return localUrl;
  }
  
  // If no VITE_SUPABASE_URL is set and not on localhost, show error
  console.error('VITE_SUPABASE_URL environment variable is not set. Please configure your Supabase project URL.');
  throw new Error('Supabase URL not configured. Please set VITE_SUPABASE_URL environment variable.');
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic API call function
 */
async function apiCall<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    console.log(`🚀 API Call: ${endpoint}`, { url: `${API_BASE_URL}/${endpoint}`, data });
    
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
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`📦 API Success: ${endpoint}`, result);
    return result;
  } catch (error) {
    console.error(`💥 API Exception: ${endpoint}`, error);
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
  create: async (shareId: string, commentData: any) => {
    return apiCall('comments', {
      action: 'create',
      shareId,
      data: commentData
    });
  },

  list: async (shareId: string) => {
    return apiCall('comments', {
      action: 'list',
      shareId
    });
  },

  delete: async (shareId: string, commentId: string, userId?: string) => {
    return apiCall('comments', {
      action: 'delete',
      shareId,
      commentId,
      userId
    });
  }
};