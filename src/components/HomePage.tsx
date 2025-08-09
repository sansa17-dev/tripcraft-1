/**
 * Modern, streamlined homepage with enhanced UX
 * Focuses on clear value proposition and smooth user journey
 */

import React from 'react';
import { 
  Plane, MapPin, Clock, Users, Star, Compass, Globe, Zap, 
  Shield, Heart, ArrowRight, CheckCircle, Quote, Sparkles,
  Calendar, DollarSign, Camera, Mountain
} from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Planning',
    description: 'Get personalized itineraries in minutes, not hours. Our AI understands your preferences and creates perfect travel plans.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    title: 'Global Destinations',
    description: 'Explore anywhere in the world with local insights, hidden gems, and authentic cultural experiences.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Heart,
    title: 'Fully Customizable',
    description: 'Edit every detail of your itinerary. Add, remove, or modify activities to match your exact preferences.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Shield,
    title: 'Save & Access Anywhere',
    description: 'Your itineraries are safely stored in the cloud. Access them from any device, anytime, anywhere.',
    color: 'from-green-500 to-emerald-500'
  }
];

const DESTINATIONS = [
  {
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Stunning sunsets & white villages',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Ancient temples & cherry blossoms',
    color: 'from-pink-600 to-rose-600'
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Tropical paradise & rich culture',
    color: 'from-green-600 to-emerald-600'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    location: 'Singapore',
    text: 'TripCraft planned our perfect 10-day European adventure. Every recommendation was spot-on!',
    trip: '10-day Europe Tour',
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    location: 'Mexico City',
    text: 'Saved me hours of research and gave me a trip I\'ll never forget. The AI is incredible.',
    trip: '7-day Japan Journey',
    avatar: 'MR'
  },
  {
    name: 'Emma Thompson',
    location: 'London',
    text: 'Perfect balance of culture, food, and relaxation. Our Bali trip was beautifully planned.',
    trip: '8-day Bali Getaway',
    avatar: 'ET'
  }
];

const STATS = [
  { number: '50K+', label: 'Happy Travelers', icon: Users },
  { number: '200+', label: 'Destinations', icon: Globe },
  { number: '4.9★', label: 'User Rating', icon: Star },
  { number: '<2min', label: 'Planning Time', icon: Clock }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell Us Your Dreams',
    description: 'Share your destination, dates, budget, and interests',
    icon: Heart,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    step: '02',
    title: 'AI Creates Magic',
    description: 'Our AI crafts a personalized day-by-day itinerary',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    step: '03',
    title: 'Customize & Go',
    description: 'Edit details, save your plan, and start your adventure',
    icon: Plane,
    color: 'from-green-500 to-emerald-500'
  }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 opacity-20 animate-float">
              <Compass className="h-16 w-16 text-white" />
            </div>
            <div className="absolute top-40 right-20 opacity-20 animate-float-delayed">
              <MapPin className="h-20 w-20 text-white" />
            </div>
            <div className="absolute bottom-32 left-1/4 opacity-20 animate-float-slow">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <div className="absolute top-1/3 right-1/4 opacity-20 animate-float">
              <Camera className="h-14 w-14 text-white" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-20 animate-float-delayed">
              <Mountain className="h-18 w-18 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Perfect Trip
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your travel dreams into detailed, personalized itineraries in minutes. 
              Every destination, perfectly planned with AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={onGetStarted}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
              >
                <Plane className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Start Planning Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              {!isAuthenticated && (
                <button
                  onClick={onSignIn}
                  className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-medium"
                >
                  Already have an account?
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Instant results
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From dream to itinerary in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6 group-hover:text-gray-200 transition-colors duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </div>
                
                {/* Connection Line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Why Choose TripCraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing places with AI-crafted itineraries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DESTINATIONS.map((destination, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${destination.color} rounded-full text-xs font-medium mb-2`}>
                    {destination.country}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-white/90 text-sm">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Loved by Travelers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-60" />
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="text-blue-600 text-sm font-medium">
                  {testimonial.trip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Ready for Adventure?</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Dream Trip
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Awaits
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust TripCraft to plan their perfect journeys. 
            Start creating memories that last a lifetime.
          </p>

          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
          >
            <Plane className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Start Your Journey
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>
    </div>
  );
}