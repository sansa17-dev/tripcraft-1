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
import { useAuth } from './hooks/useAuth';
import { TravelForm } from './components/TravelForm';
import { EditableItinerary } from './components/EditableItinerary';
import { AuthModal } from './components/AuthModal';
import { SavedItineraries } from './components/SavedItineraries';
import { HomePage } from './components/HomePage';
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
  const [currentView, setCurrentView] = useState<'home' | 'planner' | 'results' | 'saved' | 'shared'>('home');
  const [savingItinerary, setSavingItinerary] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [sharedItineraryId, setSharedItineraryId] = useState<string | null>(null);

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
        setCurrentView('results');
      } else {
        // Check if it's an API key issue
        if (result.error?.includes('API key') || result.error?.includes('demo itinerary') || result.error?.includes('Network') || result.error?.includes('CORS')) {
          setShowApiKeyNotice(true);
          // Generate demo itinerary as fallback
          const demoItinerary = generateDemoItinerary(preferences);
          setItinerary(demoItinerary);
          setCurrentView('results');
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
   * Handles saving the current itinerary
   */
  const handleSaveItinerary = async () => {
    if (!user || !itinerary) return;

    setSavingItinerary(true);
    setSaveSuccess(false);

    try {
      const result = await saveItinerary(itinerary, preferences, user.id);
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
    setError(null);
    setShowApiKeyNotice(false);
    setSaveSuccess(false);
    setSharedItineraryId(null);
    setCurrentView('home');
  };

  /**
   * Handles selecting a saved itinerary
   */
  const handleSelectSavedItinerary = (savedItinerary: GeneratedItinerary) => {
    setItinerary(savedItinerary);
    setCurrentView('results');
  };

  /**
   * Handles updating an edited itinerary
   */
  const handleUpdateItinerary = (updatedItinerary: GeneratedItinerary) => {
    setItinerary(updatedItinerary);
    // If this is a saved itinerary, we could update it in the database here
  };

  /**
   * Handles viewing a shared itinerary
   */
  const handleViewSharedItinerary = (shareId: string) => {
    setSharedItineraryId(shareId);
    setCurrentView('shared');
  };
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner message="Loading TripCraft..." showTravelIcons={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TripCraft
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Travel Planning</p>
              </div>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Navigation */}
              {user && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('planner')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'planner'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Plan Trip
                  </button>
                  <button
                    onClick={() => setCurrentView('saved')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'saved'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700 max-w-32 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentView('planner')}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-green-800">
              <Save className="h-4 w-4" />
              <span className="text-sm font-medium">Itinerary saved successfully!</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Itinerary Button */}
        {user && itinerary && currentView === 'results' && (
          <div className="mb-6">
            <button
              onClick={handleSaveItinerary}
              disabled={savingItinerary}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                savingItinerary
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg'
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
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Create Your Perfect Travel Itinerary
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Tell us about your travel preferences and we'll generate a personalised day-by-day 
                  itinerary with activities, dining recommendations, and local insights.
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
              onSave={handleUpdateItinerary}
              isEditing={isEditingItinerary}
              onToggleEdit={() => setIsEditingItinerary(!isEditingItinerary)}
            />
          ) : currentView === 'saved' ? (
            /* Saved Itineraries */
            <SavedItineraries onSelectItinerary={handleSelectSavedItinerary} />
          ) : currentView === 'shared' && sharedItineraryId ? (
            /* Shared Itinerary View */
            <SharedItineraryView shareId={sharedItineraryId} />
          ) : null}

          {/* Auth Prompt for Non-Users */}
          {!user && itinerary && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Your Itinerary</h3>
                <p className="text-gray-600 mb-4">
                  Create an account to save this itinerary and access it anytime, anywhere.
                </p>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {currentView === 'planner' && !itinerary && (
          <div className="mt-16 text-center text-sm text-gray-500">
            <p>
              TripCraft uses AI to create personalised travel itineraries based on your preferences. 
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
    </div>
  );
}

export default App;