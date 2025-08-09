# TripCraft - Direct Supabase Setup

This document explains the direct Supabase setup without Edge Functions.

## Architecture Overview

```
Frontend (React) → Supabase Client → Supabase Database
```

**Key Features:**
- ✅ Direct Supabase client operations
- ✅ Row Level Security (RLS) enforced
- ✅ Secure authentication flow
- ✅ No server-side functions needed

## Setup Instructions

### 1. Supabase Project Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Environment Variables:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Database Schema:**
   - The database schema is set up with migrations
   - Tables: `itineraries`, `shared_itineraries`, `itinerary_comments`
   - All tables have proper RLS policies

### 2. Team Setup

**Each team member needs:**
1. Project URL (`VITE_SUPABASE_URL`)
2. Anon key (`VITE_SUPABASE_ANON_KEY`)

**Safe to share:**
- Project URL
- Anon/Public key
- Database schema

### 3. Features

- **Authentication:** Direct Supabase Auth
- **Itineraries:** CRUD operations with RLS
- **Sharing:** Create shareable links
- **Comments:** Collaborative commenting
- **Demo Mode:** Built-in demo itinerary generation

### 4. Security

- Row Level Security enforced on all tables
- Users can only access their own data
- Shared itineraries respect sharing permissions
- Comments only allowed on collaborative shares

## Development

1. **Install dependencies:** `npm install`
2. **Set up environment:** Copy `.env.example` to `.env` and fill in values
3. **Start development:** `npm run dev`

## Database Tables

- `itineraries`: User travel itineraries
- `shared_itineraries`: Shareable itinerary links
- `itinerary_comments`: Comments on shared itineraries
- Built-in Supabase Auth tables

All operations go through the Supabase client with proper RLS enforcement.