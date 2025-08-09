/**
 * Interactive demo component showing TripCraft in action
 * Provides a preview of the AI planning experience
 */

import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';

interface InteractiveDemoProps {
  onStartPlanning: () => void;
}

export function InteractiveDemo({ onStartPlanning }: InteractiveDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const demoSteps = [
    {
      type: 'user',
      message: "Hey AI buddy! Plan a romantic 5-day Bali trip for 2 people 💕",
      icon: Users
    },
    {
      type: 'ai',
      message: "Hey there! 🌴 I know the perfect hidden gems in Bali! What's your vibe - luxury resorts or authentic local stays?",
      icon: MessageCircle
    },
    {
      type: 'user',
      message: "Mix of both! We're foodies who love sunset dinners 🌅",
      icon: MessageCircle
    },
    {
      type: 'ai',
      message: "Perfect! I'm connecting you with my local Bali friends for insider spots... ✨",
      icon: Sparkles,
      isGenerating: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < demoSteps.length - 1) {
        setIsTyping(true);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsTyping(false);
        }, 1000);
      } else {
        // Reset demo
        setTimeout(() => {
          setCurrentStep(0);
        }, 3000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Chat With Your AI Travel Buddy
        </h3>
        <p className="text-gray-600">
          See how our AI buddy talks like a local friend who knows every destination
        </p>
      </div>

      {/* Chat Interface */}
      <div className="bg-gray-50 rounded-xl p-4 h-80 overflow-y-auto mb-6">
        <div className="space-y-4">
          {demoSteps.slice(0, currentStep + 1).map((step, index) => (
            <div
              key={index}
              className={`flex ${step.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  step.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}
              >
                <div className="flex items-start gap-2">
                  {step.type === 'ai' && (
                    <step.icon className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  )}
                  <p className="text-sm">{step.message}</p>
                  {step.isGenerating && (
                    <div className="flex space-x-1 ml-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 shadow-sm border px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStartPlanning}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          Chat With AI Now
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Free AI chat • No signup required • Instant local insights
        </p>
      </div>
    </div>
  );
}