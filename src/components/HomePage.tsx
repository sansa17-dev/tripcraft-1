/**
 * Professional homepage with complete landing page sections
 * Includes hero, features, about, testimonials, and call-to-action
 */

import React from 'react';
import { 
  Plane, MapPin, Clock, Users, Star, Compass, Globe, Zap, 
  Shield, Heart, ArrowRight, CheckCircle, Quote
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
    description: 'Advanced AI creates personalized itineraries tailored to your preferences, budget, and travel style.'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Generate detailed day-by-day plans in minutes, not hours. Focus on excitement, not research.'
  },
  {
    icon: Globe,
    title: 'Global Destinations',
    description: 'Explore any destination worldwide with local insights, hidden gems, and authentic experiences.'
  },
  {
    icon: Users,
    title: 'Group-Friendly',
    description: 'Perfect for solo travelers, couples, families, or groups. Customized for any travel party size.'
  },
  {
    icon: Shield,
    title: 'Reliable Recommendations',
    description: 'Curated suggestions for accommodations, dining, and activities based on real traveler experiences.'
  },
  {
    icon: Heart,
    title: 'Fully Customizable',
    description: 'Edit, modify, and personalize every aspect of your itinerary to match your exact preferences.'
  }
];

const DESTINATIONS = [
  {
    name: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    trips: '2,847 trips planned'
  },
  {
    name: 'Kyoto, Japan',
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    trips: '3,156 trips planned'
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    trips: '4,293 trips planned'
  },
  {
    name: 'Swiss Alps',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    trips: '1,892 trips planned'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    location: 'Singapore',
    rating: 5,
    text: 'TripCraft planned our perfect 10-day European adventure. Every recommendation was spot-on, and the day-by-day structure made our trip stress-free and amazing!',
    trip: '10-day Europe Tour'
  },
  {
    name: 'Michael Rodriguez',
    location: 'Mexico City',
    rating: 5,
    text: 'As a busy professional, I love how quickly TripCraft creates detailed itineraries. Saved me hours of research and gave me a trip I\'ll never forget.',
    trip: '7-day Japan Journey'
  },
  {
    name: 'Emma Thompson',
    location: 'London',
    rating: 5,
    text: 'The AI understood exactly what we wanted - a mix of culture, food, and relaxation. Our Bali trip was perfectly balanced and beautifully planned.',
    trip: '8-day Bali Getaway'
  }
];

const STATS = [
  { number: '50,000+', label: 'Trips Planned' },
  { number: '200+', label: 'Destinations' },
  { number: '4.9/5', label: 'User Rating' },
  { number: '95%', label: 'Satisfaction Rate' }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-700/80"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 opacity-10">
            <Compass className="h-24 w-24 text-white animate-pulse" />
          </div>
          <div className="absolute top-40 right-20 opacity-10">
            <MapPin className="h-32 w-32 text-white animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-10">
            <Globe className="h-20 w-20 text-white animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <div className="flex items-center justify-start gap-4 mb-8">
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Travel Journey
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your travel dreams into detailed, personalized itineraries with the power of AI. 
              Every destination, every preference, perfectly planned in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold text-lg transform hover:scale-105"
              >
                Plan Your Trip
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Why Choose TripCraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with AI-powered personalization and professional-grade itineraries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Portfolio Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of travelers who've discovered amazing destinations through TripCraft
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {DESTINATIONS.map((destination, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    {destination.trips}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600">Countries & Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
              <div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real travelers who've used TripCraft to create unforgettable journeys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 relative hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-60" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-blue-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.location}
                  </div>
                  <div className="text-blue-600 text-sm font-medium mt-1">
                    {testimonial.trip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripCraft to plan their perfect journeys. 
            Create your personalized itinerary in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold text-lg transform hover:scale-105"
            >
              Start Planning Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-blue-200 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Free to get started
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Instant results
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}