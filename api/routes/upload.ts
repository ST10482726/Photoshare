import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import Profile from '../models/Profile.js';
import ImageMetadata from '../models/ImageMetadata.js';
import { getOrCreateProfile } from '../services/dbInit.js';
import { getFallbackProfile, updateFallbackProfile } from '../services/fallbackProfile.js';

// Type definitions for multer
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
  stream?: any;
}

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// POST /api/upload - Upload profile image
router.post('/', upload.single('image'), async (req: Request & { file?: MulterFile }, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    let profile;
    let usingFallback = false;
    
    // Try to get or create profile from MongoDB
    if ((global as any).mongoDBAvailable !== false) {
      try {
        profile = await getOrCreateProfile();
      } catch (error) {
        console.error('MongoDB error during upload, using fallback profile:', error);
        (global as any).mongoDBAvailable = false;
        profile = getFallbackProfile();
        usingFallback = true;
      }
    } else {
      console.log('Using fallback profile for upload');
      profile = getFallbackProfile();
      usingFallback = true;
    }

    // For Netlify Functions, store image as base64 data URL since file system is ephemeral
    const base64Data = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    
    // Generate unique filename for metadata tracking
    const timestamp = Date.now();
    const fileExtension = path.extname(req.file.originalname) || '.jpg';
    const fileName = `profile-${profile._id}-${timestamp}${fileExtension}`;

    // Save image metadata (only if MongoDB is available)
    if (!usingFallback) {
      try {
        const imageMetadata = new ImageMetadata({
          profileId: profile._id,
          originalName: req.file.originalname,
          fileName: fileName,
          mimeType: req.file.mimetype,
          fileSize: req.file.size
        });
        
        await imageMetadata.save();

        // Update profile with new image (base64 data URL)
        profile.profileImage = imageUrl;
        await profile.save();
      } catch (dbError) {
        console.error('MongoDB error saving metadata, continuing with file upload:', dbError);
        (global as any).mongoDBAvailable = false;
        // Update shared fallback profile
        updateFallbackProfile({ profileImage: imageUrl });
      }
    } else {
      // Update shared fallback profile
      updateFallbackProfile({ profileImage: imageUrl });
    }
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      message: usingFallback ? 
        'Image uploaded successfully (fallback mode - MongoDB unavailable)' : 
        'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size too large. Maximum size is 5MB.'
        });
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
  
  next(error);
});

export default router;