/**
 * Travel preferences form component
 * Collects user input for itinerary generation
 */

import React from 'react';
import { Calendar, Users, Wallet, Home, FileText } from 'lucide-react';
import { TravelPreferences, TravelPersona } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';
import { TravelPersonaQuiz } from './TravelPersonaQuiz';
import { isFeatureEnabled } from '../utils/featureFlags';

interface TravelFormProps {
  preferences: TravelPreferences;
  onPreferencesChange: (preferences: TravelPreferences) => void;
  onPersonaChange?: (persona: TravelPersona) => void;
  userPersona?: TravelPersona | null;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  isAuthenticated: boolean;
}

export function TravelForm({ preferences, onPreferencesChange, onPersonaChange, userPersona, onSubmit, isGenerating, isAuthenticated }: TravelFormProps) {
  const [showPersonaQuiz, setShowPersonaQuiz] = React.useState(false);

  // Initialize persona from userPersona prop or preferences
  const [currentPersona, setCurrentPersona] = React.useState<TravelPersona>(() => {
    return userPersona || preferences.travelPersona || {
      timePreference: '',
      socialStyle: '',
      culturalInterest: '',
      foodAdventure: '',
      planningStyle: '',
      interests: preferences.interests || []
    };
  });

  // Update persona when userPersona prop changes
  React.useEffect(() => {
    if (userPersona) {
      setCurrentPersona(userPersona);
    }
  }, [userPersona]);

  /**
   * Updates a single field in the preferences object
   */
  const updateField = (field: keyof TravelPreferences, value: any) => {
    onPreferencesChange({
      ...preferences,
      [field]: value
    });
  };

  /**
   * Updates the travel persona
   */
  const updatePersona = (persona: TravelPersona) => {
    setCurrentPersona(persona);
    // Extract interests from persona and update main preferences
    if (persona.interests) {
      updateField('interests', persona.interests);
    }
    updateField('travelPersona', persona);
    // Notify parent component of persona changes
    if (onPersonaChange) {
      onPersonaChange(persona);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-content-narrow mx-auto">
      <h2 className="font-display text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary-600" />
        Plan Your Trip
      </h2>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Origin */}
        <LocationAutocomplete
          id="origin"
          label="Where are you travelling from?"
          value={preferences.origin}
          onChange={(value) => updateField('origin', value)}
          placeholder="e.g., Mumbai, Delhi, Bangalore"
          required
          types={['(cities)']}
        />

        {/* Destination */}
        <LocationAutocomplete
          id="destination"
          label="Where would you like to go?"
          value={preferences.destination}
          onChange={(value) => updateField('destination', value)}
          placeholder="e.g., Goa, Kerala, Rajasthan"
          required
          types={['(cities)']}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              required
              value={preferences.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-3">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              required
              value={preferences.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              min={preferences.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Budget and Travelers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Budget Level (per traveler per day) *
            </label>
            <select
              id="budget"
              required
              value={preferences.budget}
              onChange={(e) => updateField('budget', e.target.value as TravelPreferences['budget'])}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">Select budget range</option>
              <option value="budget">Budget ($50-100/day)</option>
              <option value="mid-range">Mid-range ($100-200/day)</option>
              <option value="luxury">Luxury ($200+/day)</option>
            </select>
          </div>
          <div>
            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of Travelers *
            </label>
            <input
              type="number"
              id="travelers"
              required
              min="1"
              max="20"
              value={preferences.travelers}
              onChange={(e) => updateField('travelers', parseInt(e.target.value))}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Accommodation Type */}
        <div>
          <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Accommodation Preference
          </label>
          <select
            id="accommodationType"
            value={preferences.accommodationType}
            onChange={(e) => updateField('accommodationType', e.target.value as TravelPreferences['accommodationType'])}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="any">Any type</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="airbnb">Airbnb/Holiday Rental</option>
            <option value="resort">Resort</option>
            <option value="villa">Villa</option>
            <option value="mix">Mix of options as per budget</option>
          </select>
        </div>

        {/* Vacation Pace */}
        <div>
          <label htmlFor="vacationPace" className="block text-sm font-medium text-gray-700 mb-3">
            What kind of holiday do you prefer? *
          </label>
          <select
            id="vacationPace"
            required
            value={preferences.vacationPace}
            onChange={(e) => updateField('vacationPace', e.target.value as TravelPreferences['vacationPace'])}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">Select holiday pace</option>
            <option value="relaxed">Relaxed - Take it slow, enjoy leisure time</option>
            <option value="balanced">Balanced - Mix of activities and relaxation</option>
            <option value="action-packed">Action-packed - Maximise experiences and activities</option>
          </select>
        </div>

        {/* Travel Persona Quiz */}
        {isFeatureEnabled('FEATURE_TRAVEL_PERSONA') && (
          <TravelPersonaQuiz
            persona={currentPersona}
            onPersonaChange={updatePersona}
            isExpanded={showPersonaQuiz}
            onToggleExpanded={() => setShowPersonaQuiz(!showPersonaQuiz)}
          />
        )}

        {/* Submit Button */}
        {!isAuthenticated ? (
          <div className="text-center p-6 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-primary-700 mb-4 leading-relaxed">Please sign in to generate your personalized itinerary</p>
            <button
              type="button"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
              onClick={() => {/* This would trigger auth modal */}}
            >
              Sign In
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-5 px-8 rounded-2xl text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-display"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Generating...</span>
              </div>
            ) : (
              <span className="text-lg">Generate Itinerary</span>
            )}
          </button>
        )}
      </form>
    </div>
  );
}