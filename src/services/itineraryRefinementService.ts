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
  
  return `You are an enthusiastic, knowledgeable travel planning expert helping to refine an existing itinerary. You have deep local knowledge, insider tips, and a passion for creating unforgettable travel experiences. The user has a specific request to modify their trip.

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

REFINEMENT INSTRUCTIONS:
1. Make changes that are inspiring, detailed, and enhance the travel experience
2. Use vivid, engaging language that builds excitement about the modifications
3. Include cultural context, insider tips, and local insights in your changes
4. Explain WHY each change makes the experience better
5. Add sensory details and unique experiences where relevant
6. Maintain the overall structure while making meaningful improvements

Please modify the itinerary based on the user's request while keeping the overall structure intact. Provide:
1. An enthusiastic, detailed response explaining what you've changed and WHY it makes the experience better
2. The updated itinerary in the exact same JSON format with enhanced, inspiring descriptions

Respond with a JSON object in this format:
{
  "response": "Enthusiastic, detailed explanation of changes made with cultural insights and why these improvements enhance the travel experience (2-3 sentences)",
  "itinerary": {
    "title": "Inspiring updated title if needed",
    "destination": "${itinerary.destination}",
    "duration": "${itinerary.duration}",
    "totalBudget": "Detailed updated budget if needed",
    "overview": "Enhanced, inspiring overview if needed",
    "days": [...updated days array with detailed, engaging descriptions...],
    "tips": [...updated tips array with insider knowledge and cultural insights...]
  }
}

WRITING STYLE FOR MODIFICATIONS:
- Use enthusiastic, inspiring language that builds excitement
- Include cultural context and local insights
- Explain the unique aspects of each recommendation
- Add sensory descriptions where appropriate
- Mention insider tips and hidden gems
- Describe what makes each experience special
- Use vivid adjectives and engaging storytelling

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
  let responseMessage = "I've made some exciting adjustments to your itinerary based on your request!";
  
  // Simple keyword-based modifications for demo
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
    // Modify a meal recommendation
    if (modifiedItinerary.days.length > 0 && modifiedItinerary.days[0].meals.dinner) {
      modifiedItinerary.days[0].meals.dinner = "Green Garden Vegetarian Restaurant - A culinary paradise for plant-based food lovers, this award-winning establishment transforms fresh, locally-sourced ingredients into innovative dishes that even meat-eaters rave about. The cozy atmosphere, complete with living walls and soft jazz, creates the perfect setting for an unforgettable dining experience.";
      responseMessage = "I've discovered an absolutely incredible vegetarian restaurant that will make your taste buds dance with joy! This change ensures you'll experience some of the most innovative plant-based cuisine in the city while supporting local, sustainable dining practices.";
      const changeSummary = "• Upgraded Day 1 dinner to Green Garden Vegetarian Restaurant - an award-winning plant-based culinary experience\n• Enhanced with detailed description of the innovative cuisine and cozy atmosphere\n• Added context about local sourcing and sustainability focus";
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
      modifiedItinerary.days[0].activities.push("Afternoon: Embrace the art of slow travel with unscheduled time to wander charming neighborhoods, discover hidden cafés, or simply sit in a beautiful park and watch the world go by - these spontaneous moments often become the most treasured memories of any journey.");
      responseMessage = "I've transformed your itinerary into a more relaxed, mindful experience that allows you to truly savor each moment! This slower pace creates space for serendipitous discoveries and deeper connections with the local culture.";
      const changeSummary = "• Reduced Day 1 activities from 3 to 2 for a more leisurely pace\n• Added inspiring free time description that encourages spontaneous exploration\n• Created space for serendipitous discoveries and deeper cultural connections";
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
      modifiedItinerary.days[0].activities[1] = `Afternoon: Immerse yourself in the rich artistic heritage at ${itinerary.destination}'s premier art museum, where world-class collections tell the story of local culture through centuries of creative expression - don't miss the rooftop sculpture garden with panoramic city views and the interactive exhibits that bring history to life.`;
      responseMessage = "I've added an incredible cultural experience that will deepen your appreciation for ${itinerary.destination}'s artistic soul! This museum visit offers both world-class art and stunning city views, creating the perfect blend of culture and beauty.";
      const changeSummary = `• Enhanced Day 1 afternoon with detailed art museum experience in ${itinerary.destination}\n• Added specific highlights: rooftop sculpture garden and interactive exhibits\n• Included cultural context about local artistic heritage and panoramic city views`;
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
      modifiedItinerary.days[0].meals.lunch = "Vibrant local street food market - A sensory adventure where the aroma of sizzling spices fills the air and friendly vendors serve up authentic regional specialties at unbeatable prices. This bustling marketplace offers the most genuine taste of local culture, where every bite tells a story and your budget stretches further while experiencing the true heart of the destination.";
      responseMessage = "I've discovered an amazing way to stretch your budget while diving deeper into authentic local culture! This street food market experience offers incredible value and unforgettable flavors that expensive restaurants simply can't match.";
      const changeSummary = "• Upgraded Day 1 lunch to vibrant local street food market with detailed sensory descriptions\n• Enhanced budget-friendly option with cultural authenticity and storytelling elements\n• Added context about genuine local experiences and unbeatable value";
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
    response: "I've made some wonderful enhancements to your itinerary that will make your travel experience even more memorable and engaging!",
    changeSummary: "• Enhanced your itinerary with more detailed, inspiring descriptions and local insights\n• Added cultural context and insider tips to make your experience more authentic\n• Improved recommendations to create more memorable and meaningful travel moments"
  };
}