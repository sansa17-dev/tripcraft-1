# TripCraft - AI-Powered Travel Planning

## 🔒 Secure Architecture

TripCraft uses a secure backend architecture where all sensitive credentials (database keys, AI API keys) are kept server-side only. Users cannot access any sensitive information through the browser.

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase project URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Team Setup

For secure backend setup, see [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions.

**Team members only need:**
- Supabase project URL (`VITE_SUPABASE_URL`) 
- Supabase anon key (`VITE_SUPABASE_ANON_KEY`)
- No service role keys or database credentials required
- No AI API keys needed

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

## Environment Variables

**Frontend (.env file):**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

**Backend (Supabase Edge Functions - auto-configured):**
- `SUPABASE_URL`: Auto-configured
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured  
- `OPENROUTER_API_KEY`: Set in Supabase Dashboard → Edge Functions → Secrets

## Security Features

- ✅ No database credentials exposed to frontend
- ✅ No AI API keys visible in browser
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