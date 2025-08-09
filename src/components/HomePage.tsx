/**
 * Enhanced homepage based on competitive analysis
 * Incorporates best practices from Airbnb, Booking.com, Notion, Stripe, and TripAdvisor
 */

import React, { useState, useEffect } from 'react';
import { 
  Plane, MapPin, Clock, Users, Star, Compass, Globe, Zap, 
  Shield, Heart, ArrowRight, CheckCircle, Quote, Sparkles,
  Calendar, DollarSign, Camera, Mountain, Play, ChevronDown,
  Award, TrendingUp, Smartphone, Laptop, Tablet, Waves, TreePine, ShoppingBag, Mic
} from 'lucide-react';
import { InteractiveDemo } from './InteractiveDemo';
import { VoiceChatModal } from './VoiceChatModal';
import { ARPreviewModal } from './ARPreviewModal';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

// Real-time stats simulation
const useRealTimeStats = () => {
  const [stats, setStats] = useState({
    travelers: 52847,
    destinations: 247,
    rating: 4.9,
    planningTime: 1.8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        travelers: prev.travelers + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};

// Live scrolling locations with themes
const THEMED_LOCATIONS = [
  {
    theme: 'Adventure',
    locations: [
      { name: 'Manali', country: 'India', image: 'https://images.pexels.com/photos/1562/italian-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Mountain },
      { name: 'Nepal Himalayas', country: 'Nepal', image: 'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Mountain },
      { name: 'Ladakh', country: 'India', image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Mountain },
      { name: 'Patagonia', country: 'Chile', image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Mountain },
      { name: 'Swiss Alps', country: 'Switzerland', image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Mountain }
    ]
  },
  {
    theme: 'Leisure',
    locations: [
      { name: 'Maldives', country: 'Indian Ocean', image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Waves },
      { name: 'Santorini', country: 'Greece', image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Waves },
      { name: 'Bali Beaches', country: 'Indonesia', image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Waves },
      { name: 'Goa', country: 'India', image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Waves },
      { name: 'Seychelles', country: 'Africa', image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: Waves }
    ]
  },
  {
    theme: 'Markets',
    locations: [
      { name: 'Marrakech Souks', country: 'Morocco', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: ShoppingBag },
      { name: 'Istanbul Bazaar', country: 'Turkey', image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: ShoppingBag },
      { name: 'Bangkok Markets', country: 'Thailand', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: ShoppingBag },
      { name: 'Delhi Chandni Chowk', country: 'India', image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: ShoppingBag },
      { name: 'Florence Markets', country: 'Italy', image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: ShoppingBag }
    ]
  },
  {
    theme: 'Spiritual',
    locations: [
      { name: 'Kyoto Temples', country: 'Japan', image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: TreePine },
      { name: 'Rishikesh', country: 'India', image: 'https://images.pexels.com/photos/1051449/pexels-photo-1051449.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: TreePine },
      { name: 'Ubud Forests', country: 'Bali', image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: TreePine },
      { name: 'Bhutan Monasteries', country: 'Bhutan', image: 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: TreePine },
      { name: 'Tibet Temples', country: 'Tibet', image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop', icon: TreePine }
    ]
  }
];

// Live scrolling component
const LiveScrollingLocations = () => {
  const [currentTheme, setCurrentTheme] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme(prev => (prev + 1) % THEMED_LOCATIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentLocations = THEMED_LOCATIONS[currentTheme];
  const ThemeIcon = currentLocations.locations[0].icon;

  return (
    <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl p-6 border border-indigo-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ThemeIcon className="h-5 w-5 text-indigo-600" />
          <span className="text-indigo-800 font-semibold text-sm">
            {currentLocations.theme} Destinations
          </span>
        </div>
        <div className="flex gap-1">
          {THEMED_LOCATIONS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTheme ? 'bg-indigo-600' : 'bg-indigo-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentTheme * 100}%)` }}
        >
          {THEMED_LOCATIONS.map((theme, themeIndex) => (
            <div key={themeIndex} className="flex gap-4 min-w-full">
              {theme.locations.slice(0, 3).map((location, index) => (
                <div
                  key={index}
                  className="flex-1 group cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-sm font-semibold">{location.name}</div>
                      <div className="text-xs opacity-80">{location.country}</div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <location.icon className="h-4 w-4 text-white/80" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-indigo-700 hover:text-indigo-900 text-base font-semibold flex items-center gap-1 mx-auto group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/70 transition-all duration-200 shadow-sm hover:shadow-md">
          Explore {currentLocations.theme} Trips
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const TRUST_LOGOS = [
  { name: 'TechCrunch', logo: 'TC' },
  { name: 'Product Hunt', logo: 'PH' },
  { name: 'Forbes', logo: 'F' },
  { name: 'Wired', logo: 'W' }
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered in 90 Seconds',
    description: 'Get personalized itineraries faster than ordering coffee. Our AI processes 1000+ data points instantly.',
    color: 'from-yellow-500 to-orange-500',
    metric: '90s avg',
    badge: 'Fastest'
  },
  {
    icon: Globe,
    title: 'AR Destination Previews',
    description: 'See destinations before you go! 360° views, virtual hotel tours, and AR experiences. Walk through Santorini sunsets or Kyoto temples.',
    color: 'from-blue-500 to-cyan-500',
    metric: '360° + AR',
    badge: 'Revolutionary'
  },
  {
    icon: Heart,
    title: 'Live Collaboration Mode',
    description: 'Plan together in real-time. See friends\' cursors, add comments, vote on activities - like Google Docs for travel.',
    color: 'from-pink-500 to-rose-500',
    metric: 'Real-time sync',
    badge: 'World First'
  },
  {
    icon: Shield,
    title: 'Smart Price Tracking',
    description: 'AI monitors flight & hotel prices 24/7. Get alerts when prices drop. Save up to 40% with perfect timing.',
    color: 'from-green-500 to-emerald-500',
    metric: '40% savings',
    badge: 'Money Saver'
  }
];

const DESTINATIONS = [
  {
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Stunning sunsets & white villages',
    color: 'from-blue-600 to-cyan-600',
    popular: true,
    duration: '5-7 days'
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Ancient temples & cherry blossoms',
    color: 'from-pink-600 to-rose-600',
    popular: false,
    duration: '4-6 days'
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    description: 'Tropical paradise & rich culture',
    color: 'from-green-600 to-emerald-600',
    popular: true,
    duration: '7-10 days'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    location: 'Singapore',
    text: 'TripCraft planned our perfect 10-day European adventure. Every recommendation was spot-on! Saved us 20+ hours of research.',
    trip: '10-day Europe Tour',
    avatar: 'SC',
    verified: true,
    savings: '₹45,000 saved'
  },
  {
    name: 'Michael Rodriguez',
    location: 'Mexico City',
    text: 'The AI is incredible. It knew exactly what we wanted - adventure during the day, great food at night. Perfect balance.',
    trip: '7-day Japan Journey',
    avatar: 'MR',
    verified: true,
    savings: '₹32,000 saved'
  },
  {
    name: 'Emma Thompson',
    location: 'London',
    text: 'Our Bali trip was beautifully planned. The local insights were amazing - we discovered places even locals didn\'t know!',
    trip: '8-day Bali Getaway',
    avatar: 'ET',
    verified: true,
    savings: '₹28,000 saved'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell Us Your Dreams',
    description: 'Share destination, dates, budget, and interests in under 2 minutes',
    icon: Heart,
    color: 'from-purple-500 to-indigo-500',
    time: '2 min'
  },
  {
    step: '02',
    title: 'AI Creates Magic',
    description: 'Our AI analyzes 1000+ data points to craft your perfect itinerary',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    time: '90 sec'
  },
  {
    step: '03',
    title: 'Customize & Go',
    description: 'Fine-tune details, save your plan, and start your adventure',
    icon: Plane,
    color: 'from-green-500 to-emerald-500',
    time: '5 min'
  }
];

export function HomePage({ onGetStarted, onSignIn, isAuthenticated }: HomePageProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showARPreview, setShowARPreview] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{name: string, country: string, theme: string} | undefined>();
  const stats = useRealTimeStats();

  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90"></div>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 opacity-20 animate-float">
              <Compass className="h-16 w-16 text-white" />
            </div>
            <div className="absolute top-40 right-20 opacity-20 animate-float-delayed">
              <MapPin className="h-20 w-20 text-white" />
            </div>
            <div className="absolute bottom-32 left-1/4 opacity-20 animate-float-slow">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <div className="absolute top-1/3 right-1/4 opacity-20 animate-float">
              <Camera className="h-14 w-14 text-white" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-20 animate-float-delayed">
              <Mountain className="h-18 w-18 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            {/* Social Proof Banner */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20 animate-pulse-slow">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-white/90 text-sm font-medium">
                🔥 {stats.travelers.toLocaleString()}+ travelers planned their perfect trips
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI Travel
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-gradient">
                Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-4">
              <span className="text-yellow-300 font-bold text-2xl">"Plan like a local, travel like a pro"</span>
            </p>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Join 50,000+ travelers who save 20+ hours with AI-powered planning. 
              Get personalized, local-insight itineraries in 90 seconds.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1 animate-pulse-slow"
              >
                <Plane className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Meet Your AI Companion
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Urgency indicator */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  Try Free
                </div>
              </button>
              
              <button
                onClick={() => setShowVoiceChat(true)}
                className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
              >
                <Mic className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Voice Chat with AI
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                
                {/* New feature badge */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                  NEW
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedDestination({ name: 'Santorini', country: 'Greece', theme: 'Leisure' });
                  setShowARPreview(true);
                }}
                className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
              >
                <Camera className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                AR Preview Destinations
                <div className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300">👁️</div>
                
                {/* Revolutionary badge */}
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  AR
                </div>
              </button>
              
              <button
                onClick={() => alert('Demo video coming soon! 🎬')}
                className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-medium group"
              >
                <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                See Live Demo
              </button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                90-second results
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Bank-level security
              </div>
            </div>

            {/* Press Coverage Placeholder */}
            <div className="mb-8">
              <button 
                onClick={() => alert('Press coverage details coming soon! 📰')}
                className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-white/90 text-sm font-medium">
                  🏆 "Revolutionizing Travel Planning" - See Press Coverage
                </span>
                <ArrowRight className="h-3 w-3 text-white/70 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Live Scrolling Locations */}
            <div className="mb-8 max-w-4xl mx-auto">
              <LiveScrollingLocations />
            </div>

            {/* Trust Indicators */}
            <div className="mb-8">
              <p className="text-white/60 text-sm mb-4">Trusted by travelers worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">256-bit</div>
                  <div className="text-white/70 text-xs">SSL Security</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">4.9★</div>
                  <div className="text-white/70 text-xs">App Store</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">24/7</div>
                  <div className="text-white/70 text-xs">Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-center">
                  <div className="text-white font-bold text-lg">Free</div>
                  <div className="text-white/70 text-xs">Forever</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <Users className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1 tabular-nums">
                  {stats.travelers.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm">Happy Travelers</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <Globe className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stats.destinations}+
                </div>
                <div className="text-white/70 text-sm">Destinations</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <Clock className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stats.planningTime}min
                </div>
                <div className="text-white/70 text-sm">Avg Planning</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <DollarSign className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  ₹35K
                </div>
                <div className="text-white/70 text-sm">Avg Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-white/60 text-xs mt-2">Scroll to explore</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">Master Your Travel Universe</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              How TripCraft Works
              <span className="block text-blue-600 text-2xl md:text-3xl">Like Having a Local Friend Everywhere</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI combines local insights with your preferences to create authentic travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2 group-hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative`}>
                    <step.icon className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {step.time}
                    </div>
                  </div>
                  <div className="text-6xl font-bold text-gray-100 absolute top-4 right-6 group-hover:text-gray-200 transition-colors duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </div>
                
                {/* Enhanced Connection Line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Process Guarantee */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                90-Second Guarantee
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                If our AI takes longer than 90 seconds to create your itinerary, 
                we'll upgrade you to premium features for free. That's our promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              World's First AI Travel Buddy
              <span className="block text-blue-600 text-2xl md:text-3xl">Chat, Collaborate, Create Together</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Revolutionary features that no other travel planner offers - chat with AI, plan with friends in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`bg-gradient-to-r ${feature.color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                    {feature.badge}
                  </span>
                </div>

                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-4">
                  {feature.description}
                </p>
                
                {/* Metric */}
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  {feature.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Destinations Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Plan Like a Local
              <span className="block text-green-600 text-2xl md:text-3xl">Discover Hidden Gems</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access local insights and authentic experiences in these trending destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DESTINATIONS.map((destination, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  setSelectedDestination({ 
                    name: destination.name, 
                    country: destination.country, 
                    theme: destination.name === 'Santorini' ? 'Leisure' : destination.name === 'Kyoto' ? 'Spiritual' : 'Adventure'
                  });
                  setShowARPreview(true);
                }}
              >
                {/* Popular Badge */}
                {destination.popular && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      🔥 Trending
                    </span>
                  </div>
                )}

                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${destination.color} rounded-full text-xs font-medium mb-2`}>
                    {destination.country}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-white/90 text-sm mb-3">{destination.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">{destination.duration}</span>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="h-3 w-3">👁️</div>
                      <span className="text-xs">AR Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Destinations CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setSelectedDestination({ name: 'Santorini', country: 'Greece', theme: 'Leisure' });
                setShowARPreview(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <Camera className="h-4 w-4" />
              Preview All 247 Destinations in AR
              <div className="h-4 w-4">👁️</div>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Travelers Love Their AI Companion
              <span className="block text-green-600 text-2xl md:text-3xl">₹1.2M+ Saved & Counting</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real stories from travelers who discovered authentic experiences with TripCraft
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 relative"
              >
                {/* Verified Badge */}
                {testimonial.verified && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </div>
                  </div>
                )}

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <Quote className="h-8 w-8 text-blue-600 mb-4 opacity-60" />
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-blue-600 text-sm font-medium">
                    {testimonial.trip}
                  </div>
                  <div className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                    {testimonial.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Numbers */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Trust Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified Reviews
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">20hrs</div>
                  <div className="text-gray-600 text-sm">Time Saved</div>
                  <div className="text-gray-400 text-xs mt-1">Research time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Would Recommend</div>
                  <div className="text-gray-400 text-xs mt-1">To friends</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-1">
                    4.9/5 <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-gray-600 text-sm">User Rating</div>
                  <div className="text-gray-400 text-xs mt-1">2,847 reviews</div>
                </div>
              </div>
              
              {/* Money-back guarantee */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">100% Satisfaction Guarantee - Free unlimited revisions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-red-400/30 animate-pulse">
            <Clock className="h-4 w-4 text-red-300" />
            <span className="text-red-200 text-sm font-medium">
              🚨 Limited Time: Free premium features for early adopters
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Travel
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Like a Local?
            </span>
          </h2>
          
          <p className="text-lg text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
            <span className="text-yellow-300 font-bold text-xl">"Your AI travel companion is waiting"</span>
          </p>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ travelers discovering authentic experiences. 
            Your personalized local guide is 90 seconds away.
          </p>

          {/* Multiple CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 font-bold text-lg transform hover:scale-105 hover:-translate-y-1"
            >
              <Plane className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Chat With Your AI Travel Buddy
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Urgency indicator */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Chat Free
              </div>
            </button>

            <div className="text-white/60 text-sm">
              <div className="flex items-center gap-4">
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 font-medium group"
                <span>✓ 90-sec results</span>
                <span>✓ Free forever</span>
              </div>
            </div>
          </div>

          {/* Risk Reversal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Your AI Buddy Promise</h3>
            <p className="text-white/80 text-sm">
              I learn your travel style and get better with every chat. Not happy? 
              I'll keep creating new plans until you're excited about your trip!
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveDemo onStartPlanning={onGetStarted} />
        </div>
      </section>

      {/* Voice Chat Modal */}
      <VoiceChatModal 
        isOpen={showVoiceChat}
        onClose={() => setShowVoiceChat(false)}
        onPlanGenerated={onGetStarted}
      />

      {/* AR Preview Modal */}
      <ARPreviewModal 
        isOpen={showARPreview}
        onClose={() => setShowARPreview(false)}
        destination={selectedDestination}
        onPlanTrip={onGetStarted}
      />
    </div>
  );
}