/**
 * Travel preferences form component
 * Collects user input for itinerary generation
 */

import React from 'react';
import { Calendar, MapPin, Users, Wallet, Heart, Home, FileText } from 'lucide-react';
import { TravelPreferences } from '../types';

interface TravelFormProps {
  preferences: TravelPreferences;
  onPreferencesChange: (preferences: TravelPreferences) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  isAuthenticated: boolean;
}

const INTEREST_OPTIONS = [
  'Culture & Heritage',
  'Food & Dining',
  'Nature & Outdoors',
  'Arts & Museums',
  'Nightlife & Entertainment',
  'Shopping',
  'Adventure Sports',
  'Photography',
  'Architecture',
  'Local Markets & Bazaars'
];

export function TravelForm({ preferences, onPreferencesChange, onSubmit, isGenerating, isAuthenticated }: TravelFormProps) {
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
   * Handles interest selection/deselection
   */
  const toggleInterest = (interest: string) => {
    const currentInterests = preferences.interests || [];
    const isSelected = currentInterests.includes(interest);
    
    const newInterests = isSelected
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    updateField('interests', newInterests);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 flex items-center gap-2">
        <MapPin className="h-6 w-6 text-blue-600" />
        Plan Your Trip
      </h2>

      <form onSubmit={onSubmit} className="space-y-6 relative z-10">
        {/* Origin */}
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            Where are you travelling from? *
          </label>
          <input
            type="text"
            id="origin"
            required
            value={preferences.origin}
            onChange={(e) => updateField('origin', e.target.value)}
            placeholder="e.g., Mumbai, Delhi, Bangalore"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
            Where would you like to go? *
          </label>
          <input
            type="text"
            id="destination"
            required
            value={preferences.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            placeholder="e.g., Goa, Kerala, Rajasthan"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              required
              value={preferences.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              min={preferences.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Budget and Travelers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Budget Level (per traveller per day) *
            </label>
            <select
              id="budget"
              required
              value={preferences.budget}
              onChange={(e) => updateField('budget', e.target.value as TravelPreferences['budget'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select budget range</option>
              <option value="budget">Budget (₹2,000-4,000/day)</option>
              <option value="mid-range">Mid-range (₹4,000-8,000/day)</option>
              <option value="luxury">Luxury (₹8,000+/day)</option>
            </select>
          </div>
          <div>
            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Number of Travellers *
            </label>
            <input
              type="number"
              id="travelers"
              required
              min="1"
              max="20"
              value={preferences.travelers}
              onChange={(e) => updateField('travelers', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Accommodation Type */}
        <div>
          <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Home className="h-4 w-4" />
            Accommodation Preference
          </label>
          <select
            id="accommodationType"
            value={preferences.accommodationType}
            onChange={(e) => updateField('accommodationType', e.target.value as TravelPreferences['accommodationType'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
          <label htmlFor="vacationPace" className="block text-sm font-medium text-gray-700 mb-2">
            What kind of holiday do you prefer? *
          </label>
          <select
            id="vacationPace"
            required
            value={preferences.vacationPace}
            onChange={(e) => updateField('vacationPace', e.target.value as TravelPreferences['vacationPace'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select holiday pace</option>
            <option value="relaxed">Relaxed - Take it slow, enjoy leisure time</option>
            <option value="balanced">Balanced - Mix of activities and relaxation</option>
            <option value="action-packed">Action-packed - Maximise experiences and activities</option>
          </select>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
            <Heart className="h-4 w-4" />
            What interests you? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Additional Notes (Optional)
          </label>
          <textarea
            id="additionalNotes"
            rows={3}
            value={preferences.additionalNotes || ''}
            onChange={(e) => updateField('additionalNotes', e.target.value)}
            placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        {isAuthenticated ? (
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Your Itinerary...
              </div>
            ) : (
              <span className="text-lg">Generate Itinerary</span>
            )}
          </button>
        ) : (
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="text-lg">Sign In to Generate Itinerary</span>
          </button>
        )}
      </form>
    </div>
  );
}