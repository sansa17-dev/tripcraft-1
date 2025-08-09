/**
 * Enhanced loading spinner with travel-themed animations
 * Provides engaging feedback during itinerary generation
 */

import React from 'react';
import { Plane, MapPin, Compass } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  showTravelIcons?: boolean;
}

export function LoadingSpinner({ message = "Loading...", showTravelIcons = false }: LoadingSpinnerProps) {
  if (showTravelIcons) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        {/* Animated Travel Icons */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 animate-spin">
            <Plane className="h-8 w-8 text-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
            <MapPin className="h-6 w-6 text-indigo-600 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
          </div>
          <div className="absolute inset-0 animate-pulse">
            <Compass className="h-12 w-12 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Crafting Your Perfect Journey</h3>
          <p className="text-gray-600 animate-pulse">{message}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
      <span className="text-gray-600">{message}</span>
    </div>
  );
}