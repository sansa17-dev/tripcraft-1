/**
 * Service for integrating with ChatGPT API to generate travel itineraries
 * Handles API calls and response parsing for itinerary generation
 */

import { TravelPreferences, GeneratedItinerary, ApiResponse } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Creates a detailed prompt for ChatGPT based on user preferences
 */
function createItineraryPrompt(preferences: TravelPreferences): string {
  const { origin, destination, startDate, endDate, budget, interests, travelers, accommodationType, vacationPace, additionalNotes } = preferences;
  
  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  return `Create a detailed ${duration}-day travel itinerary for ${destination} from ${startDate} to ${endDate}, travelling from ${origin}.

Travel Details:
- Travelling from: ${origin}
- Destination: ${destination}
- ${travelers} traveller${travelers > 1 ? 's' : ''}
- Budget: ${budget}
- Accommodation preference: ${accommodationType}
- Holiday pace: ${vacationPace}
- Interests: ${interests.join(', ')}
${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}

Please provide a comprehensive itinerary including transportation from ${origin} to ${destination}. The itinerary should match the ${vacationPace} pace preference. Use Indian English spelling and terminology throughout. Provide the response in the following JSON format:
{
  "title": "Trip title",
  "destination": "${destination}",
  "duration": "${duration} days",
  "totalBudget": "Estimated total budget range",
  "overview": "Brief trip overview (2-3 sentences)",
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "activities": ["Morning activity", "Afternoon activity", "Evening activity"],
      "meals": {
        "breakfast": "Recommended breakfast spot",
        "lunch": "Recommended lunch spot",
        "dinner": "Recommended dinner spot"
      },
      "accommodation": "Recommended place to stay",
      "estimatedCost": "$X-Y per person",
      "notes": "Any special notes for this day"
    }
  ],
  "tips": ["Travel tip 1", "Travel tip 2", "Travel tip 3"]
}

Make sure all recommendations match the ${budget} budget level (per traveller per day), match the ${vacationPace} holiday pace, and include practical details like opening hours considerations and transportation between activities. Use Indian English spelling throughout the response.`;
}

/**
 * Calls ChatGPT API to generate travel itinerary
 */
export async function generateItinerary(preferences: TravelPreferences): Promise<ApiResponse> {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using demo itinerary');
      return {
        success: false,
        error: 'OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your environment variables.'
      };
    }

    const prompt = createItineraryPrompt(preferences);
    console.log('Making API request to OpenRouter...');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TripCraft Travel Itinerary Generator'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planner specialising in Indian and international destinations. You MUST respond ONLY with valid JSON in the exact format requested. Use Indian English spelling and terminology throughout. Do not include any explanatory text, markdown formatting, or code blocks. Return only the raw JSON object.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    // Log response status and headers for debugging
    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = null;
      }
      
      // If it's a CORS or network error, fall back to demo
      if (response.status === 0 || errorText.includes('CORS') || errorText.includes('network')) {
        console.log('Network/CORS error detected, falling back to demo itinerary');
        return {
          success: false,
          error: 'Network connectivity issue detected. Using demo itinerary.'
        };
      }
      
      return {
        success: false,
        error: errorData?.error?.message || errorText || `API request failed: ${response.status} ${response.statusText}`
      };
    }

    // Get raw response text for debugging
    const responseText = await response.text();
    console.log('API Response received, length:', responseText.length);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse API response as JSON:', parseError);
      console.log('Falling back to demo itinerary due to parse error');
      return {
        success: false,
        error: 'API response parsing failed. Using demo itinerary.'
      };
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response structure:', data);
      console.log('Falling back to demo itinerary due to invalid structure');
      return {
        success: false,
        error: 'Invalid API response format. Using demo itinerary.'
      };
    }

    try {
      // Extract JSON from the response content, handling markdown code blocks
      let jsonContent = data.choices[0].message.content.trim();
      console.log('AI Response Content received');
      
      // Remove markdown code fences if present
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
        console.log('Extracted JSON from markdown');
      }
      
      // Remove any leading/trailing text that might not be JSON
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
        console.log('Cleaned JSON content');
      }
      
      if (!jsonContent.startsWith('{') || !jsonContent.endsWith('}')) {
        console.error('Content does not appear to be JSON:', jsonContent);
        console.log('Falling back to demo itinerary due to invalid JSON format');
        return {
          success: false,
          error: 'AI response format invalid. Using demo itinerary.'
        };
      }
      
      const itinerary: GeneratedItinerary = JSON.parse(jsonContent);
      console.log('Successfully parsed itinerary');
      
      // Validate the parsed JSON has required fields
      if (!itinerary.title || !itinerary.days || !Array.isArray(itinerary.days)) {
        console.error('Invalid itinerary structure:', itinerary);
        console.log('Falling back to demo itinerary due to missing required fields');
        throw new Error('Invalid itinerary format');
      }

      return {
        success: true,
        data: itinerary
      };
    } catch (parseError) {
      console.error('Error parsing itinerary JSON:', parseError);
      console.log('Falling back to demo itinerary due to parsing error');
      return {
        success: false,
        error: `API parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. Using demo itinerary.`
      };
    }

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    // Check if it's a network/CORS related error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('Network error detected, falling back to demo itinerary');
      return {
        success: false,
        error: 'Network connection issue. Using demo itinerary.'
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred. Using demo itinerary.'
    };
  }
}

  console.log('Generated prompt for API:', prompt);
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