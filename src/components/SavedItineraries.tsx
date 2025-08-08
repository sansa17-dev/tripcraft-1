/**
 * Component for displaying and managing saved itineraries
 * Shows user's saved travel plans with options to view and delete
 */

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trash2, Eye, Clock, DollarSign } from 'lucide-react';
import { SavedItinerary, getUserItineraries, deleteItinerary } from '../services/itineraryStorageService';
import { useAuth } from '../hooks/useAuth';
import { GeneratedItinerary } from '../types';

interface SavedItinerariesProps {
  onSelectItinerary: (itinerary: GeneratedItinerary) => void;
}

export function SavedItineraries({ onSelectItinerary }: SavedItinerariesProps) {
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadItineraries();
    }
  }, [user]);

  const loadItineraries = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getUserItineraries(user.id);
      if (result.success && result.data) {
        setSavedItineraries(result.data);
      } else {
        setError(result.error || 'Failed to load itineraries');
      }
    } catch (err) {
      setError('An error occurred while loading itineraries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this itinerary?')) return;

    setDeletingId(id);
    try {
      const result = await deleteItinerary(id, user.id);
      if (result.success) {
        setSavedItineraries(prev => prev.filter(itinerary => itinerary.id !== id));
      } else {
        alert(result.error || 'Failed to delete itinerary');
      }
    } catch (err) {
      alert('An error occurred while deleting the itinerary');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (savedItinerary: SavedItinerary) => {
    // Convert saved itinerary to GeneratedItinerary format
    const itinerary: GeneratedItinerary = {
      title: savedItinerary.title,
      destination: savedItinerary.destination,
      duration: savedItinerary.duration,
      totalBudget: savedItinerary.total_budget,
      overview: savedItinerary.overview,
      days: savedItinerary.days,
      tips: savedItinerary.tips,
    };
    onSelectItinerary(itinerary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading your itineraries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading itineraries</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadItineraries}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (savedItineraries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved itineraries yet</h3>
          <p className="text-gray-600">
            Generate your first itinerary and save it to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Your Saved Itineraries</h2>
        <p className="text-gray-600 mt-1">{savedItineraries.length} saved trip{savedItineraries.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="divide-y divide-gray-200">
        {savedItineraries.map((itinerary) => (
          <div key={itinerary.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
                  {itinerary.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {itinerary.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {itinerary.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {itinerary.total_budget}
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2">
                  {itinerary.overview}
                </p>

                <div className="mt-3 text-xs text-gray-500">
                  Saved on {formatDate(itinerary.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleView(itinerary)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View itinerary"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(itinerary.id)}
                  disabled={deletingId === itinerary.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete itinerary"
                >
                  {deletingId === itinerary.id ? (
                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}