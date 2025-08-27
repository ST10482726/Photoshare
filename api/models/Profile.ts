import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IProfile {
  _id?: any;
  firstName: string;
  lastName: string;
  profileImage: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const profileSchema = new Schema({
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

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;