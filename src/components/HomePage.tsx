/**
 * Enhanced homepage with modern design, better UX, and no duplicates
 * Features clean layout, engaging animations, and intuitive user flow
 */

import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle, Play, ChevronLeft, ChevronRight,
  Mountain, Heart, Palmtree, ShoppingBag, Building, Users, Star, Zap, Globe
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
    bgColor: 'bg-orange-50',
    description: 'Thrilling experiences and outdoor adventures',
    destinations: [
      {
        name: 'Ladakh, India',
        image: 'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'High-altitude desert adventures with stunning monasteries',
        highlight: 'Motorcycle expeditions',
        rating: '4.9'
      },
      {
        name: 'Rishikesh, India',
        image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'White water rafting and bungee jumping capital',
        highlight: 'River adventures',
        rating: '4.8'
      },
      {
        name: 'Manali, India',
        image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Himalayan trekking and paragliding paradise',
        highlight: 'Mountain sports',
        rating: '4.7'
      },
      {
        name: 'Andaman Islands',
        image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Scuba diving and pristine coral reefs',
        highlight: 'Underwater exploration',
        rating: '4.9'
      }
    ]
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    icon: Heart,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    description: 'Sacred places and spiritual journeys',
    destinations: [
      {
        name: 'Varanasi, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Ancient spiritual capital on the sacred Ganges',
        highlight: 'River ceremonies',
        rating: '4.8'
      },
      {
        name: 'Dharamshala, India',
        image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Tibetan Buddhist culture in the Himalayas',
        highlight: 'Meditation retreats',
        rating: '4.7'
      },
      {
        name: 'Pushkar, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Sacred lake town with ancient temples',
        highlight: 'Holy pilgrimage',
        rating: '4.6'
      },
      {
        name: 'Amritsar, India',
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Golden Temple and Sikh heritage',
        highlight: 'Sacred architecture',
        rating: '4.9'
      }
    ]
  },
  {
    id: 'leisure',
    name: 'Leisure',
    icon: Palmtree,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    description: 'Relaxation and luxury experiences',
    destinations: [
      {
        name: 'Goa, India',
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Pristine beaches and Portuguese heritage',
        highlight: 'Beach resorts',
        rating: '4.8'
      },
      {
        name: 'Kerala Backwaters',
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Houseboat cruises through tropical canals',
        highlight: 'Ayurvedic spas',
        rating: '4.9'
      },
      {
        name: 'Udaipur, India',
        image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'City of lakes with royal palaces',
        highlight: 'Luxury heritage hotels',
        rating: '4.7'
      },
      {
        name: 'Coorg, India',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Coffee plantations and misty hills',
        highlight: 'Wellness retreats',
        rating: '4.6'
      }
    ]
  },
  {
    id: 'culture',
    name: 'Culture & Heritage',
    icon: Building,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    description: 'Rich history and architectural marvels',
    destinations: [
      {
        name: 'Rajasthan, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Majestic forts and desert palaces',
        highlight: 'Royal architecture',
        rating: '4.9'
      },
      {
        name: 'Hampi, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Ancient Vijayanagara Empire ruins',
        highlight: 'UNESCO World Heritage',
        rating: '4.8'
      },
      {
        name: 'Khajuraho, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Intricate temple sculptures and art',
        highlight: 'Medieval architecture',
        rating: '4.7'
      },
      {
        name: 'Mysore, India',
        image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&fit=crop',
        description: 'Royal palaces and silk heritage',
        highlight: 'Cultural festivals',
        rating: '4.6'
      }
    ]
  }
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Planning',
    description: 'Get personalized itineraries in seconds with our advanced AI that understands your preferences'
  },
  {
    icon: Globe,
    title: 'Global Destinations',
    description: 'Explore 200+ destinations worldwide with local insights and hidden gems'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join 50,000+ travelers sharing experiences and recommendations'
  }
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'TripCraft planned my perfect Rajasthan trip! Every detail was spot-on.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    name: 'Arjun Patel',
    location: 'Bangalore',
    text: 'The AI suggestions were incredible. Saved me hours of research!',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    name: 'Sneha Gupta',
    location: 'Delhi',
    text: 'Voice chat feature is amazing! Planning trips has never been easier.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
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
    <div className="space-y-0 font-body overflow-hidden">
      {/* Hero Section - Modernized */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 via-cyan-700 to-teal-800 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop')] bg-cover bg-center opacity-15"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/95 via-cyan-700/95 to-teal-800/95"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-turquoise-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-300 bg-clip-text text-transparent">
                Craft Your
              </span>
              <br />
              <span className="text-white">Perfect Journey</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Transform your travel dreams into detailed, personalized itineraries with AI. 
              <span className="text-cyan-300 font-semibold"> Every destination, perfectly planned in minutes.</span>
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-16">
            {/* Meet Your AI Companion */}
            <button
              onClick={onGetStarted}
              className="group relative flex items-center justify-between w-full lg:w-80 px-8 py-5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white rounded-2xl hover:from-amber-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 font-display overflow-hidden"
            >
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                Try Free
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Meet Your AI Companion</span>
              </div>
              
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </button>

            {/* Voice Chat with AI */}
            <button
              onClick={() => setShowVoiceChat(true)}
              className="group relative flex items-center justify-between w-full lg:w-80 px-8 py-5 bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 text-white rounded-2xl hover:from-teal-600 hover:via-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 font-display overflow-hidden"
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                NEW
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
                  </svg>
                </div>
                <span className="font-semibold text-lg">Voice Chat with AI</span>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 animate-pulse" />
                <Star className="w-3 h-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </button>

            {/* See Live Demo */}
            <button
              onClick={() => {/* Live demo functionality */}}
              className="group flex items-center justify-between w-full lg:w-80 px-8 py-5 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white rounded-2xl hover:from-teal-800 hover:via-teal-900 hover:to-cyan-950 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 font-display border border-teal-600"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Play className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">See Live Demo</span>
              </div>
              
              <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                <Play className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">50K+</div>
              <div className="text-gray-400 text-sm">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">200+</div>
              <div className="text-gray-400 text-sm">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">4.9★</div>
              <div className="text-gray-400 text-sm">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">95%</div>
              <div className="text-cyan-200 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - New */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
              Why Choose TripCraft?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group text-center p-8 rounded-3xl bg-gradient-to-br from-white to-cyan-50 border border-cyan-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-gradient-to-r from-teal-600 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Themed Destinations Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
              Discover by Theme
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
                  className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTheme === index
                      ? `bg-gradient-to-r ${theme.color} text-white shadow-xl scale-105`
                      : 'bg-white text-gray-600 hover:bg-cyan-50 shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${
                    activeTheme === index ? 'text-white' : 'text-gray-500'
                  } group-hover:scale-110 transition-transform`} />
                  <span className="font-display font-semibold">{theme.name}</span>
                </button>
              );
            })}
          </div>

          {/* Destinations Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollDestinations('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => scrollDestinations('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            <div
              id={`destinations-${TRAVEL_THEMES[activeTheme].id}`}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-16"
            >
              {TRAVEL_THEMES[activeTheme].destinations.map((destination, index) => (
                <div 
                  key={`${destination.name}-${index}`}
                  className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-80 hover:-translate-y-3"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${TRAVEL_THEMES[activeTheme].color} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      {destination.highlight}
                    </div>

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{destination.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {destination.description}
                    </p>
                    
                    <button 
                      onClick={onGetStarted}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r ${TRAVEL_THEMES[activeTheme].color} text-white hover:shadow-lg hover:scale-105`}
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

      {/* Testimonials Section - New */}
      <section className="py-24 bg-gradient-to-br from-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of happy travelers who've crafted their perfect journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl border border-teal-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-teal-800 via-cyan-800 to-teal-900 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/25 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-8">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          <p className="text-xl text-cyan-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create your personalized itinerary in minutes, not hours. Every journey begins with a single step.
          </p>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white rounded-2xl hover:from-amber-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold text-xl hover:scale-105 font-display"
          >
            Start Planning Free
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-purple-200 text-sm">
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-cyan-200 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Instant AI-powered results
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              50,000+ satisfied travelers
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