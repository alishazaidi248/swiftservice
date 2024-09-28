import dbConnect from '@/lib/dbConnect'; // Assuming you have a utility to connect to MongoDB
import User from '@/models/user';
import Service from '@/models/service';
import Order from '@/models/order';

export async function GET(req) {
  await dbConnect();

  try {
    // Total number of users
    const totalUsers = await User.countDocuments({});

    // Total number of services
    const totalServices = await Service.countDocuments({});

    // Total number of orders
    const totalOrders = await Order.countDocuments({});

    // Orders grouped by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Orders by service (count and revenue)
    const ordersByService = await Order.aggregate([
      {
        $group: {
          _id: "$serviceName",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    // Orders by user (how many services each user booked)
    const ordersByUser = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "uid",
          as: "userDetails"
        }
      }
    ]);

    return new Response(JSON.stringify({
      totalUsers,
      totalServices,
      totalOrders,
      ordersByStatus,
      ordersByService,
      ordersByUser,
    }), { status: 200 });
  } catch (error) {
    console.error('Error generating report:', error);
    return new Response('Error generating report', { status: 500 });
  }
}
