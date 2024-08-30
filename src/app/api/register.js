import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(request) {
  await dbConnect();
  const { email, password, userType } = await request.json();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Create new user
    const newUser = new User({
      email,
      password,  // Note: Password should be hashed before storing in production
      role: userType,
    });

    await newUser.save();
    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Failed to register user:', error);
    return new Response(JSON.stringify({ message: 'Failed to register user' }), { status: 500 });
  }
}
