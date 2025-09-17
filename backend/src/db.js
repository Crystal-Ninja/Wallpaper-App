import mongoose from "mongoose";

let isConnected = false;

export async function ConnectDB(uri) {
  if (isConnected) {
    console.log("📊 Using existing database connection");
    return mongoose.connection;
  }

  if (!uri) {
    throw new Error("❌ MONGO_URL environment variable is not defined");
  }

  try {
    console.log("🔌 Connecting to MongoDB...");

    // Modern, clean connection options
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", connection.connection.name);

    // Events
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
      isConnected = false;
    });

    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✅ MongoDB disconnected");
  }
}
