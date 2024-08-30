import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI env variable not declared');
}

let db;

async function dbConnect() {
  if (db) return db;
  try {
    db = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Database connected successfully');
    return db;
  } catch (e) {
    throw e;
  }
}

export default dbConnect;