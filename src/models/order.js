// models/order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  userId: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  serviceName: { type: String, required: true }, // Ensure this is present
  price: { type: Number, required: true }, // Ensure this is present
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
