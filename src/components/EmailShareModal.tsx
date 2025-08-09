/**
 * Email sharing modal component
 * Allows users to share itineraries via email
 */

import React, { useState } from 'react';
import { X, Mail, Send, Check, AlertCircle } from 'lucide-react';
import { GeneratedItinerary } from '../types';
import { sendItineraryEmail, isValidEmail } from '../services/emailService';

interface EmailShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: GeneratedItinerary;
  senderName?: string;
}

export function EmailShareModal({ isOpen, onClose, itinerary, senderName }: EmailShareModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate email
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send email
      const result = await sendItineraryEmail(email, itinerary, senderName);
      
      if (result.success) {
        setSuccess(true);
        setEmail('');
        setMessage('');
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setMessage('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Share Itinerary</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-4">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-green-800 font-medium">Email sent successfully!</h3>
                <p className="text-green-700 text-sm">The itinerary has been shared.</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Failed to send email</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Itinerary Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-1">{itinerary.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>📍 {itinerary.destination}</span>
              <span>⏱️ {itinerary.duration}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter recipient's email"
                  disabled={loading || success}
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={3}
                placeholder="Add a personal note (this will be included in the email)"
                disabled={loading || success}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success || !email.trim()}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || success || !email.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Email...
                </>
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  Email Sent!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Itinerary
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              The recipient will receive a beautifully formatted email with the complete itinerary, 
              including all activities, meals, and travel tips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}