import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { storage } from '@/lib/firebase/firebase'; // Adjust the import path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(req) {
  // Parse form data
  const form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.keepExtensions = true;

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ error: 'Failed to parse form data' }, { status: 500 }));
      }

      const file = files.file[0];

      if (!file) {
        return resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
      }

      try {
        const fileRef = ref(storage, `images/${file.originalFilename}`);
        const fileBuffer = fs.readFileSync(file.filepath); // Read file buffer
        await uploadBytes(fileRef, fileBuffer);
        const downloadURL = await getDownloadURL(fileRef);

        resolve(NextResponse.json({ imageUrl: downloadURL }, { status: 200 }));
      } catch (error) {
        console.error('Error uploading file:', error);
        resolve(NextResponse.json({ error: 'Failed to upload file' }, { status: 500 }));
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};
