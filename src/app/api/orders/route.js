import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import Service from '@/models/service'; 

export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find({});
    return new Response(JSON.stringify({ orders }), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch orders' }), { status: 500 });
  }
}



export async function POST(request) {
  await dbConnect();
  try {
    const { serviceId, userId, bookingDate } = await request.json();
    if (!serviceId || !userId || !bookingDate) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Fetch the service details
    const service = await Service.findById(serviceId); // Assuming Service model exists
    if (!service) {
      return new Response(JSON.stringify({ message: 'Service not found' }), { status: 404 });
    }

    // Create a new order with service details
    const newOrder = new Order({
      serviceId,
      userId,
      bookingDate,
      status: 'pending',
      serviceName: service.name, // Add service name
      price: service.price, // Add price
    });

    await newOrder.save();
    return new Response(JSON.stringify({ message: 'Order created successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ message: 'Failed to create order' }), { status: 500 });
  }
}






// PATCH method to update an order status
export async function PATCH(request) {
  await dbConnect();
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return new Response(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Order updated successfully', order: updatedOrder }), { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ message: 'Failed to update order' }), { status: 500 });
  }
}
