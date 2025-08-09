import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ShareRequest {
  action: 'create' | 'get' | 'update' | 'delete' | 'list' | 'view';
  userId?: string;
  shareId?: string;
  data?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key (server-side only)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, shareId, data }: ShareRequest = await req.json()

    let result;

    switch (action) {
      case 'create':
        if (!userId || !data) {
          throw new Error('User ID and share data are required for creation')
        }
        
        // Generate unique share ID
        const shareUuid = crypto.randomUUID()
        
        result = await supabaseClient
          .from('shared_itineraries')
          .insert({
            share_id: shareUuid,
            user_id: userId,
            itinerary_id: data.itinerary_id,
            title: data.title,
            share_mode: data.share_mode || 'view',
            is_public: data.is_public || false,
            expires_at: data.expires_at,
            view_count: 0
          })
          .select()
          .single()
        break;

      case 'get':
        if (!shareId) {
          throw new Error('Share ID is required for getting shared itinerary')
        }
        
        // Get shared itinerary with full itinerary data
        result = await supabaseClient
          .from('shared_itineraries')
          .select(`
            *,
            itineraries (*)
          `)
          .eq('share_id', shareId)
          .single()
        break;

      case 'list':
        if (!userId) {
          throw new Error('User ID is required for listing shares')
        }
        
        result = await supabaseClient
          .from('shared_itineraries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        break;

      case 'update':
        if (!userId || !shareId || !data) {
          throw new Error('User ID, share ID, and data are required for updating')
        }
        
        result = await supabaseClient
          .from('shared_itineraries')
          .update(data)
          .eq('share_id', shareId)
          .eq('user_id', userId)
          .select()
          .single()
        break;

      case 'delete':
        if (!userId || !shareId) {
          throw new Error('User ID and share ID are required for deletion')
        }
        
        result = await supabaseClient
          .from('shared_itineraries')
          .delete()
          .eq('share_id', shareId)
          .eq('user_id', userId)
        break;

      case 'view':
        if (!shareId) {
          throw new Error('Share ID is required for incrementing view count')
        }
        
        // Increment view count
        result = await supabaseClient
          .rpc('increment_share_views', { share_uuid: shareId })
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