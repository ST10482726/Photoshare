// Shared fallback profile for when MongoDB is unavailable
// This ensures consistency across all API routes

// Single source of truth for fallback profile data
let fallbackProfile = {
  _id: '1',
  firstName: 'Kheepo',
  lastName: 'Motsinoi',
  profileImage: '/kheepo-profile.jpg',
  updatedAt: new Date().toISOString()
};

// Get the current fallback profile
export const getFallbackProfile = () => {
  return { ...fallbackProfile }; // Return a copy to prevent direct mutation
};

// Update the fallback profile
export const updateFallbackProfile = (updates) => {
  fallbackProfile = {
    ...fallbackProfile,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return { ...fallbackProfile };
};

// Reset fallback profile to default values
export const resetFallbackProfile = () => {
  fallbackProfile = {
    _id: '1',
    firstName: 'Kheepo',
    lastName: 'Motsinoi',
    profileImage: '/kheepo-profile.jpg',
    updatedAt: new Date().toISOString()
  };
  return { ...fallbackProfile };
};

export default {
  getFallbackProfile,
  updateFallbackProfile,
  resetFallbackProfile
};