import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { ConnectDB } from "./src/db.js";
import authRouter from "./src/middleware/auth.js";
import imagesRouter from "./src/routes/images.js";
import imageRoute from "./src/routes/external.js";
import profileRoute from "./src/routes/profile.js"
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(cors())
app.use(express.json());

app.use("/images", imagesRouter);
app.use("/auth", authRouter);
app.use("/external", imageRoute);
app.use("/profile",profileRoute);
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API running" });
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
ConnectDB(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err);
    process.exit(1);
  });
