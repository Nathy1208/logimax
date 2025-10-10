import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Defina MONGODB_URI no arquivo .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => {
      return m;
    });
  }
  cached.conn = await cached.promise;
  console.log("✅ Conectado ao MongoDB (Mongoose)");
  return cached.conn;
}
