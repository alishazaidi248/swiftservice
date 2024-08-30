import connectMongo from '@/lib/connectMongo';
import Booking from '@/models/Booking';

export async function POST(req, res) {
  try {
    await connectMongo();
    const { bookingId, status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    return res.status(200).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating booking status' });
  }
}
