/**
 * TripCraft - Travel Itinerary Generator MVP
 * 
 * Phase 2: User authentication, itinerary persistence, and enhanced UI
 * Features: user accounts, save/load itineraries, improved visual design
 * 
 * Enhanced with professional styling and user data persistence via Supabase.
 */

import React, { useState } from 'react';
import { Plane, AlertTriangle, RefreshCw, User, LogOut, Save, BookOpen, ArrowRight } from 'lucide-react';
import { TravelPreferences, GeneratedItinerary } from './types';
import { generateItinerary, generateDemoItinerary } from './services/itineraryService';
import { saveItinerary } from './services/itineraryStorageService';
import { isFeatureEnabled } from './utils/featureFlags';
import { useAuth } from './hooks/useAuth';
import { TravelForm } from './components/TravelForm';
import { EditableItinerary } from './components/EditableItinerary';
import { AuthModal } from './components/AuthModal';
import { SavedItineraries } from './components/SavedItineraries';
import { HomePage } from './components/HomePage';
import { UserProfileModal } from './components/UserProfileModal';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const { user, signOut, loading: authLoading } = useAuth();

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentView, setCurrentView] = useState<'home' | 'planner' | 'results' | 'saved'>('home');
  const [savingItinerary, setSavingItinerary] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [generatedPreferences, setGeneratedPreferences] = useState<TravelPreferences | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  /**
   * Handles form submission and itinerary generation
   */
  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Require authentication before generating itinerary
    if (!user) {
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }
    
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
        setGeneratedPreferences(preferences);
        setCurrentView('results');
      } else {
        throw new Error(result.error || 'Failed to generate itinerary');
      }

    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handles saving the current itinerary
   */
  const handleSaveItinerary = async () => {
    if (!user || !itinerary) {
      setError('Please sign in and generate an itinerary first');
      return;
    }

    // Create robust fallback dates
    const today = new Date().toISOString().split('T')[0];
    const weekFromToday = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Use generatedPreferences if available, otherwise create minimal preferences from itinerary
    let preferencesToSave = generatedPreferences || {
      origin: 'Unknown',
      destination: itinerary.destination,
      startDate: today,
      endDate: weekFromToday,
      budget: 'mid-range' as const,
      interests: [],
      travelers: 1,
      accommodationType: 'any' as const,
      vacationPace: 'balanced' as const,
      additionalNotes: ''
    };

    // Ensure dates are always valid, even if generatedPreferences has empty strings
    if (!preferencesToSave.startDate || preferencesToSave.startDate === '') {
      preferencesToSave.startDate = today;
    }
    if (!preferencesToSave.endDate || preferencesToSave.endDate === '') {
      preferencesToSave.endDate = weekFromToday;
    }

    setSavingItinerary(true);
    setSaveSuccess(false);

    try {
      const result = await saveItinerary(itinerary, preferencesToSave, user.id);
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save itinerary');
      }
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to save itinerary');
    } finally {
      setSavingItinerary(false);
    }
  };

  /**
   * Handles user sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentView('home');
      handleReset();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  /**
   * Resets the form and results
   */
  const handleReset = () => {
    setItinerary(null);
    setGeneratedPreferences(null);
    setError(null);
    setShowApiKeyNotice(false);
    setSaveSuccess(false);
    setCurrentView('home');
  };

  /**
   * Handles selecting a saved itinerary
   */
  const handleSelectSavedItinerary = (savedItinerary: GeneratedItinerary) => {
    setItinerary(savedItinerary);
    setGeneratedPreferences(null); // Clear since this is a loaded itinerary
    setCurrentView('results');
  };

  /**
   * Handles updating an edited itinerary and saves it as new version
   */
  const handleUpdateItinerary = (updatedItinerary: GeneratedItinerary) => {
    setItinerary(updatedItinerary);
    setGeneratedPreferences(preferences); // Ensure we have preferences for saving
    
    // Auto-save the refined itinerary as a new version
    if (user) {
      handleSaveItinerary();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner message="Loading TripCraft..." showTravelIcons={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-700 to-teal-800 font-body">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600/95 via-cyan-700/95 to-teal-800/95 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="bg-gradient-to-r from-white/20 to-white/10 p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg">
                  TripCraft
                </h1>
                <p className="text-sm text-white/90 font-medium">AI Travel Planning</p>
              </div>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Navigation */}
              {user && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      showUserProfile
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setCurrentView('planner')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      currentView === 'planner'
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Plan Trip
                  </button>
                  <button
                    onClick={() => setCurrentView('saved')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      currentView === 'saved'
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Saved
                  </button>
                </div>
              )}

              {/* User Actions */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                    <User className="h-4 w-4 text-white" />
                    <span className="text-sm text-white max-w-32 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentView('planner')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Plan Your Trip
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Reset Button */}
              {(itinerary || currentView !== 'home') && currentView !== 'home' && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-gradient-to-r from-teal-600/90 via-cyan-700/90 to-teal-800/90 border-b border-white/20">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-white">
              <Save className="h-4 w-4" />
              <span className="text-sm font-medium">Itinerary saved successfully!</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Save Itinerary Button */}
        {user && itinerary && currentView === 'results' && !isEditingItinerary && (
          <div className="mb-8 bg-white rounded-2xl p-8 shadow-lg">
            <button
              onClick={handleSaveItinerary}
              disabled={savingItinerary}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                savingItinerary
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md'
              }`}
            >
              {savingItinerary ? (
                <>
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Itinerary
                </>
              )}
            </button>
          </div>
        )}

        {/* API Key Notice */}
        {showApiKeyNotice && (
          <div className="mb-6 bg-white/95 backdrop-blur-sm border border-amber-200 rounded-xl p-4 shadow-sm">
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
          <div className="mb-6 bg-white/95 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-sm">
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
        <div className="space-y-12 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          {currentView === 'home' ? (
            <HomePage 
              onGetStarted={() => {
                if (user) {
                  setCurrentView('planner');
                } else {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }
              }}
              onSignIn={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
              isAuthenticated={!!user}
            />
          ) : currentView === 'planner' ? (
            <div>
              <div className="text-center mb-12 max-w-content-narrow mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">
                  Create Your Perfect Travel Itinerary
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed-plus">
                  Tell us your preferences and we'll create a personalized day-by-day itinerary.
                </p>
              </div>

              <TravelForm
                preferences={preferences}
                onPreferencesChange={setPreferences}
                onSubmit={handleGenerateItinerary}
                isGenerating={isGenerating}
                isAuthenticated={!!user}
              />

              {/* Enhanced Loading State */}
              {isGenerating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
                    <LoadingSpinner 
                      message="Analyzing your preferences and crafting the perfect itinerary..."
                      showTravelIcons={true}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : currentView === 'results' && itinerary ? (
            /* Generated Itinerary Results */
            <EditableItinerary 
              itinerary={itinerary}
              preferences={generatedPreferences || preferences}
              onSave={handleUpdateItinerary}
              isEditing={isEditingItinerary}
              onToggleEdit={() => setIsEditingItinerary(!isEditingItinerary)}
            />
          ) : currentView === 'saved' ? (
            /* Saved Itineraries */
            <SavedItineraries onSelectItinerary={handleSelectSavedItinerary} />
          ) : null}

          {/* Auth Prompt for Non-Users */}
          {!user && itinerary && (
            <div className="bg-white/95 backdrop-blur-sm border border-primary-100 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <User className="h-8 w-8 text-primary-600 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-3">Save Your Itinerary</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create an account to save this itinerary and access it anytime, anywhere.
                </p>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {currentView === 'planner' && !itinerary && (
          <div className="mt-18 text-center text-sm text-white/80 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p>
              TripCraft uses AI to create personalized travel itineraries based on your preferences. 
              Generated suggestions should be verified for accuracy and availability.
            </p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </div>
  );
}

export default App;