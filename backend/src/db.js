import mongoose from "mongoose";

// Connection state tracking
let isConnected = false;

export async function ConnectDB(uri) {
  // If already connected, return existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('📊 Using existing database connection');
    return mongoose.connection;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('Connection string check:', {
      exists: !!uri,
      startsWithMongoDB: uri?.startsWith('mongodb'),
      length: uri?.length
    });

    if (!uri) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
      console.log('🔄 Disconnecting existing connection...');
      await mongoose.disconnect();
    }
    
    // Set mongoose options
    mongoose.set("strictQuery", true);
    
    // Enhanced connection options
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain minimum 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    };
    
    const connection = await mongoose.connect(uri, connectionOptions);
    
    isConnected = true;
    
    console.log("✅ MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.name);
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Host:", mongoose.connection.host);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });
    
    return connection;
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    isConnected = false;
    
    // Enhanced error messages
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Check your username and password in MONGO_URL');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('🌐 Network error. Check your internet connection and MongoDB Atlas cluster status');
    } else if (error.message.includes('IP')) {
      console.error('🚨 IP whitelist issue. Add your IP address to MongoDB Atlas Network Access');
    }
    
    throw error;
  }
}

// Graceful disconnection
export async function disconnectDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
}

// Check connection status
export function getConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    readyStateString: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
  };
}