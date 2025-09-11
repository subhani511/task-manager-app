import mongoose from "mongoose";

export default async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI is required");

  const dbName = "task-manager-app"; // ✅ always this DB
  await mongoose.connect(uri, { dbName });
  console.log(`MongoDB connected (db: ${dbName})`);
}
