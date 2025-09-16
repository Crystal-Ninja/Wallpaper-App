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

//  app.use(express.static("public"))
app.use('/static-images', express.static('./public/images'));

app.use(cors({
  origin: function (origin, callback) {
    // Allow same-origin requests (frontend and backend on same domain)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Add request logging for debugging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// app.use(express())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await ConnectDB(process.env.MONGO_URL);
    isConnected = true;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});


app.use("/api/images", imagesRouter);
app.use("/api/auth", authRouter);
app.use("/api/external", imageRoute);
app.use("/api/profile",profileRoute);

// app.get("/", (req, res) => {
//   res.json({ ok: true, message: "API running" });
// });
// 
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ,
    vercel:true,
  });
});

app.get("/api", (req, res) => {
  res.json({ 
    ok: true, 
    message: "Wallpaper App API v1.0 - Vercel Deployment",
    endpoints: {
      auth: "/auth/login, /auth/register, /auth/logout",
      images: "/images/*",
      external: "/external",
      profile: "/profile",
      health: "/health"
    },
    deployment: "vercel-monorepo"
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ 
    message: 'API route not found',
    path: req.originalUrl 
  });
});


// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(err.status || 500).json({ message: err.message || "Server error" });
// });
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

if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API running locally on port ${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export default app;

// ConnectDB(process.env.MONGO_URL)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 API on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to start server due to DB error:", err);
//     process.exit(1);
//   });

// Initialize database connection


// ConnectDB(process.env.MONGO_URL)
//   .then(() => {
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`🚀 API running on port ${PORT}`);
//       console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Health check: http://localhost:${PORT}/health`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to start server due to DB error:", err);
//     process.exit(1);
//   });
