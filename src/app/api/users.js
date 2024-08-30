import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase/firebase'; // Import your Firebase database

const users = async (req, res) => {
  if (req.method === 'POST') {
    const userData = req.body;
    try {
      const userRef = db.collection('users').doc();
      await userRef.set(userData);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } else if (req.method === 'GET') {
    try {
      const usersRef = db.collection('users');
      const users = await usersRef.get();
      const usersData = users.docs.map((doc) => doc.data());
      res.status(200).json(usersData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }
};

export default users;