/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_PLACES_API_KEY: string
  readonly VITE_GOOGLE_PLACES_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENROUTER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * TypeScript interfaces for TripCraft application
 * Defines the structure for travel preferences and itinerary data
 */

export interface TravelPreferences {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'mid-range' | 'luxury';
  interests: string[];
  travelers: number;
  accommodationType: 'any' | 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'villa' | 'mix';
  vacationPace: 'relaxed' | 'balanced' | 'action-packed';
  additionalNotes?: string;
  travelPersona?: TravelPersona;
}

export interface TravelPersona {
  timePreference: 'early-bird' | 'night-owl' | 'flexible' | '';
  socialStyle: 'social' | 'intimate' | 'solo-friendly' | '';
  culturalInterest: 'high' | 'moderate' | 'low' | '';
  foodAdventure: 'adventurous' | 'moderate' | 'familiar' | '';
  planningStyle: 'structured' | 'flexible' | 'spontaneous' | '';
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: string[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation?: string;
  estimatedCost?: string;
  notes?: string;
}

export interface GeneratedItinerary {
  title: string;
  destination: string;
  duration: string;
  totalBudget: string;
  overview: string;
  days: ItineraryDay[];
  tips: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: GeneratedItinerary;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ItineraryRefinementRequest {
  message: string;
  itinerary: GeneratedItinerary;
  preferences: TravelPreferences;
}