import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';

export async function GET(request) {
  await dbConnect();

  try {
    const today = new Date();
    const startDate = new Date(today.setUTCHours(0, 0, 0, 0)); // Start of today in UTC
    const endDate = new Date(today.setUTCHours(23, 59, 59, 999)); // End of today in UTC

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const bookings = await Booking.aggregate([
      {
        $match: 
          {
            "bookedAt": { "$gte": new Date("2024-08-30T00:00:00.000Z"), "$lte": new Date("2024-08-30T23:59:59.999Z") }
          }
                  
      },
      {
        $group: {
          _id: '$serviceId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $project: {
          _id: 0,
          serviceName: '$service.name',
          count: 1
        }
      }
    ]);

    console.log('Bookings:', bookings);

    return new Response(JSON.stringify({ bookings }), { status: 200 });
  } catch (error) {
    console.error('Error fetching report:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch report' }), { status: 500 });
  }
}
