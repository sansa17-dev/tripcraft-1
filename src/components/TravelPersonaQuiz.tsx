/**
 * Travel Persona Quiz Component
 * Collects deeper personalization data for better AI recommendations
 */

import React from 'react';
import { User, Clock, Users, Zap, Globe, Utensils, Calendar, Heart } from 'lucide-react';
import { TravelPersona } from '../types';

interface TravelPersonaQuizProps {
  persona: TravelPersona;
  onPersonaChange: (persona: TravelPersona) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
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

const PERSONA_QUESTIONS = [
  {
    key: 'timePreference' as keyof TravelPersona,
    icon: Clock,
    question: 'What\'s your preferred daily rhythm while traveling?',
    options: [
      { value: 'early-bird', label: 'Early Bird', description: 'Up with the sunrise, make the most of the day' },
      { value: 'night-owl', label: 'Night Owl', description: 'Late starts, evening adventures' },
      { value: 'flexible', label: 'Flexible', description: 'Adapt to the destination\'s rhythm' }
    ]
  },
  {
    key: 'socialStyle' as keyof TravelPersona,
    icon: Users,
    question: 'How do you prefer to experience destinations?',
    options: [
      { value: 'social', label: 'Social Explorer', description: 'Meet locals, join group activities' },
      { value: 'intimate', label: 'Intimate Moments', description: 'Small groups, meaningful connections' },
      { value: 'solo-friendly', label: 'Independent', description: 'Self-guided, peaceful exploration' }
    ]
  },
  {
    key: 'culturalInterest' as keyof TravelPersona,
    icon: Globe,
    question: 'How important is cultural immersion?',
    options: [
      { value: 'high', label: 'Deep Dive', description: 'Museums, history, local traditions' },
      { value: 'moderate', label: 'Balanced', description: 'Some culture, some other activities' },
      { value: 'low', label: 'Light Touch', description: 'Focus on experiences over education' }
    ]
  },
  {
    key: 'foodAdventure' as keyof TravelPersona,
    icon: Utensils,
    question: 'How adventurous are you with food?',
    options: [
      { value: 'adventurous', label: 'Foodie Explorer', description: 'Street food, local specialties, anything new' },
      { value: 'moderate', label: 'Selective Taster', description: 'Some local dishes, some familiar options' },
      { value: 'familiar', label: 'Comfort Zone', description: 'Prefer familiar cuisines and safe choices' }
    ]
  },
  {
    key: 'planningStyle' as keyof TravelPersona,
    icon: Calendar,
    question: 'How do you like to structure your trips?',
    options: [
      { value: 'structured', label: 'Well-Planned', description: 'Detailed schedules, booked in advance' },
      { value: 'flexible', label: 'Loose Framework', description: 'Key highlights planned, room for spontaneity' },
      { value: 'spontaneous', label: 'Go with Flow', description: 'Minimal planning, decide day-by-day' }
    ]
  },
  {
    key: 'interests' as keyof TravelPersona,
    icon: Heart,
    question: 'What interests you? (Select all that apply)',
    options: [] // This will be handled differently as it's a multi-select
  }
];

export function TravelPersonaQuiz({ persona, onPersonaChange, isExpanded, onToggleExpanded }: TravelPersonaQuizProps) {
  const updatePersona = (key: keyof TravelPersona, value: string) => {
    onPersonaChange({
      ...persona,
      [key]: value
    });
  };

  /**
   * Handles interest selection/deselection
   */
  const toggleInterest = (interest: string) => {
    const currentInterests = persona.interests || [];
    const isSelected = currentInterests.includes(interest);
    
    const newInterests = isSelected
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    
    onPersonaChange({
      ...persona,
      interests: newInterests
    });
  };

  const getCompletionPercentage = () => {
    const totalQuestions = PERSONA_QUESTIONS.length; // 6 questions total
    let answeredQuestions = 0;
    
    // Count answered questions (excluding interests which is handled separately)
    PERSONA_QUESTIONS.forEach(q => {
      if (q.key === 'interests') {
        // For interests, count as answered if at least one interest is selected
        if (persona.interests && persona.interests.length > 0) {
          answeredQuestions++;
        }
      } else {
        // For other questions, count as answered if not empty
        if (persona[q.key] && persona[q.key] !== '') {
          answeredQuestions++;
        }
      }
    });
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl border border-primary-100 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full p-6 text-left hover:bg-primary-100/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-xl">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-gray-900">
                Travel Persona Quiz
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
              </h3>
              <p className="text-sm text-gray-600">
                {isExpanded ? 'Help us understand your travel style for more personalized recommendations' : 'Optional: Get more personalized recommendations'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getCompletionPercentage() > 0 && (
              <div className="text-right">
                <div className="text-sm font-medium text-primary-600">
                  {getCompletionPercentage()}% complete
                </div>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full bg-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* Quiz Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-8">
          <div className="text-sm text-gray-600 bg-white/60 rounded-lg p-4">
            <p className="leading-relaxed">
              <strong>This quiz is completely optional.</strong> Answer any questions that interest you to help our AI create 
              more personalized itineraries that match your unique travel style. You can skip any or all questions.
            </p>
          </div>

          {PERSONA_QUESTIONS.map((question) => {
            const IconComponent = question.icon;
            const currentValue = persona[question.key];

            return (
              <div key={question.key} className="space-y-4">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-primary-600" />
                  <h4 className="font-medium text-gray-900">{question.question}</h4>
                </div>
                
                {/* Handle interests question differently */}
                {question.key === 'interests' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label key={interest} className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:bg-primary-50 hover:border-primary-200 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={(persona.interests || []).includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-colors"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          currentValue === option.value
                            ? 'border-primary-300 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-primary-25'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.key}
                          value={option.value}
                          checked={currentValue === option.value && currentValue !== ''}
                          onChange={(e) => updatePersona(question.key, e.target.value)}
                          className="mt-1 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{option.description}</div>
                        </div>
                      </label>
                    ))}
                    
                    {/* Skip option for each question */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => updatePersona(question.key, '')}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Skip this question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {getCompletionPercentage() === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-green-600 p-1.5 rounded-full">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-green-800">Travel persona complete!</div>
                <div className="text-sm text-green-700">Your preferences will be used to create more personalized itineraries.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}