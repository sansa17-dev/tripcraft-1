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
  
  // Combine interests from both persona and main preferences, with persona taking priority
  const personaInterests = preferences.travelPersona?.interests || [];
  const mainInterests = interests || [];
  const userInterests = personaInterests.length > 0 ? personaInterests : mainInterests;
  
  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  return `Create an incredibly detailed and inspiring ${duration}-day travel itinerary for ${destination} from ${startDate} to ${endDate}, traveling from ${origin}.

Travel Details:
- Traveling from: ${origin}
- Destination: ${destination}
- ${travelers} traveler${travelers > 1 ? 's' : ''}
- Budget: ${budget}
- Accommodation preference: ${accommodationType}
- Holiday pace: ${vacationPace}
- Interests: ${userInterests.join(', ')}
${additionalNotes ? `- Additional notes: ${additionalNotes}` : ''}
${preferences.travelPersona ? `- Planning Style: ${preferences.travelPersona.planningStyle}` : ''}

IMPORTANT INSTRUCTIONS FOR CREATING AN AMAZING TRAVEL EXPERIENCE:

1. MAKE IT INSPIRING: Use vivid, descriptive language that makes travelers excited about their journey
2. BE DETAILED: Include specific recommendations with WHY they're special, not just WHAT to do
3. ADD LOCAL INSIGHTS: Include hidden gems, local secrets, cultural tips, and insider knowledge
4. EXPLAIN THE EXPERIENCE: Describe what travelers will see, feel, taste, and experience
5. PROVIDE CONTEXT: Add historical background, cultural significance, and interesting facts
6. INCLUDE PRACTICAL DETAILS: Opening hours, booking tips, best times to visit, what to expect
7. MAKE IT PERSONAL: Tailor recommendations to the specific interests and travel style
8. ADD SENSORY DETAILS: Describe sounds, smells, textures, and atmosphere
9. SUGGEST PHOTO OPPORTUNITIES: Mention Instagram-worthy spots and unique experiences
10. INCLUDE LOCAL FOOD CULTURE: Explain dishes, ingredients, dining customs, and must-try experiences

Create a comprehensive itinerary including transportation from ${origin} to ${destination}. The itinerary should match the ${vacationPace} pace preference and be written in an engaging, enthusiastic tone that makes travelers excited about their adventure.

For each activity, meal, and accommodation:
- Explain WHY it's recommended (what makes it special/unique)
- Describe the EXPERIENCE (what they'll see, do, feel)
- Add CULTURAL CONTEXT (history, significance, local customs)
- Include PRACTICAL TIPS (best times, booking advice, what to bring)
- Mention SENSORY DETAILS (atmosphere, sounds, smells, textures)

Use USD ($) currency throughout. Provide the response in the following JSON format:
{
  "title": "Inspiring trip title that captures the essence of the adventure",
  "destination": "${destination}",
  "duration": "${duration} days",
  "totalBudget": "Detailed budget breakdown with explanations",
  "overview": "Inspiring and detailed trip overview (4-6 sentences) that captures the magic of the destination and what makes this journey special",
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "activities": [
        "Morning: Detailed, inspiring description of morning activity with WHY it's special, WHAT to expect, and insider tips (2-3 sentences)",
        "Afternoon: Engaging description of afternoon experience with cultural context, sensory details, and practical advice (2-3 sentences)", 
        "Evening: Captivating description of evening activity with atmosphere details, local insights, and photo opportunities (2-3 sentences)"
      ],
      "meals": {
        "breakfast": "Detailed breakfast recommendation with description of the place, signature dishes, atmosphere, and why it's special (1-2 sentences)",
        "lunch": "Engaging lunch suggestion with local specialties, cultural context, and dining experience details (1-2 sentences)",
        "dinner": "Inspiring dinner recommendation with ambiance, must-try dishes, and what makes the experience memorable (1-2 sentences)"
      },
      "accommodation": "Detailed accommodation recommendation with unique features, location benefits, amenities, and why it enhances the travel experience (1-2 sentences)",
      "estimatedCost": "$X-Y per person",
      "notes": "Inspiring notes with insider tips, cultural insights, best photo spots, or special experiences unique to this day (1-2 sentences)"
    }
  ],
  "tips": [
    "Detailed, actionable travel tip with specific advice and cultural insights (1-2 sentences)",
    "Inspiring local secret or hidden gem with explanation of why it's special (1-2 sentences)",
    "Practical advice with cultural context and insider knowledge (1-2 sentences)",
    "Food/dining tip with local customs and must-try experiences (1-2 sentences)",
    "Photography/experience tip with best times and unique opportunities (1-2 sentences)"
  ]
}

WRITING STYLE REQUIREMENTS:
- Use enthusiastic, inspiring language that builds excitement
- Include sensory descriptions (what you'll see, hear, smell, taste, feel)
- Add cultural context and historical background
- Mention local customs, traditions, and etiquette
- Include insider tips and hidden gems
- Describe unique photo opportunities and Instagram-worthy moments
- Explain the "why\" behind each recommendation
- Use vivid adjectives and engaging storytelling
- Make travelers feel like they're getting exclusive, expert advice

Make sure all recommendations match the ${budget} budget level (per traveler per day), match the ${vacationPace} holiday pace, and include practical details like opening hours considerations and transportation between activities. Use USD ($) currency for all cost estimates.`;
}

/**
 * Get persona description for better LLM understanding
 */
function getPersonaDescription(category: string, value: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    timePreference: {
      'early-bird': '(prefers morning activities, sunrise experiences, early starts)',
      'night-owl': '(prefers late starts, evening/night activities, sunset experiences)',
      'flexible': '(adaptable to destination rhythm, balanced schedule)'
    },
    socialStyle: {
      'social': '(enjoys meeting locals, group activities, social experiences)',
      'intimate': '(prefers small groups, meaningful connections, quiet moments)',
      'solo-friendly': '(enjoys independent exploration, peaceful activities, self-guided experiences)'
    },
    culturalInterest: {
      'high': '(loves museums, historical sites, cultural immersion, learning)',
      'moderate': '(enjoys some culture mixed with other activities)',
      'low': '(prefers experiences over educational/cultural sites)'
    },
    foodAdventure: {
      'adventurous': '(loves trying new foods, street food, local specialties, exotic dishes)',
      'moderate': '(enjoys some local dishes but also familiar options)',
      'familiar': '(prefers familiar cuisines, safe food choices, international options)'
    },
    planningStyle: {
      'structured': '(likes detailed schedules, advance bookings, organized itineraries)',
      'flexible': '(wants key highlights planned but room for spontaneity)',
      'spontaneous': '(prefers minimal planning, day-by-day decisions, freedom to explore)'
    }
  };
  
  return descriptions[category]?.[value] || '';
}

/**
 * Get specific instructions based on time preference
 */
function getTimePreferenceInstructions(timePreference: string): string {
  switch (timePreference) {
    case 'early-bird':
      return 'Schedule key activities in the morning (7-11 AM), include sunrise experiences, morning markets, and peaceful temple visits. Suggest earlier dinner times (6-7 PM) and mention best morning photo opportunities.';
    case 'night-owl':
      return 'Plan relaxed mornings with late starts (10 AM+), focus on afternoon and evening activities, include sunset viewpoints, night markets, evening cultural shows, and vibrant nightlife options.';
    case 'flexible':
      return 'Create a balanced schedule that can be adapted, mention both morning and evening options for key activities, and provide timing alternatives for major attractions.';
    default:
      return 'Create a balanced daily schedule with activities throughout the day.';
  }
}

/**
 * Get specific instructions based on social style
 */
function getSocialStyleInstructions(socialStyle: string): string {
  switch (socialStyle) {
    case 'social':
      return 'Include group tours, cooking classes, local meetups, community events, shared dining experiences, and opportunities to interact with locals. Suggest social accommodations like hostels or guesthouses.';
    case 'intimate':
      return 'Focus on small group experiences, private tours, quiet cafes, romantic restaurants, peaceful gardens, and meaningful cultural exchanges. Avoid crowded tourist traps.';
    case 'solo-friendly':
      return 'Emphasize self-guided activities, peaceful locations, solo-friendly restaurants with counter seating, libraries, parks, and independent exploration opportunities. Include safety tips for solo travelers.';
    default:
      return 'Include a mix of social and independent activities to suit different preferences.';
  }
}

/**
 * Get specific instructions based on cultural interest level
 */
function getCulturalInterestInstructions(culturalInterest: string): string {
  switch (culturalInterest) {
    case 'high':
      return 'Prioritize museums, historical sites, cultural centers, traditional performances, heritage walks, local festivals, and educational experiences. Include detailed historical context and cultural significance for each recommendation.';
    case 'moderate':
      return 'Include some key cultural sites mixed with other activities. Balance museums with outdoor activities, food experiences, and entertainment. Provide cultural context but keep it engaging.';
    case 'low':
      return 'Focus on experiential activities over educational sites. Emphasize food, nature, entertainment, shopping, and adventure activities. Include cultural elements naturally within experiences rather than dedicated cultural visits.';
    default:
      return 'Include a balanced mix of cultural and experiential activities.';
  }
}

/**
 * Get specific instructions based on food adventure level
 */
function getFoodAdventureInstructions(foodAdventure: string): string {
  switch (foodAdventure) {
    case 'adventurous':
      return 'Recommend street food, local markets, hole-in-the-wall restaurants, regional specialties, exotic dishes, food tours, cooking classes, and unique dining experiences. Include specific dishes to try and food safety tips.';
    case 'moderate':
      return 'Mix local specialties with familiar options. Suggest reputable local restaurants alongside international cuisine. Include some adventurous dishes but also comfort food options.';
    case 'familiar':
      return 'Focus on international restaurants, hotel dining, familiar cuisines, and well-known food chains. Include some mild local dishes that are similar to familiar foods. Prioritize food safety and hygiene.';
    default:
      return 'Include a variety of dining options from local to international cuisine.';
  }
}

/**
 * Get specific instructions based on planning style
 */
function getPlanningStyleInstructions(planningStyle: string): string {
  switch (planningStyle) {
    case 'structured':
      return 'Provide detailed time schedules, specific addresses, booking information, advance reservation requirements, and step-by-step daily plans. Include backup options and contingency plans.';
    case 'flexible':
      return 'Outline key highlights and must-see attractions but leave room for spontaneous discoveries. Provide time ranges rather than specific times, and suggest optional activities for extra time.';
    case 'spontaneous':
      return 'Focus on general areas to explore, provide multiple options for each time period, emphasize walk-in friendly venues, and include tips for last-minute bookings and discoveries.';
    default:
      return 'Provide a structured framework with flexibility for personal preferences.';
  }
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
        success: true,
        data: generateDemoItinerary(preferences)
      };
    }

    const prompt = createItineraryPrompt(preferences);
    console.log('Making API request to OpenRouter...');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer ${apiKey}`,
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
      
      // Handle authentication errors by falling back to demo
      if (response.status === 401 || (errorData?.error?.code === 401) || (errorData?.error?.message?.includes('auth'))) {
        console.log('Authentication error detected, falling back to demo itinerary');
        return {
          success: true,
          data: generateDemoItinerary(preferences)
        };
      }
      
      // If it's a CORS or network error, fall back to demo
      if (response.status === 0 || errorText.includes('CORS') || errorText.includes('network')) {
        console.log('Network/CORS error detected, falling back to demo itinerary');
        return {
          success: true,
          data: generateDemoItinerary(preferences)
        };
      }
      
      return {
        success: true,
        data: generateDemoItinerary(preferences)
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
        error: \`API parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. Using demo itinerary.`
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

/**
 * Generates a demo itinerary for testing without API calls
 * Used as fallback when API key is not available
 */
export function generateDemoItinerary(preferences: TravelPreferences): GeneratedItinerary {
  const duration = Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    title: \`${duration}-Day Magical Discovery of ${preferences.destination}: An Unforgettable Journey from ${preferences.origin}`,
    destination: preferences.destination,
    duration: \`${duration} days`,
    totalBudget: preferences.budget === 'budget' ? '$800-1,500' : preferences.budget === 'mid-range' ? '$1,500-3,000' : '$3,000-6,000',
    overview: \`Embark on an extraordinary ${duration}-day adventure from ${preferences.origin} to the captivating destination of ${preferences.destination}! This carefully curated journey blends the perfect mix of ${preferences.interests.join(', ')} experiences, designed specifically for your ${preferences.vacationPace} travel style. Discover hidden gems, savor authentic local flavors, and create unforgettable memories while staying within your ${preferences.budget} budget. From the moment you arrive until your reluctant departure, every detail has been thoughtfully planned to showcase the very best this incredible destination has to offer, including seamless transportation and insider access to experiences most travelers never discover.`,
    days: Array.from({ length: duration }, (_, index) => {
      const dayDate = new Date(preferences.startDate);
      dayDate.setDate(dayDate.getDate() + index);
      
      return {
        day: index + 1,
        date: dayDate.toISOString().split('T')[0],
        activities: [
          \`Morning: Begin your day with an enchanting exploration of ${preferences.destination}'s most captivating ${preferences.interests[0] || 'attractions'} - discover the stories behind these remarkable places as golden morning light creates perfect photo opportunities and fewer crowds allow for intimate experiences with local culture and history.`,
          \`Afternoon: Immerse yourself in the heart of ${preferences.destination} by visiting the iconic ${preferences.interests[1] || 'landmarks'} that define this destination's character - learn fascinating historical details from knowledgeable locals, capture Instagram-worthy shots, and understand why these places have captivated travelers for generations.`,
          \`Evening: As the sun sets, dive deep into the authentic ${preferences.interests[2] || 'cultural'} scene that makes ${preferences.destination} truly special - experience the magical transformation as the destination comes alive with evening energy, local traditions, and unforgettable moments that will become your favorite travel memories.`
        ],
        meals: {
          breakfast: \`Start your morning at a charming local café where the aroma of freshly brewed coffee mingles with traditional breakfast specialties - this beloved neighborhood spot offers authentic flavors and the perfect opportunity to observe daily life while fueling up for your adventures.`,
          lunch: \`Savor an unforgettable midday meal at a traditional restaurant renowned for its time-honored recipes and warm hospitality - taste signature dishes passed down through generations while enjoying the bustling atmosphere that captures the true spirit of ${preferences.destination}.`,
          dinner: \`End your day with an extraordinary dining experience at a highly-rated local establishment where innovative cuisine meets traditional flavors - indulge in carefully crafted dishes that showcase the region's finest ingredients while soaking in the romantic ambiance and creating lasting memories.`
        },
        accommodation: preferences.accommodationType === 'hotel' ? 'Recommended hotel' : 
                     preferences.accommodationType === 'hostel' ? 'Top-rated hostel' :
                     preferences.accommodationType === 'airbnb' ? 'Unique local Airbnb' : 
                     preferences.accommodationType === 'resort' ? 'Luxury resort' :
                     preferences.accommodationType === 'villa' ? 'Private villa' :
                     preferences.accommodationType === 'mix' ? 'Mix of accommodations' : 'Best local accommodation',
        estimatedCost: preferences.budget === 'budget' ? '$50-80' : preferences.budget === 'mid-range' ? '$100-150' : '$200-300',
        notes: index === 0 ? "Arrival day magic: Take time to soak in the excitement of being in a new place - the lighter schedule allows you to wander, get oriented, and feel the unique energy of your destination while jet lag fades and anticipation builds." : 
               index === duration - 1 ? "Departure day reflections: Savor your final moments in this incredible destination - plan for travel time but also leave space for last-minute discoveries, souvenir shopping, and those bittersweet goodbye moments that make travel so meaningful." : 
               `A perfect day of ${preferences.vacationPace} exploration awaits - this carefully balanced itinerary ensures you experience the destination's highlights while maintaining your preferred travel rhythm, creating space for spontaneous discoveries and authentic local encounters.`
      };
    }),
    tips: [
      `The timing of your visit to ${preferences.destination} during your planned dates is absolutely perfect - you'll experience ideal weather conditions, vibrant local life, and seasonal specialties that make this period truly magical for travelers seeking authentic experiences.`,
      `Secure your accommodations well in advance to unlock the best rates and ensure you stay in the most characterful places - early booking often means access to unique properties with the best locations, stunning views, and those special touches that transform a good trip into an extraordinary adventure.`,
      `Embrace local transportation as your gateway to authentic cultural immersion - not only will you save money, but you'll also experience daily life alongside locals, discover hidden neighborhoods, and gain insider knowledge that no guidebook can provide.`,
      `Protect your peace of mind by keeping copies of important documents in separate locations - store digital copies in cloud storage and physical copies in different bags, ensuring that unexpected situations never derail your incredible journey.`,
      `Download offline maps and translation apps before you go - having these tools at your fingertips opens doors to spontaneous adventures, meaningful conversations with locals, and the confidence to explore beyond the typical tourist paths.`
    ]
  };
}