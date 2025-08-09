/**
 * Service for generating travel itineraries via secure backend API
 * All AI API calls are handled server-side to keep credentials secure
 */

import { TravelPreferences, GeneratedItinerary, ApiResponse } from '../types';
import { generateItineraryApi } from '../lib/api';

/**
 * Generates travel itinerary via secure backend API
 */
export async function generateItinerary(preferences: TravelPreferences): Promise<ApiResponse> {
  try {
    console.log('Generating itinerary via secure backend API...');
    const result = await generateItineraryApi.generate(preferences);
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to generate itinerary'
      };
    }

  } catch (error) {
    console.error('Error generating itinerary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred'
    };
  }
}

/**
 * Generates a demo itinerary for testing without API calls
 * Used as fallback when API key is not available
 */
export function generateDemoItinerary(preferences: TravelPreferences): GeneratedItinerary {
  const duration = Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    title: `${duration}-Day Journey from ${preferences.origin} to ${preferences.destination}`,
    destination: preferences.destination,
    duration: `${duration} days`,
    totalBudget: preferences.budget === 'budget' ? '₹15,000-25,000' : preferences.budget === 'mid-range' ? '₹30,000-50,000' : '₹60,000-1,00,000',
    overview: `A carefully crafted ${duration}-day journey from ${preferences.origin} to ${preferences.destination}, featuring the best ${preferences.interests.join(' and ')} experiences tailored to your ${preferences.budget} budget and ${preferences.vacationPace} pace, including transportation and logistics.`,
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
}