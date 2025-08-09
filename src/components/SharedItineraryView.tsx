/**
 * Component for viewing shared itineraries
 * Allows users to view itineraries shared by others via link
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, Clock, Utensils, Bed, Lightbulb, 
  Copy, Check, Eye, Users, Share2, AlertCircle, ExternalLink, Edit3, Save, X, Plus, Trash2
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
  day_index: number | null;
}

export function SharedItineraryView({ shareId }: SharedItineraryViewProps) {
  const [sharedItinerary, setSharedItinerary] = useState<SharedItinerary | null>(null);
  const [generalComments, setGeneralComments] = useState<Comment[]>([]);
  const [dayComments, setDayComments] = useState<{ [dayIndex: number]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedDays, setCopiedDays] = useState<Set<number>>(new Set());
  const [newGeneralComment, setNewGeneralComment] = useState('');
  const [newDayComments, setNewDayComments] = useState<{ [dayIndex: number]: string }>({});
  const [addingComment, setAddingComment] = useState(false);
  const [addingDayComment, setAddingDayComment] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showDayComments, setShowDayComments] = useState<{ [dayIndex: number]: boolean }>({});

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
          loadAllComments();
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

  const loadAllComments = async () => {
    try {
      // Load general comments
      const generalResult = await commentsApi.list(shareId, null);
      if (generalResult.success && generalResult.data) {
        setGeneralComments(generalResult.data);
      }
      
      // Load day-specific comments for each day
      if (sharedItinerary?.itineraries?.days) {
        const dayCommentsMap: { [dayIndex: number]: Comment[] } = {};
        
        for (let i = 0; i < sharedItinerary.itineraries.days.length; i++) {
          const dayIndex = i + 1;
          const dayResult = await commentsApi.list(shareId, dayIndex);
          if (dayResult.success && dayResult.data) {
            dayCommentsMap[dayIndex] = dayResult.data;
          }
        }
        
        setDayComments(dayCommentsMap);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const addGeneralComment = async () => {
    if (!newGeneralComment.trim() || !user) return;

    setAddingComment(true);
    try {
      const result = await commentsApi.create(shareId, {
        user_email: user.email || 'Anonymous User',
        content: newGeneralComment.trim()
      }, null);

      if (result.success) {
        setNewGeneralComment('');
        loadAllComments(); // Reload comments
      } else {
        throw new Error(result.error || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setAddingComment(false);
    }
  };

  const addDayComment = async (dayIndex: number) => {
    const commentText = newDayComments[dayIndex];
    if (!commentText?.trim() || !user) return;

    setAddingDayComment(dayIndex);
    try {
      const result = await commentsApi.create(shareId, {
        user_email: user.email || 'Anonymous User',
        content: commentText.trim()
      }, dayIndex);

      if (result.success) {
        setNewDayComments(prev => ({ ...prev, [dayIndex]: '' }));
        loadAllComments(); // Reload comments
      } else {
        throw new Error(result.error || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding day comment:', err);
      alert('Failed to add comment: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setAddingDayComment(null);
    }
  };

  const toggleDayComments = (dayIndex: number) => {
    setShowDayComments(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const isOwner = user && sharedItinerary && user.id === sharedItinerary.user_id;
  const canCollaborate = sharedItinerary?.share_mode === 'collaborate' && user && !isOwner;

  const renderDayComments = (dayIndex: number) => {
    const comments = dayComments[dayIndex] || [];
    const isVisible = showDayComments[dayIndex];
    
    return (
      <div className="mt-4 border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleDayComments(dayIndex)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
        >
          <Users className="h-4 w-4" />
          Day {dayIndex} Comments ({comments.length})
          <span className="text-xs text-gray-500">
            {isVisible ? '▼' : '▶'}
          </span>
        </button>
        
        {isVisible && (
          <div className="space-y-3">
            {/* Add comment for collaborators */}
            {canCollaborate && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    Commenting as: {user?.email || 'Anonymous User'}
                  </span>
                </div>
                <textarea
                  value={newDayComments[dayIndex] || ''}
                  onChange={(e) => setNewDayComments(prev => ({ 
                    ...prev, 
                    [dayIndex]: e.target.value 
                  }))}
                  placeholder={`Add a comment for Day ${dayIndex}...`}
                  className="w-full p-2 border border-gray-200 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={2}
                />
                <button
                  onClick={() => addDayComment(dayIndex)}
                  disabled={!newDayComments[dayIndex]?.trim() || addingDayComment === dayIndex}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {addingDayComment === dayIndex ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            )}
            
            {/* Display comments */}
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No comments for this day yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-3">
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
        )}
      </div>
    );
  };

  const renderGeneralComments = () => {
    if (sharedItinerary?.share_mode !== 'collaborate') return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          General Comments ({generalComments.length})
        </h3>
        
        {/* Add general comment for collaborators */}
        {canCollaborate && (
          <div className="mb-4 bg-blue-50 rounded-lg p-4">
            <textarea
              value={newGeneralComment}
              onChange={(e) => setNewGeneralComment(e.target.value)}
              placeholder="Add a general comment about this itinerary..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            <button
              onClick={addGeneralComment}
              disabled={!newGeneralComment.trim() || addingComment}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {addingComment ? 'Adding...' : 'Add General Comment'}
            </button>
          </div>
        )}
        
        {/* Display general comments */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {generalComments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No general comments yet</p>
          ) : (
            generalComments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.user_email || 'Anonymous User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Show different interface for collaborators vs owners
  const renderCollaboratorInterface = () => {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Collaboration Mode</span>
        </div>
        <p className="text-blue-800 text-sm mb-4">
          You're viewing this itinerary as a collaborator. You can add comments to each day and general comments to share your thoughts with the owner.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-blue-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-900">
                Commenting as: {user?.email || 'Anonymous User'}
              </span>
            </div>
            <Eye className="h-4 w-4" />
            View itinerary details
          </div>
          <div className="flex items-center gap-1 text-blue-700">
            <Users className="h-4 w-4" />
            Add comments and suggestions
          </div>
        </div>
      </div>
    );
  };

  const renderOwnerInterface = () => {
    if (!isOwner) return null;
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Edit3 className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-900">Owner Mode</span>
        </div>
        <p className="text-green-800 text-sm mb-4">
          This is your shared itinerary. You can see all comments from collaborators and make edits to the itinerary.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-green-700">
            <Edit3 className="h-4 w-4" />
            Edit itinerary content
          </div>
          <div className="flex items-center gap-1 text-green-700">
            <Users className="h-4 w-4" />
            View all collaborator comments
          </div>
        </div>
      </div>
    );
  };

  const handleOwnerSaveChanges = async () => {
    // This would be implemented for owner editing functionality
    // For now, we'll focus on the comment system
    try {
      // Save changes logic here
      alert('Save functionality will be implemented for owners');
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes');
    }
  };

  const updateItineraryField = (field: string, value: any) => {
    // Owner editing functionality - to be implemented
  };

  const updateDay = (dayIndex: number, updatedDay: any) => {
    // Owner editing functionality - to be implemented
  };

  const addActivity = (dayIndex: number) => {
    // Owner editing functionality - to be implemented
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    // Owner editing functionality - to be implemented
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    // Owner editing functionality - to be implemented
  };

  const handleSaveChanges = async () => {
    if (!user || !sharedItinerary) return;

    try {
      // Owner save functionality
      const result = await shareApi.update(user.id, shareId, {
        title: sharedItinerary.title
      });

      if (result.success) {
        // Reload the shared itinerary to get latest data
        loadSharedItinerary();
      } else {
        throw new Error(result.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes');
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
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Collaborative
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 break-words pr-4">{sharedItinerary.title}</h2>
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
          
          <div className="flex items-center gap-2 flex-shrink-0">
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
                Comments ({generalComments.length + Object.values(dayComments).flat().length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Interface Indicators */}
      {canCollaborate && renderCollaboratorInterface()}
      {renderOwnerInterface()}

      {/* General Comments Section */}
      {sharedItinerary.share_mode === 'collaborate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Main itinerary content will be here */}
          </div>
          {/* General Comments Section */}
          {showComments && (
            <div className="lg:col-span-1">
              {renderGeneralComments()}
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
            {isOwner ? (
              <input
                type="text"
                value={itinerary.title}
                onChange={(e) => {/* Owner editing */}}
                className="text-3xl font-bold bg-transparent border-b-2 border-white/50 focus:border-white outline-none mb-3 text-white placeholder-white/70 min-w-0"
                placeholder="Trip title"
              />
            ) : (
              <h2 className="text-3xl font-bold mb-3 break-words">{itinerary.title}</h2>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {isOwner ? (
                  <input
                    type="text"
                    value={itinerary.destination}
                    onChange={(e) => {/* Owner editing */}}
                    className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 min-w-0"
                    placeholder="Destination"
                  />
                ) : (
                  <span className="break-words">{itinerary.destination}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {isOwner ? (
                  <input
                    type="text"
                    value={itinerary.duration}
                    onChange={(e) => {/* Owner editing */}}
                    className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 w-20 min-w-0"
                    placeholder="Duration"
                  />
                ) : (
                  itinerary.duration
                )}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {isOwner ? (
                  <input
                    type="text"
                    value={itinerary.total_budget}
                    onChange={(e) => {/* Owner editing */}}
                    className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 min-w-0"
                    placeholder="Budget"
                  />
                ) : (
                  <span className="break-words">{itinerary.total_budget}</span>
                )}
              </div>
            </div>

            {isOwner ? (
              <textarea
                value={itinerary.overview}
                onChange={(e) => {/* Owner editing */}}
                className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-white placeholder-white/70 resize-none min-w-0"
                rows={2}
                placeholder="Trip overview"
              />
            ) : (
              <p className="leading-relaxed text-lg break-words">{itinerary.overview}</p>
            )}
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
                className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-shadow"
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
                            {isOwner ? (
                              <input
                                type="text"
                                value={meal || ''}
                                onChange={(e) => {/* Owner editing */}}
                                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                                placeholder={`${mealType} recommendation`}
                              />
                            ) : (
                              <p className="text-gray-700 mt-1 break-words">{meal}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Accommodation */}
                {(day.accommodation || isOwner) && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Bed className="h-4 w-4 text-blue-600" />
                      Accommodation
                    </h4>
                    <div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
                      {isOwner ? (
                        <input
                          type="text"
                          value={day.accommodation || ''}
                          onChange={(e) => {/* Owner editing */}}
                          className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                          placeholder="Accommodation recommendation"
                        />
                      ) : (
                        <p className="text-gray-700 text-sm break-words">{day.accommodation}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(day.notes || isOwner) && (
                  <div className="pt-4 border-t border-gray-200">
                    {isOwner ? (
                      <textarea
                        value={day.notes || ''}
                        onChange={(e) => {/* Owner editing */}}
                        className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none min-w-0"
                        rows={2}
                        placeholder="Special notes for this day"
                      />
                    ) : (
                      day.notes && (
                        <p className="text-gray-600 text-sm italic bg-blue-50 p-3 rounded-lg break-words">{day.notes}</p>
                      )
                    )}
                  </div>
                )}
                
                {/* Day-specific Comments */}
                {sharedItinerary.share_mode === 'collaborate' && renderDayComments(dayIndex + 1)}
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