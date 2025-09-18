import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { ConnectDB } from "./src/db.js";
import { fileURLToPath } from 'url';
import authRouter from "./src/middleware/auth.js";
import imagesRouter from "./src/routes/images.js";
import imageRoute from "./src/routes/external.js";
import profileRoute from "./src/routes/profile.js"

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// CORS Configuration - Allow your frontend domains
const allowedOrigins = [
  "https://wallpaper-app-frontend.vercel.app", // Your production frontend
  "http://localhost:5173", // Vite dev server
  "http://127.0.0.1:5173", // alternative localhost
  "http://localhost:3000", // React default
  "http://127.0.0.1:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚫 CORS blocked origin:", origin);
      callback(null, true); // Allow for now, change to false for production
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept", 
    "Origin",
    "Access-Control-Allow-Origin"
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable CORS globally before any routes
app.use(cors(corsOptions));

// Serve static images
app.use('/static-images', express.static(path.join(__dirname, 'public/images')));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global connection state
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('📊 Using existing database connection');
    return;
  }
  
  try {
    console.log('🔌 Establishing database connection...');
    await ConnectDB(process.env.MONGO_URL);
    isConnected = true;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  Server will continue without database connection');
  }
};

// Database middleware
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error('Database middleware error:', error.message);
      if (req.path.startsWith('/api/') && !req.path.includes('/health')) {
        return res.status(503).json({ 
          message: 'Database temporarily unavailable',
          retry: true 
        });
      }
    }
  }
  next();
});

// API Routes with proper /api prefix
app.use("/api/images", imagesRouter);
app.use("/api/auth", authRouter);
app.use("/api/external", imageRoute);
app.use("/api/profile", profileRoute);

// Health check endpoint (without /api prefix)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is running", 
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: "enabled"
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Wallpaper App API v1.0",
    database: isConnected ? "connected" : "disconnected",
    endpoints: {
      auth: "/api/auth/login, /api/auth/register, /api/auth/logout",
      images: "/api/images/*",
      external: "/api/external",
      profile: "/api/profile",
      health: "/health"
    },
    cors: "enabled"
  });
});

// Root endpoint for debugging
app.get("/", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Wallpaper App Backend API",
    health: "/health",
    api: "/api"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({ 
      message: "Internal server error" 
    });
  } else {
    res.status(err.status || 500).json({ 
      message: err.message || "Server error",
      stack: err.stack 
    });
  }
});

const PORT = process.env.PORT || 5000;

// Start server and attempt database connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  
  // Attempt database connection after server starts
  connectToDatabase().catch(err => {
    console.error("Initial database connection failed:", err.message);
    console.log("🔄 Will retry on first API request...");
  });
});

export default app;