/**
 * Branded header component with travel imagery and professional styling
 * Creates an inspiring first impression for TripCraft
 */

import React from 'react';
import { Plane, Compass, Map, Globe } from 'lucide-react';

interface BrandedHeaderProps {
  showHero?: boolean;
  title?: string;
  subtitle?: string;
}

export function BrandedHeader({ showHero = false, title, subtitle }: BrandedHeaderProps) {
  if (!showHero) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
          <Plane className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TripCraft
          </h1>
          <p className="text-sm text-gray-600">AI-Powered Travel Planning</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1600&h=800&fit=crop"
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
          <Map className="h-32 w-32 text-white animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10">
          <Globe className="h-20 w-20 text-white animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
              <Plane className="h-12 w-12 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-white mb-2">
                TripCraft
              </h1>
              <p className="text-xl text-blue-100">AI-Powered Travel Planning</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {title || "Craft Your Perfect Journey"}
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {subtitle || "Transform your travel dreams into detailed, personalized itineraries with the power of AI. Every destination, every preference, perfectly planned."}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Planning</h3>
                <p className="text-blue-100 text-sm">AI-powered recommendations tailored to your preferences and budget</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Detailed Itineraries</h3>
                <p className="text-blue-100 text-sm">Day-by-day plans with activities, dining, and accommodation suggestions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Destinations</h3>
                <p className="text-blue-100 text-sm">Explore any destination worldwide with local insights and tips</p>
              </div>
            </div>
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
    </div>
  );
}