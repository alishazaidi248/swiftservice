import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';

const admin = require('firebase-admin');
admin.initializeApp();

const auth = getAuth();

const getUsers = async (req, res) => {
  try {
    const users = await auth.listUsers();
    const userData = users.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.metadata.creationTime,
    }));
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export default getUsers;