import multer from 'multer';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

const uploadProfilePicture = async (req, res) => {
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) return res.status(500).send(err.message);

    const file = req.file;
    const user = req.body.user;

    if (!file) return res.status(400).send('No file uploaded.');

    try {
      const bucket = getStorage().bucket();
      const fileName = `${uuidv4()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      // Use fs to read the file from the path and upload to Firebase Storage
      const fileBuffer = fs.readFileSync(file.path);
      await fileUpload.save(fileBuffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      // Get the public URL of the uploaded file
      const profilePictureUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Remove the temporary file
      fs.unlinkSync(file.path);

      // Respond with the profile picture URL
      res.status(200).json({ profilePictureUrl });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).send('Error uploading profile picture');
    }
  });
};

export default uploadProfilePicture;
