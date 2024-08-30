// pages/api/bookings.js or app/api/bookings/route.js
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const db = await connectToDatabase();
      const bookings = await db
        .collection('bookings')
        .find({ userId })
        .toArray();

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'No bookings found' });
      }

      return res.status(200).json({ bookings });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
