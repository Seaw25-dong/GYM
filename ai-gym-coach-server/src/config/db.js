import mongoose from "mongoose";

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

export { connectDatabase };
