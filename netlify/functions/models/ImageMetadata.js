import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageMetadataSchema = new Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  mimeType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/webp']
  },
  fileSize: {
    type: Number,
    required: true,
    max: 5242880 // 5MB limit
  }
}, {
  timestamps: true
});

// Create indexes
imageMetadataSchema.index({ profileId: 1 });
imageMetadataSchema.index({ fileName: 1 }, { unique: true });

const ImageMetadata = mongoose.model('ImageMetadata', imageMetadataSchema);

export default ImageMetadata;
