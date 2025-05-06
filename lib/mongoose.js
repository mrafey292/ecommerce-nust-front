import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://hallieimran:leema123@cluster0.kfojojn.mongodb.net/test?retryWrites=true&w=majority";

// Ensure we reuse the connection in dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function mongooseConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
