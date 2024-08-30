// src/pages/api/profile.js
import { auth } from '@/lib/firebase/firebase';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  await dbConnect();
  const user = auth.currentUser;
  
  if (!user) return res.status(401).json({ error: 'User not authenticated' });

  switch (req.method) {
    case 'GET':
      try {
        const profile = await User.findOne({ uid: user.uid }).lean();
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.status(200).json({ profile });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { name, profilePicture } = req.body;
        const profile = await User.findOneAndUpdate(
          { uid: user.uid },
          { name, profilePicture },
          { new: true }
        ).lean();
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.status(200).json({ profile });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
