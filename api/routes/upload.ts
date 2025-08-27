import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import Profile from '../models/Profile';
import ImageMetadata from '../models/ImageMetadata';
import { getOrCreateProfile } from '../services/dbInit';

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
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Get or create profile
    const profile = await getOrCreateProfile();

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `profile-${profile._id}-${timestamp}.jpg`;
    
    // Define upload directory and file path
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure upload directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    // Save image metadata
    const imageMetadata = new ImageMetadata({
      profileId: profile._id,
      originalName: req.file.originalname,
      fileName: fileName,
      mimeType: 'image/jpeg', // Always JPEG after processing
      fileSize: req.file.size
    });
    
    await imageMetadata.save();

    // Update profile with new image path
    const imageUrl = `/uploads/${fileName}`;
    profile.profileImage = imageUrl;
    await profile.save();

    res.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully'
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
router.use((error: any, req: Request, res: Response, next: any) => {
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