import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profileImage: {
    type: String,
    default: '/kheepo-profile.jpg'
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;