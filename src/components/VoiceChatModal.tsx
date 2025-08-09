/**
 * Voice Chat Modal Component
 * Enables voice conversation with AI travel buddy
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, X, MessageCircle, 
  Loader2, Sparkles, Plane, MapPin, Heart 
} from 'lucide-react';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated?: (preferences: any) => void;
}

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}

export function VoiceChatModal({ isOpen, onClose, onPlanGenerated }: VoiceChatModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      text: "Hey there! 👋 I'm your AI travel buddy! Tell me where you'd love to go and I'll help you plan the perfect trip. Just hit the mic and start chatting!",
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && 'speechSynthesis' in window) {
      setSpeechSupported(true);
      synthRef.current = window.speechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setCurrentTranscript(interimTranscript);
        
        if (finalTranscript) {
          handleUserMessage(finalTranscript, true);
          setCurrentTranscript('');
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start/stop listening
  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Handle user message
  const handleUserMessage = async (text: string, isVoice = false) => {
    const userMessage: ChatMessage = {
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const aiMessage: ChatMessage = {
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);

      // Speak AI response
      speakText(aiResponse);
    }, 1500);
  };

  // Generate AI response based on user input
  const generateAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('bali') || text.includes('indonesia')) {
      return "Bali! 🌴 Amazing choice! I know the perfect hidden beaches and authentic warungs. Are you thinking romantic sunsets, adventure activities, or cultural temples? And how many days are you planning?";
    }
    
    if (text.includes('japan') || text.includes('tokyo') || text.includes('kyoto')) {
      return "Japan is incredible! 🗾 Cherry blossoms, amazing food, and such rich culture. Are you more interested in modern Tokyo vibes or traditional Kyoto temples? What time of year are you thinking?";
    }
    
    if (text.includes('europe') || text.includes('paris') || text.includes('italy')) {
      return "Europe! 🏰 So many amazing countries to explore. Are you thinking a multi-city adventure or focusing on one country? I can help you with the perfect route and local experiences!";
    }
    
    if (text.includes('budget') || text.includes('cheap') || text.includes('expensive')) {
      return "Let's talk budget! 💰 I can work with any budget - from backpacker adventures to luxury experiences. What's your comfort zone per day? I'll make every rupee count!";
    }
    
    if (text.includes('romantic') || text.includes('honeymoon') || text.includes('couple')) {
      return "Aww, romantic trip! 💕 I know the most dreamy sunset spots, intimate restaurants, and couple activities. Where's your heart set on? Beach paradise, mountain retreats, or cultural cities?";
    }
    
    if (text.includes('adventure') || text.includes('hiking') || text.includes('trekking')) {
      return "Adventure time! 🏔️ I love planning adrenaline-filled trips! Thinking mountain trekking, water sports, or maybe some extreme activities? What gets your heart racing?";
    }
    
    if (text.includes('food') || text.includes('eat') || text.includes('cuisine')) {
      return "A fellow foodie! 🍜 I know the best local spots that even locals don't know about. Street food adventures, fine dining, or cooking classes? Let's make your taste buds dance!";
    }
    
    // Default responses
    const responses = [
      "That sounds exciting! 🌟 Tell me more about what kind of experience you're looking for - adventure, relaxation, culture, or maybe a mix of everything?",
      "I love helping with that! ✈️ What's your ideal trip duration and what time of year are you thinking? This helps me suggest the perfect activities!",
      "Great choice! 🗺️ I'm already thinking of some amazing local experiences. What's most important to you - authentic culture, Instagram-worthy spots, or hidden gems?",
      "Perfect! 🎯 Let me ask - are you traveling solo, with friends, or as a couple? This helps me tailor the perfect vibe for your trip!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (!synthRef.current) return;

    // Clean text for speech (remove emojis and special characters)
    const cleanText = text.replace(/[^\w\s.,!?-]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Natural') ||
      voice.name.includes('Enhanced')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Sparkles className="absolute top-2 right-8 h-6 w-6 animate-pulse" />
            <Plane className="absolute bottom-2 left-8 h-5 w-5 animate-bounce" />
            <MapPin className="absolute top-4 left-1/3 h-4 w-4 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your AI Travel Buddy</h2>
                <p className="text-blue-100 text-sm">Voice chat enabled • Speak naturally</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'ai' && (
                    <Sparkles className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  )}
                  {message.type === 'user' && message.isVoice && (
                    <Mic className="h-4 w-4 mt-0.5 text-blue-200 flex-shrink-0" />
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 shadow-sm border px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current transcript */}
          {currentTranscript && (
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl border-2 border-blue-300 border-dashed">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 animate-pulse" />
                  <span className="text-sm italic">{currentTranscript}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls */}
        <div className="p-6 bg-white border-t border-gray-200">
          {!speechSupported ? (
            <div className="text-center text-red-600 text-sm mb-4">
              Voice chat requires Chrome or Edge browser
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-4">
            {/* Voice Input Button */}
            <button
              onClick={toggleListening}
              disabled={!speechSupported || isProcessing}
              className={`relative p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }`}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              )}
            </button>

            {/* Speaking Control */}
            <button
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              className={`p-3 rounded-full transition-all duration-300 ${
                isSpeaking
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">AI thinking...</span>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isListening ? (
                <span className="text-red-600 font-medium">🎤 Listening... speak naturally!</span>
              ) : isSpeaking ? (
                <span className="text-green-600 font-medium">🔊 AI buddy is speaking...</span>
              ) : (
                "Tap the mic and tell me about your dream destination!"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}