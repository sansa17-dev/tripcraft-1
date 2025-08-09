// No imports needed for this function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface GenerateRequest {
  preferences: {
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    interests: string[];
    travelers: number;
    accommodationType: string;
    vacationPace: string;
    additionalNotes?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { preferences }: GenerateRequest = await req.json()

    // Get OpenRouter API key from environment (server-side only)
    const apiKey = Deno.env.get('OPENROUTER_API_KEY')
    
    if (!apiKey) {
      // Return demo itinerary if no API key
      const duration = Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24))
      
      const demoItinerary = {
        title: `${duration}-Day Journey from ${preferences.origin} to ${preferences.destination}`,
        destination: preferences.destination,
        duration: `${duration} days`,
        totalBudget: preferences.budget === 'budget' ? '₹15,000-25,000' : preferences.budget === 'mid-range' ? '₹30,000-50,000' : '₹60,000-1,00,000',
        overview: `A carefully crafted ${duration}-day journey from ${preferences.origin} to ${preferences.destination}, featuring the best ${preferences.interests.join(' and ')} experiences.`,
        days: Array.from({ length: duration }, (_, index) => {
          const dayDate = new Date(preferences.startDate)
          dayDate.setDate(dayDate.getDate() + index)
          
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
            accommodation: "Recommended accommodation",
            estimatedCost: preferences.budget === 'budget' ? '₹2,500-3,500' : preferences.budget === 'mid-range' ? '₹4,500-6,500' : '₹8,500-12,000',
            notes: index === 0 ? "Arrival day - lighter schedule recommended" : 
                   index === duration - 1 ? "Departure day - plan for travel time" : `Full day of ${preferences.vacationPace} exploration`
          }
        }),
        tips: [
          `Best time to visit ${preferences.destination} is during your planned dates`,
          "Book accommodations in advance for better rates",
          "Try local transportation to save money and experience authentic culture",
          "Keep copies of important documents in separate locations"
        ]
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: demoItinerary,
          isDemo: true 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Create prompt for AI
    const duration = Math.ceil((new Date(preferences.endDate).getTime() - new Date(preferences.startDate).getTime()) / (1000 * 60 * 60 * 24))
    
    const prompt = `Create a detailed ${duration}-day travel itinerary for ${preferences.destination} from ${preferences.startDate} to ${preferences.endDate}, travelling from ${preferences.origin}.

Travel Details:
- Travelling from: ${preferences.origin}
- Destination: ${preferences.destination}
- ${preferences.travelers} traveller${preferences.travelers > 1 ? 's' : ''}
- Budget: ${preferences.budget}
- Accommodation preference: ${preferences.accommodationType}
- Holiday pace: ${preferences.vacationPace}
- Interests: ${preferences.interests.join(', ')}
${preferences.additionalNotes ? `- Additional notes: ${preferences.additionalNotes}` : ''}

Please provide a comprehensive itinerary including transportation from ${preferences.origin} to ${preferences.destination}. The itinerary should match the ${preferences.vacationPace} pace preference. Use Indian English spelling and terminology throughout. Provide the response in the following JSON format:
{
  "title": "Trip title",
  "destination": "${preferences.destination}",
  "duration": "${duration} days",
  "totalBudget": "Estimated total budget range",
  "overview": "Brief trip overview (2-3 sentences)",
  "days": [
    {
      "day": 1,
      "date": "${preferences.startDate}",
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
}`

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://tripcraft.app',
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
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format')
    }

    // Parse the AI response
    let jsonContent = data.choices[0].message.content.trim()
    
    // Remove markdown code fences if present
    const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim()
    }
    
    // Clean up JSON content
    const jsonStart = jsonContent.indexOf('{')
    const jsonEnd = jsonContent.lastIndexOf('}')
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1)
    }
    
    const itinerary = JSON.parse(jsonContent)
    
    // Validate the parsed JSON
    if (!itinerary.title || !itinerary.days || !Array.isArray(itinerary.days)) {
      throw new Error('Invalid itinerary format from AI')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: itinerary 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})