import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: String,
  certifications: String,
  badges: String,
  services: [
    {
      name: String,
      description: String,
      price: Number,
      imageUrl: String,
      userId: String, // Store user ID for each service
    },
  ],
  userId: {
    type: String, // Store user ID for the service provider
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'started', 'delayed', 'completed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
