/**
 * TripCraft - Travel Itinerary Generator MVP
 * 
 * Core functionality for generating personalized travel itineraries using ChatGPT API.
 * Features: travel preference form, API integration, results display, error handling.
 * 
 * This MVP focuses on essential functionality with clean, readable interface design.
 */

import React, { useState } from 'react';
import { Plane, AlertTriangle, RefreshCw } from 'lucide-react';
import { TravelPreferences, GeneratedItinerary } from './types';
import { generateItinerary, generateDemoItinerary } from './services/itineraryService';
import { TravelForm } from './components/TravelForm';
import { ItineraryResults } from './components/ItineraryResults';

function App() {
  // State management for application
  const [preferences, setPreferences] = useState<TravelPreferences>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'mid-range',
    interests: [],
    travelers: 1,
    accommodationType: 'any',
    vacationPace: 'balanced',
    additionalNotes: ''
  });

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyNotice, setShowApiKeyNotice] = useState(false);

  /**
   * Handles form submission and itinerary generation
   */
  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setItinerary(null);
    setIsGenerating(true);
    setShowApiKeyNotice(false);

    try {
      // Validate required fields
      if (!preferences.origin || !preferences.destination || !preferences.startDate || !preferences.endDate || !preferences.vacationPace) {
        throw new Error('Please fill in all required fields');
      }

      // Validate date range
      const startDate = new Date(preferences.startDate);
      const endDate = new Date(preferences.endDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }

      // Check for reasonable trip duration (1-30 days)
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (duration > 30) {
        throw new Error('Maximum trip duration is 30 days. Please select a shorter date range.');
      }

      console.log('Generating itinerary with preferences:', preferences);

      // Attempt to generate itinerary via API
      const result = await generateItinerary(preferences);

      if (result.success && result.data) {
        setItinerary(result.data);
      } else {
        // Check if it's an API key issue
        if (result.error?.includes('API key')) {
          setShowApiKeyNotice(true);
          // Generate demo itinerary as fallback
          const demoItinerary = generateDemoItinerary(preferences);
          setItinerary(demoItinerary);
        } else {
          throw new Error(result.error || 'Failed to generate itinerary');
        }
      }

    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Resets the form and results
   */
  const handleReset = () => {
    setItinerary(null);
    setError(null);
    setShowApiKeyNotice(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TripCraft</h1>
                <p className="text-sm text-gray-600">AI-Powered Travel Itinerary Generator</p>
              </div>
            </div>
            
            {itinerary && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Plan New Trip
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Notice */}
        {showApiKeyNotice && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-medium mb-1">Demo Mode Active</h3>
                <p className="text-amber-700 text-sm mb-2">
                  To use the full ChatGPT integration, add your OpenAI API key as the environment variable 
                  <code className="bg-amber-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code>.
                </p>
                <p className="text-amber-700 text-sm">
                  The itinerary below is a demonstration of the expected format and functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {!itinerary ? (
            /* Travel Preferences Form */
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Create Your Perfect Travel Itinerary
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Tell us about your travel preferences and we'll generate a personalised day-by-day 
                  itinerary with activities, dining recommendations, and local insights.
                </p>
              </div>

              <TravelForm
                preferences={preferences}
                onPreferencesChange={setPreferences}
                onSubmit={handleGenerateItinerary}
                isGenerating={isGenerating}
              />
            </div>
          ) : (
            /* Generated Itinerary Results */
            <ItineraryResults itinerary={itinerary} />
          )}
        </div>

        {/* Footer Info */}
        {!itinerary && (
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              TripCraft uses AI to create personalised travel itineraries based on your preferences. 
              Generated suggestions should be verified for accuracy and availability.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;