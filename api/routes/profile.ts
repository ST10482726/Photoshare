import express, { Request, Response } from 'express';
import Profile from '../models/Profile.js';
import { getOrCreateProfile } from '../services/dbInit.js';

const router = express.Router();

// Fallback in-memory profile for development
let fallbackProfile = {
  id: '1',
  firstName: 'Kheepo',
  lastName: 'Motsinoi',
  profileImage: '/kheepo-profile.jpg',
  updatedAt: new Date().toISOString()
};

// GET /api/profile - Get user profile
router.get('/', async (req: Request, res: Response) => {
  try {
    // Try to get from MongoDB first
    const profile = await getOrCreateProfile();
    
    res.json({
      id: profile._id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: profile.profileImage,
      updatedAt: profile.updatedAt
    });
  } catch (error) {
    console.error('MongoDB error, using fallback profile:', error);
    // Use fallback profile if MongoDB is not available
    res.json(fallbackProfile);
  }
});

// PUT /api/profile - Update user profile
router.put('/', async (req: Request, res: Response) => {
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
    
    try {
      // Try to update MongoDB first
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
      
      res.json({
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
      // Update fallback profile if MongoDB is not available
      fallbackProfile.firstName = firstName.trim();
      fallbackProfile.lastName = lastName.trim();
      fallbackProfile.updatedAt = new Date().toISOString();
      
      res.json({
        success: true,
        profile: fallbackProfile
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

export default router;