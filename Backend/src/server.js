import { configDotenv } from "dotenv";
import Cors from "cors";
import express from express;
import { ConnectDB } from "./src/db.js";
import { connect } from "mongoose";

const app = express();

app.use(Cors({
    origin: process.env.CORS_OPTIONS || "*",
    Credential:true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API running" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err);
    process.exit(1); 
  });
