/**
 * Component for viewing shared itineraries
 * Allows users to view itineraries shared by others via link
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, Clock, Utensils, Bed, Lightbulb, 
  Copy, Check, Eye, Users, Share2, AlertCircle, ExternalLink
} from 'lucide-react';
import { shareApi, commentsApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import { CollaborativeEditor } from './CollaborativeEditor';

interface SharedItineraryViewProps {
  shareId: string;
}

interface SharedItinerary {
  id: string;
  share_id: string;
  title: string;
  share_mode: 'view' | 'collaborate';
  is_public: boolean;
  view_count: number;
  created_at: string;
  itineraries: {
    title: string;
    destination: string;
    origin: string;
    duration: string;
    total_budget: string;
    overview: string;
    days: any[];
    tips: string[];
  };
}

interface Comment {
  id: string;
  user_email: string;
  content: string;
  created_at: string;
}

export function SharedItineraryView({ shareId }: SharedItineraryViewProps) {
  const [sharedItinerary, setSharedItinerary] = useState<SharedItinerary | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedDays, setCopiedDays] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadSharedItinerary();
  }, [shareId]);

  const loadSharedItinerary = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get shared itinerary
      const result = await shareApi.get(shareId);
      
      if (result.success && result.data) {
        setSharedItinerary(result.data);
        
        // Increment view count
        await shareApi.incrementView(shareId);
        
        // Load comments if collaborative
        if (result.data.share_mode === 'collaborate') {
          loadComments();
        }
      } else {
        throw new Error(result.error || 'Shared itinerary not found');
      }
    } catch (err) {
      console.error('Error loading shared itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shared itinerary');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const result = await commentsApi.list(shareId);
      if (result.success && result.data) {
        setComments(result.data);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !user) return;

    setAddingComment(true);
    try {
      const result = await commentsApi.create(shareId, {
        user_email: user.email,
        content: newComment.trim()
      });

      if (result.success) {
        setNewComment('');
        loadComments(); // Reload comments
      } else {
        throw new Error(result.error || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const copyDayToClipboard = async (day: any, dayNumber: number) => {
    const dayText = `
Day ${day.day} - ${day.date}
${day.activities.join('\n')}

Meals:
${day.meals.breakfast ? `Breakfast: ${day.meals.breakfast}` : ''}
${day.meals.lunch ? `Lunch: ${day.meals.lunch}` : ''}
${day.meals.dinner ? `Dinner: ${day.meals.dinner}` : ''}

${day.accommodation ? `Accommodation: ${day.accommodation}` : ''}
${day.estimatedCost ? `Estimated Cost: ${day.estimatedCost}` : ''}
${day.notes ? `Notes: ${day.notes}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(dayText);
      setCopiedDays(prev => new Set([...prev, dayNumber]));
      setTimeout(() => {
        setCopiedDays(prev => {
          const newSet = new Set(prev);
          newSet.delete(dayNumber);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <LoadingSpinner message="Loading shared itinerary..." showTravelIcons={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Shared Itinerary</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            The link may be expired, invalid, or the itinerary may have been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!sharedItinerary) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shared Itinerary Not Found</h3>
          <p className="text-gray-600">This shared itinerary could not be found.</p>
        </div>
      </div>
    );
  }

  const itinerary = sharedItinerary.itineraries;

  return (
    <div className="space-y-6">
      {/* Shared Itinerary Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Shared Itinerary</span>
              {sharedItinerary.share_mode === 'collaborate' && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Collaborative
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{sharedItinerary.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {sharedItinerary.view_count} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Shared {new Date(sharedItinerary.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              <ExternalLink className="h-4 w-4" />
              Copy Link
            </button>
            
            {sharedItinerary.share_mode === 'collaborate' && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                <Users className="h-4 w-4" />
                Comments ({comments.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collaborative Features */}
      {sharedItinerary.share_mode === 'collaborate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CollaborativeEditor 
              itineraryId={sharedItinerary.id}
              isEditing={false}
            />
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              
              {/* Add Comment */}
              {user && (
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim() || addingComment}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {addingComment ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              )}
              
              {/* Comments List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user_email}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Itinerary Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Hero Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
              alt="Travel destination"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80"></div>
          </div>

          {/* Header Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold mb-3">{itinerary.title}</h2>
            
            <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {itinerary.destination}
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

            <p className="leading-relaxed text-lg">{itinerary.overview}</p>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Daily Itinerary
          </h3>

          <div className="space-y-8">
            {itinerary.days.map((day: any, dayIndex: number) => (
              <div 
                key={`${day.day}-${dayIndex}`}
                className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 relative shadow-sm"
                style={{ paddingRight: '4rem' }}
              >
                {/* Copy button */}
                <button
                  onClick={() => copyDayToClipboard(day, day.day)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors shadow-sm z-10"
                  title="Copy day to clipboard"
                >
                  {copiedDays.has(day.day) ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>

                {/* Day header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 pr-8">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                    Day {day.day}
                  </div>
                  <span className="text-sm text-gray-600 font-medium break-words">{day.date}</span>
                  {day.estimatedCost && (
                    <span className="text-sm text-green-600 font-semibold sm:ml-auto bg-green-50 px-3 py-1 rounded-full break-words max-w-48">
                      {day.estimatedCost}
                    </span>
                  )}
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
                  <ul className="space-y-2">
                    {day.activities.map((activity: string, actIndex: number) => (
                      <li key={actIndex} className="text-gray-700 pl-5 relative">
                        <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meals */}
                {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-1">
                      <Utensils className="h-4 w-4 text-blue-600" />
                      Meals
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                        const meal = day.meals[mealType as keyof typeof day.meals];
                        if (!meal) return null;
                        
                        return (
                          <div key={mealType} className="bg-white p-3 rounded-lg shadow-sm min-w-0">
                            <span className="font-medium text-gray-600 capitalize">{mealType}:</span>
                            <p className="text-gray-700 mt-1 break-words">{meal}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Accommodation */}
                {day.accommodation && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Bed className="h-4 w-4 text-blue-600" />
                      Accommodation
                    </h4>
                    <div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
                      <p className="text-gray-700 text-sm break-words">{day.accommodation}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {day.notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm italic bg-blue-50 p-3 rounded-lg break-words">{day.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        {itinerary.tips && itinerary.tips.length > 0 && (
          <div className="p-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Travel Tips
            </h3>
            <ul className="space-y-3">
              {itinerary.tips.map((tip: string, index: number) => (
                <li key={index} className="text-gray-700 flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm min-w-0">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}