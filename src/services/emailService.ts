/**
 * Email service for sharing itineraries
 * Handles sending itineraries via email using Supabase Edge Functions
 */

import { GeneratedItinerary } from '../types';

interface EmailResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Sends an itinerary via email to the specified recipient
 */
export async function sendItineraryEmail(
  recipientEmail: string,
  itinerary: GeneratedItinerary,
  senderName?: string
): Promise<EmailResponse> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    // Get Supabase URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'Email service configuration error'
      };
    }

    // Call the edge function
    const response = await fetch(`${supabaseUrl}/functions/v1/send-itinerary-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        to: recipientEmail,
        itinerary: itinerary,
        senderName: senderName
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to send email'
      };
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.'
    };
  }
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}