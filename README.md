# TripCraft - AI-Powered Travel Planning

## 🔒 Secure Architecture

TripCraft uses direct Supabase client operations with Row Level Security (RLS) to ensure data protection and user isolation.

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
   Then edit `.env` with your Supabase project URL only

4. **Start development server**
   ```bash
   npm run dev
   ```

## Team Setup

For secure backend setup, see [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions.

**Team members only need:**
- Supabase project URL (`VITE_SUPABASE_URL`)
- Supabase anon key (`VITE_SUPABASE_ANON_KEY`)

## Features

- 🤖 AI-powered itinerary generation
- 👤 User authentication and profiles
- 💾 Save and manage multiple itineraries
- ✏️ Edit and customize generated plans
- 📱 Responsive design for all devices
- 🔒 Secure backend with no exposed credentials

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Database with RLS
- **AI**: Demo itinerary generation
- **Build Tool**: Vite
- **Security**: Row Level Security (RLS)

## Environment Variables

**Frontend (.env file):**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Security Features

- ✅ Row Level Security (RLS) enforced
- ✅ User data isolation and protection
- ✅ Secure client-side operations
- ✅ Row Level Security (RLS) enforced
- ✅ Direct Supabase client with proper permissions

## Contributing

1. Set up the development environment following the Quick Start guide
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details