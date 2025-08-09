/**
 * Share modal component for creating shareable itinerary links
 * Allows users to share itineraries with others for viewing or collaboration
 */

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Link, Users, Eye, Settings } from 'lucide-react';
import { shareApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryId: string;
  itineraryTitle: string;
}

export function ShareModal({ isOpen, onClose, itineraryId, itineraryTitle }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<string>('');
  const [shareMode, setShareMode] = useState<'view' | 'collaborate'>('view');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const generateShareLink = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await shareApi.create(user.id, {
        itinerary_id: itineraryId,
        title: itineraryTitle,
        share_mode: shareMode,
        is_public: isPublic,
        expires_at: null // No expiration for now
      });

      if (result.success && result.data) {
        const baseUrl = window.location.origin;
        const generatedLink = `${baseUrl}/shared/${result.data.share_id}`;
        setShareLink(generatedLink);
      } else {
        throw new Error(result.error || 'Failed to create share link');
      }
    } catch (err) {
      console.error('Error creating share link:', err);
      setError(err instanceof Error ? err.message : 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  // Regenerate share link when mode or public setting changes
  useEffect(() => {
    if (shareLink) {
      generateShareLink();
    }
  }, [shareMode, isPublic]);

  const copyToClipboard = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleClose = () => {
    setShareLink('');
    setError(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Link className="h-5 w-5" />
            Share Itinerary
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Itinerary Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {itineraryTitle}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Share this itinerary with others
            </p>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShareMode('view')}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    shareMode === 'view'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">View Only</div>
                    <div className="text-xs text-gray-600">Read-only access</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setShareMode('collaborate')}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    shareMode === 'collaborate'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Collaborate</div>
                    <div className="text-xs text-gray-600">Can edit together</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Public Access */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Public Access
                </label>
                <p className="text-xs text-gray-600">
                  Anyone with the link can access
                </p>
              </div>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublic ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Share Link */}
          {shareLink ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600">
                {shareMode === 'collaborate' 
                  ? 'Recipients can view and edit this itinerary'
                  : 'Recipients can view this itinerary'
                }
              </p>
            </div>
          ) : (
            <button
              onClick={generateShareLink}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Share Link...
                </div>
              ) : (
                'Create Share Link'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}