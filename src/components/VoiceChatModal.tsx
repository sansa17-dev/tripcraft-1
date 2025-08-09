/**
 * Voice Chat Modal Component
 * Provides voice interaction with AI for travel planning
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceChatModal({ isOpen, onClose }: VoiceChatModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    text: string;
    timestamp: Date;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (!SpeechRecognition || !speechSynthesis) {
      setIsSupported(false);
      return;
    }

    synthRef.current = speechSynthesis;

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        handleUserSpeech(transcript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Add welcome message
    if (isOpen && conversation.length === 0) {
      setConversation([{
        type: 'ai',
        text: 'Hello! I\'m your AI travel companion. Tell me where you\'d like to go or what kind of trip you\'re planning, and I\'ll help you create the perfect itinerary!',
        timestamp: new Date()
      }]);
      
      // Speak welcome message
      setTimeout(() => {
        speakText('Hello! I\'m your AI travel companion. Tell me where you\'d like to go or what kind of trip you\'re planning, and I\'ll help you create the perfect itinerary!');
      }, 500);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    setTranscript('');
    setError(null);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('Could not start voice recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current || !isSupported) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserSpeech = async (userText: string) => {
    if (!userText.trim()) return;

    // Add user message to conversation
    const userMessage = {
      type: 'user' as const,
      text: userText,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Generate AI response (mock for now - replace with actual AI service)
      const aiResponse = await generateAIResponse(userText);
      
      const aiMessage = {
        type: 'ai' as const,
        text: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      speakText(aiResponse);
      
    } catch (err) {
      const errorMessage = 'I apologize, but I encountered an error. Please try again.';
      setConversation(prev => [...prev, {
        type: 'ai',
        text: errorMessage,
        timestamp: new Date()
      }]);
      speakText(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Mock AI responses based on keywords - replace with actual AI service
    const input = userInput.toLowerCase();
    
    if (input.includes('goa') || input.includes('beach')) {
      return 'Goa sounds amazing! I can help you plan a perfect beach getaway. Would you like me to suggest a 3-day or 5-day itinerary? I can include beautiful beaches, water sports, local cuisine, and vibrant nightlife options.';
    } else if (input.includes('rajasthan') || input.includes('desert')) {
      return 'Rajasthan is a magnificent choice! The land of kings offers incredible palaces, desert adventures, and rich culture. Would you prefer to focus on Jaipur and Udaipur for royal experiences, or include Jaisalmer for desert camping?';
    } else if (input.includes('kerala') || input.includes('backwater')) {
      return 'Kerala, God\'s own country! I can create a wonderful itinerary featuring serene backwaters, hill stations, and Ayurvedic experiences. Are you interested in houseboat stays, spice plantation visits, or beach relaxation?';
    } else if (input.includes('budget') || input.includes('cheap')) {
      return 'I\'ll help you plan an amazing budget-friendly trip! There are many incredible destinations that won\'t break the bank. What type of experience interests you most - adventure, culture, nature, or relaxation?';
    } else if (input.includes('luxury') || input.includes('premium')) {
      return 'Perfect! I can design a luxurious travel experience with premium accommodations, fine dining, and exclusive experiences. Which destination has caught your attention, and what kind of luxury experiences do you prefer?';
    } else if (input.includes('adventure') || input.includes('trekking')) {
      return 'Adventure awaits! India has incredible options for thrill-seekers. Are you interested in Himalayan treks, water sports, wildlife safaris, or mountain adventures? I can suggest the perfect adventure itinerary based on your preferences.';
    } else {
      return 'That sounds interesting! I\'d love to help you plan the perfect trip. Could you tell me more about your preferred destination, travel dates, and what kind of experiences you\'re looking for? I can create a personalized itinerary just for you.';
    }
  };

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setConversation([]);
    setTranscript('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="bg-red-100 p-4 rounded-xl mb-6">
            <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Voice Chat Not Supported</h3>
            <p className="text-red-700 text-sm">
              Your browser doesn't support voice recognition. Please use a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 rounded-xl">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-gray-900">
                Voice Chat with AI
              </h2>
              <p className="text-sm text-gray-600">Speak naturally to plan your perfect trip</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI Travel Companion</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {/* Current transcript */}
          {transcript && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className="text-xs text-gray-500 mb-1">You're saying:</div>
              <div className="text-gray-900">{transcript}</div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Microphone button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`p-4 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {/* Speaker button */}
            <button
              onClick={isSpeaking ? stopSpeaking : () => {}}
              className={`p-4 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                  : 'bg-gray-300 text-gray-600'
              } shadow-lg hover:shadow-xl`}
            >
              {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {isListening ? (
                <span className="text-purple-600 font-medium">🎤 Listening... Speak now!</span>
              ) : (
                'Click the microphone and tell me about your dream trip'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}