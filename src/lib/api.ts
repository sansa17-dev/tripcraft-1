/**
 * API client for secure backend communication
 * All non-auth Supabase operations go through Edge Functions to keep credentials secure
 */

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : 'http://localhost:54321/functions/v1';

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
    console.log(`🚀 API Call: ${endpoint}`, { url: `${API_BASE_URL}/${endpoint}`, data });
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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