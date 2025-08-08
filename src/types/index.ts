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