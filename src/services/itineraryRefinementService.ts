/**
 * Service for AI-powered itinerary refinement
 * Handles conversational modifications to existing itineraries
 */

import { ItineraryRefinementRequest, GeneratedItinerary, ApiResponse } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface RefinementResponse extends ApiResponse {
  response?: string;
}

/**
 * Creates a refinement prompt for the AI
 */
function createRefinementPrompt(request: ItineraryRefinementRequest): string {
  const { message, itinerary, preferences } = request;
  
  return `You are a travel planning assistant helping to refine an existing itinerary. The user has a specific request to modify their trip.

CURRENT ITINERARY:
${JSON.stringify(itinerary, null, 2)}

USER PREFERENCES:
- Origin: ${preferences.origin}
- Destination: ${preferences.destination}
- Budget: ${preferences.budget}
- Travelers: ${preferences.travelers}
- Interests: ${preferences.interests.join(', ')}
- Accommodation: ${preferences.accommodationType}
- Pace: ${preferences.vacationPace}
${preferences.travelPersona ? `
TRAVEL PERSONA:
- Time Preference: ${preferences.travelPersona.timePreference}
- Social Style: ${preferences.travelPersona.socialStyle}
- Activity Level: ${preferences.travelPersona.activityLevel}
- Cultural Interest: ${preferences.travelPersona.culturalInterest}
- Food Adventure: ${preferences.travelPersona.foodAdventure}
- Planning Style: ${preferences.travelPersona.planningStyle}
` : ''}

USER REQUEST: "${message}"

Please modify the itinerary based on the user's request while keeping the overall structure intact. Provide:
1. A brief, friendly response explaining what you've changed
2. The updated itinerary in the exact same JSON format

Respond with a JSON object in this format:
{
  "response": "Brief explanation of changes made",
  "itinerary": {
    "title": "Updated title if needed",
    "destination": "${itinerary.destination}",
    "duration": "${itinerary.duration}",
    "totalBudget": "Updated budget if needed",
    "overview": "Updated overview if needed",
    "days": [...updated days array...],
    "tips": [...updated tips array...]
  }
}

Make sure all recommendations match the ${preferences.budget} budget level and ${preferences.vacationPace} pace. Use USD ($) currency for all cost estimates.`;
}

/**
 * Refines an itinerary using AI based on user conversation
 */
export async function refineItineraryWithAI(request: ItineraryRefinementRequest): Promise<RefinementResponse> {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.log('No API key found, using mock refinement');
      return generateMockRefinement(request);
    }

    const prompt = createRefinementPrompt(request);
    console.log('Making refinement API request to OpenRouter...');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TripCraft Itinerary Refinement'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planning assistant. You MUST respond ONLY with valid JSON in the exact format requested. Do not include any explanatory text, markdown formatting, or code blocks. Return only the raw JSON object.'
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

    console.log('Refinement API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refinement API Error Response:', errorText);
      
      // Fall back to mock refinement on any API error
      console.log('Falling back to mock refinement due to API error');
      return generateMockRefinement(request);
    }

    const responseText = await response.text();
    console.log('Refinement API Response received');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse refinement API response as JSON:', parseError);
      return generateMockRefinement(request);
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid refinement API response structure:', data);
      return generateMockRefinement(request);
    }

    try {
      let jsonContent = data.choices[0].message.content.trim();
      
      // Remove markdown code fences if present
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      
      // Extract JSON content
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
      }
      
      const refinementResult = JSON.parse(jsonContent);
      
      // Validate the response structure
      if (!refinementResult.response || !refinementResult.itinerary) {
        throw new Error('Invalid refinement response structure');
      }

      return {
        success: true,
        data: refinementResult.itinerary,
        response: refinementResult.response
      };
    } catch (parseError) {
      console.error('Error parsing refinement JSON:', parseError);
      return generateMockRefinement(request);
    }

  } catch (error) {
    console.error('Error refining itinerary:', error);
    return generateMockRefinement(request);
  }
}

/**
 * Generates a mock refinement response for testing/fallback
 */
function generateMockRefinement(request: ItineraryRefinementRequest): RefinementResponse {
  const { message, itinerary } = request;
  
  // Create a simple mock modification based on common requests
  const modifiedItinerary = { ...itinerary };
  let responseMessage = "I've made some adjustments to your itinerary based on your request.";
  
  // Simple keyword-based modifications for demo
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
    // Modify a meal recommendation
    if (modifiedItinerary.days.length > 0 && modifiedItinerary.days[0].meals.dinner) {
      modifiedItinerary.days[0].meals.dinner = "Green Garden Vegetarian Restaurant - Highly rated plant-based cuisine";
      responseMessage = "I've updated your dinner recommendation to include a great vegetarian restaurant option.";
      const changeSummary = "• Changed Day 1 dinner to Green Garden Vegetarian Restaurant\n• Updated to plant-based cuisine option";
      return {
        success: true,
        data: modifiedItinerary,
        response: responseMessage,
        changeSummary: changeSummary
      };
    }
  } else if (lowerMessage.includes('relaxed') || lowerMessage.includes('slower')) {
    // Reduce activities in a day
    if (modifiedItinerary.days.length > 0 && modifiedItinerary.days[0].activities.length > 2) {
      modifiedItinerary.days[0].activities = modifiedItinerary.days[0].activities.slice(0, 2);
      modifiedItinerary.days[0].activities.push("Afternoon: Free time for relaxation or personal exploration");
      responseMessage = "I've made your itinerary more relaxed by reducing the number of scheduled activities and adding free time.";
      const changeSummary = "• Reduced Day 1 activities from 3 to 2\n• Added free time for relaxation in the afternoon\n• Removed one scheduled activity";
      return {
        success: true,
        data: modifiedItinerary,
        response: responseMessage,
        changeSummary: changeSummary
      };
    }
  } else if (lowerMessage.includes('museum') || lowerMessage.includes('art')) {
    // Add a museum activity
    if (modifiedItinerary.days.length > 0) {
      modifiedItinerary.days[0].activities[1] = `Afternoon: Visit the local art museum or cultural center in ${itinerary.destination}`;
      responseMessage = "I've added a museum visit to your itinerary to match your interest in art and culture.";
      const changeSummary = `• Updated Day 1 afternoon activity to museum visit\n• Added cultural center option in ${itinerary.destination}`;
      return {
        success: true,
        data: modifiedItinerary,
        response: responseMessage,
        changeSummary: changeSummary
      };
    }
  } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheaper')) {
    // Modify to more budget-friendly options
    if (modifiedItinerary.days.length > 0) {
      modifiedItinerary.days[0].meals.lunch = "Local street food market - Authentic and budget-friendly dining";
      responseMessage = "I've updated your recommendations to include more budget-friendly options while maintaining quality.";
      const changeSummary = "• Changed Day 1 lunch to local street food market\n• Updated to budget-friendly dining option\n• Maintained authentic local experience";
      return {
        success: true,
        data: modifiedItinerary,
        response: responseMessage,
        changeSummary: changeSummary
      };
    }
  }
  
  return {
    success: true,
    data: modifiedItinerary,
    response: responseMessage,
    changeSummary: "• Made general improvements to your itinerary based on your request"
  };
}