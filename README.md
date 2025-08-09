# TripCraft - AI-Powered Travel Planning

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
   Then edit `.env` with your Supabase credentials (see SUPABASE_SETUP.md)
4. **Start development server**
   ```bash
   npm run dev
   ```
## Team Setup
For team collaboration, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions on sharing Supabase configuration.
## Features
- 🤖 AI-powered itinerary generation
- 👤 User authentication and profiles
- 💾 Save and manage multiple itineraries
- ✏️ Edit and customize generated plans
- 📱 Responsive design for all devices
- 🔒 Secure data storage with Supabase
## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Auth)
- **AI**: OpenRouter API (GPT-4)
- **Build Tool**: Vite
## Environment Variables
Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key (optional, demo mode available)
## Contributing
1. Set up the development environment following the Quick Start guide
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
## License
MIT License - see LICENSE file for details