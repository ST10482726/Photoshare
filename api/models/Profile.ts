import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  firstName: string;
  lastName: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  profileImage: {
    type: String,
    default: '/default-avatar.jpg'
  }
}, {
  timestamps: true
});

// Create indexes
profileSchema.index({ firstName: 1, lastName: 1 });
profileSchema.index({ updatedAt: -1 });

const Profile = mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;