/**
 * Editable itinerary component with inline editing capabilities
 * Allows users to modify generated itineraries with real-time updates
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, Clock, Utensils, Bed, Lightbulb, 
  Copy, Check, Edit3, Save, X, Plus, Trash2, GripVertical, Share2, Users
} from 'lucide-react';
import { GeneratedItinerary, ItineraryDay } from '../types';
import { updateItinerary } from '../services/itineraryStorageService';
import { useAuth } from '../hooks/useAuth';

interface EditableItineraryProps {
  itinerary: GeneratedItinerary;
  onSave: (updatedItinerary: GeneratedItinerary) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  savedItineraryId?: string;
  onShare?: () => void;
}

export function EditableItinerary({ 
  itinerary, 
  onSave, 
  isEditing, 
  onToggleEdit, 
  savedItineraryId,
  onShare 
}: EditableItineraryProps) {
  const [editedItinerary, setEditedItinerary] = useState<GeneratedItinerary>(itinerary);
  const [copiedDays, setCopiedDays] = useState<Set<number>>(new Set());
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { user } = useAuth();

  // Update edited itinerary when prop changes
  useEffect(() => {
    setEditedItinerary(itinerary);
  }, [itinerary]);

  /**
   * Handles saving changes
   */
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      // If this is a saved itinerary, update it in the database
      if (savedItineraryId && user) {
        const result = await updateItinerary(savedItineraryId, {
          title: editedItinerary.title,
          destination: editedItinerary.destination,
          duration: editedItinerary.duration,
          total_budget: editedItinerary.totalBudget,
          overview: editedItinerary.overview,
          days: editedItinerary.days,
          tips: editedItinerary.tips,
        }, user.id);

        if (!result.success) {
          throw new Error(result.error || 'Failed to save changes');
        }
      }

      // Update local state
      onSave(editedItinerary);
      onToggleEdit();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles real-time collaborative updates
   */
  const handleCollaborativeUpdate = (field: keyof GeneratedItinerary, value: any) => {
    const updatedItinerary = {
      ...editedItinerary,
      [field]: value
    setEditedItinerary(updatedItinerary);
    
    // Auto-save for collaborative editing if this is a saved itinerary
    if (savedItineraryId && user && isEditing) {
      debouncedSave(updatedItinerary);
    }
  };

  // Debounced save for collaborative editing
  const debouncedSave = useRef<NodeJS.Timeout>();
  const performDebouncedSave = (updatedItinerary: GeneratedItinerary) => {
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }
    
    debouncedSave.current = setTimeout(async () => {
      if (savedItineraryId && user) {
        try {
          await updateItinerary(savedItineraryId, {
            title: updatedItinerary.title,
            destination: updatedItinerary.destination,
            duration: updatedItinerary.duration,
            total_budget: updatedItinerary.totalBudget,
            overview: updatedItinerary.overview,
            days: updatedItinerary.days,
            tips: updatedItinerary.tips,
          }, user.id);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  };

  /**
   * Handles canceling changes
   */
  const handleCancel = () => {
    setEditedItinerary(itinerary);
    onToggleEdit();
  };

  /**
   * Updates itinerary field
   */
  const updateItineraryField = (field: keyof GeneratedItinerary, value: any) => {
    if (savedItineraryId && user && isEditing) {
      handleCollaborativeUpdate(field, value);
    } else {
      setEditedItinerary(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  /**
   * Updates a specific day
   */
  const updateDay = (dayIndex: number, updatedDay: ItineraryDay) => {
    setEditedItinerary(prev => ({
      ...prev,
      days: prev.days.map((day, index) => 
        index === dayIndex ? updatedDay : day
      )
    }));
  };

  /**
   * Adds a new activity to a day
   */
  const addActivity = (dayIndex: number) => {
    const updatedDay = {
      ...editedItinerary.days[dayIndex],
      activities: [...editedItinerary.days[dayIndex].activities, 'New activity']
    };
    updateDay(dayIndex, updatedDay);
  };

  /**
   * Removes an activity from a day
   */
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDay = {
      ...editedItinerary.days[dayIndex],
      activities: editedItinerary.days[dayIndex].activities.filter((_, index) => index !== activityIndex)
    };
    updateDay(dayIndex, updatedDay);
  };

  /**
   * Updates an activity
   */
  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedDay = {
      ...editedItinerary.days[dayIndex],
      activities: editedItinerary.days[dayIndex].activities.map((activity, index) => 
        index === activityIndex ? value : activity
      )
    };
    updateDay(dayIndex, updatedDay);
  };

  /**
   * Adds a new tip
   */
  const addTip = () => {
    setEditedItinerary(prev => ({
      ...prev,
      tips: [...prev.tips, 'New travel tip']
    }));
  };

  /**
   * Removes a tip
   */
  const removeTip = (tipIndex: number) => {
    setEditedItinerary(prev => ({
      ...prev,
      tips: prev.tips.filter((_, index) => index !== tipIndex)
    }));
  };

  /**
   * Updates a tip
   */
  const updateTip = (tipIndex: number, value: string) => {
    setEditedItinerary(prev => ({
      ...prev,
      tips: prev.tips.map((tip, index) => 
        index === tipIndex ? value : tip
      )
    }));
  };

  /**
   * Copies day itinerary to clipboard
   */
  const copyDayToClipboard = async (day: ItineraryDay, dayNumber: number) => {
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

  /**
   * Handles drag and drop for reordering days
   */
  const handleDragStart = (dayIndex: number) => {
    setDraggedDay(dayIndex);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedDay === null || draggedDay === targetIndex) return;

    const newDays = [...editedItinerary.days];
    const draggedItem = newDays[draggedDay];
    newDays.splice(draggedDay, 1);
    newDays.splice(targetIndex, 0, draggedItem);

    // Update day numbers
    const updatedDays = newDays.map((day, index) => ({
      ...day,
      day: index + 1
    }));

    setEditedItinerary(prev => ({
      ...prev,
      days: updatedDays
    }));

    setDraggedDay(null);
  };

  return (
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
          {isEditing ? (
            <input
              type="text"
              value={editedItinerary.title}
              onChange={(e) => updateItineraryField('title', e.target.value)}
              className="text-3xl font-bold bg-transparent border-b-2 border-white/50 focus:border-white outline-none mb-3 text-white placeholder-white/70 min-w-0"
              placeholder="Trip title"
            />
          ) : (
            <h2 className="text-3xl font-bold mb-3 break-words">{editedItinerary.title}</h2>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedItinerary.destination}
                  onChange={(e) => updateItineraryField('destination', e.target.value)}
                  className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 min-w-0"
                  placeholder="Destination"
                />
              ) : (
                <span className="break-words">{editedItinerary.destination}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedItinerary.duration}
                  onChange={(e) => updateItineraryField('duration', e.target.value)}
                  className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 w-20 min-w-0"
                  placeholder="Duration"
                />
              ) : (
                editedItinerary.duration
              )}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedItinerary.totalBudget}
                  onChange={(e) => updateItineraryField('totalBudget', e.target.value)}
                  className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/70 min-w-0"
                  placeholder="Budget"
                />
              ) : (
                <span className="break-words">{editedItinerary.totalBudget}</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={editedItinerary.overview}
              onChange={(e) => updateItineraryField('overview', e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-white placeholder-white/70 resize-none w-full min-w-0"
              rows={2}
              placeholder="Trip overview"
            />
          ) : (
            <p className="leading-relaxed text-lg break-words">{editedItinerary.overview}</p>
          )}
        </div>

        {/* Edit Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors shadow-lg"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          )}

          {isEditing ? (
            <>
              {/* Save Error */}
              {saveError && (
                <div className="absolute top-12 right-0 bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm max-w-xs">
                  {saveError}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors shadow-lg"
            >
              <Edit3 className="h-4 w-4" />
              {savedItineraryId ? 'Edit & Collaborate' : 'Edit Itinerary'}
            </button>
          )}

          {/* Collaborative Indicator */}
          {savedItineraryId && isEditing && (
            <div className="flex items-center gap-1 px-3 py-2 bg-blue-600/20 backdrop-blur-sm text-white rounded-lg">
              <Users className="h-4 w-4" />
              <span className="text-sm">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Daily Itinerary
          {isEditing && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Drag days to reorder)
            </span>
          )}
        </h3>

        <div className="space-y-8">
          {editedItinerary.days.map((day, dayIndex) => (
            <div 
              key={`${day.day}-${dayIndex}`}
              className={`bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all ${
                isEditing ? 'border-2 border-dashed border-gray-200 hover:border-blue-300' : ''
              }`}
              draggable={isEditing}
              onDragStart={() => handleDragStart(dayIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dayIndex)}
            >
              {/* Drag Handle */}
              {isEditing && (
                <div className="absolute left-2 top-4 cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>
              )}

              {/* Copy button */}
              <button
                onClick={() => copyDayToClipboard(day, day.day)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                title="Copy day to clipboard"
              >
                {copiedDays.has(day.day) ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>

              {/* Day header */}
              <div className="flex items-center gap-2 mb-3 ml-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                  Day {day.day}
                </div>
                <span className="text-sm text-gray-600 font-medium">{day.date}</span>
                {day.estimatedCost && (
                  <span className="text-sm text-green-600 font-semibold ml-auto bg-green-50 px-3 py-1 rounded-full">
                    {isEditing ? (
                      <input
                        type="text"
                        value={day.estimatedCost}
                        onChange={(e) => updateDay(dayIndex, { ...day, estimatedCost: e.target.value })}
                        className="bg-transparent text-green-600 outline-none w-24"
                      />
                    ) : (
                      day.estimatedCost
                    )}
                  </span>
                )}
              </div>

              {/* Activities */}
              <div className="mb-4 ml-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Activities</h4>
                  {isEditing && (
                    <button
                      onClick={() => addActivity(dayIndex)}
                      className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      Add Activity
                    </button>
                  )}
                </div>
                <ul className="space-y-2">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="text-gray-700 pl-5 relative flex items-start gap-2 min-w-0">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex-shrink-0"></span>
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) => updateActivity(dayIndex, actIndex, e.target.value)}
                            className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => removeActivity(dayIndex, actIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="break-words">{activity}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meals */}
              {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                <div className="mb-4 ml-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-1">
                    <Utensils className="h-4 w-4 text-blue-600" />
                    Meals
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                      const meal = day.meals[mealType as keyof typeof day.meals];
                      if (!meal && !isEditing) return null;
                      
                      return (
                        <div key={mealType} className="bg-white p-3 rounded-lg shadow-sm min-w-0">
                          <span className="font-medium text-gray-600 capitalize">{mealType}:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={meal || ''}
                              onChange={(e) => updateDay(dayIndex, {
                                ...day,
                                meals: { ...day.meals, [mealType]: e.target.value }
                              })}
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
              {(day.accommodation || isEditing) && (
                <div className="mb-3 ml-6">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <Bed className="h-4 w-4 text-blue-600" />
                    Accommodation
                  </h4>
                  <div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={day.accommodation || ''}
                        onChange={(e) => updateDay(dayIndex, { ...day, accommodation: e.target.value })}
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
              {(day.notes || isEditing) && (
                <div className="pt-4 border-t border-gray-200 ml-6">
                  {isEditing ? (
                    <textarea
                      value={day.notes || ''}
                      onChange={(e) => updateDay(dayIndex, { ...day, notes: e.target.value })}
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
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      {(editedItinerary.tips && editedItinerary.tips.length > 0) && (
        <div className="p-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Travel Tips
            </h3>
            {isEditing && (
              <button
                onClick={addTip}
                className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
              >
                <Plus className="h-3 w-3" />
                Add Tip
              </button>
            )}
          </div>
          <ul className="space-y-3">
            {editedItinerary.tips.map((tip, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm min-w-0">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => updateTip(index, e.target.value)}
                      className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => removeTip(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <span className="leading-relaxed break-words">{tip}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}