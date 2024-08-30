import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';

export async function POST(request) {
  await dbConnect();
  const { uid, email, username, role } = await request.json();

  const errors = {};

  // Validate the input
  if (!username || username.trim() === '') {
    errors.username = 'Username is required.';
  }
  if (!email || email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Email address is invalid.';
  }
  // if (!role || (role !== 'Client' && role !== 'Valet')) {
  //   errors.role = 'Role is required and must be either "Client" or "Valet".';
  // }

  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify({ errors }), { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ errors: { email: 'Email is already registered.' } }), { status: 400 });
    }

    // Create a new user
    const newUser = new User({ uid, email, username, role });
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ message: 'Failed to register user' }), { status: 500 });
  }
}