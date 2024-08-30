import dbConnect from '@/lib/dbConnect';
import Service from '@/models/service';

export async function GET() {
  await dbConnect();
  try {
    const services = await Service.find({});
    return new Response(JSON.stringify({ services }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to fetch services' }), { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  
  try {
    const providerInfo = await request.json();

    console.log('Received provider info:', providerInfo);

    if (!providerInfo.userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    const service = new Service({
      name: providerInfo.name,
      certifications: providerInfo.certifications,
      badges: providerInfo.badges,
      services: providerInfo.services.map(service => ({
        ...service,
        userId: providerInfo.userId
      })),
      userId: providerInfo.userId,
    });

    console.log('Service object before saving:', service);

    await service.save();

    return new Response(JSON.stringify({ message: 'Service added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error adding service:', error);
    return new Response(JSON.stringify({ message: 'Failed to add service' }), { status: 500 });
  }
}
