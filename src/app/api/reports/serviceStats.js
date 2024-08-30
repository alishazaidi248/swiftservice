import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import Service from '@/models/service';

export default async function handler(req, res) {
  console.log('Request received'); // Log request received
  if (req.method === 'GET') {
    await dbConnect();
    try {
      console.log('Connecting to DB and fetching data'); // Log fetching data
      const bookingsByService = await Order.aggregate([
        { $group: { _id: '$serviceId', count: { $sum: 1 } } },
      ]);

      console.log('Bookings by service:', bookingsByService); // Log bookings by service

      const services = await Service.find({ _id: { $in: bookingsByService.map(order => order._id) } });

      console.log('Services:', services); // Log services

      const result = bookingsByService.map(booking => {
        const service = services.find(service => service._id.toString() === booking._id.toString());
        return {
          serviceName: service ? service.name : 'Unknown',
          bookings: booking.count,
        };
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching service bookings:', error);
      res.status(500).json({ message: 'Failed to fetch service bookings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
