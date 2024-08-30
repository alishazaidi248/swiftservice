// pages/api/upload.js

import { storage } from '../../src/lib/firebase'; // Adjust the import path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import nextConnect from 'next-connect';
import multer from 'multer';

// Set up multer to handle file upload
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
});

const handler = nextConnect()
  .use(upload.single('file'))
  .post(async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const fileRef = ref(storage, `images/${file.originalname}`);
      await uploadBytes(fileRef, file.buffer);
      const downloadURL = await getDownloadURL(fileRef);

      res.status(200).json({ imageUrl: downloadURL });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

export default handler;
