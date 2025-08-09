# Secure Backend Setup for TripCraft

This document explains the secure backend architecture where all sensitive credentials are kept server-side only.

## Architecture Overview

```
Frontend (React) → Edge Functions (Deno) → Supabase Database
                                        → OpenRouter AI API
```

**Key Security Features:**
- ✅ No database credentials exposed to frontend users
- ✅ No AI API keys visible in browser
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

## Environment Variables (Server-Side Only)

These should be configured in Supabase Dashboard → Edge Functions → Secrets:

```env
SUPABASE_URL=your-project-url (auto-configured)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (auto-configured)
OPENROUTER_API_KEY=your-openrouter-api-key
```

**Note**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available in Edge Functions. You only need to manually add `OPENROUTER_API_KEY` in the Secrets section.

## Team Setup Instructions

### For Team Lead/DevOps:

1. **Set up Supabase Project:**
   ```bash
   # Create project at supabase.com
   # Get project URL and service role key
   ```

2. **Configure Edge Function Secrets:**
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Add `OPENROUTER_API_KEY` with your OpenRouter key
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-configured

3. **Deploy Edge Functions:**
   ```bash
   # Functions are automatically deployed when you connect to Supabase
   # No manual deployment needed
   ```

### For Team Members:

1. **Get Project URL Only:**
   ```env
   # Only need this in your .env file:
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   ```

2. **No Other Credentials Needed:**
   - No database keys required
   - No AI API keys needed
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
   - No direct database access needed

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

2. **Authentication failures:**
   - Verify SUPABASE_URL is correct
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

This architecture ensures maximum security while maintaining ease of development for the entire team.