/**
 * Enhanced homepage with themed destination categories and elegant design
 * Features scrolling destination galleries organized by travel themes
 */

import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight,
  Mountain, Heart, Palmtree, ShoppingBag, Building, Users
} from 'lucide-react';
import { VoiceChatModal } from './VoiceChatModal';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

const TRAVEL_THEMES = [
  {
    id: 'adventure',
    name: 'Adventure',
    icon: Mountain,
    color: 'from-orange-500 to-red-600',
    description: 'Thrilling experiences and outdoor adventures',
    destinations: [
      {
        name: 'Ladakh, India',
        image: 'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'High-altitude desert adventures with stunning monasteries',
        highlight: 'Motorcycle expeditions'
      },
      {
        name: 'Rishikesh, India',
        image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'White water rafting and bungee jumping capital',
        highlight: 'River adventures'
      },
      {
        name: 'Manali, India',
        image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Himalayan trekking and paragliding paradise',
        highlight: 'Mountain sports'
      },
      {
        name: 'Andaman Islands',
        image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Scuba diving and pristine coral reefs',
        highlight: 'Underwater exploration'
      }
    ]
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    icon: Heart,
    color: 'from-purple-500 to-indigo-600',
    description: 'Sacred places and spiritual journeys',
    destinations: [
      {
        name: 'Varanasi, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Ancient spiritual capital on the sacred Ganges',
        highlight: 'River ceremonies'
      },
      {
        name: 'Dharamshala, India',
        image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Tibetan Buddhist culture in the Himalayas',
        highlight: 'Meditation retreats'
      },
      {
        name: 'Pushkar, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Sacred lake town with ancient temples',
        highlight: 'Holy pilgrimage'
      },
      {
        name: 'Amritsar, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Golden Temple and Sikh heritage',
        highlight: 'Sacred architecture'
      }
    ]
  },
  {
    id: 'leisure',
    name: 'Leisure',
    icon: Palmtree,
    color: 'from-teal-500 to-cyan-600',
    description: 'Relaxation and luxury experiences',
    destinations: [
      {
        name: 'Goa, India',
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Pristine beaches and Portuguese heritage',
        highlight: 'Beach resorts'
      },
      {
        name: 'Kerala Backwaters',
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Houseboat cruises through tropical canals',
        highlight: 'Ayurvedic spas'
      },
      {
        name: 'Udaipur, India',
        image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'City of lakes with royal palaces',
        highlight: 'Luxury heritage hotels'
      },
      {
        name: 'Coorg, India',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Coffee plantations and misty hills',
        highlight: 'Wellness retreats'
      }
    ]
  },
  {
    id: 'culture',
    name: 'Culture & Heritage',
    icon: Building,
    color: 'from-amber-500 to-orange-600',
    description: 'Rich history and architectural marvels',
    destinations: [
      {
        name: 'Rajasthan, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Majestic forts and desert palaces',
        highlight: 'Royal architecture'
      },
      {
        name: 'Hampi, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Ancient Vijayanagara Empire ruins',
        highlight: 'UNESCO World Heritage'
      },
      {
        name: 'Khajuraho, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Intricate temple sculptures and art',
        highlight: 'Medieval architecture'
      },
      {
        name: 'Mysore, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Royal palaces and silk heritage',
        highlight: 'Cultural festivals'
      }
    ]
  }
];

const STATS = [
  { number: '50,000+', label: 'Trips Planned' },
  { number: '200+', label: 'Destinations' },
  { number: '4.9/5', label: 'User Rating' },
  { number: '95%', label: 'Satisfaction Rate' }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  const [activeTheme, setActiveTheme] = useState(0);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const scrollDestinations = (direction: 'left' | 'right') => {
    const container = document.getElementById(`destinations-${TRAVEL_THEMES[activeTheme].id}`);
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-0 font-body">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-500/90 to-primary-700/90"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-5">
            <Mountain className="h-32 w-32 text-white animate-pulse" />
          </div>
          <div className="absolute top-40 right-20 opacity-5">
            <Heart className="h-24 w-24 text-white animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-5">
            <Palmtree className="h-28 w-28 text-white animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="max-w-content-narrow mx-auto">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              Craft Your Perfect Journey
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-loose-plus mb-12">
              Transform your travel dreams into detailed, personalized itineraries with AI. Every destination, perfectly planned in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              {/* New Function Buttons */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-5xl">
                {/* Meet Your AI Companion */}
                <button
                  onClick={onGetStarted}
                  className="group relative flex items-center justify-between w-full lg:w-80 px-6 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white rounded-2xl hover:from-amber-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-display overflow-hidden"
                >
                  {/* Try Free Badge */}
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Try Free
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Meet Your AI Companion</span>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </button>

                {/* Voice Chat with AI */}
                <button
                  onClick={() => setShowVoiceChat(true)}
                  className="group relative flex items-center justify-between w-full lg:w-80 px-6 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-display overflow-hidden"
                >
                  {/* NEW Badge */}
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Voice Chat with AI</span>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                    </svg>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                </button>

                {/* See Live Demo */}
                <button
                  onClick={() => {/* Live demo functionality */}}
                  className="group flex items-center justify-between w-full lg:w-80 px-6 py-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white rounded-2xl hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-display"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Play className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">See Live Demo</span>
                  </div>
                  
                  <div className="bg-white/20 p-1 rounded-lg flex-shrink-0">
                    <Play className="h-4 w-4" />
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => {/* Demo functionality */}}
                className="flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white transition-colors font-medium group"
              >
                <span className="text-sm">Or explore our features below</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Themed Destinations Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
              Discover by Theme
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed-plus">
              Explore curated destinations tailored to your travel style and interests
            </p>
          </div>

          {/* Theme Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {TRAVEL_THEMES.map((theme, index) => {
              const IconComponent = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(index)}
                  className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTheme === index
                      ? `bg-gradient-to-r ${theme.color} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${
                    activeTheme === index ? 'text-white' : 'text-gray-500'
                  } group-hover:scale-110 transition-transform`} />
                  <span className="font-display">{theme.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Theme Description */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">
              {TRAVEL_THEMES[activeTheme].description}
            </p>
          </div>

          {/* Destinations Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollDestinations('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => scrollDestinations('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Destinations Grid */}
            <div
              id={`destinations-${TRAVEL_THEMES[activeTheme].id}`}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TRAVEL_THEMES[activeTheme].destinations.map((destination, index) => (
                <div 
                  key={`${destination.name}-${index}`}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-80 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Highlight Badge */}
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${TRAVEL_THEMES[activeTheme].color} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      {destination.highlight}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {destination.description}
                    </p>
                    
                    <button 
                      onClick={onGetStarted}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r ${TRAVEL_THEMES[activeTheme].color} text-white hover:shadow-lg hover:scale-105`}
                    >
                      Plan This Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-content-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-8">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-xl mx-auto leading-relaxed-plus">
            Create your personalized itinerary in minutes, not hours. Every journey begins with a single step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-3 px-12 py-5 bg-white text-primary-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold text-lg hover:scale-105 font-display"
            >
              Start Planning Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Instant results
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              AI-powered recommendations
            </div>
          </div>
        </div>
      </section>

      {/* Voice Chat Modal */}
      <VoiceChatModal
        isOpen={showVoiceChat}
        onClose={() => setShowVoiceChat(false)}
      />
    </div>
  );
}