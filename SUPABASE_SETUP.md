# Supabase Setup for Team Collaboration

This document explains how to set up Supabase for all team members working on the TripCraft project.

## Quick Setup Options

### Option 1: Environment Variables (Recommended)
Each team member should create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### Option 2: Direct Configuration
Update the values in `src/lib/supabase.ts` directly (not recommended for production):

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## Getting Your Supabase Credentials

1. **Create/Access Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign in or create an account
   - Create a new project or access existing project

2. **Get Project URL and Anon Key**
   - In your Supabase dashboard, go to Settings → API
   - Copy the "Project URL" 
   - Copy the "anon public" key
   - These are safe to share as they're designed for client-side use

3. **Database Schema**
   - The database schema is already set up with migrations
   - Tables: `itineraries` with proper RLS policies
   - Authentication is handled by Supabase Auth

## Team Sharing

**Safe to Share:**
- Project URL (VITE_SUPABASE_URL)
- Anon/Public key (VITE_SUPABASE_ANON_KEY)
- Database schema and migrations

**Keep Private:**
- Service role key (if used)
- Personal API keys (OpenRouter, etc.)

## Environment File Template

Create a `.env` file with this template:

```env
# Supabase Configuration (safe to share with team)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Personal API Keys (keep private)
VITE_OPENROUTER_API_KEY=your-personal-openrouter-key
```

## Verification

To verify the setup is working:

1. Start the development server: `npm run dev`
2. Try to sign up/sign in - this tests the Supabase connection
3. Generate an itinerary and save it - this tests the database

## Troubleshooting

- **"Missing Supabase environment variables"**: Create `.env` file with correct values
- **Authentication not working**: Check if the anon key is correct
- **Database errors**: Verify the project URL and check Supabase dashboard for issues
- **CORS errors**: Ensure your domain is added to Supabase Auth settings

## Database Schema

The project uses these tables:
- `itineraries`: Stores user travel itineraries with RLS enabled
- Built-in Supabase Auth tables for user management

All migrations are in `/supabase/migrations/` and will be applied automatically.