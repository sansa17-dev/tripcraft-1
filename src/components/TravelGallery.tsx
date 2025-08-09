/**
 * Travel gallery component showcasing beautiful destinations
 * Provides visual inspiration and professional brand presence
 */

import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

interface Destination {
  name: string;
  country: string;
  image: string;
  rating: number;
  duration: string;
  description: string;
}

const FEATURED_DESTINATIONS: Destination[] = [
  {
    name: "Santorini",
    country: "Greece",
    image: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.9,
    duration: "5-7 days",
    description: "Stunning sunsets and white-washed villages"
  },
  {
    name: "Kyoto",
    country: "Japan",
    image: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.8,
    duration: "4-6 days",
    description: "Ancient temples and cherry blossoms"
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.7,
    duration: "7-10 days",
    description: "Tropical paradise with rich culture"
  },
  {
    name: "Iceland",
    country: "Nordic",
    image: "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.9,
    duration: "8-12 days",
    description: "Northern lights and dramatic landscapes"
  },
  {
    name: "Maldives",
    country: "Indian Ocean",
    image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.8,
    duration: "5-8 days",
    description: "Crystal clear waters and luxury resorts"
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    rating: 4.9,
    duration: "6-9 days",
    description: "Majestic mountains and pristine lakes"
  }
];

export function TravelGallery() {
  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Discover Amazing Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get inspired by these popular destinations and let TripCraft create the perfect itinerary for your next adventure
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_DESTINATIONS.map((destination, index) => (
            <div 
              key={destination.name}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{destination.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.country}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {destination.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{destination.duration}</span>
                  </div>
                  
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
                    Plan Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Plan Your Dream Trip?
            </h3>
            <p className="text-gray-600 mb-6">
              Tell us your preferences and let our AI create a personalized itinerary just for you
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg">
              Start Planning Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}