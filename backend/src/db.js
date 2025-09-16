// import mongoose from "mongoose";

// export async function ConnectDB(uri) {
//     mongoose.set("strictQuery",true);
//     try {
//         await mongoose.connect(uri);
//         console.log("Mongodb connected")

//     } catch (error) {
//         console.log("mongodb connection error",error);
//         throw error
//     }
// }

// src/db.js - Updated for Vercel serverless
import mongoose from "mongoose";

// Global connection cache for serverless
let cachedConnection = null;

export async function ConnectDB(uri) {
  // If we have a cached connection, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  try {
    console.log('Creating new database connection...');
    
    // Configure mongoose for serverless
    mongoose.set("strictQuery", true);
    
    // Connection options optimized for serverless
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
    };

    const connection = await mongoose.connect(uri, options);
    
    // Cache the connection
    cachedConnection = connection;
    
    console.log("✅ MongoDB connected successfully");
    return connection;
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    cachedConnection = null;
    throw error;
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  if (cachedConnection) {
    await mongoose.connection.close();
    console.log('Database connection closed through app termination');
  }
  process.exit(0);
});