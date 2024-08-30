import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // URL of the profile picture
    default: null,
  },
  // Add other fields as needed
});

export default mongoose.models.User || mongoose.model('User', userSchema);
