import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

interface CommentRequest {
  action: 'create' | 'list' | 'delete';
  shareId: string;
  commentId?: string;
  userId?: string;
  dayIndex?: number | null;
  data?: {
    user_email: string;
    content: string;
    day_index?: number | null;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify environment variables are set
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set')
    }
    
    if (!supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }

    // Create Supabase client with service role key from Edge Function secrets
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    const { action, shareId, commentId, userId, dayIndex, data }: CommentRequest = await req.json()

    if (!shareId) {
      throw new Error('Share ID is required')
    }

    let result;

    switch (action) {
      case 'create':
        if (!data) {
          throw new Error('Comment data is required for creation')
        }
        
        // Validate user email
        if (!data.user_email || data.user_email.trim() === '') {
          throw new Error('User email is required for comments')
        }
        
        // Verify the shared itinerary exists and allows comments
        const { data: sharedItinerary } = await supabaseClient
          .from('shared_itineraries')
          .select('share_mode')
          .eq('share_id', shareId)
          .single()
        
        if (!sharedItinerary || sharedItinerary.share_mode !== 'collaborate') {
          throw new Error('Comments not allowed on this shared itinerary')
        }
        
        result = await supabaseClient
          .from('itinerary_comments')
          .insert({
            share_id: shareId,
            user_email: data.user_email.trim(),
            content: data.content,
            day_index: data.day_index || null
          })
          .select()
          .single()
        break;

      case 'list':
        // If dayIndex is provided, filter by it; otherwise get all comments
        let query = supabaseClient
          .from('itinerary_comments')
          .select('*')
          .eq('share_id', shareId)
          .order('created_at', { ascending: true })
        
        if (dayIndex !== undefined) {
          if (dayIndex === null) {
            // Get general comments (where day_index is NULL)
            query = query.is('day_index', null)
          } else {
            // Get comments for specific day
            query = query.eq('day_index', dayIndex)
          }
        }
        
        result = await query
        break;

      case 'delete':
        if (!commentId) {
          throw new Error('Comment ID is required for deletion')
        }
        
        // Only allow deletion by comment author or share owner
        let deleteQuery = supabaseClient
          .from('itinerary_comments')
          .delete()
          .eq('id', commentId)
          .eq('share_id', shareId)
        
        if (userId) {
          // If userId provided, check if they're the share owner
          const { data: sharedItinerary } = await supabaseClient
            .from('shared_itineraries')
            .select('user_id')
            .eq('share_id', shareId)
            .single()
          
          if (sharedItinerary?.user_id === userId) {
            // Share owner can delete any comment
            deleteQuery = supabaseClient
              .from('itinerary_comments')
              .delete()
              .eq('id', commentId)
              .eq('share_id', shareId)
          }
        }
        
        result = await deleteQuery
        break;

      case 'resolve':
        if (!commentId || !userId) {
          throw new Error('Comment ID and User ID are required for resolving')
        }
        
        // Only allow resolution by share owner
        const { data: sharedItinerary } = await supabaseClient
          .from('shared_itineraries')
          .select('user_id')
          .eq('share_id', shareId)
          .single()
        
        if (!sharedItinerary || sharedItinerary.user_id !== userId) {
          throw new Error('Only the itinerary owner can resolve comments')
        }
        
        result = await supabaseClient
          .from('itinerary_comments')
          .update({ is_resolved: true })
          .eq('id', commentId)
          .eq('share_id', shareId)
          .select()
          .single()
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