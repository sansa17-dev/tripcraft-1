import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AuthRequest {
  action: 'signup' | 'signin' | 'signout';
  email?: string;
  password?: string;
}

serve(async (req) => {
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

    const { action, email, password }: AuthRequest = await req.json()

    let result;
    
    switch (action) {
      case 'signup':
        if (!email || !password) {
          throw new Error('Email and password are required for signup')
        }
        result = await supabaseClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true // Auto-confirm emails
        })
        break;
        
      case 'signin':
        if (!email || !password) {
          throw new Error('Email and password are required for signin')
        }
        result = await supabaseClient.auth.signInWithPassword({
          email,
          password
        })
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
        user: result.data.user,
        session: result.data.session 
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