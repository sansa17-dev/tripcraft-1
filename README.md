# TripCraft - AI-Powered Travel Planning

## 🔒 Secure Architecture with Edge Functions

TripCraft uses a secure backend architecture where all sensitive credentials are managed in Supabase Edge Function secrets. No environment variables or sensitive keys are exposed to the frontend.

## Quick Start

Transform your travel dreams into detailed, personalized itineraries with AI-powered planning.

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tripcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update Supabase configuration**
   Edit `src/lib/supabase.ts` and `src/lib/api.ts` with your actual Supabase project URL and anon key.

4. **Start development server**
   ```bash
   npm run dev
   ```

## Team Setup

All sensitive credentials are managed in Supabase Edge Function secrets. Team members only need to update the hardcoded URLs in the source code with the actual project values.

## Features

- 🤖 AI-powered itinerary generation
- 👤 User authentication and profiles
- 💾 Save and manage multiple itineraries
- ✏️ Edit and customize generated plans
- 📱 Responsive design for all devices
- 🔒 Secure backend with no exposed credentials

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions + Database
- **AI**: OpenRouter API (GPT-4)
- **Build Tool**: Vite
- **Security**: Server-side credential management

## Configuration

**Edge Function Secrets (configured in Supabase Dashboard):**
- `SUPABASE_URL`: Auto-configured
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured  
- `OPENROUTER_API_KEY`: Manually set in Edge Functions → Secrets

## Security Features

- ✅ All credentials managed in Edge Function secrets
- ✅ No environment variables required
- ✅ All sensitive operations server-side only
- ✅ Row Level Security (RLS) enforced
- ✅ User data isolation and protection

## Contributing

1. Set up the development environment following the Quick Start guide
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details