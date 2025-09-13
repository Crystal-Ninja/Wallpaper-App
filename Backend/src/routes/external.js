import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY; 

const defaultImages = [
  { id: "local1", url: "/images/ironman.jpeg", thumb: "/images/ironman.jpg", author: "Local", link: "#2" },
  { id: "local2", url: "/images/skull.jpeg", thumb: "/images/skull.jpg", author: "Local", link: "#1" },
//   { id: "local3", url: "/images/ladybug.jpg", thumb: "/images/ladybug.jpg", author: "Local", link: "#" },
//   { id: "local4", url: "/images/fish.jpg", thumb: "/images/fish.jpg", author: "Local", link: "#" },
//   { id: "local5", url: "/images/blackcat.jpg", thumb: "/images/blackcat.jpg", author: "Local", link: "#" },
//   { id: "local6", url: "/images/architect.jpg", thumb: "/images/architect.jpg", author: "Local", link: "#" },
//   { id: "local7", url: "/images/redcat.jpg", thumb: "/images/redcat.jpg", author: "Local", link: "#" },
//   { id: "local8", url: "/images/sheep.jpg", thumb: "/images/sheep.jpg", author: "Local", link: "#" },
//   { id: "local9", url: "/images/japan.jpg", thumb: "/images/japan.jpg", author: "Local", link: "#" },
//   { id: "local10", url: "/images/lamp.jpg", thumb: "/images/lamp.jpg", author: "Local", link: "#" },
//   { id: "local11", url: "/images/wallpaper.jpg", thumb: "/images/wallpaper.jpg", author: "Local", link: "#" },
//   { id: "local12", url: "/images/watercat.jpg", thumb: "/images/watercat.jpg", author: "Local", link: "#" },
//   { id: "local13", url: "/images/yello.jpg", thumb: "/images/yello.jpg", author: "Local", link: "#" },
//   { id: "local14", url: "/images/car.jpg", thumb: "/images/car.jpg", author: "Local", link: "#" },
];
router.get("/", async (req, res, next) => {
  try {
    const { query = "", page = 1, per_page = 20 } = req.query;

    // Build base URL (e.g. http://localhost:5000)
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Update local images to use full URLs
    const localImages = defaultImages.map(img => ({
      ...img,
      url: `${baseUrl}/static-images/${img.url}`,
      thumb: `${baseUrl}/static-images/${img.url}`
    }));

    if (!query) {
      return res.json({ items: localImages });
    }

    const r = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });

    const unsplashItems = r.data.results.map(x => ({
      id: x.id,
      url: x.urls.regular,
      thumb: x.urls.regular,
      author: x.user.name,
      link: x.links.html
    }));

    const items = [...localImages, ...unsplashItems];
    res.json({ items });
  } catch (e) {
    next(e);
  }
});
export default router