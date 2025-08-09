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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Auth function called with method:', req.method);
    
    // Create Supabase client with service role key (server-side only)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (!Deno.env.get('SUPABASE_URL') || !Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      throw new Error('Missing Supabase environment variables')
    }
    const { action, email, password }: AuthRequest = await req.json()
    console.log('Auth action:', action, 'email:', email);

    let result;
    
    switch (action) {
      case 'signup':
        if (!email || !password) {
          throw new Error('Email and password are required for signup')
        }
        console.log('Creating user with email:', email);
        result = await supabaseClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true // Auto-confirm emails
        })
        console.log('Signup result:', result);
        break;
        
      case 'signin':
        if (!email || !password) {
          throw new Error('Email and password are required for signin')
        }
        console.log('Signing in user with email:', email);
        result = await supabaseClient.auth.signInWithPassword({
          email,
          password
        })
        console.log('Signin result:', result);
        break;
        
      default:
        throw new Error('Invalid action')
    }

    if (result.error) {
      console.error('Auth error:', result.error);
      throw result.error
    }

    console.log('Auth success, returning user data');
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          user: result.data.user,
          session: result.data.session
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Auth function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Authentication failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})