import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ItineraryRequest {
  action: 'create' | 'read' | 'update' | 'delete' | 'list';
  userId: string;
  itineraryId?: string;
  data?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key from Edge Function secrets
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, itineraryId, data }: ItineraryRequest = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    let result;

    switch (action) {
      case 'create':
        if (!data) {
          throw new Error('Itinerary data is required for creation')
        }
        result = await supabaseClient
          .from('itineraries')
          .insert({
            user_id: userId,
            ...data
          })
          .select()
          .single()
        break;

      case 'list':
        result = await supabaseClient
          .from('itineraries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        break;

      case 'read':
        if (!itineraryId) {
          throw new Error('Itinerary ID is required for reading')
        }
        result = await supabaseClient
          .from('itineraries')
          .select('*')
          .eq('id', itineraryId)
          .eq('user_id', userId)
          .single()
        break;

      case 'update':
        if (!itineraryId || !data) {
          throw new Error('Itinerary ID and data are required for updating')
        }
        result = await supabaseClient
          .from('itineraries')
          .update(data)
          .eq('id', itineraryId)
          .eq('user_id', userId)
          .select()
          .single()
        break;

      case 'delete':
        if (!itineraryId) {
          throw new Error('Itinerary ID is required for deletion')
        }
        result = await supabaseClient
          .from('itineraries')
          .delete()
          .eq('id', itineraryId)
          .eq('user_id', userId)
        break;

      default:
        throw new Error('Invalid action')
    }

    if (result.error) {
      throw result.error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result.data 
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