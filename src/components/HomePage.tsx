/**
 * Enhanced homepage with AR features, user personas, and streamlined content
 * Removes duplicates and focuses on unique AI capabilities for better UX
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Play, ChevronDown, Sparkles, Zap, Globe, Users, 
  Star, Heart, Clock, Shield, Mic, MessageCircle, Calendar, MapPin, DollarSign,
  Brain, Eye, Smartphone, Headphones, Camera, Award
} from 'lucide-react';
import { VoiceChatModal } from './VoiceChatModal';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

const POPULAR_DESTINATIONS = [
  { 
    name: 'Paris Romance', 
    country: 'France',
    emoji: '🗼', 
    color: 'from-pink-400 to-rose-500',
    image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Tokyo Culture', 
    country: 'Japan',
    emoji: '🏮', 
    color: 'from-red-400 to-pink-500',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Bali Temples', 
    country: 'Indonesia',
    emoji: '🏛️', 
    color: 'from-green-400 to-teal-500',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Swiss Alps', 
    country: 'Switzerland',
    emoji: '🏔️', 
    color: 'from-blue-400 to-cyan-500',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Santorini Views', 
    country: 'Greece',
    emoji: '🏖️', 
    color: 'from-blue-400 to-indigo-500',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Dubai Luxury', 
    country: 'UAE',
    emoji: '🏙️', 
    color: 'from-yellow-400 to-orange-500',
    image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Maldives Paradise', 
    country: 'Maldives',
    emoji: '🌊', 
    color: 'from-cyan-400 to-blue-500',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'New York City', 
    country: 'USA',
    emoji: '🗽', 
    color: 'from-gray-400 to-blue-500',
    image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'London Heritage', 
    country: 'UK',
    emoji: '🏰', 
    color: 'from-purple-400 to-indigo-500',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  { 
    name: 'Rome History', 
    country: 'Italy',
    emoji: '🏛️', 
    color: 'from-amber-400 to-red-500',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  }
];

const AI_CAPABILITIES = [
  {
    icon: Brain,
    title: 'Personalization Engine',
    description: 'Our neural network analyzes your travel persona - from "Early Bird Explorer" to "Night Owl Foodie" - creating itineraries that match your unique rhythm and preferences',
    feature: 'Travel DNA Analysis',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: Globe,
    title: 'Real-Time Intelligence',
    description: 'Live data integration from local weather, events, crowd levels, and insider tips ensures your itinerary adapts to current conditions for optimal experiences',
    feature: 'Dynamic Optimization',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Sparkles,
    title: 'Conversational Refinement',
    description: 'Chat naturally with our AI to refine your trip: "Make Day 3 more relaxed" or "Find vegetarian restaurants" - your itinerary evolves through conversation',
    feature: 'Natural Language Processing',
    color: 'from-emerald-500 to-teal-600'
  }
];

const TRAVEL_PERSONAS = [
  {
    type: 'Early Bird Explorer',
    emoji: '🌅',
    description: 'Sunrise adventures, morning markets, peaceful temples',
    color: 'from-orange-400 to-yellow-500'
  },
  {
    type: 'Night Owl Foodie',
    emoji: '🌙',
    description: 'Evening culinary tours, rooftop bars, night markets',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    type: 'Culture Curator',
    emoji: '🎭',
    description: 'Museums, galleries, historical sites, local traditions',
    color: 'from-rose-400 to-pink-500'
  },
  {
    type: 'Adventure Seeker',
    emoji: '⛰️',
    description: 'Hiking trails, extreme sports, off-beaten paths',
    color: 'from-green-400 to-emerald-500'
  }
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Travel Blogger',
    location: 'Mumbai',
    text: 'TripCraft\'s AI understood my travel style perfectly. The Rajasthan itinerary was flawless - every recommendation was spot-on!',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    trip: 'Rajasthan Heritage Tour'
  },
  {
    name: 'Arjun Patel',
    role: 'Software Engineer',
    location: 'Bangalore',
    text: 'Voice chat feature is revolutionary! Planned my entire Kerala trip just by talking. Saved me 10+ hours of research.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    trip: 'Kerala Backwaters'
  },
  {
    name: 'Sneha Gupta',
    role: 'Marketing Manager',
    location: 'Delhi',
    text: 'The personalization is incredible. It knew I prefer boutique hotels and suggested perfect hidden gems in Goa.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    trip: 'Goa Beach Getaway'
  }
];

const TRUST_METRICS = [
  { metric: '100K+', label: 'Happy Travelers', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { metric: '500+', label: 'Global Destinations', icon: Globe, color: 'from-green-500 to-emerald-500' },
  { metric: '4.9★', label: 'User Rating', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { metric: '60s', label: 'Average Planning Time', icon: Clock, color: 'from-purple-500 to-indigo-500' },
  { metric: '99.9%', label: 'Uptime Reliability', icon: Shield, color: 'from-red-500 to-pink-500' },
  { metric: '100%', label: 'Free to Start', icon: Award, color: 'from-teal-500 to-cyan-500' }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate AI capabilities
    const interval = setInterval(() => {
      setActiveCapability((prev) => (prev + 1) % AI_CAPABILITIES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-0 font-body overflow-hidden">
      {/* Hero Section - Enhanced */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 via-cyan-700 to-teal-800 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600/95 via-cyan-700/95 to-teal-800/95"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-turquoise-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Scrolling Destinations Banner - Enhanced */}
          <div className="mb-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="relative h-64 overflow-hidden bg-white/10 backdrop-blur-sm border-y border-white/20 shadow-2xl">
              <div className="absolute inset-0 flex items-center">
                <div className="animate-scroll-destinations flex items-center gap-6 whitespace-nowrap">
                  {/* First Set */}
                  {POPULAR_DESTINATIONS.map((dest, index) => (
                    <div key={`first-${index}`} className="relative flex items-center gap-4 px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform overflow-hidden min-w-[320px] h-48">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={dest.image} 
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-4">
                        <span className="text-4xl drop-shadow-lg">{dest.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-bold text-lg drop-shadow-lg">{dest.name}</div>
                          <div className="text-white/90 text-sm drop-shadow-lg">{dest.country}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Duplicate Set for Seamless Loop */}
                  {POPULAR_DESTINATIONS.map((dest, index) => (
                    <div key={`second-${index}`} className="relative flex items-center gap-4 px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform overflow-hidden min-w-[320px] h-48">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={dest.image} 
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-4">
                        <span className="text-4xl drop-shadow-lg">{dest.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-bold text-lg drop-shadow-lg">{dest.name}</div>
                          <div className="text-white/90 text-sm drop-shadow-lg">{dest.country}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-teal-800 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-teal-800 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-12">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-300 bg-clip-text text-transparent animate-gradient">
                From vision to voyage;
              </span>
              <br />
              <span className="text-white">perfected by AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your travel dreams into <span className="text-cyan-300 font-semibold">personalized itineraries</span> in seconds. 
              Every destination, perfectly planned with AI intelligence.
            </p>
          </div>

          {/* Smart CTA Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-16">
            {/* Primary CTA */}
            <button
              onClick={onGetStarted}
              className="group relative flex items-center justify-between w-full lg:w-96 px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white rounded-2xl hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 font-display"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">Meet Your AI Companion</div>
                  <div className="text-xs opacity-90">Your personalized travel assistant</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </button>

            {/* Voice Chat CTA */}
            <button
              onClick={() => setShowVoiceChat(true)}
              className="group relative flex items-center justify-between w-full lg:w-96 px-8 py-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 font-display"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">Voice Chat with AI</div>
                  <div className="text-xs opacity-90">Speak to plan your trip</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* The AI Difference Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/50 to-cyan-100/50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The AI Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience next-generation travel planning powered by advanced AI that truly understands you
            </p>
          </div>

          {/* Interactive AI Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {AI_CAPABILITIES.map((capability, index) => {
              const IconComponent = capability.icon;
              const isActive = activeCapability === index;
              
              return (
                <div 
                  key={index} 
                  className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200 shadow-2xl scale-105' 
                      : 'bg-gradient-to-br from-white to-teal-50 border border-teal-100 hover:shadow-xl hover:-translate-y-2'
                  }`}
                  onClick={() => setActiveCapability(index)}
                >
                  {/* Animated Background */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${capability.color} opacity-5 rounded-3xl animate-pulse`}></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${capability.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className={`text-sm font-bold bg-gradient-to-r ${capability.color} bg-clip-text text-transparent mb-2 uppercase tracking-wide`}>
                        {capability.feature}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-gray-900">{capability.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-center">{capability.description}</p>
                    
                    {isActive && (
                      <div className="mt-6 flex justify-center">
                        <div className={`bg-gradient-to-r ${capability.color} w-12 h-1 rounded-full`}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Travel Personas Section */}
          <div className="bg-gradient-to-br from-white to-teal-50 rounded-3xl p-8 border border-teal-100 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
                Your Travel Persona, Understood
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI identifies your unique travel style and crafts experiences that resonate with who you are
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRAVEL_PERSONAS.map((persona, index) => (
                <div key={index} className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${persona.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {persona.emoji}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{persona.type}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{persona.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Augmented Reality Preview Section - New */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-300 uppercase tracking-wide">Coming Soon</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Virtual Destination Preview
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Step into your destination before you travel. Our AR technology lets you virtually explore landmarks, 
                hotels, and experiences right from your phone - making every booking decision confident and informed.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">3D landmark previews in your space</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">Virtual hotel room walkthroughs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span className="text-gray-300">Interactive destination experiences</span>
                </div>
              </div>
              
              <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                <Smartphone className="h-5 w-5" />
                Try AR Demo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* AR Demo Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Mock AR Interface */}
                  <div className="absolute inset-4 border-2 border-white/30 rounded-xl"></div>
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-semibold mb-2">Point your camera</p>
                    <p className="text-sm opacity-80">Watch destinations come to life</p>
                  </div>
                  
                  {/* Floating AR Elements */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-2xl">🗼</span>
                  </div>
                  <div className="absolute bottom-8 left-8 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="text-xl">🏛️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why TripCraft? - Consolidated Trust Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why 100K+ Travelers Choose TripCraft
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a community of smart travelers who've discovered the future of trip planning
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {TRUST_METRICS.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 font-display mb-1">{metric.metric}</div>
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Stories, Real Adventures
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how TripCraft has transformed travel experiences for thousands of adventurers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-white to-teal-50 p-8 rounded-3xl border border-teal-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic text-lg">"{testimonial.text}"</p>
                  
                  {/* Trip Badge */}
                  <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                    {testimonial.trip}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover shadow-lg"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-teal-600 font-medium">{testimonial.role}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Streamlined */}
      <section className="py-24 bg-gradient-to-r from-teal-800 via-cyan-800 to-teal-900 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-turquoise-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-8">
            Your Adventure Starts Now
          </h2>
          <p className="text-xl text-cyan-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the revolution in travel planning. Create your personalized itinerary in under 60 seconds 
            and discover why 100,000+ travelers trust TripCraft with their adventures.
          </p>

          {/* Primary CTA */}
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white rounded-2xl hover:from-amber-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold text-xl hover:scale-105 font-display mb-8"
          >
            <Calendar className="h-6 w-6" />
            Start Planning Your Dream Trip
            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Simple Trust Line */}
          <p className="text-cyan-200 text-lg">
            <span className="text-white font-semibold">100% Free to start</span> • No credit card required • 4.9★ rating
          </p>
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