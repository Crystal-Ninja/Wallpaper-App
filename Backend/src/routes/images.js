import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Image } from "../models/image.js"
import { User } from "../models/user.js";
import { requireAuth } from "../middleware/requireAuth.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});


const router = Router();


function uploadToCloudinary(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(fileBuffer);
  });
}


router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const q = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { tags: { $in: [new RegExp(search, "i")] } }
          ]
        }
      : {};

    const items = await Image.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Image.countDocuments(q);

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});



// ==========================
// POST /images → upload file
// ==========================
router.post("/", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const { title = "", tags = "" } = req.body;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "wallpaper_app"
    });

    const img = await Image.create({
      owner: req.user.id,
      url: result.secure_url,
      publicId: result.public_id,
      title,
      tags: tags ? tags.split(",").map((s) => s.trim()) : []
    });

    res.status(201).json(img);
  } catch (e) {
    next(e);
  }
});

// ===================================
// DELETE /images/:id → delete (owner)
// ===================================
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ message: "Not found" });
    if (String(img.owner) !== req.user.id)
      return res.status(403).json({ message: "Not yours" });

    await cloudinary.uploader.destroy(img.publicId);
    await img.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ==================================================
// POST /images/:id/favorite → add to user favorites
// ==================================================
router.post("/:id/favorite", requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: req.params.id } },
      { new: true }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ===================================================
// DELETE /images/:id/favorite → remove from favorites
// ===================================================
router.delete("/:id/favorite", requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: req.params.id } },
      { new: true }
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
