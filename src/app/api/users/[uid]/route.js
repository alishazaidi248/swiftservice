import dbConnect from '@/lib/dbConnect';
import user from '@/models/user';
export async function GET(request, { params }) {
    await dbConnect();
    const { uid } = params;
    if (!uid) {
      return new Response(JSON.stringify({ message: 'uid is required' }), { status: 400 });
    }
    try {
      const var_user = await user.findOne({ uid:uid});
      return new Response(JSON.stringify({ var_user }), { status: 200 });
    } catch (error) {
      console.error('Server Error:', error);
      return new Response(JSON.stringify({ message: 'Failed to fetch user' }), { status: 500 });
    }
  } 