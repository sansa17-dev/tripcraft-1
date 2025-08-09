/**
 * Google Places Autocomplete component
 * Provides location search with Google Maps integration
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Loader2 } from 'lucide-react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  className?: string;
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  className = ''
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey) {
          setError('Google Maps API key not configured');
          setIsLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            types: ['(cities)'],
            fields: ['place_id', 'formatted_address', 'name', 'geometry']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
              onChange(place.formatted_address, place);
            }
          });

          autocompleteRef.current = autocomplete;
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        // Check if it's a billing error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('BillingNotEnabledMapError') || errorMessage.includes('billing')) {
          setError('Google Maps billing not enabled - using text input');
        } else {
          setError('Failed to load Google Maps');
        }
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (error) {
    // Fallback to regular text input if Google Maps fails
    return (
      <div>
        <label htmlFor={`fallback-${label}`} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id={`fallback-${label}`}
            type="text"
            required={required}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
          />
        </div>
        <p className="text-xs text-amber-600 mt-1">
          {error.includes('billing') ? 
            'Google Maps requires billing to be enabled - using text input' : 
            'Google Maps unavailable - using text input'
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={`places-${label}`} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 animate-spin z-10" />
        )}
        <input
          ref={inputRef}
          id={`places-${label}`}
          type="text"
          required={required}
          value={value}
          onChange={handleInputChange}
          placeholder={isLoading ? 'Loading Google Maps...' : placeholder}
          disabled={isLoading}
          className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed ${className}`}
        />
      </div>
      {!isLoading && (
        <p className="text-xs text-gray-500 mt-1">
          {error ? 'Manual text input' : 'Start typing to search for locations'}
        </p>
      )}
    </div>
  );
}