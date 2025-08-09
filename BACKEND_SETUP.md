# Secure Backend Setup for TripCraft

This document explains the secure backend architecture where all sensitive credentials are managed in Supabase Edge Function secrets.

## Architecture Overview

```
Frontend (React) → Edge Functions (Deno) → Supabase Database
                                        → OpenRouter AI API
```

**Key Security Features:**
- ✅ All credentials managed in Edge Function secrets
- ✅ No environment variables required
- ✅ All sensitive operations handled server-side
- ✅ Secure authentication flow
- ✅ Row Level Security (RLS) enforced

## Backend Functions

### 1. Authentication (`/functions/auth`)
- Handles user signup, signin, signout
- Uses Supabase service role key (server-side only)
- Returns secure session tokens

### 2. Itinerary Management (`/functions/itineraries`)
- CRUD operations for saved itineraries
- Enforces user permissions server-side
- Validates all data before database operations

### 3. AI Generation (`/functions/generate-itinerary`)
- Calls OpenRouter API with server-side API key
- Processes AI responses securely
- Falls back to demo data if API unavailable

## Edge Function Secrets Configuration

Configure these in Supabase Dashboard → Edge Functions → Secrets:

- `SUPABASE_URL`: Auto-configured by Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured by Supabase
- `OPENROUTER_API_KEY`: Manually add your OpenRouter API key

**Note**: Only `OPENROUTER_API_KEY` needs to be manually configured.

## Team Setup Instructions

### For Team Lead/DevOps:

1. **Set up Supabase Project:**
   - Create project at supabase.com
   - Note the project URL and anon key

2. **Configure Edge Function Secrets:**
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Add `OPENROUTER_API_KEY` with your OpenRouter key

   - Other secrets are auto-configured

### For Team Members:

1. **Update Source Code:**
   - Edit `src/lib/supabase.ts` with actual project URL and anon key
   - Edit `src/lib/api.ts` with actual project URL

2. **No Environment Variables Needed:**
   - No .env file required
   - All sensitive operations handled by backend

## Security Benefits

### What Users Cannot Access:
- ❌ Database connection strings
- ❌ Service role keys
- ❌ AI API keys
- ❌ Direct database queries
- ❌ Other users' data

### What Users Can Do:
- ✅ Sign up/sign in securely
- ✅ Generate itineraries (via backend)
- ✅ Save/load their own itineraries
- ✅ Edit their own data only

## API Endpoints

All API calls go through secure Edge Functions:

```typescript
// Authentication
POST /functions/v1/auth
Body: { action: 'signup|signin|signout', email?, password? }

// Itineraries
POST /functions/v1/itineraries
Body: { action: 'create|read|update|delete|list', userId, data? }

// AI Generation
POST /functions/v1/generate-itinerary
Body: { preferences: TravelPreferences }
```

## Development Workflow

1. **Frontend Development:**
   - Work with the React app normally
   - All API calls go through `src/lib/api.ts`
   - Update hardcoded URLs with actual project values

2. **Backend Changes:**
   - Modify Edge Functions in `/supabase/functions/`
   - Functions auto-deploy when connected to Supabase
   - Test with local Supabase CLI if needed

3. **Database Changes:**
   - Create migrations in `/supabase/migrations/`
   - Apply via Supabase Dashboard or CLI
   - RLS policies automatically enforced

## Troubleshooting

### Common Issues:

1. **"Function not found" errors:**
   - Ensure Supabase project is connected
   - Check function names match exactly
   - Verify project URL is correct in source code

2. **Authentication failures:**
   - Verify project URL and anon key in source code
   - Check if functions are deployed

3. **Database permission errors:**
   - RLS policies are enforced server-side
   - Users can only access their own data

### Debugging:

1. **Check Function Logs:**
   - Go to Supabase Dashboard → Edge Functions → Logs
   - View real-time function execution logs

2. **Test API Endpoints:**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/auth \
     -H "Content-Type: application/json" \
     -d '{"action":"signup","email":"test@example.com","password":"password123"}'
   ```

## Production Deployment

1. **Frontend:** Deploy to any static hosting (Netlify, Vercel, etc.)
2. **Backend:** Edge Functions automatically deployed with Supabase
3. **Database:** Managed by Supabase with automatic backups
4. **Monitoring:** Built-in logs and metrics in Supabase Dashboard

This architecture ensures maximum security with all credentials managed in Edge Function secrets.