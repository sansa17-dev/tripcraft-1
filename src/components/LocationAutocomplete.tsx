/**
 * Google Places Autocomplete component
 * Provides location suggestions using Google Places API
 */

import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  id: string;
  types?: string[];
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

// Module-level variables to track Google Maps loading state
let googleMapsScriptLoadedPromise: Promise<void> | null = null;
let isGoogleMapsLoaded = false;

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  id,
  types = ['(cities)']
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGooglePlaces = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      
      if (!apiKey) {
        console.warn('Google Places API key not found. Location autocomplete will not work.');
        return;
      }

      // Check if Google Maps is already fully loaded
      if (isGoogleMapsLoaded && window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete();
        return;
      }

      // If loading is already in progress, wait for it
      if (googleMapsScriptLoadedPromise) {
        try {
          await googleMapsScriptLoadedPromise;
          if (isGoogleMapsLoaded) {
            initializeAutocomplete();
          }
        } catch (error) {
          console.error('Error waiting for Google Places API:', error);
        }
        return;
      }

      setIsLoading(true);

      // Create a promise to track the loading process
      googleMapsScriptLoadedPromise = new Promise((resolve, reject) => {
        try {
          // Check if script already exists
          const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
          if (existingScript) {
            // Script exists, wait for it to load
            if (window.google && window.google.maps && window.google.maps.places) {
              isGoogleMapsLoaded = true;
              resolve();
            } else {
              // Wait for the existing script to load
              const checkLoaded = () => {
                if (window.google && window.google.maps && window.google.maps.places) {
                  isGoogleMapsLoaded = true;
                  resolve();
                } else {
                  setTimeout(checkLoaded, 100);
                }
              };
              checkLoaded();
            }
            return;
          }

          // Load Google Maps JavaScript API
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
          script.async = true;
          script.defer = true;

          // Set up callback
          window.initGooglePlaces = () => {
            isGoogleMapsLoaded = true;
            setIsGoogleLoaded(true);
            resolve();
            // Clean up the global callback
            delete window.initGooglePlaces;
          };

          script.onerror = () => {
            reject(new Error('Failed to load Google Maps API'));
          };

          document.head.appendChild(script);
        } catch (error) {
          reject(error);
        }
      });

      try {
        await googleMapsScriptLoadedPromise;
        initializeAutocomplete();
      } catch (error) {
        console.error('Error loading Google Places API:', error);
        googleMapsScriptLoadedPromise = null; // Reset on error to allow retry
      } finally {
        setIsLoading(false);
      }
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      // Create autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: types,
          fields: ['formatted_address', 'name', 'place_id', 'geometry']
        }
      );

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place && (place.formatted_address || place.name)) {
          const locationName = place.formatted_address || place.name;
          onChange(locationName);
        }
      });
    };

    loadGooglePlaces();
  }, [onChange, types]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle input blur to ensure value is retained
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ensure the current value is preserved
    if (e.target.value !== value) {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          id={id}
          required={required}
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          autoComplete="off"
        />
        {!isGoogleLoaded && !isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-xs text-gray-400">Manual</span>
          </div>
        )}
      </div>
      {!import.meta.env.VITE_GOOGLE_PLACES_API_KEY && (
        <p className="mt-2 text-xs text-amber-600">
          Add VITE_GOOGLE_PLACES_API_KEY to enable location suggestions
        </p>
      )}
    </div>
  );
}