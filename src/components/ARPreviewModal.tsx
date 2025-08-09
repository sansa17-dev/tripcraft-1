/**
 * AR Destination Preview Modal Component
 * Provides immersive 360° destination previews and AR experiences
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, RotateCcw, Maximize2, Volume2, VolumeX, 
  MapPin, Star, Clock, Users, Eye, Smartphone, 
  Play, Pause, SkipForward, SkipBack, Compass,
  Mountain, Waves, Building, TreePine, Sparkles
} from 'lucide-react';

interface ARPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: {
    name: string;
    country: string;
    theme: string;
  };
  onPlanTrip?: () => void;
}

// AR Preview destinations with 360° images and experiences
const AR_DESTINATIONS = {
  'Santorini': {
    name: 'Santorini',
    country: 'Greece',
    theme: 'Leisure',
    icon: Waves,
    color: 'from-blue-600 to-cyan-600',
    experiences: [
      {
        title: 'Sunset at Oia Village',
        image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: '360° View',
        duration: '2 min',
        description: 'Experience the world-famous sunset from the iconic blue domes'
      },
      {
        title: 'Luxury Cave Hotel Room',
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'AR Room Tour',
        duration: '3 min',
        description: 'Walk through a traditional cave hotel with caldera views'
      },
      {
        title: 'Fira Cliffside Walk',
        image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'Virtual Walk',
        duration: '5 min',
        description: 'Stroll along the dramatic cliffs with panoramic sea views'
      }
    ],
    highlights: ['🌅 World-famous sunsets', '🏛️ Cycladic architecture', '🍷 Local wineries', '⛵ Catamaran cruises'],
    bestTime: 'April - October',
    rating: 4.9,
    reviews: '12,847 reviews'
  },
  'Kyoto': {
    name: 'Kyoto',
    country: 'Japan',
    theme: 'Spiritual',
    icon: TreePine,
    color: 'from-pink-600 to-rose-600',
    experiences: [
      {
        title: 'Fushimi Inari Shrine',
        image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: '360° Temple',
        duration: '4 min',
        description: 'Walk through thousands of vermillion torii gates'
      },
      {
        title: 'Bamboo Forest Path',
        image: 'https://images.pexels.com/photos/1829980/pexels-photo-1829980.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'AR Forest Walk',
        duration: '3 min',
        description: 'Immerse yourself in the mystical bamboo groves'
      },
      {
        title: 'Traditional Tea House',
        image: 'https://images.pexels.com/photos/1325837/pexels-photo-1325837.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'Cultural AR',
        duration: '6 min',
        description: 'Experience authentic tea ceremony in historic Gion'
      }
    ],
    highlights: ['⛩️ Ancient temples', '🌸 Cherry blossoms', '🍵 Tea ceremonies', '👘 Geisha districts'],
    bestTime: 'March - May, October - November',
    rating: 4.8,
    reviews: '8,234 reviews'
  },
  'Bali': {
    name: 'Bali',
    country: 'Indonesia',
    theme: 'Adventure',
    icon: Mountain,
    color: 'from-green-600 to-emerald-600',
    experiences: [
      {
        title: 'Rice Terraces Sunrise',
        image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: '360° Landscape',
        duration: '3 min',
        description: 'Watch sunrise over the iconic Jatiluwih rice terraces'
      },
      {
        title: 'Beach Club Infinity Pool',
        image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'AR Pool Experience',
        duration: '2 min',
        description: 'Relax at a luxury beach club with ocean views'
      },
      {
        title: 'Ubud Monkey Forest',
        image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        type: 'Wildlife AR',
        duration: '4 min',
        description: 'Meet playful monkeys in their natural habitat'
      }
    ],
    highlights: ['🏄‍♂️ World-class surfing', '🌾 Rice terraces', '🐒 Wildlife encounters', '🕉️ Spiritual retreats'],
    bestTime: 'April - October',
    rating: 4.7,
    reviews: '15,692 reviews'
  }
};

export function ARPreviewModal({ isOpen, onClose, destination, onPlanTrip }: ARPreviewModalProps) {
  const [currentExperience, setCurrentExperience] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Get destination data
  const destData = destination ? AR_DESTINATIONS[destination.name as keyof typeof AR_DESTINATIONS] : AR_DESTINATIONS['Santorini'];
  const currentExp = destData?.experiences[currentExperience];

  // Simulate AR experience loading
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentExperience]);

  // Progress simulation
  useEffect(() => {
    if (isPlaying && !progressInterval.current) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    } else if (!isPlaying && progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying, currentExperience]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentExperience < destData.experiences.length - 1) {
      setCurrentExperience(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentExperience > 0) {
      setCurrentExperience(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen || !destData) return null;

  const DestIcon = destData.icon;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-black rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[80vh]'
      }`}>
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${destData.color} p-4 text-white relative ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <DestIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{destData.name}</h2>
                <p className="text-white/80 text-sm">{destData.country} • AR Preview</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main AR Experience */}
        <div 
          className="relative flex-1 bg-black cursor-pointer"
          onClick={() => setShowControls(!showControls)}
          ref={videoRef}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Loading AR Experience</h3>
                <p className="text-white/70">Preparing {currentExp?.title}...</p>
              </div>
            </div>
          )}

          {/* AR Experience Image */}
          {!isLoading && (
            <div className="relative w-full h-full">
              <img 
                src={currentExp?.image}
                alt={currentExp?.title}
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* AR Indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2 text-white text-sm">
                <Eye className="h-4 w-4 text-blue-400" />
                {currentExp?.type}
              </div>
              
              {/* 360° Compass */}
              {currentExp?.type.includes('360°') && (
                <div className="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Compass className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              )}

              {/* Play Button Overlay */}
              {!isPlaying && showControls && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay();
                    }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group"
                  >
                    <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white/20 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          {!isLoading && (
            <div className={`absolute bottom-4 left-4 right-4 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white">
                    <h3 className="font-semibold">{currentExp?.title}</h3>
                    <p className="text-white/70 text-sm">{currentExp?.description}</p>
                  </div>
                  <div className="text-white/70 text-sm">
                    {currentExp?.duration}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentExperience === 0}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handlePlay}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentExperience === destData.experiences.length - 1}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>

                  <div className="w-px h-6 bg-white/20 mx-2"></div>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={() => alert('AR Camera feature coming soon! 📸')}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Take AR Photo"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className={`bg-gray-900 p-6 ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Experience List */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                AR Experiences ({destData.experiences.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {destData.experiences.map((exp, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentExperience(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`text-left p-3 rounded-lg transition-all ${
                      index === currentExperience
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{exp.title}</div>
                    <div className="text-xs opacity-80">{exp.type} • {exp.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{destData.rating}</span>
                <span className="text-gray-400 text-sm">({destData.reviews})</span>
              </div>
              
              <div className="space-y-2 mb-4">
                {destData.highlights.map((highlight, index) => (
                  <div key={index} className="text-gray-300 text-sm">{highlight}</div>
                ))}
              </div>

              <div className="text-gray-400 text-sm mb-4">
                <Clock className="h-4 w-4 inline mr-1" />
                Best time: {destData.bestTime}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip?.();
                }}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
              >
                Plan My Trip to {destData.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}