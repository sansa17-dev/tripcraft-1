/**
 * Redesigned homepage with modern UX, no duplicates, and smart user flow
 * Features progressive disclosure, micro-interactions, and conversion optimization
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Play, ChevronDown, Sparkles, Zap, Globe, Users, 
  Star, Heart, Clock, Shield, Mic, MessageCircle, Calendar, MapPin, DollarSign
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

const SMART_FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Intelligence',
    description: 'Advanced AI analyzes 1M+ travel patterns to craft your perfect itinerary in under 60 seconds',
    metric: '60s',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Global Expertise',
    description: 'Access to 500+ destinations with real-time local insights and hidden gems from travel experts',
    metric: '500+',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Community Wisdom',
    description: 'Powered by experiences from 100K+ travelers and continuously learning from user feedback',
    metric: '100K+',
    color: 'from-purple-400 to-pink-500'
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

const TRUST_INDICATORS = [
  { metric: '100K+', label: 'Happy Travelers', icon: Users },
  { metric: '500+', label: 'Destinations', icon: Globe },
  { metric: '4.9★', label: 'User Rating', icon: Star },
  { metric: '99.9%', label: 'Uptime', icon: Shield }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % SMART_FEATURES.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-0 font-body overflow-hidden">
      {/* Hero Section - Redesigned with Smart UX */}
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
          
          {/* Scrolling Destinations Banner */}
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

          {/* Main Headline with Smart Typography */}
          <div className="mb-12">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
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

            {/* Value Proposition Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  60-second planning
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  100% Free to start
                </span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  100K+ travelers
                </span>
              </div>
            </div>
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

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {TRUST_INDICATORS.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent className="h-6 w-6 text-white mr-2 group-hover:scale-110 transition-transform" />
                    <div className="text-3xl md:text-4xl font-bold text-white font-display">{indicator.metric}</div>
                  </div>
                  <div className="text-white/80 text-sm">{indicator.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smart Features Section - Interactive */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/50 to-cyan-100/50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why 100K+ Travelers Choose TripCraft
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of travel planning with our cutting-edge AI technology that learns and adapts to your preferences
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SMART_FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div 
                  key={index} 
                  className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200 shadow-2xl scale-105' 
                      : 'bg-gradient-to-br from-white to-teal-50 border border-teal-100 hover:shadow-xl hover:-translate-y-2'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  {/* Animated Background */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5 rounded-3xl animate-pulse`}></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2`}>
                        {feature.metric}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
                    
                    {isActive && (
                      <div className="mt-6 flex justify-center">
                        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 w-12 h-1 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-white to-teal-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Stories, Real Adventures
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of travelers who've discovered their perfect journeys with TripCraft
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl border border-teal-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
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

      {/* Final CTA Section - Conversion Optimized */}
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
            Join 100,000+ travelers who've discovered their perfect journeys. 
            <span className="text-white font-semibold"> Create your personalized itinerary in under 60 seconds.</span>
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

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-cyan-200 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              60-second setup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              100K+ happy travelers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-white" />
              4.9★ rating
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