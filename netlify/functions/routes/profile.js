const express = require('express');
const Profile = require('../models/Profile.js');
const { getOrCreateProfile } = require('../services/dbInit.js');
const { getFallbackProfile, updateFallbackProfile } = require('../services/fallbackProfile.js');

const router = express.Router();

// GET /api/profile - Get user profile
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is available
    if (global.mongoDBAvailable !== false) {
      try {
        const profile = await getOrCreateProfile();
        
        return res.json({
          profile: {
            _id: profile._id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
            updatedAt: profile.updatedAt
          }
        });
      } catch (error) {
        console.error('MongoDB error, using fallback profile:', error);
        global.mongoDBAvailable = false;
      }
    }
    
    // Use fallback profile if MongoDB is not available
    console.log('Using fallback profile data');
    const fallbackData = getFallbackProfile();
    res.json({
      profile: {
        _id: fallbackData._id,
        firstName: fallbackData.firstName,
        lastName: fallbackData.lastName,
        profileImage: fallbackData.profileImage,
        updatedAt: fallbackData.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in profile GET route:', error);
    const fallbackData = getFallbackProfile();
    res.status(500).json({
      error: 'Failed to load profile data',
      profile: {
        _id: fallbackData._id,
        firstName: fallbackData.firstName,
        lastName: fallbackData.lastName,
        profileImage: fallbackData.profileImage,
        updatedAt: fallbackData.updatedAt
      }
    });
  }
});

// PUT /api/profile - Update user profile
router.put('/', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }
    
    if (firstName.length > 50 || lastName.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Names must be 50 characters or less'
      });
    }
    
    // Check if MongoDB is available
    if (global.mongoDBAvailable !== false) {
      try {
        let profile = await Profile.findOne();
        
        if (!profile) {
          // Create new profile
          profile = new Profile({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            profileImage: '/kheepo-profile.jpg'
          });
        } else {
          // Update existing profile
          profile.firstName = firstName.trim();
          profile.lastName = lastName.trim();
        }
        
        await profile.save();
        
        return res.json({
          success: true,
          profile: {
            id: profile._id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
            updatedAt: profile.updatedAt
          }
        });
      } catch (dbError) {
        console.error('MongoDB error, using fallback profile:', dbError);
        global.mongoDBAvailable = false;
      }
    }
    
    // Update fallback profile if MongoDB is not available
    console.log('Updating fallback profile data');
    const updatedProfile = updateFallbackProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
    
    res.json({
      success: true,
      profile: {
        id: updatedProfile._id,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        profileImage: updatedProfile.profileImage,
        updatedAt: updatedProfile.updatedAt
      },
      note: 'Profile updated in fallback mode (MongoDB unavailable)'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;