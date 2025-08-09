/**
 * Component for displaying generated travel itinerary
 * Shows formatted itinerary with daily breakdown and travel tips
 */

import React from 'react';
import { Calendar, MapPin, DollarSign, Clock, Utensils, Bed, Lightbulb, Copy, Check, Edit3, Save, X } from 'lucide-react';
import { GeneratedItinerary } from '../types';

interface ItineraryResultsProps {
  itinerary: GeneratedItinerary;
  onItineraryUpdate?: (updatedItinerary: GeneratedItinerary) => void;
}

export function ItineraryResults({ itinerary, onItineraryUpdate }: ItineraryResultsProps) {
  const [copiedDays, setCopiedDays] = React.useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedItinerary, setEditedItinerary] = React.useState<GeneratedItinerary>(itinerary);

  /**
   * Copies day itinerary to clipboard
   */
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

  /**
   * Handles saving edited itinerary
   */
  const handleSaveEdit = () => {
    if (onItineraryUpdate) {
      onItineraryUpdate(editedItinerary);
    }
    setIsEditing(false);
  };

  /**
   * Handles canceling edit mode
   */
  const handleCancelEdit = () => {
    setEditedItinerary(itinerary);
    setIsEditing(false);
  };

  /**
   * Updates a field in the edited itinerary
   */
  const updateItineraryField = (field: keyof GeneratedItinerary, value: any) => {
    setEditedItinerary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Updates a specific day's data
   */
  const updateDay = (dayIndex: number, field: string, value: any) => {
    setEditedItinerary(prev => ({
      ...prev,
      days: prev.days.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  /**
   * Updates a specific activity in a day
   */
  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setEditedItinerary(prev => ({
      ...prev,
      days: prev.days.map((day, index) => 
        index === dayIndex ? {
          ...day,
          activities: day.activities.map((activity, aIndex) => 
            aIndex === activityIndex ? value : activity
          )
        } : day
      )
    }));
  };

  /**
   * Updates a meal for a specific day
   */
  const updateMeal = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    setEditedItinerary(prev => ({
      ...prev,
      days: prev.days.map((day, index) => 
        index === dayIndex ? {
          ...day,
          meals: { ...day.meals, [mealType]: value }
        } : day
      )
    }));
  };

  const currentItinerary = isEditing ? editedItinerary : itinerary;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between mb-3">
          {isEditing ? (
            <input
              type="text"
              value={editedItinerary.title}
              onChange={(e) => updateItineraryField('title', e.target.value)}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1"
            />
          ) : (
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {currentItinerary.title}
            </h2>
          )}
          
          <div className="flex items-center gap-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-600" />
            {currentItinerary.destination}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-600" />
            {currentItinerary.duration}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-blue-600" />
            {currentItinerary.totalBudget}
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={editedItinerary.overview}
            onChange={(e) => updateItineraryField('overview', e.target.value)}
            className="w-full text-gray-700 leading-relaxed text-lg bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        ) : (
          <p className="text-gray-700 leading-relaxed text-lg">{currentItinerary.overview}</p>
        )}
      </div>

      {/* Daily Itinerary */}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Daily Itinerary
        </h3>

        <div className="space-y-8">
          {currentItinerary.days.map((day, index) => (
            <div key={day.day} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-shadow">
              {/* Copy button */}
              {!isEditing && (
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
              )}

              {/* Day header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                  Day {day.day}
                </div>
                <span className="text-sm text-gray-600 font-medium">{day.date}</span>
                {day.estimatedCost && (
                  <span className="text-sm text-green-600 font-semibold ml-auto bg-green-50 px-3 py-1 rounded-full">
                    {day.estimatedCost}
                  </span>
                )}
              </div>

              {/* Activities */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
                {isEditing ? (
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex-shrink-0"></span>
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => updateActivity(index, actIndex, e.target.value)}
                          className="flex-1 text-gray-700 bg-white border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="text-gray-700 pl-5 relative">
                        <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Meals */}
              {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-1">
                    <Utensils className="h-4 w-4 text-blue-600" />
                    Meals
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {day.meals.breakfast && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-600">Breakfast:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={day.meals.breakfast}
                            onChange={(e) => updateMeal(index, 'breakfast', e.target.value)}
                            className="w-full text-gray-700 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none mt-1"
                          />
                        ) : (
                          <p className="text-gray-700">{day.meals.breakfast}</p>
                        )}
                      </div>
                    )}
                    {day.meals.lunch && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-600">Lunch:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={day.meals.lunch}
                            onChange={(e) => updateMeal(index, 'lunch', e.target.value)}
                            className="w-full text-gray-700 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none mt-1"
                          />
                        ) : (
                          <p className="text-gray-700">{day.meals.lunch}</p>
                        )}
                      </div>
                    )}
                    {day.meals.dinner && (
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-600">Dinner:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={day.meals.dinner}
                            onChange={(e) => updateMeal(index, 'dinner', e.target.value)}
                            className="w-full text-gray-700 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none mt-1"
                          />
                        ) : (
                          <p className="text-gray-700">{day.meals.dinner}</p>
                        )}
                      </div>
                    )}
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
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                        className="w-full text-gray-700 text-sm bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-700 text-sm">{day.accommodation}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {day.notes && (
                <div className="pt-4 border-t border-gray-200">
                  {isEditing ? (
                    <textarea
                      value={day.notes}
                      onChange={(e) => updateDay(index, 'notes', e.target.value)}
                      className="w-full text-gray-600 text-sm italic bg-blue-50 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-600 text-sm italic bg-blue-50 p-3 rounded-lg">{day.notes}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      {currentItinerary.tips && currentItinerary.tips.length > 0 && (
        <div className="p-8 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Travel Tips
          </h3>
          <ul className="space-y-3">
            {currentItinerary.tips.map((tip, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                <span className="text-blue-600 mt-1.5 w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex-shrink-0"></span>
                {isEditing ? (
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => {
                      const newTips = [...editedItinerary.tips];
                      newTips[index] = e.target.value;
                      updateItineraryField('tips', newTips);
                    }}
                    className="flex-1 leading-relaxed bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <span className="leading-relaxed">{tip}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}