/**
 * User Profile Modal Component
 * Displays and allows editing of user travel persona
 */

import React, { useState, useEffect } from 'react';
import { X, User, Save, Trash2, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import { TravelPersona } from '../types';
import { TravelPersonaQuiz } from './TravelPersonaQuiz';
import { saveUserPersona, getUserPersona, deleteUserPersona } from '../services/userPersonaService';
import { useAuth } from '../hooks/useAuth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonaLoad?: (persona: TravelPersona) => void;
}

const PERSONA_LABELS = {
  timePreference: {
    'early-bird': 'Early Bird Explorer 🌅',
    'night-owl': 'Night Owl Adventurer 🌙',
    'flexible': 'Flexible Traveler 🔄'
  },
  socialStyle: {
    'social': 'Social Explorer 👥',
    'intimate': 'Intimate Moments Seeker 💫',
    'solo-friendly': 'Independent Wanderer 🚶'
  },
  culturalInterest: {
    'high': 'Culture Enthusiast 🎭',
    'moderate': 'Balanced Explorer ⚖️',
    'low': 'Experience Focused 🎯'
  },
  foodAdventure: {
    'adventurous': 'Foodie Explorer 🍜',
    'moderate': 'Selective Taster 🍽️',
    'familiar': 'Comfort Zone Diner 🥪'
  },
  planningStyle: {
    'structured': 'Detailed Planner 📋',
    'flexible': 'Flexible Framework 🗺️',
    'spontaneous': 'Spontaneous Adventurer 🎲'
  }
};

export function UserProfileModal({ isOpen, onClose, onPersonaLoad }: UserProfileModalProps) {
  const { user } = useAuth();
  const [persona, setPersona] = useState<TravelPersona>({
    timePreference: '',
    socialStyle: '',
    culturalInterest: '',
    foodAdventure: '',
    planningStyle: '',
    interests: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPersonaQuiz, setShowPersonaQuiz] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadUserPersona();
    }
  }, [isOpen, user]);

  const loadUserPersona = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getUserPersona(user.id);
      if (result.success && result.data) {
        setPersona(result.data);
       // Notify parent component that persona has been loaded
       if (onPersonaLoad) {
         onPersonaLoad(result.data);
       }
        // Check if persona has any data to determine if we should show in edit mode
        const hasData = Object.values(result.data).some(value => 
          Array.isArray(value) ? value.length > 0 : value !== ''
        );
        setIsEditing(!hasData);
      } else {
        setError(result.error || 'Failed to load profile');
        setIsEditing(true); // Start in edit mode if no profile exists
      }
    } catch (err) {
      setError('An error occurred while loading your profile');
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await saveUserPersona(persona, user.id);
      if (result.success) {
        setSuccess('Profile saved successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred while saving your profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Are you sure you want to delete your travel profile? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await deleteUserPersona(user.id);
      if (result.success) {
        setPersona({
          timePreference: '',
          socialStyle: '',
          culturalInterest: '',
          foodAdventure: '',
          planningStyle: '',
          interests: []
        });
        setIsEditing(true);
        setSuccess('Profile deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to delete profile');
      }
    } catch (err) {
      setError('An error occurred while deleting your profile');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    onClose();
  };

  const getPersonaLabel = (category: keyof typeof PERSONA_LABELS, value: string) => {
    return PERSONA_LABELS[category][value as keyof typeof PERSONA_LABELS[typeof category]] || value;
  };

  const getCompletionPercentage = () => {
    const fields = ['timePreference', 'socialStyle', 'culturalInterest', 'foodAdventure', 'planningStyle'] as const;
    const answeredFields = fields.filter(field => persona[field] && persona[field] !== '').length;
    const hasInterests = persona.interests && persona.interests.length > 0 ? 1 : 0;
    return Math.round(((answeredFields + hasInterests) / 6) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-2.5 rounded-xl">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-gray-900">
                Your Travel Profile
              </h2>
              <p className="text-sm text-gray-600">
                {getCompletionPercentage()}% complete • Personalize your travel experience
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-600">Loading your profile...</span>
            </div>
          ) : (
            <div className="p-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-800 font-medium">Success!</h3>
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {isEditing ? (
                /* Edit Mode - Show Quiz */
                <div>
                  <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h3 className="font-medium text-primary-800 mb-2">Complete Your Travel Profile</h3>
                    <p className="text-sm text-primary-700">
                      Answer these questions to help our AI create more personalized itineraries for all your future trips.
                    </p>
                  </div>

                  <TravelPersonaQuiz
                    persona={persona}
                    onPersonaChange={setPersona}
                    isExpanded={showPersonaQuiz}
                    onToggleExpanded={() => setShowPersonaQuiz(!showPersonaQuiz)}
                  />
                </div>
              ) : (
                /* View Mode - Show Profile Summary */
                <div className="space-y-6">
                  {/* Profile Overview */}
                  <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-6 border border-primary-100">
                    <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                      Your Travel Personality
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {persona.timePreference && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {getPersonaLabel('timePreference', persona.timePreference)}
                          </span>
                        </div>
                      )}
                      {persona.socialStyle && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {getPersonaLabel('socialStyle', persona.socialStyle)}
                          </span>
                        </div>
                      )}
                      {persona.culturalInterest && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {getPersonaLabel('culturalInterest', persona.culturalInterest)}
                          </span>
                        </div>
                      )}
                      {persona.foodAdventure && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {getPersonaLabel('foodAdventure', persona.foodAdventure)}
                          </span>
                        </div>
                      )}
                      {persona.planningStyle && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {getPersonaLabel('planningStyle', persona.planningStyle)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  {persona.interests && persona.interests.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                        Your Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {persona.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-primary-100 to-indigo-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {getCompletionPercentage() === 0 && (
                    <div className="text-center py-12">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No profile data yet</h3>
                      <p className="text-gray-600 mb-6">
                        Complete your travel profile to get more personalized itineraries.
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:from-primary-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                      >
                        Complete Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isEditing && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Profile
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  saving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:from-primary-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}