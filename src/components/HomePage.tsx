/**
 * Professional homepage with complete landing page sections
 * Includes hero, features, about, testimonials, and call-to-action
 */

import React from 'react';
import { 
  ArrowRight, CheckCircle, Play
} from 'lucide-react';
import { isFeatureEnabled } from '../utils/featureFlags';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

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

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-30 text-center">
          <div className="max-w-content-narrow mx-auto">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              Travel Plans Made Easy
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-loose-plus mb-12">
              Create personalized travel itineraries with AI. Every destination, perfectly planned in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-18">
              <button
                onClick={onGetStarted}
                className="flex items-center gap-3 px-10 py-5 bg-white text-primary-600 rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl font-semibold text-lg hover:scale-105 font-display"
              >
                Plan Your Trip
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => {/* Demo functionality */}}
                className="flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white transition-colors font-medium"
              >
                <Play className="h-4 w-4" />
                Try Demo
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

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* Destinations Section */}
      {isFeatureEnabled('FEATURE_LIVE_DESTINATIONS') && (
      <section className="py-26 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed-plus">
              Discover amazing destinations planned by thousands of travelers
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {DESTINATIONS.map((destination, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 flex-shrink-0 w-80"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-primary-600 text-sm font-medium">
                    {destination.trips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Final CTA Section */}
      <section className="py-26 bg-gradient-to-r from-primary-600 to-primary-700 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-content-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-8">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg text-white/90 mb-12 max-w-xl mx-auto leading-relaxed-plus">
            Create your personalized itinerary in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-3 px-10 py-5 bg-white text-primary-600 rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl font-semibold text-lg hover:scale-105 font-display"
            >
              Start Planning Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              No credit card required
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