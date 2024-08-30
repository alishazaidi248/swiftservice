// src/models/order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  serviceName: String,
  price: Number,
  bookingDate: Date,
  userId: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Status field added here
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
