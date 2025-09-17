// Alternative approach - Direct connection like the test script
import mongoose from "mongoose";

export async function ConnectDB(uri) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Use the exact same approach as the working test script
    mongoose.set("strictQuery", true);
    
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.name);
    console.log("Connection state:", mongoose.connection.readyState);
    
    return connection;
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}