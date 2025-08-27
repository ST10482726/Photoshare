import Profile from '../models/Profile.js';

const initializeDefaultProfile = async () => {
  try {
    // Check if any profile exists
    const existingProfile = await Profile.findOne();
    
    if (!existingProfile) {
      // Create default profile data
      const defaultProfile = {
        firstName: "Kheepo",
        lastName: "Motsinoi",
        profileImage: "/kheepo-profile.jpg"
      };
      
      const profile = new Profile(defaultProfile);
      await profile.save();
      
      console.log('Default profile created successfully');
    } else {
      console.log('Profile already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing default profile:', error);
  }
};

const getOrCreateProfile = async () => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      const defaultProfile = {
        firstName: "Kheepo",
        lastName: "Motsinoi",
        profileImage: "/kheepo-profile.jpg"
      };
      
      profile = new Profile(defaultProfile);
      await profile.save();
    }
    
    return profile;
  } catch (error) {
    console.error('Error getting or creating profile:', error);
    throw error;
  }
};

export { initializeDefaultProfile, getOrCreateProfile };