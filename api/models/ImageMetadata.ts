import mongoose, { Schema, Document } from 'mongoose';

export interface IImageMetadata extends Document {
  profileId: mongoose.Types.ObjectId;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const imageMetadataSchema = new Schema<IImageMetadata>({
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

const ImageMetadata = mongoose.model<IImageMetadata>('ImageMetadata', imageMetadataSchema);

export default ImageMetadata;