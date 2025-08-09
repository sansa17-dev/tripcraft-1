/**
 * API client for secure backend communication
 * All Supabase operations go through Edge Functions to keep credentials secure
 */

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL ? 
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` : 
  'http://localhost:54321/functions/v1';

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
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
}

/**
 * Authentication API calls
 */
export const authApi = {
  signUp: async (email: string, password: string) => {
    return apiCall('auth', { action: 'signup', email, password });
  },

  signIn: async (email: string, password: string) => {
    return apiCall('auth', { action: 'signin', email, password });
  },

  signOut: async () => {
    return apiCall('auth', { action: 'signout' });
  }
};

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