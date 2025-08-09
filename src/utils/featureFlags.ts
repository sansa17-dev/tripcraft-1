/**
 * Feature flags for safe rollout of new features
 * All new features should be wrapped with these flags
 */

interface FeatureFlags {
  FEATURE_VOICE_CHAT: boolean;
  FEATURE_LIVE_DESTINATIONS: boolean;
  FEATURE_ENHANCED_MAPS: boolean;
  FEATURE_PREMIUM_UI: boolean;
}

// Default feature flags - can be overridden by environment variables
const defaultFlags: FeatureFlags = {
  FEATURE_VOICE_CHAT: false,
  FEATURE_LIVE_DESTINATIONS: false,
  FEATURE_ENHANCED_MAPS: false,
  FEATURE_PREMIUM_UI: true, // Enable premium UI by default
};

/**
 * Get feature flag value with environment variable override
 */
function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  const envValue = import.meta.env[`VITE_${flag}`];
  if (envValue !== undefined) {
    return envValue === 'true';
  }
  return defaultFlags[flag];
}

/**
 * Feature flags object with environment overrides
 */
export const featureFlags: FeatureFlags = {
  FEATURE_VOICE_CHAT: getFeatureFlag('FEATURE_VOICE_CHAT'),
  FEATURE_LIVE_DESTINATIONS: getFeatureFlag('FEATURE_LIVE_DESTINATIONS'),
  FEATURE_ENHANCED_MAPS: getFeatureFlag('FEATURE_ENHANCED_MAPS'),
  FEATURE_PREMIUM_UI: getFeatureFlag('FEATURE_PREMIUM_UI'),
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag];
}