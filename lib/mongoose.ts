import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB as string;

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}