
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  bookedAt: { type: Date, required: true },
  
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
